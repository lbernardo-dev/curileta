import { NextResponse } from 'next/server';
import { isEventPrintableAsset, mapEventPrintable, removeUnreferencedEventPrintable, revalidateEventPrintablePages } from '@/lib/event-printables.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const noStore = { 'Cache-Control': 'private, no-store' };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona un recurso válido.' }, { status: 400, headers: noStore });
  const body = await readJson(request);
  const resource = body && normalizeResource(body);
  if (!body || !resource) return NextResponse.json({ success: false, error: 'Revisa el evento, los textos y el PDF.' }, { status: 400, headers: noStore });
  if (resource.is_published && !resource.file_path) return NextResponse.json({ success: false, error: 'Para publicar el recurso, sube primero su PDF.' }, { status: 400, headers: noStore });

  const supabase = createSupabaseAdminClient();
  const { data: previous, error: readError } = await supabase.from('event_printables').select('updated_at, file_path').eq('id', id).maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar el recurso existente.' }, { status: 503, headers: noStore });
  if (!previous) return NextResponse.json({ success: false, error: 'El recurso ya no existe. Actualiza la lista.' }, { status: 404, headers: noStore });
  if (typeof body.updatedAt !== 'string' || body.updatedAt !== previous.updated_at) return NextResponse.json({ success: false, error: 'El recurso cambió desde que lo abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 409, headers: noStore });

  const { data, error } = await supabase.from('event_printables')
    .update({ ...resource, updated_by: identity.userId, updated_at: new Date().toISOString() })
    .eq('id', id).eq('updated_at', previous.updated_at).select('*').maybeSingle();
  if (error) return NextResponse.json({ success: false, error: error.code === '23505' ? 'Ya existe un recurso con ese identificador.' : 'No se pudo guardar el recurso.' }, { status: error.code === '23505' ? 409 : 503, headers: noStore });
  if (!data) return NextResponse.json({ success: false, error: 'El recurso cambió desde que lo abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 409, headers: noStore });
  if (previous.file_path && previous.file_path !== resource.file_path) await removeUnreferencedEventPrintable(previous.file_path).catch(() => false);
  revalidateEventPrintablePages();
  return NextResponse.json({ success: true, resource: mapEventPrintable(data) }, { headers: noStore });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ success: false, error: 'Selecciona un recurso válido.' }, { status: 400, headers: noStore });
  const supabase = createSupabaseAdminClient();
  const { data: previous, error: readError } = await supabase.from('event_printables').select('file_path').eq('id', id).maybeSingle();
  if (readError) return NextResponse.json({ success: false, error: 'No se pudo comprobar el recurso existente.' }, { status: 503, headers: noStore });
  if (!previous) return NextResponse.json({ success: false, error: 'El recurso ya no existe. Actualiza la lista.' }, { status: 404, headers: noStore });
  const { error } = await supabase.from('event_printables').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: 'No se pudo eliminar el recurso.' }, { status: 503, headers: noStore });
  if (previous.file_path) await removeUnreferencedEventPrintable(previous.file_path).catch(() => false);
  revalidateEventPrintablePages();
  return NextResponse.json({ success: true }, { headers: noStore });
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
  if (!uuidPattern.test(eventId) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80 || !title || !description
    || (body.resourceType !== 'coloring' && body.resourceType !== 'printable')
    || Boolean(fileUrl) !== Boolean(filePath) || (filePath && !isEventPrintableAsset(fileUrl, filePath))
    || typeof sortOrder !== 'number' || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000
    || typeof body.isPublished !== 'boolean') return null;
  return {
    event_id: eventId, slug, resource_type: body.resourceType, title, description,
    file_url: fileUrl, file_path: filePath, sort_order: sortOrder, is_published: body.isPublished,
  };
}
