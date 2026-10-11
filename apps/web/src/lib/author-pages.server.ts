import 'server-only';

import type { AuthorPage } from './author-pages';
import { createSupabaseAdminClient } from './supabase/server';

export async function getAuthorPages(options: { publishedOnly?: boolean } = {}): Promise<AuthorPage[]> {
  try {
    let query = createSupabaseAdminClient()
      .from('author_pages')
      .select('slug, author_name, name, biography, quote, portrait_url, portrait_path, website_url, instagram_url, youtube_url, sort_order, is_published')
      .order('sort_order', { ascending: true })
      .order('author_name', { ascending: true });
    if (options.publishedOnly !== false) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error) return [];
    return (data || []).map((row) => normalizeAuthorPage(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getAuthorPageBySlug(slug: string, publishedOnly = true): Promise<AuthorPage | null> {
  const pages = await getAuthorPages({ publishedOnly });
  return pages.find((page) => page.slug === slug) || null;
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
