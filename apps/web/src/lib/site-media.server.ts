import 'server-only';
import { getYouTubeSourceItemsForMediaCleanup } from '@/lib/cms';
import { removeUnreferencedEventMedia } from './event-media.server';
import { removeUnreferencedDestinationMedia } from './destination-media.server';
import { removeUnreferencedYouTubeMedia } from './youtube-media.server';

export const SITE_MEDIA_BUCKET = 'curileta-site-media';

type SiteMediaPrefix = 'authors/portraits' | 'gallery' | 'letters/photos' | 'books/upcoming' | 'editorial/content';

export function isSiteMediaAsset(urlValue: unknown, pathValue: unknown, prefix: SiteMediaPrefix) {
  if (typeof urlValue !== 'string' || typeof pathValue !== 'string') return false;
  const pathPattern = prefix === 'letters/photos' || prefix === 'books/upcoming' || prefix === 'editorial/content'
    ? new RegExp(`^${prefix}/[0-9a-f-]{36}\\.(webp|jpg)$`, 'i')
    : new RegExp(`^${prefix}/[a-z0-9-]+\\.(webp|jpg)$`, 'i');
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

export async function removeSiteMediaAsset(path: string, prefix: SiteMediaPrefix) {
  const pathPattern = prefix === 'letters/photos' || prefix === 'books/upcoming' || prefix === 'editorial/content'
    ? new RegExp(`^${prefix}/[0-9a-f-]{36}\\.(webp|jpg)$`, 'i')
    : new RegExp(`^${prefix}/[a-z0-9-]+\\.(webp|jpg)$`, 'i');
  if (!pathPattern.test(path)) return false;
  const { createSupabaseAdminClient } = await import('@/lib/supabase/server');
  const admin = createSupabaseAdminClient();
  if (prefix === 'letters/photos') {
    try {
      if (await (await import('@/lib/letters-admin.server')).isLetterPhotoReferenced(path)) return false;
    } catch {
      return false;
    }
    const { error } = await admin.storage.from(SITE_MEDIA_BUCKET).remove([path]);
    return !error;
  }
  if (prefix === 'editorial/content') {
    const { data, error } = await admin.from('managed_content_entries').select('payload');
    if (error || (data || []).some((row) => containsMediaReference(row.payload, path))) return false;
    const { error: removeError } = await admin.storage.from(SITE_MEDIA_BUCKET).remove([path]);
    return !removeError;
  }
  if (prefix === 'books/upcoming') {
    const { data, error } = await admin.from('book_catalog_settings')
      .select('upcoming_books')
      .eq('setting_key', 'homepage')
      .maybeSingle();
    if (error || !data) return false;
    const referenced = Array.isArray(data.upcoming_books) && data.upcoming_books.some((value: unknown) =>
      Boolean(value && typeof value === 'object' && (value as Record<string, unknown>).coverImagePath === path));
    if (referenced) return false;
    const { error: removeError } = await admin.storage.from(SITE_MEDIA_BUCKET).remove([path]);
    return !removeError;
  }
  const reference = prefix === 'gallery'
    ? await admin.from('gallery_items').select('id').eq('storage_path', path).limit(1).maybeSingle()
    : await admin.from('author_pages').select('slug').eq('portrait_path', path).limit(1).maybeSingle();
  if (reference.error || reference.data) return false;
  const { error } = await admin.storage.from(SITE_MEDIA_BUCKET).remove([path]);
  return !error;
}

function containsMediaReference(value: unknown, path: string): boolean {
  if (typeof value === 'string') return value === path || value.endsWith(`/${path}`);
  if (Array.isArray(value)) return value.some((entry) => containsMediaReference(entry, path));
  if (!value || typeof value !== 'object') return false;
  return Object.values(value).some((entry) => containsMediaReference(entry, path));
}

export async function cleanupUnreferencedSiteMedia(now = new Date()) {
  const { createSupabaseAdminClient } = await import('@/lib/supabase/server');
  const admin = createSupabaseAdminClient();
  const [authorsCheck, galleryCheck, channelCheck, contentCheck, eventsCheck, destinationsCheck, booksCheck, editorialCheck] = await Promise.all([
    admin.from('author_pages').select('slug').limit(1),
    admin.from('gallery_items').select('id').limit(1),
    admin.from('youtube_channel_settings').select('setting_key').limit(1),
    admin.from('youtube_content_overrides').select('item_key').limit(1),
    admin.from('site_events').select('id').limit(1),
    admin.from('managed_destinations').select('slug').limit(1),
    admin.from('book_catalog_settings').select('setting_key').limit(1),
    admin.from('managed_content_entries').select('id').limit(1),
  ]);
  if (authorsCheck.error || galleryCheck.error || channelCheck.error || contentCheck.error || eventsCheck.error || destinationsCheck.error || booksCheck.error || editorialCheck.error) {
    throw new Error('No se pueden comprobar todas las referencias de medios administrados.');
  }

  const targets = [
    { prefix: 'youtube/avatar', pattern: /^youtube\/avatar\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'youtube/header', pattern: /^youtube\/header\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'youtube/content/video-thumbnails', pattern: /^youtube\/content\/video-thumbnails\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'youtube/content/song-covers', pattern: /^youtube\/content\/song-covers\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'authors/portraits', pattern: /^authors\/portraits\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'gallery', pattern: /^gallery\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'letters/photos', pattern: /^letters\/photos\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'books/upcoming', pattern: /^books\/upcoming\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'editorial/content', pattern: /^editorial\/content\/[0-9a-f-]{36}\.(webp|jpg)$/i },
    { prefix: 'events', pattern: /^events\/[0-9a-f-]{36}\.(mp4|webm|mp3|m4a|ogg)$/i },
    { prefix: 'destinations', pattern: /^destinations\/[0-9a-f-]{36}\.(webp|jpg|mp4|webm)$/i },
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
  for (const candidate of selected.filter((entry) => entry.prefix === 'events')) {
    if (await removeUnreferencedEventMedia(candidate.path)) deleted += 1;
  }
  for (const candidate of selected.filter((entry) => entry.prefix === 'destinations')) {
    if (await removeUnreferencedDestinationMedia(candidate.path)) deleted += 1;
  }
  for (const candidate of selected.filter((entry) => entry.prefix === 'gallery' || entry.prefix === 'authors/portraits' || entry.prefix === 'letters/photos' || entry.prefix === 'books/upcoming' || entry.prefix === 'editorial/content')) {
    const prefix = candidate.prefix === 'gallery' ? 'gallery' : candidate.prefix === 'authors/portraits' ? 'authors/portraits' : candidate.prefix === 'letters/photos' ? 'letters/photos' : candidate.prefix === 'books/upcoming' ? 'books/upcoming' : 'editorial/content';
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
