import type { Song, Video, YouTubeContentMetadata } from '@curileta/cms';
import type { YouTubeManagedKind } from './youtube-content.types';
import { getManagedYouTubeMediaPath } from './youtube-media.server';

const videoTypes = ['episode', 'short', 'song', 'trailer'] as const;

function isLocalized(value: unknown, maxLength: number, required = false): value is { es: string; en?: string } {
  if (value === undefined || value === null) return !required;
  if (typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const spanish = record.es;
  const english = record.en;
  return typeof spanish === 'string' && spanish.length <= maxLength
    && (english === undefined || (typeof english === 'string' && english.length <= maxLength))
    && (!required || Boolean(spanish.trim()));
}

function cleanLocalized(value: unknown) {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const es = typeof record.es === 'string' ? record.es.trim() : '';
  const en = typeof record.en === 'string' ? record.en.trim() : es;
  return { es, en };
}

function isSafeUrl(value: unknown, maxLength = 2000) {
  if (value === undefined || value === null) return true;
  if (typeof value !== 'string' || value.length > maxLength) return false;
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function optionalString(value: unknown, maxLength: number) {
  return value === undefined || (typeof value === 'string' && value.length <= maxLength);
}

function isAllowedYouTubeImage(value: unknown, folder: 'video-thumbnails' | 'song-covers', youtubeId: string) {
  if (value === undefined || value === null || value === '') return true;
  if (typeof value !== 'string') return false;
  if (getManagedYouTubeMediaPath(value)?.startsWith(`youtube/content/${folder}/`)) return true;

  try {
    const url = new URL(value);
    const pathParts = url.pathname.split('/').filter(Boolean);
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && !url.search
      && !url.hash
      && ['i.ytimg.com', 'img.youtube.com'].includes(url.hostname.toLowerCase())
      && pathParts.length === 3
      && ['vi', 'vi_webp'].includes(pathParts[0])
      && pathParts[1] === youtubeId
      && /^[A-Za-z0-9_.-]+$/.test(pathParts[2]);
  } catch {
    return false;
  }
}

function normalizedMetadata(value: unknown): YouTubeContentMetadata | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const stringKeys = [
    'channelId', 'channelTitle', 'categoryId', 'viewCount', 'likeCount', 'commentCount', 'favoriteCount',
    'defaultLanguage', 'defaultAudioLanguage', 'liveBroadcastContent', 'privacyStatus', 'dimension', 'definition',
    'caption', 'projection', 'license', 'playlistChannelId', 'playlistChannelTitle', 'playlistPublishedAt',
  ] as const;
  const result: Record<string, unknown> = {};
  for (const key of stringKeys) {
    const field = record[key];
    if (typeof field === 'string' && field.length <= 200) result[key] = field;
  }
  for (const key of ['licensedContent', 'embeddable', 'madeForKids', 'selfDeclaredMadeForKids'] as const) {
    if (typeof record[key] === 'boolean') result[key] = record[key];
  }
  if (record.thumbnailUrls && typeof record.thumbnailUrls === 'object' && !Array.isArray(record.thumbnailUrls)) {
    const thumbnails: Record<string, string> = {};
    for (const [key, url] of Object.entries(record.thumbnailUrls as Record<string, unknown>).slice(0, 8)) {
      if (/^[a-zA-Z0-9_-]{1,32}$/.test(key) && typeof url === 'string' && url.length <= 2000 && isSafeUrl(url)) {
        thumbnails[key] = url;
      }
    }
    if (Object.keys(thumbnails).length) result.thumbnailUrls = thumbnails;
  }
  return result as YouTubeContentMetadata;
}

export function normalizeYoutubeContentItem(value: unknown, kind: YouTubeManagedKind): Video | Song | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(record.id)
    || typeof record.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug) || record.slug.length > 100
    || !isLocalized(record.title, 160, true)
    || (record.isPublished !== undefined && typeof record.isPublished !== 'boolean')
    || !optionalString(record.youtubeId, 20)
    || !optionalString(record.duration, 32)
    || !optionalString(record.publishedAt, 40)) return null;

  if (record.youtubeId && !/^[A-Za-z0-9_-]{11}$/.test(record.youtubeId as string)) return null;
  if (record.publishedAt && !/^\d{4}-\d{2}-\d{2}(?:T[^\s]+)?$/.test(record.publishedAt as string)) return null;
  if (record.tags !== undefined && (!Array.isArray(record.tags) || record.tags.length > 50
    || record.tags.some((tag) => typeof tag !== 'string' || tag.length > 100))) return null;
  if (record.duration && !/^\d{1,3}:\d{2}(?::\d{2})?$/.test(record.duration as string)) return null;

  const base = {
    id: record.id,
    slug: record.slug,
    title: cleanLocalized(record.title)!,
    youtubeId: (record.youtubeId as string | undefined) || '',
    isPublished: record.isPublished !== false,
    duration: (record.duration as string | undefined) || undefined,
    publishedAt: (record.publishedAt as string | undefined) || '',
    tags: (record.tags as string[] | undefined)?.map((tag) => tag.trim()).filter(Boolean),
    youtubeMetadata: normalizedMetadata(record.youtubeMetadata),
  };

  if (kind === 'video') {
    if (!videoTypes.includes(record.type as typeof videoTypes[number])
      || !isLocalized(record.description, 5000)
      || !isLocalized(record.highlightTag, 120)
      || !isLocalized(record.playlistName, 160)
      || !isLocalized(record.votePrompt, 500)
      || !optionalString(record.thumbnail, 2000)
      || !isAllowedYouTubeImage(record.thumbnail, 'video-thumbnails', record.youtubeId as string)
      || !optionalString(record.playlistId, 200)
      || (record.episodeNumber !== undefined && (!Number.isInteger(record.episodeNumber) || Number(record.episodeNumber) < 1 || Number(record.episodeNumber) > 9999))
      || (record.votingEnabled !== undefined && typeof record.votingEnabled !== 'boolean')) return null;

    return {
      ...base,
      type: record.type as Video['type'],
      thumbnail: (record.thumbnail as string | undefined) || '',
      description: cleanLocalized(record.description),
      highlightTag: cleanLocalized(record.highlightTag),
      playlistName: cleanLocalized(record.playlistName),
      playlistId: (record.playlistId as string | undefined) || undefined,
      episodeNumber: record.episodeNumber as number | undefined,
      votingEnabled: record.votingEnabled === true,
      votePrompt: cleanLocalized(record.votePrompt),
    };
  }

  if (!isLocalized(record.description, 5000)
    || !isLocalized(record.lyrics, 10000)
    || !isLocalized(record.playlistName, 160)
    || !isAllowedYouTubeImage(record.coverImage, 'song-covers', record.youtubeId as string)
    || !isSafeUrl(record.audioUrl)
    || !optionalString(record.coverImage, 2000)
    || !optionalString(record.audioUrl, 2000)
    || !optionalString(record.playlistId, 200)) return null;

  return {
    ...base,
    youtubeId: (record.youtubeId as string | undefined) || undefined,
    coverImage: (record.coverImage as string | undefined) || '',
    audioUrl: (record.audioUrl as string | undefined) || undefined,
    description: cleanLocalized(record.description),
    lyrics: record.lyrics as Song['lyrics'],
    playlistName: cleanLocalized(record.playlistName),
    playlistId: (record.playlistId as string | undefined) || undefined,
  };
}

export function isValidYouTubeItemKey(value: string) {
  return /^(video|song):[A-Za-z0-9_-]{1,180}$/.test(value);
}
