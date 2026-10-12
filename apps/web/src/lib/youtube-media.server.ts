import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/server';

const mediaBucket = 'curileta-site-media';
const managedMediaPathPattern = /^youtube\/(?:avatar|header|content\/(?:video-thumbnails|song-covers))\/[0-9a-f-]{36}\.(webp|jpg)$/i;

export function getManagedYouTubeMediaPath(value: unknown) {
  if (typeof value !== 'string' || !value) return null;

  try {
    const assetUrl = new URL(value);
    const configuredSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configuredSupabaseUrl || assetUrl.username || assetUrl.password
      || assetUrl.origin !== new URL(configuredSupabaseUrl).origin) return null;

    const prefix = `/storage/v1/object/public/${mediaBucket}/`;
    if (!assetUrl.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(assetUrl.pathname.slice(prefix.length));
    return managedMediaPathPattern.test(path) ? path : null;
  } catch {
    return null;
  }
}

function hasManagedImage(value: unknown, targetPath: string) {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['youtubeChannelAvatarUrl', 'youtubeChannelHeaderUrl', 'thumbnail', 'coverImage']
    .some((key) => getManagedYouTubeMediaPath(record[key]) === targetPath);
}

export async function removeUnreferencedYouTubeMedia(
  values: unknown[],
  sourceItems: unknown[] = [],
  options: { throwOnError?: boolean } = {},
) {
  const candidatePaths = [...new Set(values
    .map(getManagedYouTubeMediaPath)
    .filter((path): path is string => Boolean(path)))];
  if (candidatePaths.length === 0) return 0;

  try {
    const admin = createSupabaseAdminClient();
    const [channelResult, contentResult] = await Promise.all([
      admin.from('youtube_channel_settings').select('config').eq('setting_key', 'primary').maybeSingle(),
      admin.from('youtube_content_overrides').select('payload, is_deleted'),
    ]);

    // Keep every object if either reference source cannot be checked safely.
    if (channelResult.error || contentResult.error) {
      if (options.throwOnError) throw new Error('No se pueden comprobar las referencias de imágenes de YouTube.');
      return 0;
    }

    const channelConfig = channelResult.data?.config;
    const contentRows = (contentResult.data || []) as Array<{ payload: unknown; is_deleted: boolean }>;
    const removablePaths = candidatePaths.filter((candidatePath) => {
      if (hasManagedImage(channelConfig, candidatePath)) return false;
      if (sourceItems.some((item) => hasManagedImage(item, candidatePath))) return false;
      return !contentRows.some((row) => !row.is_deleted && hasManagedImage(row.payload, candidatePath));
    });
    if (removablePaths.length === 0) return 0;

    const { error } = await admin.storage.from(mediaBucket).remove(removablePaths);
    if (error) {
      if (options.throwOnError) throw new Error('No se pudieron retirar imágenes sin referencias.');
      console.error('[YouTubeMedia] No se pudieron retirar imágenes sin referencias.');
      return 0;
    }
    return removablePaths.length;
  } catch (error) {
    if (options.throwOnError) throw error;
    console.error('[YouTubeMedia] No se pudieron comprobar las referencias de imágenes.');
    return 0;
  }
}
