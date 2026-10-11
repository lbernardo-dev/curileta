import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
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
  const name = readLocalized(body.name, true);
  if (!name || typeof body.slug !== 'string' || !slugPattern.test(body.slug) || body.slug.length > 80
    || typeof body.sortOrder !== 'number' || !Number.isInteger(body.sortOrder) || body.sortOrder < 0 || body.sortOrder > 10000) {
    return NextResponse.json({ error: 'Escribe el nombre en ambos idiomas y un identificador válido.' }, { status: 400 });
  }
  const { error } = await createSupabaseAdminClient().from('gallery_categories').insert({
    slug: body.slug, name, sort_order: body.sortOrder, updated_by: identity.userId,
  });
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Ya existe una categoría con ese identificador.' : 'No se pudo guardar la categoría.' }, { status: error.code === '23505' ? 409 : 503 });
  revalidateGallery();
  return NextResponse.json({ success: true });
}

function readLocalized(value: unknown, required: boolean): { es: string; en: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (['es', 'en'].some((locale) => typeof row[locale] !== 'string' || (row[locale] as string).length > 120
    || (required && !(row[locale] as string).trim()))) return null;
  return { es: (row.es as string).trim(), en: (row.en as string).trim() };
}

function revalidateGallery() {
  revalidatePath('/[locale]/galeria', 'page');
  revalidatePath('/[locale]', 'page');
  revalidatePath('/sitemap.xml');
}
