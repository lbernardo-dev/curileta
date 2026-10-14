'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { DestinationMedia } from '@curileta/cms';
import { ArrowDown, ArrowUp, ImagePlus, Trash2, Upload } from 'lucide-react';
import { ContentImage } from '@/components/ContentImage';
import { encodeAdminImage } from '@/lib/admin-image-encoding';

const fieldClass = 'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-hidden transition-all duration-700 ease-fluid focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#181818] dark:text-white';

interface UploadTicket {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
  supabaseUrl: string;
  publishableKey: string;
  contentType: string;
}

export function DestinationMediaEditor({
  media,
  committedPaths,
  onChange,
  onUploadingChange,
}: {
  media: DestinationMedia[];
  committedPaths: string[];
  onChange: (media: DestinationMedia[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const stagedPathsRef = useRef(new Set<string>());
  const onUploadingChangeRef = useRef(onUploadingChange);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { onUploadingChangeRef.current = onUploadingChange; }, [onUploadingChange]);
  const discard = useCallback(async (path: string) => {
    if (!path) return;
    await fetch('/api/admin/destinations/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
      keepalive: true,
    }).catch(() => undefined);
  }, []);
  useEffect(() => {
    const currentPaths = new Set(media.map((item) => item.storagePath));
    const savedPaths = new Set(committedPaths);
    for (const path of stagedPathsRef.current) {
      if (savedPaths.has(path)) {
        stagedPathsRef.current.delete(path);
        continue;
      }
      if (currentPaths.has(path)) continue;
      stagedPathsRef.current.delete(path);
      void discard(path);
    }
  }, [committedPaths, discard, media]);
  useEffect(() => () => {
    for (const path of stagedPathsRef.current) void discard(path);
    onUploadingChangeRef.current(false);
  }, [discard]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || uploading) return;
    const queue = Array.from(files);
    setUploading(true);
    onUploadingChangeRef.current(true);
    setError('');
    try {
      let nextMedia = [...media];
      for (const file of queue) {
        const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
        if (!kind || (kind === 'image' && !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type))
          || (kind === 'video' && !['video/mp4', 'video/webm'].includes(file.type))) {
          throw new Error(`El formato de «${file.name}» no está admitido. Usa JPG, PNG, WebP, AVIF, MP4 o WebM.`);
        }
        if (file.size < 1 || file.size > (kind === 'image' ? 24 : 100) * 1024 * 1024) {
          throw new Error(`«${file.name}» supera el límite permitido de ${kind === 'image' ? '24' : '100'} MB.`);
        }
        const prepared = kind === 'image'
          ? await convertDestinationImage(file)
          : { blob: file, contentType: file.type };
        const maxBytes = kind === 'image' ? 8 * 1024 * 1024 : 100 * 1024 * 1024;
        if (prepared.blob.size > maxBytes) throw new Error(`«${file.name}» supera el límite de ${kind === 'image' ? '8' : '100'} MB después de prepararlo.`);

        const ticketResponse = await fetch('/api/admin/destinations/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kind, contentType: prepared.contentType, fileSize: prepared.blob.size }),
        });
        const ticketResult = await ticketResponse.json().catch(() => null) as (Partial<UploadTicket> & { error?: unknown }) | null;
        if (!ticketResponse.ok || !ticketResult || typeof ticketResult.bucket !== 'string' || typeof ticketResult.path !== 'string'
          || typeof ticketResult.token !== 'string' || typeof ticketResult.publicUrl !== 'string'
          || typeof ticketResult.supabaseUrl !== 'string' || typeof ticketResult.publishableKey !== 'string'
          || typeof ticketResult.contentType !== 'string') {
          throw new Error(typeof ticketResult?.error === 'string' ? ticketResult.error : 'No se pudo preparar la subida del archivo.');
        }
        const ticket = ticketResult as UploadTicket;
        stagedPathsRef.current.add(ticket.path);
        const client = createClient(ticket.supabaseUrl, ticket.publishableKey, {
          auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        });
        const { error: uploadError } = await client.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, prepared.blob, {
          cacheControl: '31536000',
          contentType: ticket.contentType,
        });
        if (uploadError) {
          await discard(ticket.path);
          stagedPathsRef.current.delete(ticket.path);
          throw new Error(`No se pudo subir «${file.name}». Comprueba la conexión e inténtalo de nuevo.`);
        }

        const nextOrder = nextMedia.reduce((maximum, item) => Math.max(maximum, item.sortOrder), -1) + 1;
        const isCard = kind === 'image' && !nextMedia.some((item) => item.isCard);
        const item: DestinationMedia = {
          id: crypto.randomUUID(),
          kind,
          url: ticket.publicUrl,
          storagePath: ticket.path,
          alt: { es: '', en: '' },
          caption: { es: '', en: '' },
          isCard,
          sortOrder: nextOrder,
        };
        nextMedia = [...nextMedia, item];
        onChange(nextMedia);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo subir el archivo.');
    } finally {
      setUploading(false);
      onUploadingChangeRef.current(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function update(itemId: string, patch: Partial<DestinationMedia>) {
    onChange(media.map((item) => item.id === itemId ? { ...item, ...patch } : item));
  }

  function selectCard(itemId: string) {
    onChange(media.map((item) => ({ ...item, isCard: item.id === itemId && item.kind === 'image' })));
  }

  function move(itemId: string, offset: -1 | 1) {
    const index = media.findIndex((item) => item.id === itemId);
    const targetIndex = index + offset;
    if (index < 0 || targetIndex < 0 || targetIndex >= media.length) return;
    const next = [...media];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next.map((item, sortOrder) => ({ ...item, sortOrder })));
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-[#313131] sm:p-5" aria-labelledby="destination-media-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="destination-media-heading" className="text-base font-bold">Fotos y escenas de vídeo</h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-300">Carga varias piezas desde el ordenador. Las fotos se optimizan a WebP o JPEG según el navegador; puedes elegir una para la tarjeta de portada.</p>
        </div>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" className="sr-only" aria-label="Seleccionar fotos y vídeos" disabled={uploading} onChange={(event) => { void uploadFiles(event.target.files); }} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600">
          <Upload className="h-4 w-4" />{uploading ? 'Subiendo…' : 'Elegir archivos'}
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">Fotos JPG, PNG, WebP o AVIF: 24 MB de original y 8 MB optimizada. Vídeos MP4 o WebM: hasta 100 MB.</p>
      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:bg-[#313131] dark:text-rose-200">{error}</p>}

      {media.length ? <ol className="grid gap-4 md:grid-cols-2">
        {media.map((item, index) => <li key={item.id} className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-[#414141]">
          {item.kind === 'video'
            ? <video controls preload="metadata" className="aspect-video w-full rounded-lg bg-black" src={item.url} />
            : <ContentImage src={item.url} alt={item.alt.es || 'Vista previa de la foto'} className="aspect-video w-full rounded-lg bg-slate-100 object-cover dark:bg-[#181818]" />}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.kind === 'image' ? 'Fotografía' : 'Escena de vídeo'}</span>
            <div className="flex items-center gap-1">
              {item.kind === 'image' && <label className="mr-2 inline-flex items-center gap-2 text-xs font-semibold"><input type="radio" name="destination-card-image" checked={item.isCard} onChange={() => selectCard(item.id)} className="accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600" />Usar en tarjeta</label>}
              <button type="button" onClick={() => move(item.id, -1)} disabled={index === 0} aria-label="Subir medio" className="rounded-md p-2 hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(item.id, 1)} disabled={index === media.length - 1} aria-label="Bajar medio" className="rounded-md p-2 hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:bg-[#272727]"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => onChange(media.filter(({ id }) => id !== item.id).map((entry, sortOrder) => ({ ...entry, isCard: item.isCard ? false : entry.isCard, sortOrder })))} aria-label="Quitar medio" className="rounded-md p-2 text-rose-700 hover:bg-rose-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['es', 'en'] as const).map((language) => <label key={`${item.id}-alt-${language}`} className="text-xs font-semibold">
              {language === 'es' ? 'Texto alternativo en español *' : 'Alt text in English *'}
              <input required className={fieldClass} value={item.alt[language] || ''} maxLength={240} onChange={(event) => update(item.id, { alt: { ...item.alt, [language]: event.target.value } })} />
            </label>)}
            {(['es', 'en'] as const).map((language) => <label key={`${item.id}-caption-${language}`} className="text-xs font-semibold">
              {language === 'es' ? 'Pie de foto en español' : 'Caption in English'}
              <input className={fieldClass} value={item.caption?.[language] || ''} maxLength={500} onChange={(event) => update(item.id, { caption: { es: item.caption?.es || '', en: item.caption?.en || '', [language]: event.target.value } })} />
            </label>)}
          </div>
        </li>)}
      </ol> : <div className="flex min-h-28 items-center justify-center gap-2 rounded-lg bg-slate-50 text-sm text-slate-500 dark:bg-[#181818] dark:text-slate-400"><ImagePlus className="h-5 w-5" />Aún no hay medios para este destino</div>}
    </section>
  );
}

async function convertDestinationImage(file: File): Promise<{ blob: Blob; contentType: 'image/webp' | 'image/jpeg' }> {
  if (typeof createImageBitmap !== 'function') throw new Error('Este navegador no puede procesar la imagen. Prueba con otro navegador.');
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`No se pudo leer «${file.name}». Prueba con JPG, PNG, WebP o AVIF.`);
  }
  try {
    const scale = Math.min(1, 3840 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo procesar la imagen.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    return await encodeAdminImage(canvas, 0.88);
  } finally {
    bitmap.close();
  }
}
