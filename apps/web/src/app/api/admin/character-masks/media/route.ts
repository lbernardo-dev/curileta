import { NextResponse } from 'next/server';
import { CHARACTER_MASKS_BUCKET, removeUnreferencedCharacterMaskMedia } from '@/lib/character-masks.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const maxFileSize = 8 * 1024 * 1024;
const maskPdfPathPattern = /^masks\/printables\/[0-9a-f-]{36}\.pdf$/i;

export async function POST(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return NextResponse.json({ error: 'La solicitud supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'La solicitud de subida no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'La solicitud de subida no tiene un formato válido.' }, { status: 400 });
  const value = body as Record<string, unknown>;
  if (value.kind !== 'characterMaskPdf' || value.contentType !== 'application/pdf'
    || typeof value.fileSize !== 'number' || !Number.isInteger(value.fileSize) || value.fileSize < 1 || value.fileSize > maxFileSize) {
    return NextResponse.json({ error: 'El PDF debe pesar 8 MB o menos.' }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const path = `masks/printables/${crypto.randomUUID()}.pdf`;
    const { data, error } = await admin.storage.from(CHARACTER_MASKS_BUCKET).createSignedUploadUrl(path);
    if (error || !data?.token) throw error || new Error('Supabase no devolvió un permiso de subida.');
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) throw new Error('Falta la configuración pública de Supabase.');
    const { data: publicData } = admin.storage.from(CHARACTER_MASKS_BUCKET).getPublicUrl(path);
    return NextResponse.json({ bucket: CHARACTER_MASKS_BUCKET, path, token: data.token, publicUrl: publicData.publicUrl, supabaseUrl, publishableKey, contentType: 'application/pdf' }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo preparar la subida del PDF. Comprueba la biblioteca multimedia.' }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return NextResponse.json({ error: 'La solicitud supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'La solicitud de limpieza no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof (body as Record<string, unknown>).path !== 'string') {
    return NextResponse.json({ error: 'Selecciona un PDF administrado válido.' }, { status: 400 });
  }
  const path = (body as Record<string, unknown>).path as string;
  if (!maskPdfPathPattern.test(path)) return NextResponse.json({ error: 'El PDF no pertenece a la biblioteca de máscaras.' }, { status: 400 });
  await removeUnreferencedCharacterMaskMedia(path);
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });
}
