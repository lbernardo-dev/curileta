import { NextResponse } from 'next/server';
import { listManagedEvents } from '@/lib/events.server';
import { normalizeEventBody } from '@/lib/events.validation';
import { revalidateEventPages } from '@/lib/events-revalidation';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const noStore = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  try {
    const events = await listManagedEvents();
    return NextResponse.json({ success: true, events }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar los eventos. Comprueba que la migración de eventos esté aplicada.' }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  if (!body) return NextResponse.json({ success: false, error: 'El evento no tiene un formato válido o supera el tamaño permitido.' }, { status: 400, headers: noStore });
  const event = normalizeEventBody(body);
  if (!event) return NextResponse.json({ success: false, error: 'Revisa el nombre, las fechas, la temática, la paleta, los efectos y los archivos del evento.' }, { status: 400, headers: noStore });

  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('site_events')
      .insert({ ...event, created_by: identity.userId, updated_by: identity.userId })
      .select('*')
      .single();
    if (error) {
      return NextResponse.json({ success: false, error: error.code === '23505' ? 'Ya existe un evento con ese identificador.' : 'No se pudo crear el evento. Comprueba la migración de eventos.' }, { status: error.code === '23505' ? 409 : 503, headers: noStore });
    }
    revalidateEventPages();
    return NextResponse.json({ success: true, event: data }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo crear el evento. Comprueba la conexión y la migración de eventos.' }, { status: 503, headers: noStore });
  }
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text();
    if (raw.length > 32_000) return null;
    const body: unknown = JSON.parse(raw);
    return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

