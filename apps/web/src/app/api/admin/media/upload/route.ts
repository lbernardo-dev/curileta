import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const bucket = 'curileta-site-media';
const maxFileSize = 8 * 1024 * 1024;
const acceptedImageTypes = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
} as const;
const targets = {
  'youtube-avatar': 'youtube/avatar',
  'youtube-header': 'youtube/header',
  'youtube-video-thumbnail': 'youtube/content/video-thumbnails',
  'youtube-song-cover': 'youtube/content/song-covers',
  'author-portrait': 'authors/portraits',
  'gallery-image': 'gallery',
  'upcoming-book-cover': 'books/upcoming',
  'letter-photo': 'letters/photos',
} as const;

export async function POST(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return NextResponse.json({ error: 'La solicitud supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'La solicitud de subida no tiene un formato válido.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'La solicitud de subida no tiene un formato válido.' }, { status: 400 });
  }

  const value = body as Record<string, unknown>;
  const target = value.target;
  if (typeof target !== 'string' || !Object.prototype.hasOwnProperty.call(targets, target)) {
    return NextResponse.json({ error: 'Selecciona un campo de imagen válido.' }, { status: 400 });
  }
  const contentType = typeof value.contentType === 'string' && Object.prototype.hasOwnProperty.call(acceptedImageTypes, value.contentType)
    ? value.contentType as keyof typeof acceptedImageTypes
    : null;
  if (!contentType
    || typeof value.fileSize !== 'number'
    || !Number.isInteger(value.fileSize)
    || value.fileSize < 1
    || value.fileSize > maxFileSize) {
    return NextResponse.json({ error: 'La imagen debe ser WebP o JPEG y pesar 8 MB o menos.' }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const extension = acceptedImageTypes[contentType];
    const path = `${targets[target as keyof typeof targets]}/${crypto.randomUUID()}.${extension}`;
    const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(path);
    if (error || !data?.token) throw error || new Error('Supabase no devolvió un permiso de subida.');

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) throw new Error('Falta la configuración pública de Supabase.');

    const { data: publicData } = admin.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({
      bucket,
      path,
      token: data.token,
      publicUrl: publicData.publicUrl,
      supabaseUrl,
      publishableKey,
      contentType,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo preparar la subida. Comprueba que la biblioteca de imágenes está configurada.' }, { status: 503 });
  }
}
