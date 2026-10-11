import { NextResponse } from 'next/server';
import { getDestinationData } from '@/lib/destinations.server';
import { normalizeDestination } from '@/lib/destinations.validation';
import { destinationRow, destinationStorageUnavailable, readDestinationBody, revalidateDestinations } from '@/lib/destinations-admin.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  const data = await getDestinationData('es', true);
  return NextResponse.json({ success: true, ...data }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readDestinationBody(request);
  if (!body) return NextResponse.json({ error: 'La ficha no tiene un formato válido.' }, { status: 400 });
  const destination = normalizeDestination(body);
  if (!destination) return NextResponse.json({ error: 'Revisa los campos bilingües, coordenadas, segmentos y medios.' }, { status: 400 });

  const current = await getDestinationData('es', true);
  if (!current.storageAvailable) return destinationStorageUnavailable();
  if (current.locations.some((location) => location.slug === destination.slug)) {
    return NextResponse.json({ error: 'Ya existe un destino con ese identificador.' }, { status: 409 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: settings } = await supabase.from('destination_settings')
    .select('home_selection_enabled').eq('setting_key', 'homepage').maybeSingle();
  const { error } = await supabase.from('managed_destinations').upsert(destinationRow(destination, identity.userId, settings?.home_selection_enabled === true), { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: 'No se pudo crear el destino. Comprueba que la migración esté aplicada.' }, { status: 503 });

  revalidateDestinations(destination.slug);
  return NextResponse.json({ success: true, slug: destination.slug }, { status: 201 });
}
