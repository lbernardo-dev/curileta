'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FileAudio2, FileVideo2, FileText, Trash2, Upload } from 'lucide-react';

type MediaKind = 'heroVideo' | 'ambientAudio' | 'scareSound' | 'activityPdf' | 'eventPrintablePdf' | 'characterMaskPdf';

interface Ticket {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
  supabaseUrl: string;
  publishableKey: string;
  contentType: string;
}

export function EventMediaUploadField({
  kind,
  label,
  hint,
  url,
  onChange,
  onUploadingChange,
}: {
  kind: MediaKind;
  label: string;
  hint: string;
  url: string;
  onChange: (media: { url: string; path: string }) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);
  const uploadGeneration = useRef(0);
  const stagedPath = useRef('');
  const onUploadingChangeRef = useRef(onUploadingChange);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const isVideo = kind === 'heroVideo';
  const isPdf = kind === 'activityPdf' || kind === 'eventPrintablePdf' || kind === 'characterMaskPdf';
  const isMaskPdf = kind === 'characterMaskPdf';
  const uploadKind = kind;
  const accept = isVideo ? 'video/mp4,video/webm' : isPdf ? 'application/pdf,.pdf' : 'audio/mpeg,audio/mp4,audio/ogg,audio/webm';
  const maxBytes = isVideo ? 100 * 1024 * 1024 : isMaskPdf ? 8 * 1024 * 1024 : isPdf ? 12 * 1024 * 1024 : 25 * 1024 * 1024;
  const mediaEndpoint = isMaskPdf ? '/api/admin/character-masks/media' : '/api/admin/events/media';

  useEffect(() => {
    onUploadingChangeRef.current = onUploadingChange;
  }, [onUploadingChange]);

  const discard = useCallback(async (mediaPath: string) => {
    if (!mediaPath) return;
    await fetch(mediaEndpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: mediaPath }),
      keepalive: true,
    }).catch(() => undefined);
  }, [mediaEndpoint]);

  useEffect(() => {
    mountedRef.current = true;
    const generation = ++uploadGeneration.current;
    return () => {
      mountedRef.current = false;
      if (uploadGeneration.current === generation) uploadGeneration.current += 1;
      if (stagedPath.current) discard(stagedPath.current);
      onUploadingChangeRef.current(false);
    };
  }, [discard]);

  async function upload(file?: File) {
    if (!file || uploading) return;
    if (!file.type.startsWith(isVideo ? 'video/' : isPdf ? 'application/' : 'audio/')
      || (isVideo ? !['video/mp4', 'video/webm'].includes(file.type) : isPdf ? file.type !== 'application/pdf' : !['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm'].includes(file.type))) {
      setError(isVideo ? 'Elige un vídeo MP4 o WebM.' : isPdf ? 'Elige un documento PDF.' : 'Elige un audio MP3, M4A, OGG o WebM.');
      return;
    }
    if (file.size < 1 || file.size > maxBytes) {
      setError(`El archivo debe pesar ${isVideo ? '100' : isMaskPdf ? '8' : isPdf ? '12' : '25'} MB o menos.`);
      return;
    }

    const generation = uploadGeneration.current;
    setUploading(true);
    onUploadingChangeRef.current(true);
    setError('');
    let pendingPath = '';
    try {
      const ticketResponse = await fetch(mediaEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: uploadKind, contentType: file.type, fileSize: file.size }),
      });
      const result = await ticketResponse.json().catch(() => null) as (Partial<Ticket> & { error?: unknown }) | null;
      if (!ticketResponse.ok || !result || typeof result.bucket !== 'string' || typeof result.path !== 'string'
        || typeof result.token !== 'string' || typeof result.publicUrl !== 'string' || typeof result.supabaseUrl !== 'string'
        || typeof result.publishableKey !== 'string' || typeof result.contentType !== 'string') {
        throw new Error(typeof result?.error === 'string' ? result.error : 'No se pudo preparar la subida del archivo.');
      }
      const ticket = result as Ticket;
      pendingPath = ticket.path;
      const client = createClient(ticket.supabaseUrl, ticket.publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
      });
      const { error: uploadError } = await client.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file, {
        cacheControl: '31536000',
        contentType: ticket.contentType,
      });
      if (uploadError) throw new Error('No se pudo subir el archivo. Comprueba la conexión e inténtalo de nuevo.');
      if (!mountedRef.current || uploadGeneration.current !== generation) {
        await discard(ticket.path);
        pendingPath = '';
        return;
      }
      if (stagedPath.current) await discard(stagedPath.current);
      stagedPath.current = ticket.path;
      pendingPath = '';
      onChange({ url: ticket.publicUrl, path: ticket.path });
    } catch (cause) {
      if (pendingPath) await discard(pendingPath);
      if (mountedRef.current) setError(cause instanceof Error ? cause.message : 'No se pudo subir el archivo.');
    } finally {
      if (mountedRef.current && uploadGeneration.current === generation) {
        setUploading(false);
        onUploadingChangeRef.current(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  }

  async function clear() {
    if (stagedPath.current) {
      await discard(stagedPath.current);
      stagedPath.current = '';
    }
    onChange({ url: '', path: '' });
    setError('');
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-[#313131]">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{hint}</p>
      </div>
      {url ? (
        isVideo
          ? <video controls preload="metadata" className="max-h-64 w-full rounded-lg bg-black" src={url} />
          : isPdf
            ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-emerald-800 underline dark:bg-[#181818] dark:text-emerald-200"><FileText className="h-5 w-5" />Abrir el PDF actual</a>
            : <audio controls preload="metadata" className="w-full" src={url} />
      ) : (
        <div className="flex min-h-20 items-center justify-center gap-2 rounded-lg bg-slate-50 text-sm text-slate-500 dark:bg-[#181818] dark:text-slate-400">
          {isVideo ? <FileVideo2 className="h-5 w-5" /> : isPdf ? <FileText className="h-5 w-5" /> : <FileAudio2 className="h-5 w-5" />}
          No hay archivo seleccionado
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="sr-only" aria-label={`Seleccionar ${label.toLocaleLowerCase()}`} disabled={uploading} onChange={(event) => { void upload(event.target.files?.[0]); }} />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:hover:bg-[#272727]">
          <Upload className="h-4 w-4" />{uploading ? 'Subiendo…' : url ? 'Cambiar archivo' : 'Elegir archivo'}
        </button>
        {url && <button type="button" onClick={() => { void clear(); }} disabled={uploading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:text-slate-200 dark:hover:bg-[#272727]"><Trash2 className="h-4 w-4" />Quitar</button>}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{isVideo ? 'MP4 o WebM, máximo 100 MB.' : isMaskPdf ? 'PDF, máximo 8 MB.' : isPdf ? 'PDF, máximo 12 MB.' : 'MP3, M4A, OGG o WebM, máximo 25 MB.'}</p>
      {error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>}
    </div>
  );
}
