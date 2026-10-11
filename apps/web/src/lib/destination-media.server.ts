import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const DESTINATION_MEDIA_BUCKET = 'curileta-site-media';
const mediaPathPattern = /^destinations\/[0-9a-f-]{36}\.(webp|mp4|webm)$/i;

export function isDestinationMediaAsset(urlValue: unknown, pathValue: unknown, kind: 'image' | 'video') {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string' || !mediaPathPattern.test(pathValue)) return false;
  const extension = pathValue.split('.').at(-1)?.toLowerCase();
  if (kind === 'image' && extension !== 'webp') return false;
  if (kind === 'video' && extension !== 'mp4' && extension !== 'webm') return false;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const expectedOrigin = new URL(supabaseUrl).origin;
    const mediaUrl = new URL(urlValue);
    return !mediaUrl.username && !mediaUrl.password
      && mediaUrl.origin === expectedOrigin
      && mediaUrl.pathname === `/storage/v1/object/public/${DESTINATION_MEDIA_BUCKET}/${pathValue}`;
  } catch {
    return false;
  }
}

export async function removeUnreferencedDestinationMedia(path: string) {
  if (!mediaPathPattern.test(path)) return false;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('managed_destinations').select('media');
  if (error) return false;
  const referenced = (data || []).some((row) => Array.isArray(row.media)
    && row.media.some((item: unknown) => item && typeof item === 'object'
      && (item as Record<string, unknown>).storagePath === path));
  if (referenced) return false;
  const { error: removeError } = await supabase.storage.from(DESTINATION_MEDIA_BUCKET).remove([path]);
  return !removeError;
}
