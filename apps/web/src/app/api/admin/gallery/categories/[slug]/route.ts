import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const { slug } = await params;
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return NextResponse.json({ error: 'La categoría supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'La categoría no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'La categoría no tiene un formato válido.' }, { status: 400 });
  }
  const nextSlug = typeof body.slug === 'string' ? body.slug : '';
  const name = readLocalized(body.name);
  if (!slugPattern.test(slug) || slug.length > 80 || !slugPattern.test(nextSlug) || nextSlug.length > 80
    || !name || typeof body.sortOrder !== 'number' || !Number.isInteger(body.sortOrder) || body.sortOrder < 0 || body.sortOrder > 10000) {
    return NextResponse.json({ error: 'Revisa el identificador, los nombres y el orden de la categoría.' }, { status: 400 });
  }
  const { data, error } = await createSupabaseAdminClient().from('gallery_categories')
    .update({ slug: nextSlug, name, sort_order: body.sortOrder, updated_by: identity.userId, updated_at: new Date().toISOString() })
    .eq('slug', slug).select('slug').maybeSingle();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Ya existe una categoría con ese identificador.' : 'No se pudo guardar la categoría.' }, { status: error.code === '23505' ? 409 : 503 });
  if (!data) return NextResponse.json({ error: 'La categoría ya no existe. Actualiza la lista e inténtalo de nuevo.' }, { status: 404 });
  revalidateGallery();
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const { slug } = await params;
  if (!slugPattern.test(slug) || slug.length > 80) return NextResponse.json({ error: 'Selecciona una categoría válida.' }, { status: 400 });
  const { data, error } = await createSupabaseAdminClient().from('gallery_categories').delete().eq('slug', slug).select('slug').maybeSingle();
  if (error) return NextResponse.json({ error: error.code === '23503' ? 'Mueve o elimina primero las imágenes de esta categoría.' : 'No se pudo eliminar la categoría.' }, { status: error.code === '23503' ? 409 : 503 });
  if (!data) return NextResponse.json({ error: 'La categoría ya no existe.' }, { status: 404 });
  revalidateGallery();
  return NextResponse.json({ success: true });
}

function readLocalized(value: unknown): { es: string; en: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (['es', 'en'].some((locale) => typeof row[locale] !== 'string' || !(row[locale] as string).trim() || (row[locale] as string).length > 120)) return null;
  return { es: (row.es as string).trim(), en: (row.en as string).trim() };
}

function revalidateGallery() {
  revalidatePath('/[locale]/galeria', 'page');
  revalidatePath('/[locale]', 'page');
  revalidatePath('/sitemap.xml');
}
