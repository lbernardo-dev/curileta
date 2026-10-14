'use client';

import { ContentImage } from '@/components/ContentImage';
import { useEffect, useMemo, useState } from 'react';
import type { Video } from '@curileta/cms';
import type { ManagedYouTubeItem, YouTubeImportDraft, YouTubeManagedKind, YouTubeVideoType } from '@/lib/youtube-content.types';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

type ContentFilter = 'all' | 'video' | 'short' | 'music';

const inputClass = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-hidden transition-all duration-700 ease-fluid focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:bg-[#181818] dark:text-white';
const textareaClass = `${inputClass} min-h-28 resize-y`;
const surfaceClass = 'rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

function localized(value: { es: string; en?: string } | undefined, locale: 'es' | 'en') {
  return value?.[locale] || value?.es || '';
}

function makeItemDraft(kind: YouTubeManagedKind, imported: YouTubeImportDraft, videoType: YouTubeVideoType): ManagedYouTubeItem {
  const safeVideoId = [...imported.youtubeId].map((character) => character.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  const id = `${kind}-${safeVideoId}`;
  const encodedId = btoa(id).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  const common = {
    id,
    slug: imported.suggestedSlug,
    title: imported.title,
    youtubeId: imported.youtubeId,
    duration: imported.duration,
    publishedAt: imported.publishedAt,
    tags: imported.tags,
    playlistName: imported.playlistName,
    playlistId: imported.playlistId,
    isPublished: true,
    youtubeMetadata: imported.youtubeMetadata,
    itemKey: `${kind}:${encodedId}`,
    inherited: false,
  };

  if (kind === 'video') {
    return {
      ...common,
      kind: 'video',
      type: videoType,
      thumbnail: imported.thumbnail,
      description: imported.description,
      highlightTag: { es: '', en: '' },
      votingEnabled: false,
      votePrompt: { es: '', en: '' },
    };
  }

  return {
    ...common,
    kind: 'song',
    youtubeId: imported.youtubeId,
    coverImage: imported.thumbnail,
    description: imported.description,
    lyrics: { es: '', en: '' },
  };
}

function itemLabel(item: ManagedYouTubeItem) {
  return localized(item.title, 'es') || 'Contenido sin título';
}

function itemSummary(item: ManagedYouTubeItem) {
  if (item.kind === 'song') return 'Ficha musical';
  if (item.type === 'short') return 'Short';
  if (item.type === 'song') return 'Videoclip';
  if (item.type === 'trailer') return 'Tráiler';
  return item.episodeNumber ? `Episodio ${item.episodeNumber}` : 'Vídeo';
}

function sortByDate(items: ManagedYouTubeItem[]) {
  return [...items].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || itemLabel(a).localeCompare(itemLabel(b), 'es'));
}

const youtubeMetadataLabels: Record<string, string> = {
  channelId: 'Identificador del canal',
  channelTitle: 'Canal',
  categoryId: 'Categoría',
  viewCount: 'Reproducciones al importar',
  likeCount: 'Me gusta al importar',
  commentCount: 'Comentarios al importar',
  favoriteCount: 'Favoritos al importar',
  defaultLanguage: 'Idioma',
  defaultAudioLanguage: 'Idioma del audio',
  liveBroadcastContent: 'Estado de emisión',
  privacyStatus: 'Privacidad',
  dimension: 'Dimensión',
  definition: 'Definición',
  caption: 'Subtítulos',
  licensedContent: 'Contenido con licencia',
  projection: 'Proyección',
  embeddable: 'Se puede insertar',
  license: 'Licencia',
  madeForKids: 'Marcado para niños',
  selfDeclaredMadeForKids: 'Declarado para niños',
  playlistChannelId: 'Identificador del canal de la lista',
  playlistChannelTitle: 'Canal de la lista',
  playlistPublishedAt: 'Fecha de creación de la lista',
};

export function YouTubeContentManager() {
  const [items, setItems] = useState<ManagedYouTubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [filter, setFilter] = useState<ContentFilter>('all');
  const [kind, setKind] = useState<YouTubeManagedKind>('video');
  const [videoType, setVideoType] = useState<YouTubeVideoType>('episode');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingImageUploads, setPendingImageUploads] = useState(0);
  const [draft, setDraft] = useState<ManagedYouTubeItem | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/youtube-content', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo cargar el contenido de YouTube.');
      setItems(result.items || []);
      setStorageAvailable(result.storageAvailable !== false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el contenido de YouTube.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/youtube-content', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar el contenido de YouTube.');
        setItems(result.items || []);
        setStorageAvailable(result.storageAvailable !== false);
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'No se pudo cargar el contenido de YouTube.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const visibleItems = useMemo(() => sortByDate(items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'video') return item.kind === 'video' && item.type !== 'short' && item.type !== 'song';
    if (filter === 'short') return item.kind === 'video' && item.type === 'short';
    return item.kind === 'song' || (item.kind === 'video' && item.type === 'song');
  })), [filter, items]);

  function updateDraft(field: string, value: unknown) {
    setDraft((current) => current ? ({ ...current, [field]: value } as ManagedYouTubeItem) : current);
  }

  function updateDraftImage(value: string) {
    setDraft((current) => {
      if (!current) return current;
      return current.kind === 'video'
        ? { ...current, thumbnail: value }
        : { ...current, coverImage: value };
    });
  }

  function updateLocalized(field: 'title' | 'description' | 'playlistName' | 'highlightTag' | 'votePrompt' | 'lyrics', locale: 'es' | 'en', value: string) {
    setDraft((current) => {
      if (!current) return current;
      const currentValue = (current as unknown as Record<string, unknown>)[field] as Record<string, string> | undefined;
      return { ...current, [field]: { es: currentValue?.es || '', en: currentValue?.en || '', [locale]: value } } as ManagedYouTubeItem;
    });
  }

  async function importLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setImporting(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/youtube-content/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl, kind, videoType }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron importar los datos del vídeo.');
      const imported = result.draft as YouTubeImportDraft;
      const suggestedVideoType = result.suggestedVideoType as YouTubeVideoType;
      setVideoType(suggestedVideoType);
      setDraft(makeItemDraft(kind, imported, suggestedVideoType));
      setEditingKey(null);
      setNotice(imported.sourceNote || 'Datos del enlace cargados. Revisa la ficha antes de guardarla.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron importar los datos del vídeo.');
    } finally {
      setImporting(false);
    }
  }

  function editItem(item: ManagedYouTubeItem) {
    setDraft(structuredClone(item));
    setEditingKey(item.itemKey);
    setNotice('');
    setError('');
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError('');
    setNotice('');
    const { itemKey, kind: itemKind, ...item } = draft;
    const itemPayload = Object.fromEntries(Object.entries(item).filter(([key]) => key !== 'inherited'));
    try {
      const response = await fetch(editingKey ? `/api/admin/youtube-content/${encodeURIComponent(itemKey)}` : '/api/admin/youtube-content', {
        method: editingKey ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingKey ? { item: itemPayload } : { kind: itemKind, item: itemPayload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar la ficha.');
      setDraft(null);
      setEditingKey(null);
      setYoutubeUrl('');
      setNotice(editingKey ? 'Ficha actualizada.' : 'Ficha creada.');
      await loadItems();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la ficha.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: ManagedYouTubeItem) {
    setError('');
    try {
      const response = await fetch(`/api/admin/youtube-content/${encodeURIComponent(item.itemKey)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo retirar la ficha.');
      setItems((current) => current.filter((entry) => entry.itemKey !== item.itemKey));
      setConfirmingDelete(null);
      setNotice('Ficha retirada del sitio.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo retirar la ficha.');
    }
  }

  function cancelDraft() {
    setDraft(null);
    setEditingKey(null);
    setError('');
    setNotice('');
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">Contenido multimedia</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Vídeos y música</h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">Administra episodios, Shorts, videoclips y fichas musicales desde un solo lugar.</p>
        </div>
        <a href="https://www.youtube.com/@curileta" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:hover:bg-[#272727]">
          Abrir canal público
        </a>
      </header>

      {!storageAvailable && <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-[#272727] dark:text-amber-100">La tabla de gestión aún no está disponible. Aplica la migración de contenido de YouTube para guardar cambios.</p>}

        <section className={`${surfaceClass} space-y-6`} aria-labelledby="add-youtube-content-heading">
        <div>
          <h2 id="add-youtube-content-heading" className="text-xl font-bold">Añadir desde un enlace</h2>
          <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">Pega un vídeo o Short. Revisarás los datos detectados antes de publicarlo.</p>
        </div>
        <form onSubmit={importLink} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] lg:items-end">
          <Field label="Enlace de YouTube">
            <input className={inputClass} type="url" required value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
          </Field>
          <Field label="Se guardará como">
            <select className={inputClass} value={kind} onChange={(event) => setKind(event.target.value as YouTubeManagedKind)}>
              <option value="video">Vídeo del canal</option>
              <option value="song">Ficha musical</option>
            </select>
          </Field>
          {kind === 'video' ? (
            <Field label="Tipo de vídeo">
              <select className={inputClass} value={videoType} onChange={(event) => setVideoType(event.target.value as YouTubeVideoType)}>
                <option value="episode">Episodio</option>
                <option value="short">Short</option>
                <option value="song">Videoclip</option>
                <option value="trailer">Tráiler</option>
              </select>
            </Field>
          ) : <span className="hidden lg:block" aria-hidden="true" />}
          <button type="submit" disabled={importing || pendingImageUploads > 0 || !storageAvailable} className="min-h-11 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600">
            {importing ? 'Leyendo enlace…' : 'Importar datos'}
          </button>
        </form>
      </section>

      {draft && (
        <section className={`${surfaceClass} space-y-6`} aria-labelledby="youtube-item-editor-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{editingKey ? 'Editar ficha' : 'Revisar importación'}</p>
              <h2 id="youtube-item-editor-heading" className="mt-1 text-xl font-bold">{itemLabel(draft)}</h2>
            </div>
            <button type="button" onClick={cancelDraft} className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-300 dark:hover:bg-[#272727]">Cerrar editor</button>
          </div>

          <form onSubmit={saveItem} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {(['es', 'en'] as const).map((locale) => (
                <Field key={`title-${locale}`} label={`Título en ${locale === 'es' ? 'español' : 'inglés'}`}>
                  <input className={inputClass} required maxLength={160} value={localized(draft.title, locale)} onChange={(event) => updateLocalized('title', locale, event.target.value)} />
                </Field>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ruta corta" hint="Se usa para identificar y compartir esta ficha.">
                <input className={inputClass} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={100} value={draft.slug} onChange={(event) => updateDraft('slug', event.target.value)} />
              </Field>
              <Field label="Enlace del vídeo">
                <input className={`${inputClass} bg-slate-50 dark:bg-[#181818]`} readOnly value={draft.youtubeId ? `https://www.youtube.com/watch?v=${draft.youtubeId}` : ''} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {draft.kind === 'video' && (
                <Field label="Tipo">
                  <select className={inputClass} value={draft.type} onChange={(event) => updateDraft('type', event.target.value as Video['type'])}>
                    <option value="episode">Episodio</option><option value="short">Short</option><option value="song">Videoclip</option><option value="trailer">Tráiler</option>
                  </select>
                </Field>
              )}
              <Field label="Duración" hint="Formato minutos y segundos.">
                <input className={inputClass} inputMode="numeric" placeholder="3:42" value={draft.duration || ''} onChange={(event) => updateDraft('duration', event.target.value)} />
              </Field>
              <Field label="Fecha de publicación">
                <input className={inputClass} type="date" value={(draft.publishedAt || '').slice(0, 10)} onChange={(event) => updateDraft('publishedAt', event.target.value)} />
              </Field>
            </div>
            {draft.kind === 'video' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageUploadField
                  label="Miniatura del vídeo"
                  hint="Se usa la miniatura detectada en YouTube. Puedes sustituirla por una imagen de la biblioteca del sitio."
                  target="youtube-video-thumbnail"
                  value={draft.thumbnail || ''}
                  onChange={updateDraftImage}
                  onUploadingChange={(uploading) => setPendingImageUploads((count) => Math.max(0, count + (uploading ? 1 : -1)))}
                />
                <Field label="Número de episodio">
                  <input className={inputClass} type="number" min="1" max="9999" value={draft.episodeNumber || ''} onChange={(event) => updateDraft('episodeNumber', event.target.value ? Number(event.target.value) : undefined)} />
                </Field>
              </div>
            )}
            {draft.kind === 'song' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageUploadField
                  label="Portada de la ficha musical"
                  hint="Se usa la miniatura detectada en YouTube. Puedes sustituirla por una portada de la biblioteca del sitio."
                  target="youtube-song-cover"
                  value={draft.coverImage || ''}
                  onChange={updateDraftImage}
                  onUploadingChange={(uploading) => setPendingImageUploads((count) => Math.max(0, count + (uploading ? 1 : -1)))}
                />
                <Field label="Enlace de audio" hint="Opcional si la publicación solo está en YouTube.">
                  <input className={inputClass} type="url" value={draft.audioUrl || ''} onChange={(event) => updateDraft('audioUrl', event.target.value)} />
                </Field>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {(['es', 'en'] as const).map((locale) => (
                <Field key={`description-${locale}`} label={`Descripción en ${locale === 'es' ? 'español' : 'inglés'}`}>
                  <textarea className={textareaClass} maxLength={5000} value={localized(draft.description, locale)} onChange={(event) => updateLocalized('description', locale, event.target.value)} />
                </Field>
              ))}
            </div>
            {draft.kind === 'song' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {(['es', 'en'] as const).map((locale) => (
                  <Field key={`lyrics-${locale}`} label={`Letra en ${locale === 'es' ? 'español' : 'inglés'}`}>
                    <textarea className={textareaClass} maxLength={10000} value={localized(draft.lyrics, locale)} onChange={(event) => updateLocalized('lyrics', locale, event.target.value)} />
                  </Field>
                ))}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Etiquetas" hint="Sepáralas con comas.">
                <input className={inputClass} value={(draft.tags || []).join(', ')} onChange={(event) => updateDraft('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 50))} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Identificador de lista">
                  <input className={inputClass} value={draft.playlistId || ''} onChange={(event) => updateDraft('playlistId', event.target.value)} />
                </Field>
                {(['es', 'en'] as const).map((locale) => (
                  <Field key={`playlist-${locale}`} label={`Lista en ${locale === 'es' ? 'español' : 'inglés'}`}>
                    <input className={inputClass} value={localized(draft.playlistName, locale)} onChange={(event) => updateLocalized('playlistName', locale, event.target.value)} />
                  </Field>
                ))}
              </div>
            </div>
            {draft.kind === 'video' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(['es', 'en'] as const).map((locale) => (
                    <Field key={`highlight-${locale}`} label={`Etiqueta destacada en ${locale === 'es' ? 'español' : 'inglés'}`}>
                      <input className={inputClass} value={localized(draft.highlightTag, locale)} onChange={(event) => updateLocalized('highlightTag', locale, event.target.value)} />
                    </Field>
                  ))}
                </div>
                <label className="flex items-center gap-3 text-sm font-semibold">
                  <input type="checkbox" checked={draft.votingEnabled || false} onChange={(event) => updateDraft('votingEnabled', event.target.checked)} className="h-4 w-4 rounded-sm border-slate-300 accent-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600" />
                  Activar votación en la ficha
                </label>
                {draft.votingEnabled && <div className="grid gap-4 sm:grid-cols-2">{(['es', 'en'] as const).map((locale) => <Field key={`vote-${locale}`} label={`Pregunta de votación en ${locale === 'es' ? 'español' : 'inglés'}`}><input className={inputClass} maxLength={500} value={localized(draft.votePrompt, locale)} onChange={(event) => updateLocalized('votePrompt', locale, event.target.value)} /></Field>)}</div>}
              </>
            )}

            {draft.youtubeMetadata && (
              <details className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-[#181818]">
                <summary className="cursor-pointer font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600">Datos detectados en YouTube</summary>
                <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {Object.entries(draft.youtubeMetadata)
                    .filter(([key, value]) => key !== 'thumbnailUrls' && value !== '' && value !== undefined)
                    .map(([key, value]) => (
                      <div key={key} className="min-w-0">
                        <dt className="text-xs text-slate-500 dark:text-slate-400">{youtubeMetadataLabels[key] || key}</dt>
                        <dd className="wrap-break-word text-slate-700 dark:text-slate-200">{typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}</dd>
                      </div>
                    ))}
                </dl>
                {draft.youtubeMetadata.thumbnailUrls && Object.entries(draft.youtubeMetadata.thumbnailUrls).length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tamaños de miniatura disponibles</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(draft.youtubeMetadata.thumbnailUrls).map(([size, url]) => (
                        <a key={size} href={url} target="_blank" rel="noopener noreferrer" className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-emerald-800 underline dark:bg-[#272727] dark:text-emerald-200">{size}</a>
                      ))}
                    </div>
                  </div>
                )}
              </details>
            )}

            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-semibold dark:bg-[#181818]">
              <input type="checkbox" checked={draft.isPublished} onChange={(event) => updateDraft('isPublished', event.target.checked)} className="h-4 w-4 rounded-sm border-slate-300 accent-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600" />
              Visible en el sitio al guardar
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={cancelDraft} className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:hover:bg-[#272727]">Cancelar</button>
              <button type="submit" disabled={saving || pendingImageUploads > 0 || !storageAvailable} className="min-h-11 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600">
                {saving ? 'Guardando…' : draft.isPublished ? (editingKey ? 'Guardar cambios' : 'Crear y publicar ficha') : 'Guardar como oculta'}
              </button>
            </div>
          </form>
        </section>
      )}

      {notice && <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:bg-[#1f1f1f] dark:text-emerald-200">{notice}</p>}
      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">{error}</p>}

      <section className="space-y-6" aria-labelledby="youtube-content-list-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="youtube-content-list-heading" className="text-xl font-bold">Contenido del canal</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{items.length} fichas · los cambios se reflejan en la web pública.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filtrar contenido">
            {([
              ['all', 'Todo'], ['video', 'Vídeos'], ['short', 'Shorts'], ['music', 'Música'],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${filter === value ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-[#1f1f1f] dark:text-slate-200 dark:hover:bg-[#272727]'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div role="status" aria-label="Cargando contenido" className="space-y-3">
            {[0, 1, 2].map((index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-[#272727]" />)}
          </div>
        ) : visibleItems.length ? (
          <div className="space-y-3">
            {visibleItems.map((item) => (
              <article key={item.itemKey} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#313131] dark:bg-[#1f1f1f] sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center">
                <div className="aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-[#272727]">
                  {item.kind === 'video' ? <ContentImage src={item.thumbnail} alt="" className="h-full w-full object-cover" /> : item.coverImage ? <ContentImage src={item.coverImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">Música</div>}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{itemSummary(item)}</p>
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${item.isPublished ? 'bg-emerald-100 text-emerald-950 dark:bg-[#272727] dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-[#272727] dark:text-slate-300'}`}>{item.isPublished ? 'Visible' : 'Oculta'}</span>
                    {!item.inherited && <span className="text-xs text-slate-500">Añadida en el panel</span>}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{itemLabel(item)}</h3>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{localized(item.description, 'es') || (item.kind === 'song' ? item.audioUrl || '' : '')}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.publishedAt?.slice(0, 10) || 'Sin fecha'}{item.duration ? ` · ${item.duration}` : ''}{item.youtubeMetadata?.viewCount ? ` · ${Number(item.youtubeMetadata.viewCount).toLocaleString('es-ES')} reproducciones al importar` : ''}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <button type="button" onClick={() => editItem(item)} className="min-h-10 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:hover:bg-[#272727]">Editar</button>
                  {confirmingDelete === item.itemKey ? (
                    <div className="flex items-center gap-2" role="group" aria-label={`Confirmar retirada de ${itemLabel(item)}`}>
                      <button type="button" onClick={() => void deleteItem(item)} className="min-h-10 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-red-800 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-600">Retirar</button>
                      <button type="button" onClick={() => setConfirmingDelete(null)} className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-300">Cancelar</button>
                    </div>
                  ) : <button type="button" onClick={() => setConfirmingDelete(item.itemKey)} className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition-all duration-700 ease-fluid hover:bg-red-50 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-600 dark:text-red-300 dark:hover:bg-[#272727]">Retirar</button>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={`${surfaceClass} py-10 text-center`}>
            <h3 className="text-lg font-bold">Todavía no hay contenido en esta vista</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">Pega un enlace de YouTube para crear una ficha y completar los datos que falten.</p>
          </div>
        )}
      </section>
    </div>
  );
}
