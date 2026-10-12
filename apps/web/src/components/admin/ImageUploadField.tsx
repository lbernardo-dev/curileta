'use client';

import { ContentImage } from '@/components/ContentImage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { encodeAdminImage, type EncodedAdminImage } from '@/lib/admin-image-encoding';

const MAX_SOURCE_BYTES = 24 * 1024 * 1024;
const MAX_STORED_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif';

export type AdminImageTarget =
  | 'youtube-avatar'
  | 'youtube-header'
  | 'youtube-video-thumbnail'
  | 'youtube-song-cover'
  | 'author-portrait'
  | 'gallery-image'
  | 'upcoming-book-cover'
  | 'letter-photo'
  | 'editorial-image'
  | 'event-artwork';

interface UploadTicket {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
  supabaseUrl: string;
  publishableKey: string;
  contentType: string;
}

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  target: AdminImageTarget;
  value: string;
  onChange: (value: string) => void;
  onPathChange?: (path: string) => void;
  onCensoredImageChange?: (value: string, path: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  preserveOnUnmount?: boolean;
}

async function convertAdminImage(file: File): Promise<EncodedAdminImage> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    throw new Error('Elige un archivo de imagen compatible.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('La imagen original debe pesar 24 MB o menos.');
  }
  if (typeof createImageBitmap !== 'function') {
    throw new Error('Este navegador no puede procesar la imagen. Prueba con otro navegador.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('No se pudo leer la imagen. Prueba con un archivo JPG, PNG o WebP.');
  }

  try {
    const longestSide = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, 3840 / longestSide);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo procesar la imagen.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const converted = await encodeAdminImage(canvas, 0.88);

    if (converted.blob.size > MAX_STORED_BYTES) {
      throw new Error('La imagen optimizada supera el límite de 8 MB. Elige una imagen más pequeña.');
    }
    return converted;
  } finally {
    bitmap.close();
  }
}

async function createCensoredPreview(file: File): Promise<EncodedAdminImage> {
  const bitmap = await createImageBitmap(file);
  try {
    const longestSide = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, 128 / longestSide);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo preparar la vista previa censurada.');
    context.fillStyle = '#827f73';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.filter = 'blur(18px) saturate(0.35)';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    const converted = await encodeAdminImage(canvas, 0.52);
    if (converted.blob.size > MAX_STORED_BYTES) {
      throw new Error('La vista previa censurada supera el límite de 8 MB.');
    }
    return converted;
  } finally {
    bitmap.close();
  }
}

export function ImageUploadField({
  label,
  hint,
  target,
  value,
  onChange,
  onPathChange,
  onCensoredImageChange,
  onUploadingChange,
  preserveOnUnmount = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);
  const lifecycleGenerationRef = useRef(0);
  const uploadingRef = useRef(false);
  const recentUploadPathsRef = useRef<string[]>([]);
  const onUploadingChangeRef = useRef(onUploadingChange);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onUploadingChangeRef.current = onUploadingChange;
  }, [onUploadingChange]);

  const discardRecentUpload = useCallback((path: string) => {
    if (!path) return;
    void fetch('/api/admin/media/discard', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, path }),
      keepalive: true,
    }).catch(() => undefined);
  }, [target]);

  useEffect(() => {
    mountedRef.current = true;
    const generation = ++lifecycleGenerationRef.current;
    return () => {
      mountedRef.current = false;
      if (lifecycleGenerationRef.current === generation) lifecycleGenerationRef.current += 1;
      if (!preserveOnUnmount) recentUploadPathsRef.current.forEach(discardRecentUpload);
      recentUploadPathsRef.current = [];
      if (uploadingRef.current) {
        uploadingRef.current = false;
        onUploadingChangeRef.current(false);
      }
    };
  }, [discardRecentUpload, preserveOnUnmount]);

  async function upload(file?: File) {
    if (!file || uploadingRef.current) return;
    const generation = lifecycleGenerationRef.current;
    uploadingRef.current = true;
    setUploading(true);
    onUploadingChangeRef.current(true);
    setError('');
    const pendingUploadPaths: string[] = [];

    try {
      const original = await convertAdminImage(file);
      const images = target === 'letter-photo'
        ? [original, await createCensoredPreview(file)]
        : [original];
      const uploaded: UploadTicket[] = [];

      for (const image of images) {
        const ticketResponse = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target, contentType: image.contentType, fileSize: image.blob.size }),
        });
        const ticketResult = await ticketResponse.json().catch(() => null) as (Partial<UploadTicket> & { error?: unknown }) | null;
        if (!ticketResponse.ok
          || !ticketResult
          || typeof ticketResult.bucket !== 'string'
          || typeof ticketResult.path !== 'string'
          || typeof ticketResult.token !== 'string'
          || typeof ticketResult.publicUrl !== 'string'
          || typeof ticketResult.supabaseUrl !== 'string'
          || typeof ticketResult.publishableKey !== 'string'
          || ticketResult.contentType !== image.contentType) {
          throw new Error(typeof ticketResult?.error === 'string' ? ticketResult.error : 'No se pudo preparar la subida.');
        }
        const ticket: UploadTicket = {
          bucket: ticketResult.bucket,
          path: ticketResult.path,
          token: ticketResult.token,
          publicUrl: ticketResult.publicUrl,
          supabaseUrl: ticketResult.supabaseUrl,
          publishableKey: ticketResult.publishableKey,
          contentType: ticketResult.contentType,
        };
        pendingUploadPaths.push(ticket.path);

        const client = createClient(ticket.supabaseUrl, ticket.publishableKey, {
          auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        });
        const { error: uploadError } = await client.storage
          .from(ticket.bucket)
          .uploadToSignedUrl(ticket.path, ticket.token, image.blob, {
            cacheControl: '31536000',
            contentType: ticket.contentType,
          });
        if (uploadError) throw new Error('No se pudo subir la imagen. Comprueba la conexión e inténtalo de nuevo.');
        uploaded.push(ticket);
      }

      if (!mountedRef.current || lifecycleGenerationRef.current !== generation) {
        pendingUploadPaths.forEach(discardRecentUpload);
        pendingUploadPaths.length = 0;
        return;
      }

      recentUploadPathsRef.current.forEach(discardRecentUpload);
      recentUploadPathsRef.current = pendingUploadPaths;
      pendingUploadPaths.length = 0;
      onChange(uploaded[0].publicUrl);
      onPathChange?.(uploaded[0].path);
      if (target === 'letter-photo') {
        onCensoredImageChange?.(uploaded[1].publicUrl, uploaded[1].path);
      }
    } catch (cause) {
      pendingUploadPaths.forEach(discardRecentUpload);
      if (mountedRef.current) setError(cause instanceof Error ? cause.message : 'No se pudo subir la imagen.');
    } finally {
      if (uploadingRef.current && lifecycleGenerationRef.current === generation) {
        uploadingRef.current = false;
      }
      if (mountedRef.current && lifecycleGenerationRef.current === generation) {
        setUploading(false);
        onUploadingChangeRef.current(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold">{label}</span>
      {value ? (
        <ContentImage src={value} alt="Vista previa de la imagen seleccionada" className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain dark:border-[#414141] dark:bg-[#181818]" />
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 dark:border-[#414141] dark:bg-[#181818] dark:text-slate-400">
          <span className="flex items-center gap-2 text-sm"><ImagePlus className="h-5 w-5" />Sin imagen seleccionada</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="sr-only"
        aria-label={`Seleccionar ${label.toLocaleLowerCase()}`}
        disabled={uploading}
        onChange={(event) => { void upload(event.target.files?.[0]); }}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#444] dark:hover:bg-[#272727]"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Subiendo imagen…' : value ? 'Cambiar imagen' : 'Elegir imagen'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onPathChange?.('');
              onCensoredImageChange?.('', '');
              recentUploadPathsRef.current.forEach(discardRecentUpload);
              recentUploadPathsRef.current = [];
              setError('');
            }}
            disabled={uploading}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-50 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]"
          >
            <Trash2 className="h-4 w-4" />Quitar imagen
          </button>
        )}
      </div>
      <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">{hint} Se guarda como WebP o JPEG según el navegador. Archivo original de hasta 24 MB; imagen optimizada de hasta 8 MB.</span>
      <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">Guarda el formulario dentro de 30 días para conservar una imagen que aún no uses.</span>
      {uploading && <p role="status" aria-live="polite" className="text-sm text-slate-600 dark:text-slate-300">Optimizando y subiendo la imagen…</p>}
      {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </div>
  );
}
