export interface GalleryCategory {
  slug: string;
  name: { es: string; en: string };
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  slug: string;
  category_slug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  alt: { es: string; en: string };
  image_url: string;
  storage_path: string;
  sort_order: number;
  is_published: boolean;
}
