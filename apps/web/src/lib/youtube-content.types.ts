import type { Song, Video } from '@curileta/cms';
import type { YouTubeContentMetadata } from '@curileta/cms';

export type YouTubeManagedKind = 'video' | 'song';
export type YouTubeVideoType = Video['type'];

export type ManagedVideo = Video & {
  kind: 'video';
  itemKey: string;
  inherited: boolean;
  isPublished: boolean;
};

export type ManagedSong = Song & {
  kind: 'song';
  itemKey: string;
  inherited: boolean;
  isPublished: boolean;
};

export type ManagedYouTubeItem = ManagedVideo | ManagedSong;

export interface YouTubeImportDraft {
  kind: YouTubeManagedKind;
  youtubeId: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  thumbnail: string;
  duration: string;
  publishedAt: string;
  tags: string[];
  playlistId: string;
  playlistName: { es: string; en: string };
  youtubeMetadata: YouTubeContentMetadata;
  suggestedSlug: string;
  source: 'youtube-data-api' | 'oembed';
  sourceNote?: string;
}
