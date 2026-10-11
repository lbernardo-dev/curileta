import { NextResponse } from 'next/server';
import { getDestinationData } from '@/lib/destinations.server';
import { destinationRow, destinationStorageUnavailable } from '@/lib/destinations-admin.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return NextResponse.json({ error: 'La selección supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'La selección no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || !Array.isArray((body as Record<string, unknown>).slugs)
    || (body as { slugs: unknown[] }).slugs.length > 100
    || (body as { slugs: unknown[] }).slugs.some((slug) => typeof slug !== 'string')) {
    return NextResponse.json({ error: 'Selecciona destinos válidos para la portada.' }, { status: 400 });
  }

  const selectedSlugs = [...new Set((body as { slugs: string[] }).slugs)];
  const current = await getDestinationData('es', true);
  if (!current.storageAvailable) return destinationStorageUnavailable();
  const bySlug = new Map(current.locations.map((location) => [location.slug, location]));
  if (selectedSlugs.some((slug) => !bySlug.has(slug) || bySlug.get(slug)?.isPublished !== true)) {
    return NextResponse.json({ error: 'Publica cada destino antes de mostrarlo en la portada.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const rows = current.locations.map((location) => ({
    ...destinationRow(location, identity.userId, true),
    show_on_home: selectedSlugs.includes(location.slug),
  }));
  const { error: rowsError } = await supabase.from('managed_destinations').upsert(rows, { onConflict: 'slug' });
  if (rowsError) return NextResponse.json({ error: 'No se pudo actualizar la selección de portada.' }, { status: 503 });
  const { error: settingsError } = await supabase.from('destination_settings').upsert({
    setting_key: 'homepage',
    home_selection_enabled: true,
    updated_by: identity.userId,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'setting_key' });
  if (settingsError) return NextResponse.json({ error: 'Los destinos se guardaron, pero no se pudo activar su selección en la portada.' }, { status: 503 });

  const { revalidateDestinations } = await import('@/lib/destinations-admin.server');
  revalidateDestinations();
  return NextResponse.json({ success: true, total: selectedSlugs.length });
}
