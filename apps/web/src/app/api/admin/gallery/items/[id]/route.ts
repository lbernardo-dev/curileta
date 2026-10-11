import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isSiteMediaAsset, removeSiteMediaAsset } from '@/lib/site-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Selecciona una imagen válida.' }, { status: 400 });
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return NextResponse.json({ error: 'La ficha supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'La ficha no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'La ficha no tiene un formato válido.' }, { status: 400 });
  }
  const normalized = normalizeItem(body);
  if (!normalized) return NextResponse.json({ error: 'Completa los títulos, textos alternativos, categoría e imagen.' }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  const { data: previous, error: previousError } = await supabase.from('gallery_items').select('storage_path').eq('id', id).maybeSingle();
  if (previousError) return NextResponse.json({ error: 'No se pudo comprobar la imagen existente.' }, { status: 503 });
  if (!previous) return NextResponse.json({ error: 'La imagen ya no existe. Actualiza la lista e inténtalo de nuevo.' }, { status: 404 });
  const { data: updated, error } = await supabase.from('gallery_items')
    .update({ ...normalized, updated_by: identity.userId, updated_at: new Date().toISOString() })
    .eq('id', id).select('id').maybeSingle();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Ya existe otra imagen con ese identificador.' : 'No se pudo guardar la ficha de imagen.' }, { status: error.code === '23505' ? 409 : 503 });
  if (!updated) return NextResponse.json({ error: 'La imagen cambió desde que la abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 404 });
  if (previous?.storage_path && previous.storage_path !== normalized.storage_path) {
    await removeSiteMediaAsset(previous.storage_path, 'gallery').catch(() => false);
  }
  revalidateGallery();
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Selecciona una imagen válida.' }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  const { data: item, error: readError } = await supabase.from('gallery_items').select('storage_path').eq('id', id).maybeSingle();
  if (readError) return NextResponse.json({ error: 'No se pudo comprobar la imagen existente.' }, { status: 503 });
  if (!item) return NextResponse.json({ error: 'La imagen ya no existe. Actualiza la lista e inténtalo de nuevo.' }, { status: 404 });
  const { data: removed, error } = await supabase.from('gallery_items').delete().eq('id', id).select('id').maybeSingle();
  if (error) return NextResponse.json({ error: 'No se pudo eliminar la imagen.' }, { status: 503 });
  if (!removed) return NextResponse.json({ error: 'La imagen cambió desde que la abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 404 });
  if (item?.storage_path) await removeSiteMediaAsset(item.storage_path, 'gallery').catch(() => false);
  revalidateGallery();
  return NextResponse.json({ success: true });
}

function normalizeItem(body: Record<string, unknown>) {
  const title = readLocalized(body.title, true, 160);
  const description = readLocalized(body.description, false, 1000);
  const alt = readLocalized(body.alt, true, 240);
  if (!title || !description || !alt || typeof body.slug !== 'string' || !slugPattern.test(body.slug) || body.slug.length > 100
    || typeof body.categorySlug !== 'string' || !slugPattern.test(body.categorySlug)
    || typeof body.imageUrl !== 'string' || typeof body.storagePath !== 'string'
    || !isSiteMediaAsset(body.imageUrl, body.storagePath, 'gallery')
    || typeof body.sortOrder !== 'number' || !Number.isInteger(body.sortOrder) || body.sortOrder < 0 || body.sortOrder > 10000
    || typeof body.isPublished !== 'boolean') return null;
  return {
    slug: body.slug, category_slug: body.categorySlug, title, description, alt,
    image_url: body.imageUrl, storage_path: body.storagePath,
    sort_order: body.sortOrder, is_published: body.isPublished,
  };
}

function readLocalized(value: unknown, required: boolean, max: number): { es: string; en: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (['es', 'en'].some((locale) => typeof row[locale] !== 'string' || (row[locale] as string).length > max
    || (required && !(row[locale] as string).trim()))) return null;
  return { es: (row.es as string).trim(), en: (row.en as string).trim() };
}

function revalidateGallery() {
  revalidatePath('/[locale]/galeria', 'page');
  revalidatePath('/[locale]', 'page');
  revalidatePath('/sitemap.xml');
}
