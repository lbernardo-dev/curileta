import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cmsProvider } from '@/lib/cms';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getBookCatalogSettings } from '@/lib/book-catalog.server';
import type { UpcomingBookRecord } from '@/lib/book-catalog';
import { isSiteMediaAsset, removeSiteMediaAsset } from '@/lib/site-media.server';

const localized = (value: unknown, required: boolean) => Boolean(value && typeof value === 'object'
  && ['es', 'en'].every((language) => typeof (value as Record<string, unknown>)[language] === 'string'
    && ((value as Record<string, string>)[language].length <= 500)
    && (!required || Boolean((value as Record<string, string>)[language].trim()))));

export async function GET() {
  await requireAdmin(['owner', 'admin', 'editor']);
  const [books, settings] = await Promise.all([cmsProvider.getBooks('es'), getBookCatalogSettings()]);
  let storageAvailable = true;
  try {
    const { error } = await createSupabaseAdminClient().from('book_catalog_settings').select('setting_key').limit(1);
    storageAvailable = !error;
  } catch {
    storageAvailable = false;
  }
  return NextResponse.json({
    books: books.map((book) => ({ slug: book.slug, title: book.title, publicationDate: book.publicationDate })),
    ...settings,
    storageAvailable,
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function PUT(request: Request) {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 64_000) return NextResponse.json({ error: 'El formulario supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'El formulario no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'El formulario no tiene un formato válido.' }, { status: 400 });
  }

  const featuredSlugs = Array.isArray(body.featuredBookSlugs) ? body.featuredBookSlugs : [];
  const incomingBooks = Array.isArray(body.upcomingBooks) ? body.upcomingBooks : [];
  if (featuredSlugs.length > 3 || featuredSlugs.some((slug) => typeof slug !== 'string') || incomingBooks.length > 12) {
    return NextResponse.json({ error: 'Selecciona hasta tres libros y registra hasta doce próximas aventuras.' }, { status: 400 });
  }

  const canonicalBooks = await cmsProvider.getBooks('es');
  const validCanonicalSlugs = new Set(canonicalBooks.map((book) => book.slug));
  const upcomingBooks: UpcomingBookRecord[] = [];
  for (const entry of incomingBooks) {
    if (!entry || typeof entry !== 'object') return NextResponse.json({ error: 'Revisa los datos de las próximas aventuras.' }, { status: 400 });
    const value = entry as Record<string, unknown>;
    if (typeof value.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) || value.slug.length > 80
      || !localized(value.title, true) || !localized(value.description, false)
      || (typeof value.publicationDate !== 'string' || (value.publicationDate && !/^\d{4}-\d{2}-\d{2}$/.test(value.publicationDate)))) {
      return NextResponse.json({ error: 'Cada aventura necesita título en español e inglés, y una fecha válida si se conoce.' }, { status: 400 });
    }
    const title = value.title as UpcomingBookRecord['title'];
    const description = value.description as UpcomingBookRecord['description'];
    if (value.isPublished !== undefined && typeof value.isPublished !== 'boolean') {
      return NextResponse.json({ error: 'Indica si cada próxima aventura está publicada o en borrador.' }, { status: 400 });
    }
    const coverImageUrl = value.coverImageUrl === undefined ? '' : value.coverImageUrl;
    const coverImagePath = value.coverImagePath === undefined ? '' : value.coverImagePath;
    const hasCoverImage = typeof coverImageUrl === 'string' && coverImageUrl.length > 0;
    if (typeof coverImageUrl !== 'string' || coverImageUrl.length > 2_048
      || typeof coverImagePath !== 'string' || coverImagePath.length > 240
      || Boolean(coverImageUrl) !== Boolean(coverImagePath)
      || (hasCoverImage && !isSiteMediaAsset(coverImageUrl, coverImagePath, 'books/upcoming'))) {
      return NextResponse.json({ error: 'La cubierta debe pertenecer a la biblioteca de imágenes del sitio.' }, { status: 400 });
    }

    const subtitle = value.subtitle && typeof value.subtitle === 'object' && localized(value.subtitle, false)
      ? {
          es: String((value.subtitle as Record<string, string>).es || '').trim(),
          en: String((value.subtitle as Record<string, string>).en || (value.subtitle as Record<string, string>).es || '').trim(),
        }
      : undefined;

    const theme = value.theme && typeof value.theme === 'object' && localized(value.theme, false)
      ? {
          es: String((value.theme as Record<string, string>).es || '').trim(),
          en: String((value.theme as Record<string, string>).en || (value.theme as Record<string, string>).es || '').trim(),
        }
      : undefined;

    const badge = value.badge && typeof value.badge === 'object' && localized(value.badge, false)
      ? {
          es: String((value.badge as Record<string, string>).es || '').trim(),
          en: String((value.badge as Record<string, string>).en || (value.badge as Record<string, string>).es || '').trim(),
        }
      : undefined;

    const ageRange = typeof value.ageRange === 'string' && value.ageRange.length <= 60
      ? value.ageRange.trim()
      : undefined;

    const pageCount = typeof value.pageCount === 'number' && Number.isFinite(value.pageCount) && value.pageCount >= 0 && value.pageCount <= 5000
      ? Math.round(value.pageCount)
      : undefined;

    const externalUrl = typeof value.externalUrl === 'string' && value.externalUrl.length <= 1024
      ? value.externalUrl.trim()
      : undefined;

    const author = typeof value.author === 'string' && value.author.length <= 120 && value.author.trim()
      ? value.author.trim()
      : 'Sweety Taless';

    upcomingBooks.push({
      id: `upcoming-${value.slug}`,
      slug: value.slug,
      title: { es: title.es.trim(), en: title.en.trim() },
      subtitle,
      description: { es: description.es.trim(), en: description.en.trim() },
      theme,
      badge,
      ageRange,
      pageCount,
      externalUrl,
      author,
      publicationDate: (value.publicationDate as string) || '',
      isPublished: value.isPublished !== false,
      coverImageUrl,
      coverImagePath,
    });
  }

  const upcomingSlugs = new Set(upcomingBooks.filter((book) => book.isPublished).map((book) => book.slug));
  const uniqueFeatured = [...new Set(featuredSlugs as string[])];
  if (uniqueFeatured.some((slug) => !validCanonicalSlugs.has(slug) && !upcomingSlugs.has(slug))) {
    return NextResponse.json({ error: 'La portada solo puede mostrar libros existentes en el catálogo.' }, { status: 400 });
  }
  if (new Set(upcomingBooks.map((book) => book.slug)).size !== upcomingBooks.length
    || upcomingBooks.some((book) => validCanonicalSlugs.has(book.slug))) {
    return NextResponse.json({ error: 'Cada próxima aventura necesita un identificador único.' }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: existingSettings, error: readError } = await admin.from('book_catalog_settings')
      .select('upcoming_books')
      .eq('setting_key', 'homepage')
      .maybeSingle();
    if (readError) throw readError;

    const previousMediaPaths = Array.isArray(existingSettings?.upcoming_books)
      ? existingSettings.upcoming_books.flatMap((entry: unknown) => {
        if (!entry || typeof entry !== 'object') return [];
        const path = (entry as Record<string, unknown>).coverImagePath;
        return typeof path === 'string' ? [path] : [];
      })
      : [];
    const nextMediaPaths = new Set(upcomingBooks.map((book) => book.coverImagePath).filter(Boolean));
    const { error } = await admin.from('book_catalog_settings').upsert({
      setting_key: 'homepage',
      featured_book_slugs: uniqueFeatured,
      upcoming_books: upcomingBooks,
      updated_by: identity.userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });
    if (error) throw error;
    await Promise.allSettled(previousMediaPaths
      .filter((path: string) => !nextMediaPaths.has(path))
      .map((path: string) => removeSiteMediaAsset(path, 'books/upcoming')));
    revalidatePath('/[locale]', 'page');
    revalidatePath('/[locale]/libros', 'page');
    revalidatePath('/[locale]/libros/[slug]', 'page');
    revalidatePath('/[locale]/novedades', 'page');
    revalidatePath('/[locale]/autora', 'page');
    revalidatePath('/[locale]/autora/[slug]', 'page');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el catálogo. Comprueba que la migración de gestión de libros esté aplicada.' }, { status: 503 });
  }
}
