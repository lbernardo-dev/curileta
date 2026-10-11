import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import type { YouTubeImportDraft, YouTubeManagedKind, YouTubeVideoType } from '@/lib/youtube-content.types';

interface ParsedYouTubeUrl {
  videoId: string;
  playlistId: string;
  isShort: boolean;
}

function parseYouTubeUrl(value: unknown): ParsedYouTubeUrl | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)
      || !['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    let videoId = '';
    let isShort = false;
    if (host.includes('youtu.be')) {
      videoId = parts[0] || '';
    } else if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v') || '';
    } else if (['shorts', 'embed', 'live', 'v'].includes(parts[0] || '')) {
      videoId = parts[1] || '';
      isShort = parts[0] === 'shorts';
    }
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null;
    const playlistId = url.searchParams.get('list') || '';
    if (playlistId && !/^[A-Za-z0-9_-]{10,128}$/.test(playlistId)) return null;
    return { videoId, playlistId, isShort };
  } catch {
    return null;
  }
}

function toSlug(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90) || 'contenido-youtube';
}

function formatDuration(value: string) {
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return '';
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

async function fetchYouTubeApi<T>(endpoint: 'videos' | 'playlists', params: Record<string, string>, apiKey: string) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [key, value] of Object.entries({ ...params, key: apiKey })) url.searchParams.set(key, value);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`YouTube API responded with ${response.status}`);
  return response.json() as Promise<T>;
}

interface YouTubeApiVideo {
  items?: Array<{
    id: string;
    localizations?: Record<string, { title?: string; description?: string }>;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      channelId?: string;
      channelTitle?: string;
      tags?: string[];
      categoryId?: string;
      defaultLanguage?: string;
      defaultAudioLanguage?: string;
      liveBroadcastContent?: string;
      thumbnails?: Record<string, { url?: string }>;
      localized?: { title?: string; description?: string };
    };
    contentDetails?: {
      duration?: string;
      dimension?: string;
      definition?: string;
      caption?: string;
      licensedContent?: boolean;
      projection?: string;
    };
    statistics?: { viewCount?: string; likeCount?: string; commentCount?: string; favoriteCount?: string };
    status?: {
      privacyStatus?: string;
      embeddable?: boolean;
      license?: string;
      madeForKids?: boolean;
      selfDeclaredMadeForKids?: boolean;
    };
  }>;
}

interface YouTubeApiPlaylist {
  items?: Array<{ snippet?: { title?: string; channelId?: string; channelTitle?: string; publishedAt?: string } }>;
}

interface YouTubeOEmbed {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

function localizedField(
  localizations: Record<string, { title?: string; description?: string }> | undefined,
  language: 'es' | 'en',
  field: 'title' | 'description',
) {
  const match = Object.entries(localizations || {}).find(([locale, value]) =>
    (locale.toLowerCase() === language || locale.toLowerCase().startsWith(`${language}-`))
    && Boolean(value[field]),
  );
  return match?.[1][field] || '';
}

function bestThumbnail(thumbnails: Record<string, { url?: string }> | undefined, videoId: string) {
  return thumbnails?.maxres?.url || thumbnails?.standard?.url || thumbnails?.high?.url
    || thumbnails?.medium?.url || thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export async function POST(request: Request) {
  await requireAdmin(['owner', 'admin', 'editor']);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return NextResponse.json({ error: 'El enlace supera el tamaño permitido.' }, { status: 413 });
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'El formulario no tiene un formato válido.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'El formulario no tiene un formato válido.' }, { status: 400 });
  }

  if (body.kind !== 'video' && body.kind !== 'song') {
    return NextResponse.json({ error: 'Selecciona si vas a crear un vídeo o una ficha musical.' }, { status: 400 });
  }
  const parsed = parseYouTubeUrl(body.url);
  if (!parsed) return NextResponse.json({ error: 'Pega un enlace de vídeo, Short o emisión de YouTube válido.' }, { status: 400 });
  const selectedVideoType = body.videoType;
  if (body.kind === 'video' && !['episode', 'short', 'song', 'trailer'].includes(String(selectedVideoType))) {
    return NextResponse.json({ error: 'Selecciona el tipo de vídeo.' }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const kind = body.kind as YouTubeManagedKind;
  const videoType = (parsed.isShort ? 'short' : selectedVideoType || 'episode') as YouTubeVideoType;
  let title = '';
  let englishTitle = '';
  let description = '';
  let englishDescription = '';
  let thumbnail = `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`;
  let duration = '';
  let publishedAt = '';
  let tags: string[] = [];
  let playlistName = '';
  let channelTitle = '';
  let metadata: YouTubeImportDraft['youtubeMetadata'] = {
    channelTitle: '', categoryId: '', viewCount: '', likeCount: '', commentCount: '', favoriteCount: '',
    defaultLanguage: '', defaultAudioLanguage: '', liveBroadcastContent: '', privacyStatus: '',
  };
  let source: YouTubeImportDraft['source'] = 'oembed';
  let sourceNote = '';

  if (apiKey) {
    try {
      const result = await fetchYouTubeApi<YouTubeApiVideo>('videos', {
        part: 'snippet,contentDetails,statistics,status,localizations', id: parsed.videoId,
      }, apiKey);
      const video = result.items?.[0];
      if (!video?.snippet) return NextResponse.json({ error: 'YouTube no encontró un vídeo público con ese enlace.' }, { status: 404 });
      title = localizedField(video.localizations, 'es', 'title') || video.snippet.title || '';
      description = localizedField(video.localizations, 'es', 'description') || video.snippet.description || '';
      thumbnail = bestThumbnail(video.snippet.thumbnails, parsed.videoId);
      duration = formatDuration(video.contentDetails?.duration || '');
      publishedAt = video.snippet.publishedAt || '';
      tags = (video.snippet.tags || []).slice(0, 50);
      channelTitle = video.snippet.channelTitle || '';
      metadata = {
        channelId: video.snippet.channelId || '',
        channelTitle,
        categoryId: video.snippet.categoryId || '',
        viewCount: video.statistics?.viewCount || '',
        likeCount: video.statistics?.likeCount || '',
        commentCount: video.statistics?.commentCount || '',
        favoriteCount: video.statistics?.favoriteCount || '',
        defaultLanguage: video.snippet.defaultLanguage || '',
        defaultAudioLanguage: video.snippet.defaultAudioLanguage || '',
        liveBroadcastContent: video.snippet.liveBroadcastContent || '',
        privacyStatus: video.status?.privacyStatus || '',
        dimension: video.contentDetails?.dimension || '',
        definition: video.contentDetails?.definition || '',
        caption: video.contentDetails?.caption || '',
        licensedContent: video.contentDetails?.licensedContent,
        projection: video.contentDetails?.projection || '',
        embeddable: video.status?.embeddable,
        license: video.status?.license || '',
        madeForKids: video.status?.madeForKids,
        selfDeclaredMadeForKids: video.status?.selfDeclaredMadeForKids,
        thumbnailUrls: Object.fromEntries(Object.entries(video.snippet.thumbnails || {}).flatMap(([size, image]) => image.url ? [[size, image.url]] : [])),
      };
      englishTitle = localizedField(video.localizations, 'en', 'title') || video.snippet.localized?.title || '';
      englishDescription = localizedField(video.localizations, 'en', 'description') || video.snippet.localized?.description || '';
      source = 'youtube-data-api';
      if (parsed.playlistId) {
        try {
          const playlist = await fetchYouTubeApi<YouTubeApiPlaylist>('playlists', {
            part: 'snippet', id: parsed.playlistId,
          }, apiKey);
          const playlistSnippet = playlist.items?.[0]?.snippet;
          playlistName = playlistSnippet?.title || '';
          metadata.playlistChannelId = playlistSnippet?.channelId || '';
          metadata.playlistChannelTitle = playlistSnippet?.channelTitle || '';
          metadata.playlistPublishedAt = playlistSnippet?.publishedAt || '';
        } catch {
          playlistName = '';
        }
      }
    } catch {
      sourceNote = 'No se pudo consultar YouTube Data API. Se han importado los datos básicos disponibles.';
    }
  } else {
    sourceNote = 'Importación básica. Configura YOUTUBE_API_KEY para traer descripción, duración, fecha, etiquetas y estadísticas.';
  }

  if (source !== 'youtube-data-api') {
    try {
      const oembedUrl = new URL('https://www.youtube.com/oembed');
      oembedUrl.searchParams.set('url', `https://www.youtube.com/watch?v=${parsed.videoId}`);
      oembedUrl.searchParams.set('format', 'json');
      const response = await fetch(oembedUrl, { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new Error('oEmbed unavailable');
      const result = await response.json() as YouTubeOEmbed;
      title = result.title || title;
      channelTitle = result.author_name || channelTitle;
      thumbnail = result.thumbnail_url || thumbnail;
      metadata.channelTitle = channelTitle;
      metadata.thumbnailUrls = { default: thumbnail };
    } catch {
      if (!title) return NextResponse.json({ error: 'No se pudieron leer los datos de YouTube. Comprueba el enlace o configura YOUTUBE_API_KEY.' }, { status: 502 });
    }
  }

  const playlistId = parsed.playlistId;
  const draft: YouTubeImportDraft = {
    kind,
    youtubeId: parsed.videoId,
    title: { es: title, en: englishTitle || title },
    description: { es: description, en: englishDescription || description },
    thumbnail,
    duration,
    publishedAt,
    tags,
    playlistId,
    playlistName: { es: playlistName, en: playlistName },
    youtubeMetadata: metadata,
    suggestedSlug: toSlug(title),
    source,
    sourceNote: sourceNote || undefined,
  };

  return NextResponse.json({ draft, suggestedVideoType: videoType }, { headers: { 'Cache-Control': 'private, no-store' } });
}
