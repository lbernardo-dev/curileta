import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cmsProvider } from '@/lib/cms';
import { removeSiteMediaAsset, isSiteMediaAsset } from '@/lib/site-media.server';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  const books = await cmsProvider.getBooks('es');
  let storageAvailable = true;
  let data: unknown[] = [];
  try {
    const { data: rows, error } = await createSupabaseAdminClient()
      .from('author_pages')
      .select('slug, author_name, name, biography, quote, portrait_url, portrait_path, website_url, instagram_url, youtube_url, sort_order, is_published')
      .order('sort_order').order('author_name');
    if (error) throw error;
    data = rows || [];
  } catch {
    storageAvailable = false;
  }
  return NextResponse.json({
    data,
    sourceAuthorNames: [...new Set(books.map((book) => book.author?.trim()).filter((name): name is string => Boolean(name)))].sort((a, b) => a.localeCompare(b, 'es')),
    storageAvailable,
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 24_000) return NextResponse.json({ error: 'El perfil supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'El perfil no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'El perfil no tiene un formato válido.' }, { status: 400 });
  }

  const name = readLocalized(body.name, true);
  const biography = readLocalized(body.biography, true);
  const quote = readLocalized(body.quote, false);
  const currentSlug = body.currentSlug === undefined ? null : body.currentSlug;
  if (!name || !biography || !quote || typeof body.slug !== 'string' || !slugPattern.test(body.slug) || body.slug.length > 80
    || (currentSlug !== null && (typeof currentSlug !== 'string' || !slugPattern.test(currentSlug) || currentSlug.length > 80))
    || typeof body.authorName !== 'string' || !body.authorName.trim() || body.authorName.trim().length > 120
    || typeof body.sortOrder !== 'number' || !Number.isInteger(body.sortOrder) || body.sortOrder < 0 || body.sortOrder > 10000
    || typeof body.isPublished !== 'boolean') {
    return NextResponse.json({ error: 'Completa el nombre, la biografía, el identificador y el orden del perfil.' }, { status: 400 });
  }

  const portraitUrl = typeof body.portraitUrl === 'string' ? body.portraitUrl : '';
  const portraitPath = typeof body.portraitPath === 'string' ? body.portraitPath : '';
  if ((portraitUrl || portraitPath) && !isSiteMediaAsset(portraitUrl, portraitPath, 'authors/portraits')) {
    return NextResponse.json({ error: 'La fotografía debe proceder de la biblioteca de imágenes de autoras.' }, { status: 400 });
  }
  const websiteUrl = readHttpsUrl(body.websiteUrl);
  const instagramUrl = readHttpsUrl(body.instagramUrl);
  const youtubeUrl = readHttpsUrl(body.youtubeUrl);
  if (websiteUrl === null || instagramUrl === null || youtubeUrl === null) {
    return NextResponse.json({ error: 'Los enlaces deben usar direcciones HTTPS válidas.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const previousSlug = typeof currentSlug === 'string' ? currentSlug : body.slug;
  const { data: previous, error: previousError } = await supabase.from('author_pages').select('portrait_path').eq('slug', previousSlug).maybeSingle();
  if (previousError) {
    await removeSiteMediaAsset(portraitPath, 'authors/portraits').catch(() => false);
    return NextResponse.json({ error: 'No se pudo comprobar la página existente.' }, { status: 503 });
  }
  const page = {
    slug: body.slug,
    author_name: body.authorName.trim(),
    name,
    biography,
    quote,
    portrait_url: portraitUrl,
    portrait_path: portraitPath,
    website_url: websiteUrl,
    instagram_url: instagramUrl,
    youtube_url: youtubeUrl,
    sort_order: body.sortOrder,
    is_published: body.isPublished,
    updated_by: identity.userId,
    updated_at: new Date().toISOString(),
  };
  const result = currentSlug === null
    ? await supabase.from('author_pages').insert(page)
    : await supabase.from('author_pages').update(page).eq('slug', previousSlug).select('slug').maybeSingle();
  const error = result.error;
  if (error) {
    await removeSiteMediaAsset(portraitPath, 'authors/portraits').catch(() => false);
    return NextResponse.json({ error: error.code === '23505' ? 'Ese identificador o nombre de autoría ya está en uso.' : 'No se pudo guardar el perfil. Comprueba que la migración esté aplicada.' }, { status: error.code === '23505' ? 409 : 503 });
  }
  if (currentSlug !== null && !result.data) {
    await removeSiteMediaAsset(portraitPath, 'authors/portraits').catch(() => false);
    return NextResponse.json({ error: 'La página cambió desde que la abriste. Actualiza la lista e inténtalo de nuevo.' }, { status: 409 });
  }
  if (previous?.portrait_path && previous.portrait_path !== portraitPath) {
    await removeSiteMediaAsset(previous.portrait_path, 'authors/portraits').catch(() => false);
  }
  revalidateAuthorPages(previousSlug, body.slug);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: { order?: unknown };
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
  if (!Array.isArray(body.order) || body.order.length > 100 || body.order.some((entry, index) =>
    !entry || typeof entry !== 'object' || typeof (entry as Record<string, unknown>).slug !== 'string'
    || !slugPattern.test((entry as Record<string, string>).slug)
    || (entry as Record<string, unknown>).sortOrder !== index)) {
    return NextResponse.json({ error: 'Revisa la lista ordenada de páginas.' }, { status: 400 });
  }
  try {
    const supabase = createSupabaseAdminClient();
    for (const entry of body.order as Array<{ slug: string; sortOrder: number }>) {
      const { error } = await supabase.from('author_pages').update({ sort_order: entry.sortOrder, updated_at: new Date().toISOString() }).eq('slug', entry.slug);
      if (error) throw error;
    }
    revalidatePath('/[locale]/autora', 'page');
    revalidatePath('/[locale]/autora/[slug]', 'page');
    revalidatePath('/[locale]', 'page');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el orden de las páginas.' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  await requireAdmin(['owner', 'admin', 'editor']);
  const slug = request.nextUrl.searchParams.get('slug') || '';
  if (!slugPattern.test(slug)) return NextResponse.json({ error: 'Selecciona una página válida.' }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  const { data: page } = await supabase.from('author_pages').select('portrait_path').eq('slug', slug).maybeSingle();
  const { error } = await supabase.from('author_pages').delete().eq('slug', slug);
  if (error) return NextResponse.json({ error: 'No se pudo eliminar la página de autora.' }, { status: 503 });
  if (page?.portrait_path) await removeSiteMediaAsset(page.portrait_path, 'authors/portraits').catch(() => false);
  revalidateAuthorPages(slug);
  return NextResponse.json({ success: true });
}

function readLocalized(value: unknown, required: boolean): { es: string; en: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (['es', 'en'].some((locale) => typeof record[locale] !== 'string' || (record[locale] as string).length > 6000
    || (required && !(record[locale] as string).trim()))) return null;
  return { es: (record.es as string).trim(), en: (record.en as string).trim() };
}

function readHttpsUrl(value: unknown): string | null {
  if (value === undefined || value === '') return '';
  if (typeof value !== 'string' || value.length > 500) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

function revalidateAuthorPages(...slugs: string[]) {
  revalidatePath('/[locale]/autora', 'page');
  revalidatePath('/[locale]/autora/[slug]', 'page');
  for (const slug of new Set(slugs)) {
    revalidatePath(`/es/autora/${slug}`);
    revalidatePath(`/en/autora/${slug}`);
  }
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/libros/[slug]', 'page');
  revalidatePath('/sitemap.xml');
}
