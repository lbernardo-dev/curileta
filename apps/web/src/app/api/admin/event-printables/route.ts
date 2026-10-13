import { NextResponse } from 'next/server';
import { isEventPrintableAsset, mapEventPrintable, revalidateEventPrintablePages } from '@/lib/event-printables.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const noStore = { 'Cache-Control': 'private, no-store' };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  try {
    const supabase = createSupabaseAdminClient();
    const [{ data: rows, error }, { data: eventRows, error: eventsError }, downloads] = await Promise.all([
      supabase.from('event_printables').select('*').order('event_id').order('resource_type').order('sort_order').order('created_at'),
      supabase.from('site_events').select('id, slug, name').order('starts_at'),
      readDownloadTotals(supabase),
    ]);
    if (error || eventsError || !Array.isArray(rows) || !Array.isArray(eventRows)) throw error || eventsError || new Error('Missing event resources.');
    const events = eventRows.map((event) => ({ id: event.id, slug: event.slug, name: event.name }));
    const eventById = new Map(events.map((event) => [event.id, event]));
    const resources = rows.map((row) => {
      const event = eventById.get(row.event_id);
      return { ...mapEventPrintable(row), eventSlug: event?.slug || '', eventName: event?.name || { es: '', en: '' }, downloads: downloads[row.slug] || 0 };
    });
    return NextResponse.json({ success: true, resources, events }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudieron cargar los recursos. Comprueba que la migración esté aplicada.' }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const body = await readJson(request);
  const resource = body && normalizeResource(body);
  if (!resource) return NextResponse.json({ success: false, error: 'Completa el evento, el tipo, los textos y el PDF con valores válidos.' }, { status: 400, headers: noStore });
  if (resource.is_published && !resource.file_path) return NextResponse.json({ success: false, error: 'Para publicar el recurso, sube primero su PDF.' }, { status: 400, headers: noStore });

  try {
    const { data, error } = await createSupabaseAdminClient().from('event_printables')
      .insert({ ...resource, created_by: identity.userId, updated_by: identity.userId })
      .select('*').single();
    if (error) return NextResponse.json({ success: false, error: error.code === '23505' ? 'Ya existe un recurso con ese identificador.' : 'No se pudo guardar el recurso.' }, { status: error.code === '23505' ? 409 : 503, headers: noStore });
    revalidateEventPrintablePages();
    return NextResponse.json({ success: true, resource: mapEventPrintable(data) }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar el recurso. Comprueba la conexión y la migración.' }, { status: 503, headers: noStore });
  }
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function normalizeResource(body: Record<string, unknown>) {
  const localized = (value: unknown, max: number, required: boolean) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    if (['es', 'en'].some((locale) => typeof row[locale] !== 'string'
      || (row[locale] as string).length > max || (required && !(row[locale] as string).trim()))) return null;
    return { es: (row.es as string).trim(), en: (row.en as string).trim() };
  };
  const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const title = localized(body.title, 120, true);
  const description = localized(body.description, 500, false);
  const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '';
  const filePath = typeof body.filePath === 'string' ? body.filePath.trim() : '';
  const sortOrder = body.sortOrder;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)
    || !slugPattern.test(slug) || slug.length > 80 || !title || !description
    || (body.resourceType !== 'coloring' && body.resourceType !== 'printable')
    || Boolean(fileUrl) !== Boolean(filePath) || (filePath && !isEventPrintableAsset(fileUrl, filePath))
    || typeof sortOrder !== 'number' || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000
    || typeof body.isPublished !== 'boolean') return null;
  return {
    event_id: eventId,
    slug,
    resource_type: body.resourceType,
    title,
    description,
    file_url: fileUrl,
    file_path: filePath,
    sort_order: sortOrder,
    is_published: body.isPublished,
  };
}

async function readDownloadTotals(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  const totals: Record<string, number> = {};
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('analytics_daily')
      .select('path, event_count')
      .eq('event_name', 'event_printable_download')
      .order('path')
      .range(offset, offset + 999);
    if (error) throw error;
    for (const row of data || []) {
      const match = row.path.match(/^\/events\/[a-z0-9-]+\/resources\/([a-z0-9-]+)$/);
      if (match) totals[match[1]] = (totals[match[1]] || 0) + Number(row.event_count || 0);
    }
    if (!data || data.length < 1000) return totals;
  }
}
