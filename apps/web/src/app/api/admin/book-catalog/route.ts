import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cmsProvider } from '@/lib/cms';
import { requireAdmin } from '@/lib/supabase/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getBookCatalogSettings } from '@/lib/book-catalog.server';
import type { UpcomingBookRecord } from '@/lib/book-catalog';

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
    if (raw.length > 24_000) return NextResponse.json({ error: 'El formulario supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
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
    upcomingBooks.push({
      id: `upcoming-${value.slug}`,
      slug: value.slug,
      title: { es: title.es.trim(), en: title.en.trim() },
      description: { es: description.es.trim(), en: description.en.trim() },
      publicationDate: value.publicationDate as string,
    });
  }

  const upcomingSlugs = new Set(upcomingBooks.map((book) => book.slug));
  const uniqueFeatured = [...new Set(featuredSlugs as string[])];
  if (uniqueFeatured.some((slug) => !validCanonicalSlugs.has(slug) && !upcomingSlugs.has(slug))) {
    return NextResponse.json({ error: 'La portada solo puede mostrar libros existentes en el catálogo.' }, { status: 400 });
  }
  if (new Set(upcomingBooks.map((book) => book.slug)).size !== upcomingBooks.length
    || upcomingBooks.some((book) => validCanonicalSlugs.has(book.slug))) {
    return NextResponse.json({ error: 'Cada próxima aventura necesita un identificador único.' }, { status: 400 });
  }

  try {
    const { error } = await createSupabaseAdminClient().from('book_catalog_settings').upsert({
      setting_key: 'homepage',
      featured_book_slugs: uniqueFeatured,
      upcoming_books: upcomingBooks,
      updated_by: identity.userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });
    if (error) throw error;
    revalidatePath('/[locale]', 'page');
    revalidatePath('/[locale]/libros', 'page');
    revalidatePath('/[locale]/libros/[slug]', 'page');
    revalidatePath('/[locale]/novedades', 'page');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar el catálogo. Comprueba que la migración de gestión de libros esté aplicada.' }, { status: 503 });
  }
}
