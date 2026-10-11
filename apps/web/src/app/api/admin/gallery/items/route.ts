import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isSiteMediaAsset, removeSiteMediaAsset } from '@/lib/site-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
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
  const { error } = await createSupabaseAdminClient().from('gallery_items').insert({ ...normalized, updated_by: identity.userId });
  if (error) {
    await removeSiteMediaAsset(normalized.storage_path, 'gallery').catch(() => false);
    return NextResponse.json({ error: error.code === '23505' ? 'Ya existe una imagen con ese identificador.' : 'No se pudo guardar la imagen. Comprueba la migración y la categoría elegida.' }, { status: error.code === '23505' ? 409 : 503 });
  }
  revalidateGallery();
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: { order?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 128_000) return NextResponse.json({ error: 'La lista supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as typeof body;
  } catch {
    return NextResponse.json({ error: 'El orden no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'El orden no tiene un formato válido.' }, { status: 400 });
  }
  if (!Array.isArray(body.order) || body.order.length > 1000 || body.order.some((entry, index) =>
    !entry || typeof entry !== 'object' || typeof (entry as Record<string, unknown>).id !== 'string'
    || !/^[0-9a-f-]{36}$/i.test((entry as Record<string, string>).id)
    || (entry as Record<string, unknown>).sortOrder !== index)) {
    return NextResponse.json({ error: 'Revisa la lista ordenada de imágenes.' }, { status: 400 });
  }
  try {
    const supabase = createSupabaseAdminClient();
    for (const entry of body.order as Array<{ id: string; sortOrder: number }>) {
      const { error } = await supabase.from('gallery_items').update({ sort_order: entry.sortOrder, updated_at: new Date().toISOString() }).eq('id', entry.id);
      if (error) throw error;
    }
    revalidateGallery();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el orden de las imágenes.' }, { status: 503 });
  }
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
