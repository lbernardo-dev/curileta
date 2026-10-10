import type { SeasonalEvent } from '@curileta/cms';

export interface HeroVideoAsset {
  url: string;
  poster: string;
}

export const HERO_BASE_VIDEOS = [
  {
    url: '/videos/hero/base/curileta-base-sin-mapa.mp4',
    poster: '/images/hero/video-posters/curileta-base-sin-mapa.jpg',
  },
  {
    url: '/videos/hero/base/curileta-base-mapa-mundo.mp4',
    poster: '/images/hero/video-posters/curileta-base-mapa-mundo.jpg',
  },
] as const satisfies readonly HeroVideoAsset[];

export const HERO_EVENT_VIDEOS: Partial<Record<SeasonalEvent['themeKey'], HeroVideoAsset>> = {
  halloween: {
    url: '/videos/hero/events/halloween/curileta-halloween.mp4',
    poster: '/images/hero/video-posters/curileta-halloween.jpg',
  },
};

export const HERO_BASE_VIDEO_INDEX_STORAGE_KEY = 'curileta-hero-base-video-index';
export const HERO_VIDEO_ROTATION_INTERVAL_MS = 5 * 60_000;
