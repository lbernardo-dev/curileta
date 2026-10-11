import 'server-only';
import { getYouTubeSourceItemsForMediaCleanup } from '@/lib/cms';
import { removeUnreferencedDestinationMedia } from './destination-media.server';
import { removeUnreferencedYouTubeMedia } from './youtube-media.server';

export const SITE_MEDIA_BUCKET = 'curileta-site-media';

export function isSiteMediaAsset(urlValue: unknown, pathValue: unknown, prefix: 'authors/portraits' | 'gallery' | 'destinations') {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string') return false;
  const pathPattern = prefix === 'destinations'
    ? /^destinations\/[0-9a-f-]{36}\.(webp|mp4|webm)$/i
    : new RegExp(`^${prefix}/[a-z0-9-]+\\.webp$`);
  if (!pathPattern.test(pathValue)) return false;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const expectedOrigin = new URL(supabaseUrl).origin;
    const imageUrl = new URL(urlValue);
    return !imageUrl.username && !imageUrl.password
      && imageUrl.origin === expectedOrigin
      && imageUrl.pathname === `/storage/v1/object/public/${SITE_MEDIA_BUCKET}/${pathValue}`;
  } catch {
    return false;
  }
}

export async function removeSiteMediaAsset(path: string, prefix: 'authors/portraits' | 'gallery' | 'destinations') {
  const pathPattern = prefix === 'destinations'
    ? /^destinations\/[0-9a-f-]{36}\.(webp|mp4|webm)$/i
    : new RegExp(`^${prefix}/[a-z0-9-]+\\.webp$`);
  if (!pathPattern.test(path)) return false;
  if (prefix === 'destinations') return removeUnreferencedDestinationMedia(path);
  const { createSupabaseAdminClient } = await import('@/lib/supabase/server');
  const admin = createSupabaseAdminClient();
  const reference = prefix === 'gallery'
    ? await admin.from('gallery_items').select('id').eq('storage_path', path).limit(1).maybeSingle()
    : await admin.from('author_pages').select('slug').eq('portrait_path', path).limit(1).maybeSingle();
  if (reference.error || reference.data) return false;
  const { error } = await admin.storage.from(SITE_MEDIA_BUCKET).remove([path]);
  return !error;
}

export async function cleanupUnreferencedSiteMedia(now = new Date()) {
  const { createSupabaseAdminClient } = await import('@/lib/supabase/server');
  const admin = createSupabaseAdminClient();
  const [authorsCheck, galleryCheck, channelCheck, contentCheck, destinationsCheck] = await Promise.all([
    admin.from('author_pages').select('slug').limit(1),
    admin.from('gallery_items').select('id').limit(1),
    admin.from('youtube_channel_settings').select('setting_key').limit(1),
    admin.from('youtube_content_overrides').select('item_key').limit(1),
    admin.from('managed_destinations').select('slug').limit(1),
  ]);
  if (authorsCheck.error || galleryCheck.error || channelCheck.error || contentCheck.error || destinationsCheck.error) {
    throw new Error('No se pueden comprobar todas las referencias de medios administrados.');
  }

  const targets = [
    { prefix: 'youtube/avatar', pattern: /^youtube\/avatar\/[0-9a-f-]{36}\.webp$/ },
    { prefix: 'youtube/header', pattern: /^youtube\/header\/[0-9a-f-]{36}\.webp$/ },
    { prefix: 'youtube/content/video-thumbnails', pattern: /^youtube\/content\/video-thumbnails\/[0-9a-f-]{36}\.webp$/ },
    { prefix: 'youtube/content/song-covers', pattern: /^youtube\/content\/song-covers\/[0-9a-f-]{36}\.webp$/ },
    { prefix: 'authors/portraits', pattern: /^authors\/portraits\/[0-9a-f-]{36}\.webp$/ },
    { prefix: 'gallery', pattern: /^gallery\/[0-9a-f-]{36}\.webp$/ },
    { prefix: 'destinations', pattern: /^destinations\/[0-9a-f-]{36}\.(webp|mp4|webm)$/i },
  ] as const;
  const cutoff = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const pageSize = 100;
  const maxPerTarget = 1000;
  const candidates: Array<{ path: string; prefix: typeof targets[number]['prefix']; createdAt: number }> = [];
  const scanLimited: string[] = [];
  let scanned = 0;

  for (const target of targets) {
    let reachedEnd = false;
    for (let offset = 0; offset < maxPerTarget; offset += pageSize) {
      const { data, error } = await admin.storage.from(SITE_MEDIA_BUCKET).list(target.prefix, {
        limit: pageSize,
        offset,
        sortBy: { column: 'created_at', order: 'asc' },
      });
      if (error) throw new Error('No se puede listar la biblioteca de imágenes administradas.');

      const objects = data || [];
      scanned += objects.length;
      for (const object of objects) {
        if (!object.id || !object.created_at) continue;
        const createdAt = Date.parse(object.created_at);
        if (!Number.isFinite(createdAt) || createdAt >= cutoff) continue;
        const path = `${target.prefix}/${object.name}`;
        if (target.pattern.test(path)) candidates.push({ path, prefix: target.prefix, createdAt });
      }

      if (objects.length < pageSize) {
        reachedEnd = true;
        break;
      }
    }
    if (!reachedEnd) scanLimited.push(target.prefix);
  }

  const deleteLimit = 100;
  candidates.sort((left, right) => left.createdAt - right.createdAt);
  const selected = candidates.slice(0, deleteLimit);
  const youtubeCandidates = selected.filter((candidate) => candidate.prefix.startsWith('youtube/'));
  let deleted = 0;
  if (youtubeCandidates.length > 0) {
    const sourceItems = await getYouTubeSourceItemsForMediaCleanup();
    const publicUrls = youtubeCandidates.map(({ path }) =>
      admin.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
    deleted += await removeUnreferencedYouTubeMedia(publicUrls, sourceItems, { throwOnError: true });
  }
  for (const candidate of selected.filter((entry) => entry.prefix === 'destinations')) {
    if (await removeUnreferencedDestinationMedia(candidate.path)) deleted += 1;
  }
  for (const candidate of selected.filter((entry) => entry.prefix === 'gallery' || entry.prefix === 'authors/portraits')) {
    const prefix = candidate.prefix === 'gallery' ? 'gallery' : 'authors/portraits';
    if (await removeSiteMediaAsset(candidate.path, prefix)) deleted += 1;
  }

  return {
    scanned,
    oldObjectCandidates: candidates.length,
    deleted,
    deferred: Math.max(0, candidates.length - deleteLimit),
    scanLimited,
  };
}
