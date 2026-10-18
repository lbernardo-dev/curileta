import 'server-only';

import { INITIAL_WALLPAPERS } from '@curileta/cms';
import type { GalleryCategory, GalleryItem } from './gallery';
import { createSupabaseAdminClient } from './supabase/server';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  { slug: 'espana', name: { es: 'España', en: 'Spain' }, sort_order: 0 },
  { slug: 'mexico', name: { es: 'México', en: 'Mexico' }, sort_order: 1 },
  { slug: 'peru', name: { es: 'Perú', en: 'Peru' }, sort_order: 2 },
  { slug: 'egipto', name: { es: 'Egipto', en: 'Egypt' }, sort_order: 3 },
  { slug: 'islandia', name: { es: 'Islandia', en: 'Iceland' }, sort_order: 4 },
  { slug: 'japon', name: { es: 'Japón', en: 'Japan' }, sort_order: 5 },
  { slug: 'australia', name: { es: 'Australia', en: 'Australia' }, sort_order: 6 },
  { slug: 'nueva-zelanda', name: { es: 'Nueva Zelanda', en: 'New Zealand' }, sort_order: 7 },
  { slug: 'china', name: { es: 'China', en: 'China' }, sort_order: 8 },
  { slug: 'italia', name: { es: 'Italia', en: 'Italy' }, sort_order: 9 },
  { slug: 'francia', name: { es: 'Francia', en: 'France' }, sort_order: 10 },
  { slug: 'especiales', name: { es: 'Especiales', en: 'Specials' }, sort_order: 11 },
];

const COUNTRY_CATEGORY: Record<string, string> = {
  España: 'espana', México: 'mexico', Perú: 'peru', Egipto: 'egipto', Islandia: 'islandia',
  Japón: 'japon', Australia: 'australia', 'Nueva Zelanda': 'nueva-zelanda', China: 'china',
  Italia: 'italia', Francia: 'francia',
};

const STATIC_GALLERY_ITEMS: GalleryItem[] = [
  ...INITIAL_WALLPAPERS.map((wallpaper, index) => {
    const country = wallpaper.country?.es || '';
    const title = { es: wallpaper.title.es, en: wallpaper.title.en || wallpaper.title.es };
    const description = {
      es: wallpaper.description?.es || '',
      en: wallpaper.description?.en || wallpaper.description?.es || '',
    };
    return {
      id: `static-${wallpaper.id}`,
      slug: wallpaper.slug,
      category_slug: COUNTRY_CATEGORY[country] || 'espana',
      title,
      description,
      alt: {
        es: `${title.es}. ${description.es}`.trim(),
        en: `${title.en || title.es}. ${description.en || description.es}`.trim(),
      },
      image_url: wallpaper.fullImageUrl,
      storage_path: '',
      device_type: wallpaper.deviceType,
      sort_order: index,
      is_published: true,
    };
  }),
  {
    id: 'static-halloween-special',
    slug: 'halloween-bosque-encantado',
    category_slug: 'especiales',
    title: { es: 'Halloween en el Bosque Encantado', en: 'Halloween at the Enchanted Forest' },
    description: {
      es: 'Ilustración de la campaña de Halloween de Curileta y Pompón.',
      en: 'Illustration from Curileta and Pompon’s Halloween campaign.',
    },
    alt: {
      es: 'Escena ilustrada de Halloween con Curileta y Pompón en el Bosque Encantado',
      en: 'Illustrated Halloween scene with Curileta and Pompon in the Enchanted Forest',
    },
    image_url: '/images/events/halloween-curileta-pompon-wide.webp',
    storage_path: '',
    sort_order: INITIAL_WALLPAPERS.length,
    is_published: true,
  },
];

export async function getGalleryData(options: { publishedOnly?: boolean } = {}) {
  const staticData = { categories: GALLERY_CATEGORIES, items: STATIC_GALLERY_ITEMS };
  try {
    const supabase = createSupabaseAdminClient();
    const categoriesQuery = supabase.from('gallery_categories').select('slug, name, sort_order').order('sort_order').order('slug');
    let itemsQuery = supabase.from('gallery_items')
      .select('id, slug, category_slug, title, description, alt, image_url, storage_path, sort_order, is_published')
      .order('sort_order').order('updated_at', { ascending: false });
    if (options.publishedOnly !== false) itemsQuery = itemsQuery.eq('is_published', true);
    const [{ data: categories, error: categoryError }, { data: items, error: itemError }] = await Promise.all([categoriesQuery, itemsQuery]);
    if (categoryError || itemError) return staticData;
    const normalizedCategories = (categories || []).map((row) => ({
      slug: String(row.slug), name: localized(row.name), sort_order: Number(row.sort_order) || 0,
    }));
    const categoryMap = new Map(GALLERY_CATEGORIES.map((category) => [category.slug, category]));
    for (const category of normalizedCategories) categoryMap.set(category.slug, category);
    const normalizedItems = (items || []).map((row) => ({
      id: String(row.id), slug: String(row.slug), category_slug: String(row.category_slug),
      title: localized(row.title), description: localized(row.description), alt: localized(row.alt),
      image_url: String(row.image_url), storage_path: String(row.storage_path),
      sort_order: Number(row.sort_order) || 0, is_published: row.is_published === true,
    })).filter((item) => categoryMap.has(item.category_slug));
    const itemMap = new Map(STATIC_GALLERY_ITEMS.map((item) => [item.slug, item]));
    for (const item of normalizedItems) itemMap.set(item.slug, item);
    return {
      categories: [...categoryMap.values()].sort((left, right) => left.sort_order - right.sort_order || left.slug.localeCompare(right.slug)),
      items: [...itemMap.values()].sort((left, right) => left.sort_order - right.sort_order || left.slug.localeCompare(right.slug)),
    };
  } catch {
    return staticData;
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
