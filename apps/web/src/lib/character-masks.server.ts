import 'server-only';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const CHARACTER_MASKS_BUCKET = 'curileta-site-media';

const staticAssets = {
  preview: {
    'static:character-mask:curileta-preview-v1': '/images/events/masks/curileta-mask-v1.png',
    'static:character-mask:pompon-preview-v1': '/images/events/masks/pompon-mask-v1.png',
  },
  pdf: {
    'static:character-mask:curileta-printable-v1': '/files/events/masks/curileta-mask-v1.pdf',
    'static:character-mask:pompon-printable-v1': '/files/events/masks/pompon-mask-v1.pdf',
  },
} as const;

export type CharacterMaskLocaleText = { es: string; en: string };

export interface CharacterMask {
  id: string;
  slug: string;
  characterSlug: string;
  title: CharacterMaskLocaleText;
  description: CharacterMaskLocaleText;
  previewImageUrl: string;
  previewImagePath: string;
  printablePdfUrl: string;
  printablePdfPath: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

type CharacterMaskRow = {
  id: string;
  slug: string;
  character_slug: string;
  title: CharacterMaskLocaleText;
  description: CharacterMaskLocaleText;
  preview_image_url: string;
  preview_image_path: string;
  printable_pdf_url: string;
  printable_pdf_path: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export function mapCharacterMask(row: CharacterMaskRow): CharacterMask {
  return {
    id: row.id,
    slug: row.slug,
    characterSlug: row.character_slug,
    title: row.title,
    description: row.description,
    previewImageUrl: row.preview_image_url,
    previewImagePath: row.preview_image_path,
    printablePdfUrl: row.printable_pdf_url,
    printablePdfPath: row.printable_pdf_path,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedCharacterMasks(): Promise<CharacterMask[]> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('character_masks')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('character_slug', { ascending: true });
    if (error || !Array.isArray(data)) return [];
    return (data as CharacterMaskRow[]).map(mapCharacterMask);
  } catch {
    return [];
  }
}

export async function getPublishedCharacterMask(slug: string): Promise<CharacterMask | null> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('character_masks')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    if (error || !data) return null;
    return mapCharacterMask(data as CharacterMaskRow);
  } catch {
    return null;
  }
}

export function isCharacterMaskAsset(
  urlValue: unknown,
  pathValue: unknown,
  kind: 'preview' | 'pdf',
): urlValue is string {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string') return false;
  if (Object.hasOwn(staticAssets[kind], pathValue)) {
    return urlValue === staticAssets[kind][pathValue as keyof typeof staticAssets[typeof kind]];
  }

  const pattern = kind === 'preview'
    ? /^masks\/previews\/[0-9a-f-]{36}\.(?:webp|jpg)$/i
    : /^masks\/printables\/[0-9a-f-]{36}\.pdf$/i;
  if (!pattern.test(pathValue)) return false;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const assetUrl = new URL(urlValue);
    return !assetUrl.username && !assetUrl.password
      && assetUrl.origin === new URL(supabaseUrl).origin
      && assetUrl.pathname === `/storage/v1/object/public/${CHARACTER_MASKS_BUCKET}/${pathValue}`
      && !assetUrl.search && !assetUrl.hash;
  } catch {
    return false;
  }
}

export async function removeUnreferencedCharacterMaskMedia(path: string): Promise<boolean> {
  const isPreview = /^masks\/previews\/[0-9a-f-]{36}\.(?:webp|jpg)$/i.test(path);
  const isPdf = /^masks\/printables\/[0-9a-f-]{36}\.pdf$/i.test(path);
  if (!isPreview && !isPdf) return false;

  const admin = createSupabaseAdminClient();
  const column = isPreview ? 'preview_image_path' : 'printable_pdf_path';
  const { data, error } = await admin.from('character_masks').select('id').eq(column, path).limit(1).maybeSingle();
  if (error || data) return false;
  const { error: removeError } = await admin.storage.from(CHARACTER_MASKS_BUCKET).remove([path]);
  return !removeError;
}

export function revalidateCharacterMaskPages() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/eventos', 'page');
}
