import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: { categories?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 24_000) return NextResponse.json({ error: 'La lista supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as typeof body;
  } catch {
    return NextResponse.json({ error: 'El orden no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'El orden no tiene un formato válido.' }, { status: 400 });
  }
  if (!Array.isArray(body.categories) || body.categories.length > 100 || body.categories.some((entry, index) =>
    !entry || typeof entry !== 'object' || typeof (entry as Record<string, unknown>).slug !== 'string'
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test((entry as Record<string, string>).slug)
    || (entry as Record<string, unknown>).sortOrder !== index)) {
    return NextResponse.json({ error: 'Revisa el orden de las categorías.' }, { status: 400 });
  }
  try {
    const supabase = createSupabaseAdminClient();
    for (const category of body.categories as Array<{ slug: string; sortOrder: number }>) {
      const { error } = await supabase.from('gallery_categories').update({ sort_order: category.sortOrder, updated_at: new Date().toISOString() }).eq('slug', category.slug);
      if (error) throw error;
    }
    revalidatePath('/[locale]/galeria', 'page');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el orden de las categorías.' }, { status: 503 });
  }
}
