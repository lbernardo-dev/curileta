import { NextResponse } from 'next/server';
import { DESTINATION_MEDIA_BUCKET, isDestinationMediaAsset, removeUnreferencedDestinationMedia } from '@/lib/destination-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const uploadTypes = {
  'image/webp': { extension: 'webp', kind: 'image', maxBytes: 8 * 1024 * 1024 },
  'image/jpeg': { extension: 'jpg', kind: 'image', maxBytes: 8 * 1024 * 1024 },
  'video/mp4': { extension: 'mp4', kind: 'video', maxBytes: 100 * 1024 * 1024 },
  'video/webm': { extension: 'webm', kind: 'video', maxBytes: 100 * 1024 * 1024 },
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
  const contentType = value.contentType;
  const type = typeof contentType === 'string' && Object.prototype.hasOwnProperty.call(uploadTypes, contentType)
    ? uploadTypes[contentType as keyof typeof uploadTypes]
    : null;
  if (!type || value.kind !== type.kind || typeof value.fileSize !== 'number'
    || !Number.isInteger(value.fileSize) || value.fileSize < 1 || value.fileSize > type.maxBytes) {
    return NextResponse.json({ error: 'El formato o tamaño del archivo no está permitido.' }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const path = `destinations/${crypto.randomUUID()}.${type.extension}`;
    const { data, error } = await admin.storage.from(DESTINATION_MEDIA_BUCKET).createSignedUploadUrl(path);
    if (error || !data?.token) throw error || new Error('Supabase no devolvió un permiso de subida.');
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) throw new Error('Falta la configuración pública de Supabase.');
    const publicUrl = admin.storage.from(DESTINATION_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
    return NextResponse.json({
      bucket: DESTINATION_MEDIA_BUCKET,
      path,
      token: data.token,
      publicUrl,
      supabaseUrl,
      publishableKey,
      contentType,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo preparar la subida. Comprueba que el bucket de medios esté configurado.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return NextResponse.json({ error: 'La solicitud supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'La solicitud de limpieza no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof (body as Record<string, unknown>).path !== 'string') {
    return NextResponse.json({ error: 'Selecciona un archivo administrado válido.' }, { status: 400 });
  }
  const path = (body as Record<string, unknown>).path as string;
  const kind = /\.(webp|jpg)$/i.test(path) ? 'image' : 'video';
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = supabaseUrl ? createSupabaseAdminClient().storage.from(DESTINATION_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl : '';
  if (!isDestinationMediaAsset(url, path, kind)) {
    return NextResponse.json({ error: 'El archivo no pertenece a la biblioteca de destinos.' }, { status: 400 });
  }
  await removeUnreferencedDestinationMedia(path);
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });
}
