import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { IMAGE_FRAME_TARGETS, type ImageFrameKey } from '@/lib/image-frames';

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);

  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('image_frame_settings')
      .select('target_key, position_x, position_y, zoom, updated_at')
      .order('target_key');

    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'No se pudieron cargar los encuadres. Comprueba que la migración de encuadres está aplicada.',
    }, { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
}

export async function PUT(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'El ajuste no tiene un formato válido.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'El ajuste no tiene un formato válido.' }, { status: 400 });
  }

  const value = body as Record<string, unknown>;
  const targetKey = value.targetKey;
  const positionX = value.positionX;
  const positionY = value.positionY;
  const zoom = value.zoom;

  if (typeof targetKey !== 'string' || !Object.prototype.hasOwnProperty.call(IMAGE_FRAME_TARGETS, targetKey)) {
    return NextResponse.json({ success: false, error: 'Selecciona una ubicación de imagen válida.' }, { status: 400 });
  }
  if (typeof positionX !== 'number' || !Number.isInteger(positionX) || positionX < 0 || positionX > 100
    || typeof positionY !== 'number' || !Number.isInteger(positionY) || positionY < 0 || positionY > 100) {
    return NextResponse.json({ success: false, error: 'La posición debe estar entre 0 y 100.' }, { status: 400 });
  }
  if (typeof zoom !== 'number' || !Number.isFinite(zoom) || zoom < 1 || zoom > 2) {
    return NextResponse.json({ success: false, error: 'La ampliación debe estar entre 1 y 2.' }, { status: 400 });
  }

  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('image_frame_settings')
      .upsert({
        target_key: targetKey as ImageFrameKey,
        position_x: positionX,
        position_y: positionY,
        zoom: Number(zoom.toFixed(2)),
        updated_by: identity.userId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'target_key' })
      .select('target_key, position_x, position_y, zoom, updated_at')
      .single();

    if (error) throw error;

    revalidatePath('/[locale]', 'page');
    revalidatePath('/[locale]/libros', 'page');
    revalidatePath('/[locale]/libros/[slug]', 'page');
    return NextResponse.json({ success: true, data }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar el encuadre.' }, { status: 503 });
  }
}
