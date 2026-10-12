import { NextResponse } from 'next/server';
import { revalidateEventPages } from '@/lib/events-revalidation';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const noStore = { 'Cache-Control': 'private, no-store' };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return NextResponse.json({ success: false, error: 'La solicitud supera el tamaño permitido.' }, { status: 413, headers: noStore });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ success: false, error: 'La solicitud de control no tiene un formato válido.' }, { status: 400, headers: noStore });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ success: false, error: 'Selecciona una acción válida.' }, { status: 400, headers: noStore });
  const value = body as Record<string, unknown>;
  const mode = value.action === 'apply-base' ? 'base' : value.action === 'resume-schedule' ? 'automatic' : value.action === 'activate-event' ? 'event' : null;
  const eventId = typeof value.eventId === 'string' && uuidPattern.test(value.eventId) ? value.eventId : null;
  if (!mode || (mode === 'event' && !eventId)) return NextResponse.json({ success: false, error: 'Selecciona un tema y una acción válidos.' }, { status: 400, headers: noStore });

  const { error } = await createSupabaseAdminClient().rpc('set_site_theme_override', {
    p_mode: mode,
    p_event_id: mode === 'event' ? eventId : null,
    p_user_id: identity.userId,
  });
  if (error) return NextResponse.json({ success: false, error: error.code === '22023' ? 'El evento seleccionado ya no está disponible.' : 'No se pudo aplicar el tema en toda la web.' }, { status: error.code === '22023' ? 404 : 503, headers: noStore });
  revalidateEventPages();
  return NextResponse.json({ success: true, mode, eventId }, { headers: noStore });
}
