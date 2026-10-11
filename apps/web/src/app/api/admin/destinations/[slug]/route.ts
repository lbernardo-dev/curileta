import { NextResponse } from 'next/server';
import { getDestinationData } from '@/lib/destinations.server';
import { normalizeDestination } from '@/lib/destinations.validation';
import { destinationRow, destinationStorageUnavailable, readDestinationBody, revalidateDestinations } from '@/lib/destinations-admin.server';
import { removeUnreferencedDestinationMedia } from '@/lib/destination-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { slug: currentSlug } = await params;
  const body = await readDestinationBody(request);
  if (!body) return NextResponse.json({ error: 'La ficha no tiene un formato válido.' }, { status: 400 });
  const destination = normalizeDestination(body);
  if (!destination) return NextResponse.json({ error: 'Revisa los campos bilingües, coordenadas, segmentos y medios.' }, { status: 400 });

  const current = await getDestinationData('es', true);
  if (!current.storageAvailable) return destinationStorageUnavailable();
  const existing = current.locations.find((location) => location.slug === currentSlug);
  if (!existing) return NextResponse.json({ error: 'El destino ya no existe. Actualiza la lista.' }, { status: 404 });
  if (destination.slug !== currentSlug && current.locations.some((location) => location.slug === destination.slug)) {
    return NextResponse.json({ error: 'Ya existe otro destino con ese identificador.' }, { status: 409 });
  }

  const supabase = createSupabaseAdminClient();
  const writes = [destinationRow(destination, identity.userId, current.homeSelectionEnabled)];
  if (destination.slug !== currentSlug) {
    const tombstone = destinationRow(existing, identity.userId, current.homeSelectionEnabled);
    writes.push({ ...tombstone, media: [], is_published: false, show_on_home: false, is_deleted: true });
  }
  const { error } = await supabase.from('managed_destinations').upsert(writes, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: 'No se pudieron guardar los cambios del destino.' }, { status: 503 });

  const currentPaths = new Set((destination.media || []).map((item) => item.storagePath));
  for (const item of existing.media || []) {
    if (!currentPaths.has(item.storagePath)) await removeUnreferencedDestinationMedia(item.storagePath);
  }
  revalidateDestinations(currentSlug, destination.slug);
  return NextResponse.json({ success: true, slug: destination.slug });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { slug } = await params;
  const current = await getDestinationData('es', true);
  if (!current.storageAvailable) return destinationStorageUnavailable();
  const existing = current.locations.find((location) => location.slug === slug);
  if (!existing) return NextResponse.json({ error: 'El destino ya no existe. Actualiza la lista.' }, { status: 404 });

  const tombstone = destinationRow(existing, identity.userId, current.homeSelectionEnabled);
  const { error } = await createSupabaseAdminClient().from('managed_destinations').upsert({
    ...tombstone,
    media: [],
    is_published: false,
    show_on_home: false,
    is_deleted: true,
  }, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: 'No se pudo eliminar el destino.' }, { status: 503 });

  for (const item of existing.media || []) await removeUnreferencedDestinationMedia(item.storagePath);
  revalidateDestinations(slug);
  return NextResponse.json({ success: true });
}
