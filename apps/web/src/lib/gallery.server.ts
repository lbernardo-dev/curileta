import 'server-only';

import type { GalleryCategory, GalleryItem } from './gallery';
import { createSupabaseAdminClient } from './supabase/server';

export async function getGalleryData(options: { publishedOnly?: boolean } = {}) {
  try {
    const supabase = createSupabaseAdminClient();
    const categoriesQuery = supabase.from('gallery_categories').select('slug, name, sort_order').order('sort_order').order('slug');
    let itemsQuery = supabase.from('gallery_items')
      .select('id, slug, category_slug, title, description, alt, image_url, storage_path, sort_order, is_published')
      .order('sort_order').order('updated_at', { ascending: false });
    if (options.publishedOnly !== false) itemsQuery = itemsQuery.eq('is_published', true);
    const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([categoriesQuery, itemsQuery]);
    if (categoryError || itemError) return { categories: [] as GalleryCategory[], items: [] as GalleryItem[] };
    const normalizedCategories = (categories || []).map((row) => ({
      slug: String(row.slug), name: localized(row.name), sort_order: Number(row.sort_order) || 0,
    }));
    const categorySlugs = new Set(normalizedCategories.map((category) => category.slug));
    const normalizedItems = (items || []).map((row) => ({
      id: String(row.id), slug: String(row.slug), category_slug: String(row.category_slug),
      title: localized(row.title), description: localized(row.description), alt: localized(row.alt),
      image_url: String(row.image_url), storage_path: String(row.storage_path),
      sort_order: Number(row.sort_order) || 0, is_published: row.is_published === true,
    })).filter((item) => categorySlugs.has(item.category_slug));
    return { categories: normalizedCategories, items: normalizedItems };
  } catch {
    return { categories: [] as GalleryCategory[], items: [] as GalleryItem[] };
  }
}

export async function getGalleryItemBySlug(slug: string, publishedOnly = true): Promise<GalleryItem | null> {
  const { items } = await getGalleryData({ publishedOnly });
  return items.find((item) => item.slug === slug) || null;
}

function localized(value: unknown) {
  const fields = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const es = typeof fields.es === 'string' ? fields.es : '';
  return { es, en: typeof fields.en === 'string' && fields.en ? fields.en : es };
}
