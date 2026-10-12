'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, FileText, Plus, Save, Trash2 } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { LetterItem, LetterPhoto } from '@curileta/cms';

type LetterStatus = NonNullable<LetterItem['publicationStatus']>;
type PhotoVisibility = NonNullable<LetterPhoto['visibility']>;
type LetterDraft = Omit<LetterItem, 'body' | 'photos'> & {
  body: { es: string; en: string };
  photos: Array<LetterPhoto & { photoId: string; imageUrl: string; storagePath: string; censoredImageUrl: string; censoredStoragePath: string; visibility: PhotoVisibility }>;
};
type ManagedLetter = LetterItem & { documentId: string; isDeleted: boolean };

const fieldClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white';
const labelClass = 'mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200';

function emptyDraft(order = 1): LetterDraft {
  return {
    id: '',
    order,
    publicationStatus: 'unpublished',
    episodeUrl: '',
    country: { es: '', en: '' },
    city: { es: '', en: '' },
    postmark: '',
    postageColor: '#f59e0b',
    envelopeColor: '',
    greeting: { es: '', en: '' },
    body: { es: '', en: '' },
    signOff: { es: '', en: '' },
    photos: [],
  };
}

function toDraft(letter: LetterItem): LetterDraft {
  return {
    ...letter,
    publicationStatus: letter.publicationStatus || 'public',
    episodeUrl: letter.episodeUrl || '',
    body: { es: (letter.body?.es || []).join('\n\n'), en: (letter.body?.en || []).join('\n\n') },
    photos: (letter.photos || []).map((photo, index) => ({
      ...photo,
      photoId: photo.photoId || `photo-${index + 1}`,
      imageUrl: photo.imageUrl || '',
      storagePath: photo.storagePath || '',
      censoredImageUrl: photo.censoredImageUrl || '',
      censoredStoragePath: photo.censoredStoragePath || '',
      visibility: photo.visibility || 'public',
      title: photo.title || { es: '', en: '' },
      fact: photo.fact || { es: '', en: '' },
      tag: photo.tag || '',
      tagEn: photo.tagEn || '',
    })),
  };
}

function statusLabel(status: LetterStatus) {
  return status === 'public' ? 'Pública' : status === 'censored' ? 'Censurada' : 'Retirada';
}

function statusClass(status: LetterStatus) {
  return status === 'public'
    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
    : status === 'censored'
      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
      : 'bg-slate-200 text-slate-800 dark:bg-[#313131] dark:text-slate-200';
}

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function LettersManager() {
  const [letters, setLetters] = useState<ManagedLetter[]>([]);
  const [draft, setDraft] = useState<LetterDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch(`/api/admin/letters${showDeleted ? '?includeDeleted=true' : ''}`, { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las cartas.');
    setLetters(result.letters as ManagedLetter[]);
  }, [showDeleted]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/letters${showDeleted ? '?includeDeleted=true' : ''}`, { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las cartas.');
        setLetters(result.letters as ManagedLetter[]);
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las cartas.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true);
      });
    return () => controller.abort();
  }, [refresh, showDeleted]);

  function beginCreate() {
    setEditingId(null);
    setDraft(emptyDraft(letters.length + 1));
    setError('');
    setMessage('');
  }

  function beginEdit(letter: ManagedLetter) {
    setEditingId(letter.id);
    setDraft(toDraft(letter));
    setError('');
    setMessage('');
  }

  function closeEditor() {
    setDraft(null);
    setEditingId(null);
    setConfirmDelete('');
  }

  function updateDraft<K extends keyof LetterDraft>(key: K, value: LetterDraft[K]) {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  }

  function updateLocalized(key: 'country' | 'city' | 'greeting' | 'signOff', locale: 'es' | 'en', value: string) {
    setDraft((current) => current ? { ...current, [key]: { ...current[key], [locale]: value } } : current);
  }

  function updateBody(locale: 'es' | 'en', value: string) {
    setDraft((current) => current ? { ...current, body: { ...current.body, [locale]: value } } : current);
  }

  function updatePhoto(index: number, key: keyof LetterDraft['photos'][number], value: string | PhotoVisibility) {
    setDraft((current) => current ? {
      ...current,
      photos: current.photos.map((photo, photoIndex) => photoIndex === index ? { ...photo, [key]: value } : photo),
    } : current);
  }

  function updatePhotoLocalized(index: number, key: 'title' | 'fact', locale: 'es' | 'en', value: string) {
    setDraft((current) => current ? {
      ...current,
      photos: current.photos.map((photo, photoIndex) => photoIndex === index
        ? { ...photo, [key]: { ...photo[key], [locale]: value } }
        : photo),
    } : current);
  }

  async function saveLetter() {
    if (!draft) return;
    setSaving(true);
    setError('');
    setMessage('');
    const letter = {
      ...draft,
      id: editingId && draft.id === editingId ? editingId : slugify(draft.id || draft.country.es),
    };
    try {
      const response = await fetch(editingId ? `/api/admin/letters/${encodeURIComponent(editingId)}` : '/api/admin/letters', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letter),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la carta.');
      await refresh();
      closeEditor();
      setMessage('Carta guardada.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la carta.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteLetter(letter: ManagedLetter) {
    if (confirmDelete !== letter.id) {
      setConfirmDelete(letter.id);
      return;
    }
    setError('');
    try {
      const response = await fetch(`/api/admin/letters/${encodeURIComponent(letter.id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar la carta.');
      await refresh();
      if (editingId === letter.id) closeEditor();
      setConfirmDelete('');
      setMessage('Carta y fotos retiradas.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la carta.');
      setConfirmDelete('');
    }
  }

  async function restoreLetter(letter: ManagedLetter) {
    setError('');
    try {
      const response = await fetch(`/api/admin/letters/${encodeURIComponent(letter.id)}`, { method: 'PATCH' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo recuperar la carta.');
      await refresh();
      setMessage('Carta recuperada.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo recuperar la carta.');
    }
  }

  function movePhoto(index: number, direction: -1 | 1) {
    setDraft((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.photos.length) return current;
      const photos = [...current.photos];
      [photos[index], photos[target]] = [photos[target], photos[index]];
      return { ...current, photos };
    });
  }

  if (!loaded) {
    return <div className="mx-auto max-w-6xl space-y-4" aria-label="Cargando cartas" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-[#272727]" />
      <div className="h-40 rounded-xl bg-slate-200 dark:bg-[#272727]" />
    </div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Contenido editorial</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Cartas a Pompón</h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">
            Relaciona cada carta con su episodio y decide cuándo se muestra completa, censurada o se retira.
          </p>
        </div>
        <button type="button" onClick={beginCreate} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
          <Plus className="h-4 w-4" /> Nueva carta
        </button>
      </header>

      {error && <p className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200" role="alert">{error}</p>}
      {message && <p className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-[#272727] dark:text-emerald-200" role="status">{message}</p>}

      <section className="grid gap-6 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.8fr)]">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold">Cartas guardadas</h2>
            <span className="text-sm text-slate-600 dark:text-slate-300">{letters.length} en total</span>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />Mostrar cartas retiradas</label>
          {letters.length ? (
            <ul className="space-y-3">
              {letters.map((letter) => {
                const status = letter.publicationStatus || 'public';
                const selected = editingId === letter.id;
                return (
                  <li key={letter.documentId} className={`rounded-xl border p-4 dark:border-[#313131] ${selected ? 'border-emerald-500 bg-emerald-50 dark:bg-[#272727]' : 'border-slate-200 bg-white dark:bg-[#1f1f1f]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold">{letter.country.es || 'Carta sin título'}</p>
                        <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{letter.city.es} · #{letter.order}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}`}>{letter.isDeleted ? 'Eliminada' : statusLabel(status)}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{letter.photos?.length || 0} fotos{letter.episodeUrl ? ' · episodio vinculado' : ''}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {letter.isDeleted ? <button type="button" onClick={() => void restoreLetter(letter)} className="rounded-lg border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200">Recuperar carta</button> : <>
                        <button type="button" onClick={() => beginEdit(letter)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:hover:bg-[#272727]">Editar</button>
                        <button type="button" onClick={() => void deleteLetter(letter)} className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]">
                          {confirmDelete === letter.id ? 'Confirmar retirada' : 'Eliminar'}
                        </button>
                      </>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-[#414141] dark:bg-[#1f1f1f]">
              <FileText className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 text-base font-semibold">Aún no hay cartas</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Crea la primera ficha y añade sus fotos cuando quieras.</p>
            </div>
          )}
        </div>

        {draft ? (
          <form className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" onSubmit={(event) => { event.preventDefault(); void saveLetter(); }}>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-[#313131]">
              <div>
                <h2 className="text-xl font-bold">{editingId ? 'Editar carta' : 'Crear carta'}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Las cartas y sus fotos se administran desde este panel y se guardan en la biblioteca del sitio.</p>
              </div>
              <button type="button" onClick={closeEditor} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#272727]">Cerrar</button>
            </div>

            <section className="space-y-4" aria-labelledby="letter-settings-heading">
              <h3 id="letter-settings-heading" className="text-lg font-bold">Publicación y episodio</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className={labelClass}>Estado de la carta</span>
                  <select className={fieldClass} value={draft.publicationStatus || 'unpublished'} onChange={(event) => updateDraft('publicationStatus', event.target.value as LetterStatus)}>
                    <option value="unpublished">Retirada de la landing</option>
                    <option value="censored">Censurada como documento clasificado</option>
                    <option value="public">Pública y completa</option>
                  </select>
                </label>
                <label><span className={labelClass}>Orden en la landing</span><input className={fieldClass} type="number" min={1} max={10000} value={draft.order} onChange={(event) => updateDraft('order', Number(event.target.value))} /></label>
                <label className="sm:col-span-2"><span className={labelClass}>Episodio de YouTube relacionado</span><input className={fieldClass} type="url" inputMode="url" placeholder="https://www.youtube.com/watch?v=…" value={draft.episodeUrl || ''} onChange={(event) => updateDraft('episodeUrl', event.target.value)} /><span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">Añade el enlace del episodio del lugar para tenerlo junto a la programación de la carta.</span></label>
              </div>
              {draft.publicationStatus === 'censored' && draft.photos.some((photo) => photo.visibility !== 'hidden' && photo.imageUrl && !photo.censoredImageUrl) && (
                <p role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">Hay fotos anteriores sin copia borrosa. Vuelve a cargarlas en la sección de fotos para mostrar una pista sellada sin compartir el original.</p>
              )}
            </section>

            <section className="space-y-4" aria-labelledby="letter-location-heading">
              <h3 id="letter-location-heading" className="text-lg font-bold">Lugar e identificación</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className={labelClass}>Identificador interno</span><input className={fieldClass} autoComplete="off" value={draft.id} onChange={(event) => updateDraft('id', event.target.value)} placeholder="mexico" /><span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">Se usa en el orden y las referencias internas.</span></label>
                <label><span className={labelClass}>Matasellos</span><input className={fieldClass} value={draft.postmark} onChange={(event) => updateDraft('postmark', event.target.value)} placeholder="TEOTIHUACÁN · CARTA 01" /></label>
                {(['country', 'city'] as const).map((key) => <div key={key} className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                  <label><span className={labelClass}>{key === 'country' ? 'País' : 'Ciudad o lugar'} en español</span><input className={fieldClass} value={draft[key].es} onChange={(event) => updateLocalized(key, 'es', event.target.value)} /></label>
                  <label><span className={labelClass}>{key === 'country' ? 'País' : 'Ciudad o lugar'} en inglés</span><input className={fieldClass} value={draft[key].en} onChange={(event) => updateLocalized(key, 'en', event.target.value)} /></label>
                </div>)}
                <label><span className={labelClass}>Color del sello</span><input className={`${fieldClass} min-h-12 p-1.5`} type="color" value={draft.postageColor || '#f59e0b'} onChange={(event) => updateDraft('postageColor', event.target.value)} /></label>
                <label><span className={labelClass}>Clase visual del sobre</span><input className={fieldClass} value={draft.envelopeColor || ''} onChange={(event) => updateDraft('envelopeColor', event.target.value)} placeholder="from-amber-950/90 to-yellow-950/80" /></label>
              </div>
            </section>

            <section className="space-y-4" aria-labelledby="letter-text-heading">
              <h3 id="letter-text-heading" className="text-lg font-bold">Texto de la carta</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['es', 'en'] as const).map((locale) => <div key={locale} className="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-[#181818]">
                  <h4 className="text-base font-semibold">{locale === 'es' ? 'Español' : 'Inglés'}</h4>
                  <label><span className={labelClass}>Saludo</span><input className={fieldClass} value={draft.greeting[locale]} onChange={(event) => updateLocalized('greeting', locale, event.target.value)} /></label>
                  <label><span className={labelClass}>Cuerpo</span><textarea className={`${fieldClass} min-h-40 resize-y`} value={draft.body[locale]} onChange={(event) => updateBody(locale, event.target.value)} placeholder="Un párrafo por línea en blanco" /></label>
                  <label><span className={labelClass}>Despedida</span><textarea className={`${fieldClass} min-h-20 resize-y`} value={draft.signOff[locale]} onChange={(event) => updateLocalized('signOff', locale, event.target.value)} /></label>
                </div>)}
              </div>
            </section>

            <section className="space-y-4" aria-labelledby="letter-photos-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 id="letter-photos-heading" className="text-lg font-bold">Fotos de la carta</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Carga imágenes desde el ordenador, ordénalas y decide su visibilidad.</p></div>
                <button type="button" onClick={() => updateDraft('photos', [...draft.photos, { photoId: crypto.randomUUID(), title: { es: '', en: '' }, fact: { es: '', en: '' }, tag: '', tagEn: '', imageUrl: '', storagePath: '', censoredImageUrl: '', censoredStoragePath: '', visibility: 'public' }])} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:hover:bg-[#272727]"><Plus className="h-4 w-4" /> Añadir foto</button>
              </div>
              {draft.photos.length ? <div className="space-y-4">
                {draft.photos.map((photo, index) => <article key={photo.photoId} className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-[#414141]">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold">Foto {index + 1}</h4>
                    <div className="flex gap-1">
                      <button type="button" aria-label={`Mover foto ${index + 1} antes`} disabled={index === 0} onClick={() => movePhoto(index, -1)} className="rounded-lg p-2 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]"><ArrowUp className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Mover foto ${index + 1} después`} disabled={index === draft.photos.length - 1} onClick={() => movePhoto(index, 1)} className="rounded-lg p-2 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]"><ArrowDown className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Eliminar foto ${index + 1}`} onClick={() => updateDraft('photos', draft.photos.filter((_, photoIndex) => photoIndex !== index))} className="rounded-lg p-2 text-rose-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2"><span className={labelClass}>Estado de la foto</span><select className={fieldClass} value={photo.visibility} onChange={(event) => updatePhoto(index, 'visibility', event.target.value as PhotoVisibility)}><option value="public">Pública</option><option value="censored">Censurada</option><option value="hidden">Oculta por completo</option></select></label>
                    <div className="sm:col-span-2"><ImageUploadField label="Imagen de la foto" hint="Al subirla se crea también una copia de baja resolución y muy difuminada para el estado censurado. El original no se comparte mientras siga sellada." target="letter-photo" value={photo.imageUrl} onChange={(value) => updatePhoto(index, 'imageUrl', value)} onPathChange={(path) => updatePhoto(index, 'storagePath', path)} onCensoredImageChange={(value, path) => { updatePhoto(index, 'censoredImageUrl', value); updatePhoto(index, 'censoredStoragePath', path); }} onUploadingChange={(uploading) => setUploadingPhotos((count) => Math.max(0, count + (uploading ? 1 : -1)))} /></div>
                    {photo.visibility === 'censored' && photo.imageUrl && !photo.censoredImageUrl && <p className="sm:col-span-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">Esta imagen es anterior al archivo borroso. Vuelve a cargarla para que la carta censurada pueda mostrar su vista previa sellada.</p>}
                    {(['es', 'en'] as const).map((locale) => <div key={locale} className="space-y-3 rounded-lg bg-slate-50 p-3 dark:bg-[#181818]">
                      <h5 className="text-sm font-semibold">{locale === 'es' ? 'Español' : 'Inglés'}</h5>
                      <label><span className={labelClass}>Título</span><input className={fieldClass} value={photo.title[locale]} onChange={(event) => updatePhotoLocalized(index, 'title', locale, event.target.value)} /></label>
                      <label><span className={labelClass}>Dato de la imagen</span><textarea className={`${fieldClass} min-h-20 resize-y`} value={photo.fact[locale]} onChange={(event) => updatePhotoLocalized(index, 'fact', locale, event.target.value)} /></label>
                    </div>)}
                    <label><span className={labelClass}>Etiqueta en español</span><input className={fieldClass} value={photo.tag} onChange={(event) => updatePhoto(index, 'tag', event.target.value)} /></label>
                    <label><span className={labelClass}>Etiqueta en inglés</span><input className={fieldClass} value={photo.tagEn || ''} onChange={(event) => updatePhoto(index, 'tagEn', event.target.value)} /></label>
                  </div>
                </article>)}
              </div> : <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-[#181818] dark:text-slate-300">Todavía no hay fotos. Puedes añadirlas ahora o guardar la carta para completarla más adelante.</p>}
            </section>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-[#313131]">
              <button type="button" onClick={closeEditor} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#272727]">Cancelar</button>
              <button type="submit" disabled={saving || uploadingPhotos > 0} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"><Save className="h-4 w-4" />{saving ? 'Guardando…' : uploadingPhotos > 0 ? 'Esperando las fotos…' : 'Guardar carta'}</button>
            </div>
          </form>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-[#414141] dark:bg-[#1f1f1f]">
            <FileText className="h-10 w-10 text-slate-500" />
            <h2 className="mt-4 text-xl font-bold">Administra la salida de cada carta</h2>
            <p className="mt-2 max-w-md text-sm leading-5 text-slate-600 dark:text-slate-300">Después del episodio puedes publicar la carta completa. A mitad de semana puedes cambiarla a censurada y mostrar el documento clasificado.</p>
            <button type="button" onClick={beginCreate} className="mt-5 rounded-lg bg-emerald-700 px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">Crear carta</button>
          </div>
        )}
      </section>
    </div>
  );
}
