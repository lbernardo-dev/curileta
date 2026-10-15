import 'server-only';

import type { AuthorPage } from './author-pages';
import { createSupabaseAdminClient } from './supabase/server';

export const DEFAULT_AUTHOR_PAGES: AuthorPage[] = [
  {
    slug: 'sweety-taless',
    author_name: 'Sweety Taless',
    name: {
      es: 'SweetyTaless',
      en: 'SweetyTaless',
    },
    biography: {
      es: 'Autora e ilustradora de literatura infantil y creadora de historias pensadas para despertar la imaginación, la curiosidad por el mundo y los valores de la amistad en los más pequeños. Creadora de «Las Aventuras de Curileta», junto a otras publicaciones infantiles disponibles en Amazon.',
      en: 'Author and illustrator of children’s literature, crafting stories to spark curiosity, global exploration, and enduring values of friendship in young readers. Creator of “The Adventures of Curileta” alongside other children’s books available on Amazon.',
    },
    quote: {
      es: '«Cada historia es un viaje que comienza con una página y nos conecta con amigos en cualquier rincón del mundo.»',
      en: '“Every story is a journey that begins with a page and connects us with friends across the world.”',
    },
    portrait_url: '/images/author/sweety-taless.webp',
    portrait_path: '',
    website_url: 'https://www.curileta.com',
    instagram_url: '',
    youtube_url: 'https://www.youtube.com/@AventurasdeCurileta',
    sort_order: 1,
    is_published: true,
  },
];

export async function getAuthorPages(options: { publishedOnly?: boolean } = {}): Promise<AuthorPage[]> {
  try {
    let query = createSupabaseAdminClient()
      .from('author_pages')
      .select('slug, author_name, name, biography, quote, portrait_url, portrait_path, website_url, instagram_url, youtube_url, sort_order, is_published')
      .order('sort_order', { ascending: true })
      .order('author_name', { ascending: true });
    if (options.publishedOnly !== false) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error || !data || data.length === 0) return DEFAULT_AUTHOR_PAGES;
    const pages = data.map((row) => normalizeAuthorPage(row as Record<string, unknown>));
    return pages.length > 0 ? pages : DEFAULT_AUTHOR_PAGES;
  } catch {
    return DEFAULT_AUTHOR_PAGES;
  }
}

export async function getAuthorPageBySlug(slug: string, publishedOnly = true): Promise<AuthorPage | null> {
  const pages = await getAuthorPages({ publishedOnly });
  const normalizedSlug = slug.toLowerCase();
  return (
    pages.find((page) => {
      const pageSlug = page.slug.toLowerCase();
      return (
        pageSlug === normalizedSlug ||
        (normalizedSlug === 'sweetytaless' && pageSlug === 'sweety-taless') ||
        (normalizedSlug === 'sweety-taless' && pageSlug === 'sweetytaless') ||
        (normalizedSlug === 'laura-bernardo' && (pageSlug === 'sweety-taless' || pageSlug === 'sweetytaless'))
      );
    }) || null
  );
}

function localized(value: unknown) {
  const fields = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const es = typeof fields.es === 'string' ? fields.es : '';
  return { es, en: typeof fields.en === 'string' && fields.en ? fields.en : es };
}

function normalizeAuthorPage(row: Record<string, unknown>): AuthorPage {
  return {
    slug: String(row.slug || ''),
    author_name: String(row.author_name || ''),
    name: localized(row.name),
    biography: localized(row.biography),
    quote: localized(row.quote),
    portrait_url: String(row.portrait_url || ''),
    portrait_path: String(row.portrait_path || ''),
    website_url: String(row.website_url || ''),
    instagram_url: String(row.instagram_url || ''),
    youtube_url: String(row.youtube_url || ''),
    sort_order: Number(row.sort_order) || 0,
    is_published: row.is_published === true,
  };
}
