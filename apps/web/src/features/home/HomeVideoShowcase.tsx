'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import type { Locale } from '@curileta/i18n';
import type { SiteSettings, Video } from '@curileta/cms';
import { SectionEmblem } from '@/components/SectionEmblem';
import { YouTubeTrackedPlayer } from '@/components/YouTubeTrackedPlayer';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Film,
  Music,
  Play,
  Smartphone,
  Sparkles,
  X,
  Youtube,
} from 'lucide-react';

interface HomeVideoShowcaseProps {
  locale: Locale;
  videos?: Video[];
  settings?: SiteSettings;
}

const localized = (value: { es: string; en?: string } | string | undefined, locale: Locale) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.es || '';
};

export const resolveHighQualityThumbnail = (video: Video | null | undefined): string => {
  if (!video) return '/images/hero/curileta-world-expedition-clean-v1.jpg';
  const meta = (video as unknown as { youtubeMetadata?: { thumbnailUrls?: Record<string, string> } })?.youtubeMetadata?.thumbnailUrls;
  if (meta?.maxres && !meta.maxres.includes('hqdefault')) return meta.maxres;
  if (meta?.standard && !meta.standard.includes('hqdefault')) return meta.standard;
  if (meta?.high && !meta.high.includes('hqdefault')) return meta.high;
  if (video.youtubeId && /^[A-Za-z0-9_-]{11}$/.test(video.youtubeId)) {
    return `https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/maxresdefault.jpg`;
  }
  if (video.thumbnail && video.thumbnail.includes('i.ytimg.com') && video.thumbnail.includes('/hqdefault.jpg')) {
    return video.thumbnail.replace('/hqdefault.jpg', '/maxresdefault.jpg');
  }
  return video.thumbnail || '/images/hero/curileta-world-expedition-clean-v1.jpg';
};

export const HomeVideoShowcase: React.FC<HomeVideoShowcaseProps> = ({
  locale,
  videos = [],
  settings,
}) => {
  const isEn = locale === 'en';
  const [activeModalVideo, setActiveModalVideo] = useState<Video | null>(null);
  const dialogCloseButtonRef = useRef<HTMLButtonElement>(null);

  const realVideos = useMemo(() => {
    return (videos || []).filter(
      (v) => v.youtubeId && v.youtubeId.trim() !== '' && v.youtubeId !== 'dQw4w9WgXcQ'
    );
  }, [videos]);

  const latestEpisode = useMemo(() => {
    return realVideos.find((v) => v.type === 'episode') || realVideos[0] || null;
  }, [realVideos]);

  const featuredShort = useMemo(() => {
    return realVideos.find((v) => v.type === 'short' && v.id !== latestEpisode?.id) || null;
  }, [realVideos, latestEpisode]);

  const secondaryVideo = useMemo(() => {
    return realVideos.find((v) => v.id !== latestEpisode?.id && v.id !== featuredShort?.id) || null;
  }, [realVideos, latestEpisode, featuredShort]);

  const channelUrl = settings?.youtubeChannelUrl?.startsWith('https://')
    ? settings.youtubeChannelUrl
    : 'https://www.youtube.com/@AventurasdeCurileta';
  const subscribeUrl = `${channelUrl}${channelUrl.includes('?') ? '&' : '?'}sub_confirmation=1`;

  useEffect(() => {
    if (!activeModalVideo) return;
    dialogCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeModalVideo]);

  if (!latestEpisode) {
    return null;
  }

  const latestTitle = localized(latestEpisode.title, locale);
  const latestDesc = localized(latestEpisode.description, locale);

  return (
    <section
      id="videos-destacados"
      aria-labelledby="home-videos-title"
      className="relative z-10 border-t border-emerald-950/60 bg-[#0B1513] px-5 py-24 text-white transition-colors duration-500 dark:border-[#272727] dark:bg-[#070E0C] sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <SectionEmblem
          icon={Youtube}
          tone="rose"
          label={isEn ? 'Official YouTube Channel' : 'Canal oficial en YouTube'}
        />

        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              <span>{isEn ? 'Stories in motion' : 'Historias en movimiento'}</span>
            </p>
            <h2
              id="home-videos-title"
              className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl"
            >
              {isEn ? 'Curileta’s latest adventures on screen.' : 'Las aventuras de Curileta en pantalla.'}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {isEn
                ? 'Join Curileta and Pompón through animated episodes, real destinations, songs and short videos made for curious families.'
                : 'Acompaña a Curileta y Pompón por episodios animados, destinos reales, canciones y vídeos cortos para disfrutar en familia.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/videos`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <span>{isEn ? 'Explore all videos' : 'Ver todos los vídeos'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-700/60 bg-emerald-950/60 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-900/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Youtube className="h-4 w-4 text-red-500" aria-hidden="true" />
              <span>{isEn ? 'Subscribe' : 'Suscribirme'}</span>
            </a>
          </div>
        </div>

        {/* Showcase Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Main Premiere Hero Card (col-span 7 or 8) */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-emerald-900/50 bg-[#122320] shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-emerald-700/60 lg:col-span-7 xl:col-span-8">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <Image
                src={resolveHighQualityThumbnail(latestEpisode)}
                alt={latestTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 dark:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-md shadow-red-600/40">
                  <Film className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Latest Premiere' : 'Nuevo Estreno'}</span>
                </span>
                {latestEpisode.episodeNumber && (
                  <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {isEn ? `Episode ${latestEpisode.episodeNumber}` : `Capítulo ${latestEpisode.episodeNumber}`}
                  </span>
                )}
              </div>

              {latestEpisode.duration && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-black/80 px-2.5 py-1 text-xs font-mono font-bold text-white backdrop-blur-md sm:bottom-6 sm:right-6">
                  <Clock className="h-3 w-3 text-amber-400" aria-hidden="true" />
                  <span>{latestEpisode.duration}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveModalVideo(latestEpisode)}
                aria-label={isEn ? `Watch video: ${latestTitle}` : `Ver vídeo: ${latestTitle}`}
                className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/60 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-110 hover:bg-red-500 active:scale-95 sm:h-20 sm:w-20"
              >
                <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
              <div>
                <h3 className="text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {latestTitle}
                </h3>
                {latestDesc && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {latestDesc}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-900/40 pt-5">
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(latestEpisode)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 transition-colors hover:text-amber-200"
                >
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  <span>{isEn ? 'Watch episode now' : 'Ver capítulo ahora'}</span>
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${latestEpisode.youtubeId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  <span>{isEn ? 'Open in YouTube' : 'Abrir en YouTube'}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Access Sidebar Cards (col-span 5 or 4) */}
          <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
            {/* Short preview card */}
            {featuredShort && (
              <div
                onClick={() => setActiveModalVideo(featuredShort)}
                className="group relative flex cursor-pointer gap-4 overflow-hidden rounded-[1.65rem] border border-emerald-900/50 bg-[#122320] p-4 shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-emerald-700/60 hover:shadow-xl"
              >
                <div className="relative aspect-[9/16] h-32 shrink-0 overflow-hidden rounded-xl bg-slate-950 sm:h-36">
                  <Image
                    src={resolveHighQualityThumbnail(featuredShort)}
                    alt={localized(featuredShort.title, locale)}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-950/60 px-2.5 py-0.5 text-[11px] font-bold text-rose-300">
                      <Smartphone className="h-3 w-3" aria-hidden="true" />
                      <span>{isEn ? 'YouTube Short' : 'Corto animado'}</span>
                    </span>
                    <h4 className="mt-2 line-clamp-2 font-display text-base font-bold text-white transition-colors group-hover:text-amber-300">
                      {localized(featuredShort.title, locale)}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-amber-300">
                    {isEn ? 'Watch in 60s' : 'Ver en 60 segundos'} →
                  </p>
                </div>
              </div>
            )}

            {/* Secondary video / song card */}
            {secondaryVideo && (
              <div
                onClick={() => setActiveModalVideo(secondaryVideo)}
                className="group relative flex cursor-pointer gap-4 overflow-hidden rounded-[1.65rem] border border-emerald-900/50 bg-[#122320] p-4 shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-emerald-700/60 hover:shadow-xl"
              >
                <div className="relative aspect-video h-24 shrink-0 overflow-hidden rounded-xl bg-slate-950 sm:h-28">
                  <Image
                    src={resolveHighQualityThumbnail(secondaryVideo)}
                    alt={localized(secondaryVideo.title, locale)}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                      {secondaryVideo.type === 'song' ? <Music className="h-3 w-3" aria-hidden="true" /> : <Film className="h-3 w-3" aria-hidden="true" />}
                      <span>{secondaryVideo.type === 'song' ? (isEn ? 'Song' : 'Canción') : (isEn ? 'Episode' : 'Episodio')}</span>
                    </span>
                    <h4 className="mt-2 line-clamp-2 font-display text-base font-bold text-white transition-colors group-hover:text-amber-300">
                      {localized(secondaryVideo.title, locale)}
                    </h4>
                  </div>
                  {secondaryVideo.duration && (
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {secondaryVideo.duration}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Features summary box */}
            <div className="rounded-[1.65rem] border border-emerald-800/40 bg-[#0E1E1B] p-5 shadow-sm">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {isEn ? 'What you will find in our channel' : 'Qué encontrarás en el canal'}
              </h5>
              <ul className="mt-3 space-y-2 text-xs font-medium text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-900/70 text-amber-300">✓</span>
                  <span>{isEn ? 'Animated weekly episodes' : 'Capítulos animados semanales'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-900/70 text-amber-300">✓</span>
                  <span>{isEn ? 'Real world destinations and curious facts' : 'Destinos del mundo real y datos curiosos'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-900/70 text-amber-300">✓</span>
                  <span>{isEn ? 'Original songs and illustrated learning' : 'Canciones originales y aprendizaje ilustrado'}</span>
                </li>
              </ul>

              <div className="mt-4 border-t border-emerald-900/40 pt-3">
                <Link
                  href={`/${locale}/videos`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 transition-colors hover:text-amber-200"
                >
                  <span>{isEn ? 'View all videos & songs' : 'Ver catálogo completo de vídeos'}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeModalVideo && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={localized(activeModalVideo.title, locale)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-700 bg-[#181818] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#313131] px-6 py-4">
              <h3 className="truncate font-display text-lg font-bold text-white">
                {localized(activeModalVideo.title, locale)}
              </h3>
              <button
                ref={dialogCloseButtonRef}
                type="button"
                onClick={() => setActiveModalVideo(null)}
                aria-label={isEn ? 'Close video' : 'Cerrar vídeo'}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#272727] text-white transition hover:bg-[#313131] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                <YouTubeTrackedPlayer
                  videoId={activeModalVideo.youtubeId}
                  videoSlug={activeModalVideo.slug}
                  title={localized(activeModalVideo.title, locale)}
                  thumbnail={resolveHighQualityThumbnail(activeModalVideo)}
                  youtubeUrl={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
                  locale={locale}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <p className="max-w-xl text-pretty line-clamp-2">
                  {localized(activeModalVideo.description, locale)}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 font-bold text-red-400 hover:text-red-300"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span>{isEn ? 'Open in YouTube' : 'Ver en YouTube'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
};
