'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { DestinationMedia, Location } from '@curileta/cms';
import { Compass, ExternalLink, MapPin, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { ContentImage } from '@/components/ContentImage';
import { DestinationMediaEditor } from '@/components/admin/DestinationMediaEditor';

type DirectoryFilter = 'all' | 'published' | 'draft' | 'home';
type ApiResponse = { success?: boolean; error?: string; locations?: Location[]; storageAvailable?: boolean; homeSelectionEnabled?: boolean };

const fieldClass = 'mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-hidden transition-all duration-700 ease-fluid focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-50';
const cardClass = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6';

function emptyDestination(sortOrder = 0): Location {
  return {
    id: '', slug: '',
    name: { es: '', en: '' },
    country: { es: '', en: '' },
    theme: { es: '', en: '' },
    climate: { es: '', en: '' },
    coordinates: { lat: 0, lng: 0 },
    passportStamp: { icon: 'MapPin', code: '', color: '#1b8a44' },
    description: { es: '', en: '' },
    heroImage: { url: '', alt: { es: '', en: '' } },
    curiosities: [], characters: [], media: [], segments: [],
    sortOrder, isPublished: false, showOnHome: false,
  };
}

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 96);
}

function parseCommaList(value: string) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
}

export function DestinationsManager({ initialData }: { initialData: ApiResponse }) {
  const [locations, setLocations] = useState<Location[]>(initialData.locations || []);
  const [storageAvailable, setStorageAvailable] = useState(initialData.storageAvailable === true);
  const [homeSelectionEnabled, setHomeSelectionEnabled] = useState(initialData.homeSelectionEnabled === true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState<Location>(emptyDestination());
  const [committedMediaPaths, setCommittedMediaPaths] = useState<string[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<DirectoryFilter>('all');
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
  const [selectionSaving, setSelectionSaving] = useState(false);
  const [initialHomeSlugs, setInitialHomeSlugs] = useState<string[]>((initialData.locations || []).filter((location) => location.showOnHome).map((location) => location.slug).sort());

  async function loadDestinations() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/destinations', { cache: 'no-store' });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudieron cargar los destinos.');
      const loaded = result.locations || [];
      setLocations(loaded);
      setStorageAvailable(result.storageAvailable === true);
      setHomeSelectionEnabled(result.homeSelectionEnabled === true);
      setInitialHomeSlugs(loaded.filter((location) => location.showOnHome).map((location) => location.slug).sort());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los destinos.');
    } finally {
      setLoading(false);
    }
  }

  const countries = useMemo(() => [...new Set(locations.map((location) => location.country.es).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')), [locations]);
  const segments = useMemo(() => [...new Set(locations.flatMap((location) => location.segments || []))].sort((a, b) => a.localeCompare(b, 'es')), [locations]);
  const visibleLocations = useMemo(() => locations.filter((location) => {
    const haystack = [location.name.es, location.name.en, location.country.es, location.country.en, location.slug, location.description.es, location.description.en, ...(location.segments || [])].join(' ').toLocaleLowerCase('es');
    if (search && !haystack.includes(search.toLocaleLowerCase('es'))) return false;
    if (countryFilter !== 'all' && location.country.es !== countryFilter) return false;
    if (segmentFilter !== 'all' && !location.segments?.includes(segmentFilter)) return false;
    if (filter === 'published' && !location.isPublished) return false;
    if (filter === 'draft' && location.isPublished) return false;
    if (filter === 'home' && !location.showOnHome) return false;
    return true;
  }), [locations, search, countryFilter, segmentFilter, filter]);
  const selectedHomeSlugs = locations.filter((location) => location.showOnHome).map((location) => location.slug).sort();
  const homeSelectionDirty = selectedHomeSlugs.join('|') !== initialHomeSlugs.join('|');

  function resetForm() {
    setEditingSlug(null);
    setDraft(emptyDestination(locations.length));
    setError('');
    setMessage('');
  }

  function edit(location: Location) {
    setEditingSlug(location.slug);
    setDraft({
      ...location,
      coordinates: { ...location.coordinates },
      name: { ...location.name }, country: { ...location.country },
      theme: { es: location.theme?.es || '', en: location.theme?.en || '' },
      climate: { es: location.climate?.es || '', en: location.climate?.en || '' },
      description: { ...location.description },
      heroImage: { ...location.heroImage, alt: { ...location.heroImage.alt } },
      passportStamp: { icon: location.passportStamp?.icon || 'MapPin', code: location.passportStamp?.code || '', color: location.passportStamp?.color || '#1b8a44' },
      curiosities: (location.curiosities || []).map((item) => ({ ...item })),
      characters: [...(location.characters || [])],
      segments: [...(location.segments || [])],
      media: (location.media || []).map((item) => ({
        ...item,
        alt: { es: item.alt.es || '', en: item.alt.en || '' },
        caption: { es: item.caption?.es || '', en: item.caption?.en || '' },
      })),
    });
    setError('');
    setMessage('');
  }

  function setLocalized(field: 'name' | 'country' | 'theme' | 'climate' | 'description', language: 'es' | 'en', value: string) {
    setDraft((current) => ({ ...current, [field]: { ...current[field], [language]: value } }));
  }

  function setMedia(media: DestinationMedia[]) {
    setDraft((current) => {
      const previousCard = current.media?.some((item) => item.isCard) || false;
      const card = media.find((item) => item.isCard);
      return {
        ...current,
        media,
        heroImage: card
          ? { url: card.url, alt: card.alt }
          : previousCard ? { url: '', alt: { es: '', en: '' } } : current.heroImage,
      };
    });
  }

  async function saveDestination() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        ...draft,
        id: editingSlug ? draft.id : slugify(draft.slug),
        slug: slugify(draft.slug),
        characters: draft.characters || [],
        segments: draft.segments || [],
        media: (draft.media || []).map((item, sortOrder) => ({ ...item, sortOrder })),
        curiosities: (draft.curiosities || []).filter((item) => item.es.trim() || item.en?.trim()),
      };
      const response = await fetch(editingSlug ? `/api/admin/destinations/${encodeURIComponent(editingSlug)}` : '/api/admin/destinations', {
        method: editingSlug ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo guardar el destino.');
      setCommittedMediaPaths((payload.media || []).map((item) => item.storagePath));
      await loadDestinations();
      setEditingSlug(null);
      setDraft(emptyDestination(locations.length + 1));
      setMessage('Destino guardado.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el destino.');
    } finally {
      setSaving(false);
    }
  }

  async function saveHomeSelection() {
    setSelectionSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/destinations/selection', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: selectedHomeSlugs }),
      });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo guardar la selección de portada.');
      await loadDestinations();
      setMessage('Selección de portada guardada.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la selección de portada.');
    } finally {
      setSelectionSaving(false);
    }
  }

  async function removeDestination(location: Location) {
    if (confirmDeleteSlug !== location.slug) {
      setConfirmDeleteSlug(location.slug);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/destinations/${encodeURIComponent(location.slug)}`, { method: 'DELETE' });
      const result = await response.json() as ApiResponse;
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo eliminar el destino.');
      if (editingSlug === location.slug) resetForm();
      setConfirmDeleteSlug(null);
      await loadDestinations();
      setMessage('Destino eliminado de las páginas públicas.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar el destino.');
    } finally {
      setSaving(false);
    }
  }

  function toggleHome(location: Location) {
    if (!location.isPublished) return;
    setLocations((current) => current.map((item) => item.slug === location.slug ? { ...item, showOnHome: !item.showOnHome } : item));
  }

  return <div className="mx-auto max-w-7xl space-y-8">
    <header>
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Gestión editorial</p>
      <div className="mt-2 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200"><Compass className="h-5 w-5" /></span><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Destinos y lugares</h1></div>
      <p className="mt-3 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">Administra los lugares de la expedición, decide qué tarjetas aparecen en la portada y prepara galerías con fotos y escenas de vídeo para cada ficha.</p>
    </header>

    {loading ? <div role="status" aria-label="Cargando destinos" className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" /> : <>
      {!storageAvailable && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-200">La lista pública está disponible en modo lectura, pero Supabase todavía no expone las tablas de gestión. Aplica `20261011070000_destination_management.sql` antes de guardar cambios.</p>}
      <section className={cardClass} aria-labelledby="destination-home-selection-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Portada</p><h2 id="destination-home-selection-heading" className="mt-1 text-xl font-bold">Tarjetas de la landing</h2><p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-300">Marca destinos publicados y guarda el orden actual de la lista. La portada muestra esas tarjetas; la ficha dedicada conserva todos los medios.</p></div>
          <button type="button" onClick={() => { void saveHomeSelection(); }} disabled={!storageAvailable || !homeSelectionDirty || selectionSaving} className={`${buttonClass} bg-emerald-800 text-white hover:bg-emerald-700` }><Save className="h-4 w-4" />{selectionSaving ? 'Guardando…' : 'Guardar selección'}</button>
        </div>
        {homeSelectionEnabled && <p className="mt-3 text-xs font-medium text-emerald-800 dark:text-emerald-300">La portada ya usa esta selección administrada.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {locations.filter((location) => location.isPublished).map((location) => <label key={`home-${location.slug}`} className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${location.showOnHome ? 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-[#272727] dark:text-emerald-200' : 'border-slate-300 bg-white text-slate-700 dark:border-[#414141] dark:bg-[#181818] dark:text-slate-200'}`}>
            <input type="checkbox" checked={location.showOnHome === true} onChange={() => toggleHome(location)} className="h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />{location.name.es}
          </label>)}
          {!locations.some((location) => location.isPublished) && <p className="text-sm text-slate-500">Publica un destino para poder seleccionarlo en la portada.</p>}
        </div>
      </section>

      <section className={`${cardClass} space-y-5`} aria-labelledby="destination-editor-heading">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Ficha bilingüe</p><h2 id="destination-editor-heading" className="mt-1 text-xl font-bold">{editingSlug ? 'Editar destino' : 'Crear destino'}</h2></div><button type="button" onClick={() => { resetForm(); setDraft(emptyDestination(locations.length)); }} className={`${buttonClass} border border-slate-300 hover:bg-slate-100 dark:border-[#414141] dark:hover:bg-[#272727]`}><Plus className="h-4 w-4" />Nuevo destino</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Nombre del destino en español<input className={fieldClass} maxLength={120} value={draft.name.es} onChange={(event) => setLocalized('name', 'es', event.target.value)} /></label>
          <label className="text-sm font-semibold">Destination name in English<input className={fieldClass} maxLength={120} value={draft.name.en || ''} onChange={(event) => setLocalized('name', 'en', event.target.value)} /></label>
          <label className="text-sm font-semibold">Identificador URL<input className={fieldClass} maxLength={96} value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, id: slugify(event.target.value), slug: slugify(event.target.value) }))} placeholder="bosque-encantado" /></label>
          <label className="text-sm font-semibold">País o región en español<input className={fieldClass} maxLength={100} value={draft.country.es} onChange={(event) => setLocalized('country', 'es', event.target.value)} /></label>
          <label className="text-sm font-semibold">Country or region in English<input className={fieldClass} maxLength={100} value={draft.country.en || ''} onChange={(event) => setLocalized('country', 'en', event.target.value)} /></label>
          {(['es', 'en'] as const).map((language) => <label key={`theme-${language}`} className="text-sm font-semibold">{language === 'es' ? 'Tema del viaje en español' : 'Journey theme in English'}<input className={fieldClass} maxLength={240} value={draft.theme?.[language] || ''} onChange={(event) => setLocalized('theme', language, event.target.value)} /></label>)}
          {(['es', 'en'] as const).map((language) => <label key={`climate-${language}`} className="text-sm font-semibold">{language === 'es' ? 'Clima, opcional' : 'Climate, optional'}<input className={fieldClass} maxLength={160} value={draft.climate?.[language] || ''} onChange={(event) => setLocalized('climate', language, event.target.value)} /></label>)}
          {(['es', 'en'] as const).map((language) => <label key={`description-${language}`} className="text-sm font-semibold">{language === 'es' ? 'Descripción en español' : 'Description in English'}<textarea className={`${fieldClass} min-h-28 resize-y`} maxLength={2400} value={draft.description[language] || ''} onChange={(event) => setLocalized('description', language, event.target.value)} /></label>)}
          <label className="text-sm font-semibold">Latitud<input className={fieldClass} type="number" min={-90} max={90} step="any" value={draft.coordinates.lat} onChange={(event) => setDraft((current) => ({ ...current, coordinates: { ...current.coordinates, lat: Number(event.target.value) } }))} /></label>
          <label className="text-sm font-semibold">Longitud<input className={fieldClass} type="number" min={-180} max={180} step="any" value={draft.coordinates.lng} onChange={(event) => setDraft((current) => ({ ...current, coordinates: { ...current.coordinates, lng: Number(event.target.value) } }))} /></label>
          <label className="text-sm font-semibold">Código de pasaporte<input className={fieldClass} maxLength={32} value={draft.passportStamp?.code || ''} onChange={(event) => setDraft((current) => ({ ...current, passportStamp: { icon: current.passportStamp?.icon || 'MapPin', code: event.target.value, color: current.passportStamp?.color || '#1b8a44' } }))} /></label>
          <label className="text-sm font-semibold">Segmentos separados por coma<input className={fieldClass} value={(draft.segments || []).join(', ')} onChange={(event) => setDraft((current) => ({ ...current, segments: parseCommaList(event.target.value).map(slugify).filter(Boolean).slice(0, 12) }))} placeholder="selva, patrimonio, montaña" /><span className="mt-1 block text-xs font-normal text-slate-500">Usa los mismos segmentos para agrupar y filtrar destinos.</span></label>
          <label className="text-sm font-semibold">Personajes relacionados separados por coma<input className={fieldClass} value={(draft.characters || []).join(', ')} onChange={(event) => setDraft((current) => ({ ...current, characters: parseCommaList(event.target.value) }))} placeholder="curileta, pompon" /></label>
          <label className="text-sm font-semibold">Orden en el directorio<input className={fieldClass} type="number" min={0} max={10000} value={draft.sortOrder ?? 0} onChange={(event) => setDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))} /></label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.isPublished === true} onChange={(event) => setDraft((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Publicar en el directorio y la ficha</label>
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">Curiosidades</h3><button type="button" onClick={() => setDraft((current) => ({ ...current, curiosities: [...(current.curiosities || []), { es: '', en: '' }] }))} className={`${buttonClass} border border-slate-300 dark:border-[#414141]`}><Plus className="h-4 w-4" />Añadir curiosidad</button></div>
            {(draft.curiosities || []).map((curiosity, index) => <div key={`curiosity-${index}`} className="grid gap-3 rounded-lg bg-slate-50 p-3 dark:bg-[#181818] sm:grid-cols-[1fr_1fr_auto]">
              {(['es', 'en'] as const).map((language) => <label key={`${index}-${language}`} className="text-xs font-semibold">{language === 'es' ? 'Español' : 'English'}<textarea className={`${fieldClass} min-h-20 resize-y`} maxLength={600} value={curiosity[language] || ''} onChange={(event) => setDraft((current) => ({ ...current, curiosities: (current.curiosities || []).map((item, itemIndex) => itemIndex === index ? { ...item, [language]: event.target.value } : item) }))} /></label>)}
              <button type="button" onClick={() => setDraft((current) => ({ ...current, curiosities: (current.curiosities || []).filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Eliminar curiosidad" className="self-end rounded-md p-2 text-rose-700 hover:bg-rose-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]"><Trash2 className="h-4 w-4" /></button>
            </div>)}
          </div>
          <div className="sm:col-span-2"><DestinationMediaEditor media={draft.media || []} committedPaths={committedMediaPaths} onChange={setMedia} onUploadingChange={setUploading} /></div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div aria-live="polite">{message && <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>}{error && <p role="alert" className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>}</div>
          <div className="flex gap-2">{editingSlug && <button type="button" onClick={resetForm} className={`${buttonClass} hover:bg-slate-100 dark:hover:bg-[#272727]`}><X className="h-4 w-4" />Cancelar</button>}<button type="button" onClick={() => { void saveDestination(); }} disabled={saving || uploading || !storageAvailable} className={`${buttonClass} bg-emerald-800 px-5 text-white hover:bg-emerald-700`}><Save className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar destino'}</button></div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="destination-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Directorio</p><h2 id="destination-list-heading" className="mt-1 text-2xl font-bold">Todos los destinos <span className="text-base font-medium text-slate-500">({locations.length})</span></h2></div><Link href="/es/destinos" target="_blank" className={`${buttonClass} border border-slate-300 text-emerald-800 hover:bg-emerald-50 dark:border-[#414141] dark:text-emerald-200 dark:hover:bg-[#272727]`}><ExternalLink className="h-4 w-4" />Abrir directorio</Link></div>
        <div className={`${cardClass} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
          <label className="text-xs font-semibold">Buscar<input className={fieldClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, país, texto" /></label>
          <label className="text-xs font-semibold">País o región<select className={fieldClass} value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}><option value="all">Todos</option>{countries.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
          <label className="text-xs font-semibold">Segmento<select className={fieldClass} value={segmentFilter} onChange={(event) => setSegmentFilter(event.target.value)}><option value="all">Todos</option>{segments.map((segment) => <option key={segment} value={segment}>{segment.replaceAll('-', ' ')}</option>)}</select></label>
          <label className="text-xs font-semibold">Estado<select className={fieldClass} value={filter} onChange={(event) => setFilter(event.target.value as DirectoryFilter)}><option value="all">Todos</option><option value="published">Publicados</option><option value="draft">Borradores</option><option value="home">En portada</option></select></label>
        </div>
        {visibleLocations.length ? <ol className="grid gap-4 lg:grid-cols-2">
          {visibleLocations.map((location) => <li key={location.slug} className={`${cardClass} flex flex-col gap-4 sm:flex-row`}>
            {location.heroImage.url ? <ContentImage src={location.heroImage.url} alt="" className="h-32 w-full rounded-lg bg-slate-100 object-cover sm:w-48" /> : <div className="flex h-32 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-[#181818] sm:w-48"><MapPin className="h-6 w-6" /></div>}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold">{location.name.es}</h3><p className="mt-1 text-xs text-slate-500">{location.country.es} · /{location.slug}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${location.isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-[#313131] dark:text-slate-200'}`}>{location.isPublished ? 'Publicado' : 'Borrador'}</span></div>
              <div className="mt-2 flex flex-wrap gap-1.5">{(location.segments || []).map((segment) => <span key={segment} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-[#272727] dark:text-slate-200">{segment.replaceAll('-', ' ')}</span>)}<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-[#272727] dark:text-slate-200">{location.media?.length || 0} medios</span></div>
              <div className="mt-4 flex flex-wrap gap-1">{location.isPublished && <Link href={`/es/destinos/${location.slug}`} target="_blank" className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]">Ver ficha</Link>}<button type="button" onClick={() => edit(location)} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]">Editar</button><button type="button" onClick={() => { void removeDestination(location); }} disabled={saving} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]">{confirmDeleteSlug === location.slug ? <>Confirma eliminación</> : <><Trash2 className="h-4 w-4" />Eliminar</>}</button></div>
            </div>
          </li>)}
        </ol> : <div className={`${cardClass} border-dashed text-center`}><Search className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-sm font-semibold">No hay destinos para esos filtros</p><p className="mt-1 text-sm text-slate-500">Prueba otro país, segmento o término.</p></div>}
      </section>
    </>}
  </div>;
}
