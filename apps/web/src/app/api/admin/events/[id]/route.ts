import { NextResponse } from 'next/server';
import { removeUnreferencedEventMedia } from '@/lib/event-media.server';
import { normalizeEventBody } from '@/lib/events.validation';
import { revalidateEventPages } from '@/lib/events-revalidation';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const noStore = { 'Cache-Control': 'private, no-store' };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona un evento válido.' }, { status: 400, headers: noStore });
  const body = await readJson(request);
  if (!body) return NextResponse.json({ success: false, error: 'El evento no tiene un formato válido o supera el tamaño permitido.' }, { status: 400, headers: noStore });
  const event = normalizeEventBody(body);
  if (!event) return NextResponse.json({ success: false, error: 'Revisa el nombre, las fechas, la temática, la paleta, los efectos y los archivos del evento.' }, { status: 400, headers: noStore });

  const supabase = createSupabaseAdminClient();
  const { data: previous, error: readError } = await supabase
    .from('site_events')
    .select('updated_at, hero_video_path, ambient_audio_path, scare_sound_path')
    .eq('id', id)
    .maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar el evento existente.' }, { status: 503, headers: noStore });
  if (!previous) return NextResponse.json({ success: false, error: 'El evento ya no existe. Actualiza la lista e inténtalo de nuevo.' }, { status: 404, headers: noStore });
  if (typeof body.updatedAt !== 'string' || body.updatedAt !== previous.updated_at) {
    return NextResponse.json({ success: false, error: 'El evento cambió desde que lo abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 409, headers: noStore });
  }

  const { data: updated, error } = await supabase
    .from('site_events')
    .update({ ...event, updated_by: identity.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('updated_at', previous.updated_at)
    .select('id')
    .maybeSingle();
  if (error) {
    return NextResponse.json({ success: false, error: error.code === '23505' ? 'Ya existe otro evento con ese identificador.' : 'No se pudo guardar el evento.' }, { status: error.code === '23505' ? 409 : 503, headers: noStore });
  }
  if (!updated) return NextResponse.json({ success: false, error: 'El evento cambió desde que lo abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 404, headers: noStore });

  const replacedMedia = [previous.hero_video_path, previous.ambient_audio_path, previous.scare_sound_path]
    .filter((path): path is string => typeof path === 'string' && Boolean(path))
    .filter((path) => path !== event.hero_video_path && path !== event.ambient_audio_path && path !== event.scare_sound_path);
  await Promise.all(replacedMedia.map((path) => removeUnreferencedEventMedia(path).catch(() => false)));
  revalidateEventPages();
  return NextResponse.json({ success: true }, { headers: noStore });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona un evento válido.' }, { status: 400, headers: noStore });
  const body = await readJson(request, 2_000);
  if (!body || (body.action !== 'activate-now' && body.action !== 'disable')) {
    return NextResponse.json({ success: false, error: 'Selecciona una acción de activación válida.' }, { status: 400, headers: noStore });
  }
  const { error } = await createSupabaseAdminClient().rpc('set_site_theme_override', {
    p_mode: body.action === 'activate-now' ? 'event' : 'automatic',
    p_event_id: id,
    p_user_id: identity.userId,
  });
  if (error) return NextResponse.json({ success: false, error: error.code === '22023' ? 'El evento ya no existe.' : 'No se pudo cambiar el estado del tema.' }, { status: error.code === '22023' ? 404 : 503, headers: noStore });
  revalidateEventPages();
  return NextResponse.json({ success: true }, { headers: noStore });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona un evento válido.' }, { status: 400, headers: noStore });
  const supabase = createSupabaseAdminClient();
  const { data: event, error: readError } = await supabase
    .from('site_events')
    .select('hero_video_path, ambient_audio_path, scare_sound_path')
    .eq('id', id)
    .maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar el evento existente.' }, { status: 503, headers: noStore });
  if (!event) return NextResponse.json({ success: false, error: 'El evento ya no existe. Actualiza la lista e inténtalo de nuevo.' }, { status: 404, headers: noStore });

  const { data: control } = await supabase.from('site_theme_control').select('event_id').eq('control_key', 'global').maybeSingle();
  if (control?.event_id === id) {
    await supabase.rpc('set_site_theme_override', { p_mode: 'automatic', p_event_id: null, p_user_id: null });
  }

  const { data: removed, error } = await supabase.from('site_events').delete().eq('id', id).select('id').maybeSingle();
  if (error) return NextResponse.json({ success: false, error: 'No se pudo eliminar el evento.' }, { status: 503, headers: noStore });
  if (!removed) return NextResponse.json({ success: false, error: 'El evento cambió desde que lo abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 404, headers: noStore });
  const media = [event.hero_video_path, event.ambient_audio_path, event.scare_sound_path].filter((path): path is string => typeof path === 'string' && Boolean(path));
  await Promise.all(media.map((path) => removeUnreferencedEventMedia(path).catch(() => false)));
  revalidateEventPages();
  return new NextResponse(null, { status: 204, headers: noStore });
}

async function readJson(request: Request, maxLength = 32_000): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text();
    if (raw.length > maxLength) return null;
    const body: unknown = JSON.parse(raw);
    return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}
