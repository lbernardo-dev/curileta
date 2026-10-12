'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { AdminManagedContentType, ManagedContentEntry } from '@/lib/managed-content.types';
import { resolveHomepageSections } from '@/lib/homepage-sections';

const contentTypes: Array<{ value: AdminManagedContentType; label: string }> = [
  { value: 'character', label: 'Personajes' },
  { value: 'book', label: 'Libros' },
  { value: 'adventure', label: 'Aventuras' },
  { value: 'trailWaypoint', label: 'Etapas de la ruta' },
  { value: 'narrativeMilestone', label: 'Hitos narrativos' },
  { value: 'mentionedCuriosity', label: 'Curiosidades' },
  { value: 'wallpaper', label: 'Fondos de pantalla' },
  { value: 'universeRoadmapItem', label: 'Próximo contenido' },
  { value: 'collaboration', label: 'Colaboraciones' },
  { value: 'siteSettings', label: 'Ajustes de portada' },
];

const labels: Record<string, string> = {
  id: 'Identificador',
  slug: 'Ruta corta',
  name: 'Nombre',
  characterName: 'Nombre',
  title: 'Título',
  subtitle: 'Subtítulo',
  shortDescription: 'Descripción breve',
  biography: 'Biografía',
  passportRole: 'Papel en la aventura',
  voiceQuote: 'Frase del personaje',
  species: 'Especie',
  personality: 'Personalidad',
  values: 'Valores',
  explorerStats: 'Habilidades de exploración',
  curiosity: 'Curiosidad',
  courage: 'Valentía',
  agility: 'Agilidad',
  wisdom: 'Sabiduría',
  backpackItems: 'Objetos de la mochila',
  curiosityFacts: 'Datos curiosos',
  mainImage: 'Imagen principal',
  coverImage: 'Cubierta',
  cover: 'Cubierta',
  heroImage: 'Imagen de portada',
  gallery: 'Galería',
  url: 'Dirección de la imagen',
  alt: 'Texto alternativo',
  aspectRatio: 'Proporción',
  author: 'Autoría',
  description: 'Descripción',
  publicationDate: 'Fecha de publicación',
  publicationStatus: 'Estado editorial',
  isbn: 'ISBN',
  languages: 'Idiomas',
  ageRange: 'Edad recomendada',
  pageCount: 'Páginas',
  publisher: 'Editorial',
  format: 'Formato',
  badge: 'Etiqueta',
  colorTheme: 'Color de presentación',
  destinations: 'Destinos',
  purchaseLinks: 'Enlaces de compra',
  storeName: 'Tienda',
  characters: 'Personajes',
  locations: 'Lugares',
  number: 'Número',
  synopsis: 'Sinopsis',
  countries: 'Países',
  relatedBooks: 'Libros relacionados',
  relatedEpisodes: 'Episodios relacionados',
  relatedLocations: 'Lugares relacionados',
  stepNumber: 'Número de etapa',
  stampCode: 'Código del sello',
  coordinatesText: 'Coordenadas',
  badgeIcon: 'Icono del sello',
  dateStamp: 'Fecha',
  note: 'Nota',
  color: 'Color',
  order: 'Orden',
  place: 'Lugar',
  country: 'País',
  whatHappens: 'Qué sucede',
  charactersPresent: 'Personajes presentes',
  isTravesia: 'Es una travesía',
  curiosityFact: 'Dato curioso',
  isMentionOnly: 'Solo se menciona',
  deviceType: 'Dispositivo',
  category: 'Categoría',
  resolution: 'Resolución',
  thumbnail: 'Miniatura',
  fullImageUrl: 'Imagen completa',
  tags: 'Etiquetas',
  characterId: 'Personaje relacionado',
  fileSizeBytes: 'Tamaño del archivo',
  desc: 'Descripción breve',
  iconName: 'Nombre del icono',
  featured: 'Destacar en portada',
  siteName: 'Nombre del sitio',
  heroTagline: 'Frase principal',
  heroSubtitle: 'Descripción principal',
  featuredQuote: 'Frase destacada',
  statsBadges: 'Indicadores de la portada',
  homepageSections: 'Secciones de la portada',
  visible: 'Visible',
  key: 'Sección',
  orderIndex: 'Orden',
  value: 'Valor',
  icon: 'Icono',
  es: 'Español',
  en: 'Inglés',
};

const inputClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-60';

type Draft = {
  contentType: AdminManagedContentType;
  contentId: string;
  slug: string;
  payload: Record<string, unknown>;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
  isNew: boolean;
};

async function fetchManagedContent(signal?: AbortSignal, includeDeleted = false) {
  const response = await fetch(`/api/admin/content${includeDeleted ? '?includeDeleted=true' : ''}`, { cache: 'no-store', signal });
  const result = await response.json().catch(() => null) as { entries?: ManagedContentEntry[]; error?: string } | null;
  if (!response.ok || !result || !Array.isArray(result.entries)) throw new Error(result?.error || 'No se pudo cargar el contenido.');
  return result.entries;
}

function localized() {
  return { es: '', en: '' };
}

function emptyPayload(type: AdminManagedContentType): Record<string, unknown> {
  const base = { id: '', slug: '' };
  switch (type) {
    case 'character':
      return { ...base, name: '', shortDescription: localized(), biography: localized(), species: '', personality: [], values: [], explorerStats: { curiosity: 50, courage: 50, agility: 50, wisdom: 50 }, backpackItems: [], curiosityFacts: [], mainImage: { url: '', alt: localized() }, gallery: [] };
    case 'book':
      return { ...base, author: '', title: localized(), subtitle: localized(), coverImage: { url: '', alt: localized() }, description: localized(), publicationDate: '', isbn: [], languages: [], ageRange: '', pageCount: 0, publisher: '', format: localized(), badge: localized(), colorTheme: '', destinations: [], purchaseLinks: [], characters: [], locations: [] };
    case 'adventure':
      return { ...base, number: 1, title: localized(), synopsis: localized(), heroImage: { url: '', alt: localized() }, countries: [], locations: [], characters: [], bookRef: '' };
    case 'trailWaypoint':
      return { ...base, stepNumber: 1, title: localized(), subtitle: localized(), stampCode: '', coordinatesText: '', badgeIcon: '', dateStamp: '', note: localized(), color: '#167a51' };
    case 'narrativeMilestone':
      return { ...base, order: 1, place: localized(), country: localized(), whatHappens: localized(), charactersPresent: [], isTravesia: false, coordinates: { lat: 0, lng: 0 } };
    case 'mentionedCuriosity':
      return { ...base, name: localized(), country: localized(), curiosityFact: localized(), isMentionOnly: true };
    case 'wallpaper':
      return { ...base, title: localized(), deviceType: 'mobile', category: 'personajes', resolution: '', thumbnail: '', fullImageUrl: '', tags: [], characterId: '', description: localized() };
    case 'universeRoadmapItem':
      return { ...base, title: localized(), desc: localized(), badge: localized(), iconName: '', orderIndex: 1 };
    case 'collaboration':
      return { ...base, title: localized(), desc: localized(), iconName: '', category: '', orderIndex: 1, featured: false };
    case 'siteSettings':
      return { siteName: '', heroTagline: localized(), heroSubtitle: localized(), featuredQuote: localized(), statsBadges: [], homepageSections: [] };
  }
}

function displayName(entry: ManagedContentEntry) {
  const payload = entry.payload;
  const title = readPath(payload, ['title', 'es'])
    || readPath(payload, ['name', 'es'])
    || payload.name
    || payload.characterName
    || readPath(payload, ['place', 'es'])
    || payload.siteName
    || entry.contentId;
  return String(title);
}

function readPath(value: unknown, path: Array<string | number>): unknown {
  return path.reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string | number, unknown>)[key];
  }, value);
}

function setPath(root: Record<string, unknown>, path: Array<string | number>, value: unknown) {
  const copy = JSON.parse(JSON.stringify(root)) as Record<string, unknown>;
  let current: Record<string | number, unknown> = copy;
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    const nextKey = path[index + 1];
    if (!current[key] || typeof current[key] !== 'object') current[key] = typeof nextKey === 'number' ? [] : {};
    current = current[key] as Record<string | number, unknown>;
  }
  if (path.length) current[path[path.length - 1]] = value;
  return copy;
}

function arrayItemTemplate(key: string, items: unknown[]) {
  if (items.length && items[0] && typeof items[0] === 'object') {
    return JSON.parse(JSON.stringify(items[0])) as Record<string, unknown>;
  }
  if (['backpackItems', 'curiosityFacts'].includes(key)) return localized();
  if (key === 'gallery') return { url: '', alt: localized() };
  if (key === 'purchaseLinks') return { storeName: '', url: '' };
  if (key === 'statsBadges') return { icon: '', label: localized(), value: '' };
  if (key === 'homepageSections') return { key: 'hero', visible: true, order: items.length };
  return '';
}

function isImagePath(path: Array<string | number>) {
  const keys = path.filter((value): value is string => typeof value === 'string');
  const last = keys[keys.length - 1];
  const parent = keys[keys.length - 2];
  if (last === 'url' && ['mainImage', 'coverImage', 'cover', 'heroImage', 'gallery'].includes(parent)) return true;
  return ['thumbnail', 'fullImageUrl'].includes(last);
}

function storagePathFor(path: Array<string | number>) {
  const result = [...path];
  const last = result[result.length - 1];
  if (last === 'url') result[result.length - 1] = 'storagePath';
  else if (last === 'fullImageUrl') result[result.length - 1] = 'fullImageStoragePath';
  else if (last === 'thumbnail') result[result.length - 1] = 'thumbnailStoragePath';
  return result;
}

function FieldValue({
  fieldKey,
  value,
  path,
  locked,
  onChange,
  onUploadingChange,
}: {
  fieldKey: string;
  value: unknown;
  path: Array<string | number>;
  locked: boolean;
  onChange: (path: Array<string | number>, nextValue: unknown) => void;
  onUploadingChange: (key: string, uploading: boolean) => void;
}) {
  const label = labels[fieldKey] || fieldKey;
  if (fieldKey === 'storagePath' || fieldKey === 'fullImageStoragePath' || fieldKey === 'thumbnailStoragePath') {
    return value ? <p className="mt-2 break-all text-xs text-slate-500 dark:text-slate-400">Archivo: {String(value)}</p> : null;
  }
  if (Array.isArray(value)) {
    const primitiveItems = value.every((item) => item === null || ['string', 'number', 'boolean'].includes(typeof item));
    if (primitiveItems) {
      return (
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold">{label}</span>
          <textarea
            className={inputClass + ' min-h-28'}
            value={value.join('\n')}
            disabled={locked}
            onChange={(event) => onChange(path, event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
            aria-label={label}
          />
          <span className="block text-xs text-slate-500 dark:text-slate-400">Escribe un elemento por línea.</span>
        </label>
      );
    }
    return (
      <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-[#414141]">
        <legend className="px-2 text-sm font-semibold">{label}</legend>
        {value.map((item, index) => (
          <div key={index} className="rounded-lg bg-slate-50 p-3 dark:bg-[#181818]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label} {index + 1}</span>
              <button type="button" className={buttonClass + ' min-h-8 text-rose-700 dark:text-rose-300'} disabled={locked} onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}>Quitar</button>
            </div>
            <FieldValue
              fieldKey={label}
              value={item}
              path={[...path, index]}
              locked={locked}
              onChange={onChange}
              onUploadingChange={onUploadingChange}
            />
          </div>
        ))}
        <button type="button" className={buttonClass + ' border border-slate-300 dark:border-[#414141]'} disabled={locked} onClick={() => onChange(path, [...value, arrayItemTemplate(fieldKey, value)])}>+ Añadir elemento</button>
      </fieldset>
    );
  }

  if (value && typeof value === 'object') {
    const fields = Object.entries(value as Record<string, unknown>);
    const isLocalized = fields.length > 0 && fields.every(([key, item]) => ['es', 'en'].includes(key) && typeof item === 'string');
    return (
      <fieldset className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-[#414141] sm:grid-cols-2">
        <legend className="px-2 text-sm font-semibold">{label}</legend>
        {fields.length ? fields.map(([key, item]) => (
          <FieldValue
            key={key}
            fieldKey={key}
            value={item}
            path={[...path, key]}
            locked={locked}
            onChange={onChange}
            onUploadingChange={onUploadingChange}
          />
        )) : <p className="text-sm text-slate-500 dark:text-slate-400">Todavía no hay campos en este grupo.</p>}
        {isLocalized && <p className="sm:col-span-2 text-xs text-slate-500 dark:text-slate-400">Completa español e inglés para mostrar este texto en ambos idiomas.</p>}
      </fieldset>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 dark:border-[#414141]">
        <input type="checkbox" checked={value} disabled={locked} onChange={(event) => onChange(path, event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
        <span className="text-sm font-semibold">{label}</span>
      </label>
    );
  }

  const isNumber = typeof value === 'number';
  const currentValue = typeof value === 'string' || isNumber ? String(value) : '';
  const needsLongText = currentValue.length > 120 || ['biography', 'description', 'synopsis', 'whatHappens', 'desc', 'note', 'shortDescription', 'curiosityFact'].includes(fieldKey);
  const setValue = (next: string) => onChange(path, isNumber && next !== '' ? Number(next) : next);
  const uploadingKey = path.map(String).join('.');

  return (
    <div className="space-y-2">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">{label}</span>
        {needsLongText ? (
          <textarea className={inputClass + ' min-h-28'} value={currentValue} disabled={locked} onChange={(event) => setValue(event.target.value)} aria-label={label} />
        ) : (
          <input type={isNumber ? 'number' : 'text'} step={isNumber ? 'any' : undefined} className={inputClass} value={currentValue} disabled={locked} onChange={(event) => setValue(event.target.value)} aria-label={label} />
        )}
      </label>
      {isImagePath(path) && (
        <ImageUploadField
          label={label}
          hint="Sube una imagen desde el ordenador o pega su dirección en el campo."
          target="editorial-image"
          value={currentValue}
          onChange={(next) => onChange(path, next)}
          onPathChange={(next) => onChange(storagePathFor(path), next)}
          onUploadingChange={(uploading) => onUploadingChange(uploadingKey, uploading)}
        />
      )}
    </div>
  );
}

function toDraft(entry: ManagedContentEntry): Draft {
  const payload = entry.contentType === 'siteSettings'
    ? { ...entry.payload, homepageSections: resolveHomepageSections(entry.payload.homepageSections as Parameters<typeof resolveHomepageSections>[0]) }
    : entry.payload;
  return {
    contentType: entry.contentType,
    contentId: entry.contentId,
    slug: entry.slug || '',
    payload,
    sortOrder: entry.sortOrder,
    isPublished: entry.isPublished,
    updatedAt: entry.updatedAt,
    isNew: false,
  };
}

export default function ContentManager() {
  const [entries, setEntries] = useState<ManagedContentEntry[]>([]);
  const [selectedType, setSelectedType] = useState<AdminManagedContentType>('character');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const refresh = useCallback(async (signal?: AbortSignal, includeDeleted = false) => {
    setEntries(await fetchManagedContent(signal, includeDeleted));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchManagedContent(controller.signal)
      .then((result) => setEntries(result))
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No se pudo cargar el contenido.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => entries.filter((entry) => entry.contentType === selectedType
    && (search.trim() === '' || [displayName(entry), entry.contentId, entry.slug || ''].join(' ').toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')))), [entries, search, selectedType]);
  const typeLabel = contentTypes.find((type) => type.value === selectedType)?.label || 'Contenidos';

  function beginCreate() {
    const nextOrder = entries.filter((entry) => entry.contentType === selectedType).reduce((highest, item) => Math.max(highest, item.sortOrder), 0) + 1;
    setDraft({
      contentType: selectedType,
      contentId: '',
      slug: '',
      payload: emptyPayload(selectedType),
      sortOrder: nextOrder,
      isPublished: false,
      updatedAt: '',
      isNew: true,
    });
    setError('');
    setNotice('');
    setDeleteId('');
  }

  function beginEdit(entry: ManagedContentEntry) {
    setDraft(toDraft(entry));
    setError('');
    setNotice('');
    setDeleteId('');
  }

  function updatePayload(path: Array<string | number>, value: unknown) {
    setDraft((current) => current ? { ...current, payload: setPath(current.payload, path, value) } : current);
  }

  function closeEditor() {
    setDraft(null);
    setDeleteId('');
    setUploads({});
    setError('');
  }

  function makeSaveDraft(current: Draft) {
    const payload = JSON.parse(JSON.stringify(current.payload)) as Record<string, unknown>;
    let contentId = current.contentId || String(payload.id || '').trim();
    let slug = current.slug.trim();
    if (current.contentType !== 'siteSettings') {
      const source = slug || String(readPath(payload, ['title', 'es']) || readPath(payload, ['name', 'es']) || payload.name || payload.characterName || payload.place && readPath(payload, ['place', 'es']) || 'contenido');
      if (!contentId) {
        const normalized = source.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        contentId = normalized || crypto.randomUUID();
      }
      payload.id = contentId;
      if ('slug' in payload && !slug) slug = contentId;
      if ('slug' in payload) payload.slug = slug;
    } else {
      contentId = 'siteSettings';
      slug = '';
    }
    return { ...current, contentId, slug, payload };
  }

  async function save() {
    if (!draft || saving) return;
    if (Object.values(uploads).some(Boolean)) {
      setError('Espera a que terminen las subidas de imágenes.');
      return;
    }
    const current = makeSaveDraft(draft);
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/content', {
        method: current.isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: current.contentType,
          contentId: current.contentId,
          slug: current.slug || null,
          payload: current.payload,
          sortOrder: current.sortOrder,
          isPublished: current.isPublished,
          expectedUpdatedAt: current.updatedAt,
        }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || 'No se pudo guardar el contenido.');
      await refresh(undefined, showDeleted);
      setDraft(null);
      setNotice(current.isNew ? 'Contenido creado.' : 'Cambios guardados.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el contenido.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(entry: ManagedContentEntry) {
    if (deleteId !== entry.contentId) {
      setDeleteId(entry.contentId);
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: entry.contentType, contentId: entry.contentId }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || 'No se pudo retirar el contenido.');
      await refresh(undefined, showDeleted);
      if (draft?.contentId === entry.contentId) setDraft(null);
      setNotice('Contenido retirado. Se puede recuperar desde la base de datos.');
      setDeleteId('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo retirar el contenido.');
      setDeleteId('');
    } finally {
      setSaving(false);
    }
  }

  async function restore(entry: ManagedContentEntry) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: entry.contentType, contentId: entry.contentId }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || 'No se pudo recuperar el contenido.');
      await refresh(undefined, showDeleted);
      setNotice('Contenido recuperado y disponible según su estado de publicación.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo recuperar el contenido.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Gestión editorial</p>
          <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Contenidos</h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">
            Edita desde este panel las fichas editoriales y la portada. Los cambios se guardan en Supabase y se publican en el sitio.
          </p>
        </div>
        {selectedType !== 'siteSettings' && (
          <button type="button" onClick={beginCreate} className={buttonClass + ' bg-emerald-700 px-4 text-white hover:bg-emerald-800'}>
            + Nuevo contenido
          </button>
        )}
      </header>

      {error && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-[#272727] dark:text-emerald-200">{notice}</p>}

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <section className="space-y-4" aria-labelledby="content-list-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="content-list-heading" className="text-xl font-bold">{typeLabel}</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">{filtered.length} registros</span>
          </div>
          <label className="block space-y-2 text-sm font-semibold">
            <span>Sección</span>
            <select className={inputClass} value={selectedType} onChange={(event) => { setSelectedType(event.target.value as AdminManagedContentType); setDraft(null); setDeleteId(''); }}>
              {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>
          {selectedType !== 'siteSettings' && (
            <label className="relative block">
              <input className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o ruta" aria-label="Buscar contenido" />
            </label>
          )}
          {selectedType !== 'siteSettings' && (
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={showDeleted} onChange={async (event) => {
                const next = event.target.checked;
                setShowDeleted(next);
                setLoading(true);
                setError('');
                try { await refresh(undefined, next); }
                catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo cargar el contenido.'); }
                finally { setLoading(false); }
              }} className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
              Mostrar fichas retiradas
            </label>
          )}
          {loading ? (
            <div role="status" aria-label="Cargando contenido" className="space-y-3">
              <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" />
              <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" />
              <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-[#272727]" />
            </div>
          ) : selectedType === 'siteSettings' ? (
            <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f]">
              <p className="font-semibold">Ajustes de portada</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Frases principales, indicadores y orden de las secciones.</p>
              <button type="button" className={buttonClass + ' mt-4 border border-slate-300 dark:border-[#414141]'} onClick={() => entries.find((entry) => entry.contentType === 'siteSettings') ? beginEdit(entries.find((entry) => entry.contentType === 'siteSettings')!) : setError('No se encontró la configuración inicial.')}>
                Editar ajustes
              </button>
            </article>
          ) : filtered.length ? (
            <ul className="space-y-3">
              {filtered.map((entry) => (
                <li key={entry.contentId} className={'rounded-xl border bg-white p-4 dark:bg-[#1f1f1f] ' + (draft?.contentId === entry.contentId ? 'border-emerald-500 dark:border-emerald-700' : 'border-slate-200 dark:border-[#313131]')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{displayName(entry)}</p>
                      <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{entry.slug || entry.contentId}</p>
                      <span className={'mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ' + (entry.isDeleted ? 'bg-slate-200 text-slate-800 dark:bg-[#272727] dark:text-slate-200' : entry.isPublished ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200' : 'bg-amber-100 text-amber-900 dark:bg-[#272727] dark:text-amber-200')}>{entry.isDeleted ? 'Retirado' : entry.isPublished ? 'Publicado' : 'Oculto'}</span>
                    </div>
                    <button type="button" className={buttonClass + ' shrink-0 border border-slate-300 dark:border-[#414141]'} onClick={() => beginEdit(entry)}>Editar</button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {entry.isDeleted ? (
                      <button type="button" className={buttonClass + ' min-h-8 border border-emerald-700 text-emerald-800 dark:text-emerald-200'} onClick={() => void restore(entry)} disabled={saving}>Recuperar</button>
                    ) : (
                      <>
                        <button type="button" className={buttonClass + ' min-h-8 text-rose-700 dark:text-rose-300'} onClick={() => void remove(entry)} disabled={saving}>
                          {deleteId === entry.contentId ? 'Confirmar retirada' : 'Retirar'}
                        </button>
                        {deleteId === entry.contentId && <button type="button" className={buttonClass + ' min-h-8'} onClick={() => setDeleteId('')}>Cancelar</button>}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-[#414141]">
              <p className="font-semibold">No hay contenido en esta sección</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Crea la primera ficha para publicarla desde el panel.</p>
            </div>
          )}
        </section>

        <section aria-labelledby="content-editor-heading" className="min-w-0">
          {draft ? (
            <form onSubmit={(event) => { event.preventDefault(); void save(); }} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="content-editor-heading" className="text-xl font-bold">{draft.isNew ? 'Crear contenido' : 'Editar contenido'}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{contentTypes.find((type) => type.value === draft.contentType)?.label}</p>
                </div>
                <button type="button" className={buttonClass + ' min-h-9'} onClick={closeEditor} aria-label="Cerrar editor">Cerrar</button>
              </div>
              {draft.contentType !== 'siteSettings' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold">Identificador</span>
                    <input className={inputClass} value={String(draft.payload.id || '')} disabled={!draft.isNew} onChange={(event) => updatePayload(['id'], event.target.value)} />
                  </label>
                  {('slug' in draft.payload || draft.slug) && (
                    <label className="block space-y-1.5">
                      <span className="text-sm font-semibold">Ruta corta</span>
                      <input className={inputClass} value={draft.slug || String(draft.payload.slug || '')} onChange={(event) => {
                        setDraft((current) => current ? { ...current, slug: event.target.value, payload: { ...current.payload, slug: event.target.value } } : current);
                      }} />
                    </label>
                  )}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(draft.payload).filter(([key]) => !['id', 'slug', 'contentType'].includes(key)).map(([key, value]) => (
                  <FieldValue
                    key={key}
                    fieldKey={key}
                    value={value}
                    path={[key]}
                    locked={saving}
                    onChange={updatePayload}
                    onUploadingChange={(uploadKey, uploading) => setUploads((current) => ({ ...current, [uploadKey]: uploading }))}
                  />
                ))}
              </div>
              {draft.contentType !== 'siteSettings' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold">Orden</span>
                    <input className={inputClass} type="number" step="1" value={draft.sortOrder} onChange={(event) => setDraft((current) => current ? { ...current, sortOrder: Number(event.target.value) } : current)} />
                  </label>
                  <label className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 dark:border-[#414141]">
                    <input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft((current) => current ? { ...current, isPublished: event.target.checked } : current)} className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
                    <span className="text-sm font-semibold">Visible en el sitio</span>
                  </label>
                </div>
              )}
              {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:bg-[#272727] dark:text-rose-200">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <button type="submit" className={buttonClass + ' bg-emerald-700 px-4 text-white hover:bg-emerald-800'} disabled={saving || Object.values(uploads).some(Boolean)}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
                <button type="button" className={buttonClass + ' border border-slate-300 dark:border-[#414141]'} disabled={saving} onClick={closeEditor}>Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-[#414141] dark:bg-[#1f1f1f]">
              <h2 id="content-editor-heading" className="mt-4 text-lg font-semibold">Selecciona una ficha para editarla</h2>
              <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">Puedes crear, actualizar, ordenar, ocultar o retirar contenido desde este panel.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
