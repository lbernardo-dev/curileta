import { NextResponse } from 'next/server';
import { isEventMediaAsset, removeUnreferencedEventMedia } from '@/lib/event-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const bucket = 'curileta-site-media';
const uploadTypes = {
  'video/mp4': { extension: 'mp4', kind: 'heroVideo', maxBytes: 100 * 1024 * 1024 },
  'video/webm': { extension: 'webm', kind: 'heroVideo', maxBytes: 100 * 1024 * 1024 },
  'audio/mpeg': { extension: 'mp3', kind: 'ambientAudio', maxBytes: 25 * 1024 * 1024 },
  'audio/mp4': { extension: 'm4a', kind: 'ambientAudio', maxBytes: 25 * 1024 * 1024 },
  'audio/ogg': { extension: 'ogg', kind: 'ambientAudio', maxBytes: 25 * 1024 * 1024 },
  'audio/webm': { extension: 'webm', kind: 'ambientAudio', maxBytes: 25 * 1024 * 1024 },
  'application/pdf': { extension: 'pdf', kind: 'activityPdf', maxBytes: 12 * 1024 * 1024 },
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
  const acceptedKind = type && (value.kind === type.kind || (type.kind === 'ambientAudio' && value.kind === 'scareSound'));
  if (!type || !acceptedKind || typeof value.fileSize !== 'number' || !Number.isInteger(value.fileSize)
    || value.fileSize < 1 || value.fileSize > type.maxBytes) {
    return NextResponse.json({ error: 'El formato o el tamaño del archivo no está permitido para este campo.' }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const path = type.kind === 'activityPdf'
      ? `events/materials/${crypto.randomUUID()}.pdf`
      : `events/${crypto.randomUUID()}.${type.extension}`;
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
    return NextResponse.json({ error: 'No se pudo preparar la subida. Comprueba que la biblioteca de medios esté configurada.' }, { status: 503 });
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
  const extension = path.split('.').at(-1)?.toLowerCase();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicUrl = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}` : '';
  const validAsset = Boolean(supabaseUrl) && ['image', 'video', 'audio', 'pdf'].some((kind) => (
    isEventMediaAsset(publicUrl, path, kind as 'image' | 'video' | 'audio' | 'pdf')
  ));
  if (!validAsset || !extension) {
    return NextResponse.json({ error: 'El archivo no pertenece a la biblioteca de eventos.' }, { status: 400 });
  }

  await removeUnreferencedEventMedia(path);
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });
}
