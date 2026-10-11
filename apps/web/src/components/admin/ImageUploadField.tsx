'use client';

import { useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ImagePlus, Trash2, Upload } from 'lucide-react';

const MAX_SOURCE_BYTES = 24 * 1024 * 1024;
const MAX_STORED_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif';

export type AdminImageTarget = 'youtube-avatar' | 'youtube-header';

interface UploadTicket {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
  supabaseUrl: string;
  publishableKey: string;
}

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  target: AdminImageTarget;
  value: string;
  onChange: (value: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

async function convertToWebp(file: File): Promise<Blob> {
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

    const converted = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob || blob.type !== 'image/webp') {
          reject(new Error('Este navegador no puede convertir la imagen a WebP.'));
          return;
        }
        resolve(blob);
      }, 'image/webp', 0.88);
    });

    if (converted.size > MAX_STORED_BYTES) {
      throw new Error('La imagen optimizada supera el límite de 8 MB. Elige una imagen más pequeña.');
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
  onUploadingChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file?: File) {
    if (!file || uploading) return;
    setUploading(true);
    onUploadingChange(true);
    setError('');

    try {
      const image = await convertToWebp(file);
      const ticketResponse = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, contentType: image.type, fileSize: image.size }),
      });
      const ticketResult = await ticketResponse.json().catch(() => null) as (Partial<UploadTicket> & { error?: unknown }) | null;
      if (!ticketResponse.ok
        || !ticketResult
        || typeof ticketResult.bucket !== 'string'
        || typeof ticketResult.path !== 'string'
        || typeof ticketResult.token !== 'string'
        || typeof ticketResult.publicUrl !== 'string'
        || typeof ticketResult.supabaseUrl !== 'string'
        || typeof ticketResult.publishableKey !== 'string') {
        throw new Error(typeof ticketResult?.error === 'string' ? ticketResult.error : 'No se pudo preparar la subida.');
      }
      const ticket: UploadTicket = {
        bucket: ticketResult.bucket,
        path: ticketResult.path,
        token: ticketResult.token,
        publicUrl: ticketResult.publicUrl,
        supabaseUrl: ticketResult.supabaseUrl,
        publishableKey: ticketResult.publishableKey,
      };

      const client = createClient(ticket.supabaseUrl, ticket.publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
      });
      const { error: uploadError } = await client.storage
        .from(ticket.bucket)
        .uploadToSignedUrl(ticket.path, ticket.token, image, {
          cacheControl: '31536000',
          contentType: image.type,
        });
      if (uploadError) throw new Error('No se pudo subir la imagen. Comprueba la conexión e inténtalo de nuevo.');

      onChange(ticket.publicUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
      onUploadingChange(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold">{label}</span>
      {value ? (
        <img src={value} alt="Vista previa de la imagen seleccionada" className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain dark:border-[#414141] dark:bg-[#181818]" />
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
            onClick={() => { onChange(''); setError(''); }}
            disabled={uploading}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-50 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-rose-300 dark:hover:bg-[#272727]"
          >
            <Trash2 className="h-4 w-4" />Quitar imagen
          </button>
        )}
      </div>
      <span className="block text-xs leading-5 text-slate-500 dark:text-slate-400">{hint} Se procesa como WebP y se guarda en la biblioteca del sitio. Archivo original de hasta 24 MB; imagen optimizada de hasta 8 MB.</span>
      {uploading && <p role="status" aria-live="polite" className="text-sm text-slate-600 dark:text-slate-300">Optimizando y subiendo la imagen…</p>}
      {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    </div>
  );
}
