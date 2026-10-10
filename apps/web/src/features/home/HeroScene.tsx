'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import type { Locale } from '@curileta/i18n';
import type { SeasonalEvent, SiteSettings } from '@curileta/cms';
import { ArrowDown, ArrowRight, Compass, MapPin, Sparkles } from 'lucide-react';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import routeData from './heroRoute.json';
import {
  HERO_BASE_VIDEOS,
  HERO_BASE_VIDEO_INDEX_STORAGE_KEY,
  HERO_EVENT_VIDEOS,
  HERO_VIDEO_ROTATION_INTERVAL_MS,
} from './heroVideos';

interface HeroSceneProps {
  locale: Locale;
  settings?: SiteSettings;
  publishedBooksCount: number;
}

const route = routeData;

export const HeroScene: React.FC<HeroSceneProps> = ({ locale, settings, publishedBooksCount }) => {
  const { isReady: seasonalThemeReady, isSeasonalActive, themeKey } = useSeasonalTheme();
  const [baseVideoIndex, setBaseVideoIndex] = useState<number | null>(null);
  const seasonalVideo = isSeasonalActive && themeKey
    ? HERO_EVENT_VIDEOS[themeKey as SeasonalEvent['themeKey']]
    : undefined;
  const eventVideo = seasonalThemeReady ? seasonalVideo : undefined;
  const heroVideo = seasonalThemeReady
    ? eventVideo ?? (baseVideoIndex === null ? undefined : HERO_BASE_VIDEOS[baseVideoIndex])
    : undefined;
  const heroPoster = heroVideo?.poster ?? seasonalVideo?.poster ?? HERO_BASE_VIDEOS[0].poster;

  useEffect(() => {
    if (!seasonalThemeReady || eventVideo) return;

    try {
      const storedIndex = sessionStorage.getItem(HERO_BASE_VIDEO_INDEX_STORAGE_KEY);
      const previousIndex = storedIndex === null ? -1 : Number(storedIndex);
      const nextIndex = Number.isInteger(previousIndex) && previousIndex >= 0
        ? (previousIndex + 1) % HERO_BASE_VIDEOS.length
        : 0;

      sessionStorage.setItem(HERO_BASE_VIDEO_INDEX_STORAGE_KEY, String(nextIndex));
      setBaseVideoIndex(nextIndex);
    } catch {
      setBaseVideoIndex(Math.floor(Math.random() * HERO_BASE_VIDEOS.length));
    }
  }, [eventVideo, seasonalThemeReady]);

  useEffect(() => {
    if (!seasonalThemeReady || eventVideo || baseVideoIndex === null) return;

    try {
      sessionStorage.setItem(HERO_BASE_VIDEO_INDEX_STORAGE_KEY, String(baseVideoIndex));
    } catch {
      // La rotación sigue funcionando aunque el navegador bloquee el almacenamiento de sesión.
    }
  }, [baseVideoIndex, eventVideo, seasonalThemeReady]);

  useEffect(() => {
    if (!seasonalThemeReady || eventVideo || baseVideoIndex === null || HERO_BASE_VIDEOS.length < 2) return;

    const rotationTimer = window.setInterval(() => {
      setBaseVideoIndex((index) => (index === null ? 0 : (index + 1) % HERO_BASE_VIDEOS.length));
    }, HERO_VIDEO_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(rotationTimer);
  }, [baseVideoIndex === null, eventVideo, seasonalThemeReady]);

  const isEn = locale === 'en';
  const tagline = settings?.heroSubtitle?.[locale] || settings?.heroSubtitle?.es;

  const landmarkTitle = (route[0]?.name[locale] || route[0]?.name.es || '').split(/[—–]/)[0].trim();

  return (
    <section
      id="hero-scene"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[#102925] text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={heroPoster}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover object-[78%_center] sm:object-center"
        />

        {heroVideo && (
          <video
            key={heroVideo.url}
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={heroPoster}
            className="absolute inset-0 h-full w-full object-cover object-[78%_center] motion-reduce:hidden sm:object-center"
          >
            <source src={heroVideo.url} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#09241f]/96 via-[#09241f]/76 to-[#09241f]/20 sm:from-[#09241f]/95 sm:via-[#09241f]/62 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09241f]/70 via-transparent to-[#09241f]/10" />

      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12">
        <div className="max-w-[600px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#17372e]/70 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-50 shadow-lg shadow-black/10 backdrop-blur-md sm:mb-7">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>{isEn ? 'An illustrated journey for curious families' : 'Una aventura ilustrada para familias curiosas'}</span>
          </div>

          <h1 id="hero-title" className="hero-copy-shadow max-w-[12ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {isEn ? 'The world is full of stories.' : 'El mundo está lleno de historias.'}
          </h1>
          <p className="hero-copy-shadow mt-5 max-w-xl text-base leading-7 text-white/95 sm:mt-6 sm:text-lg sm:leading-8">
            {tagline || (isEn
              ? 'Join Curileta as curiosity turns every new place into a story worth sharing.'
              : 'Acompaña a Curileta: cada lugar nuevo convierte la curiosidad en una historia que merece compartirse.')}
          </p>

          <div className="mt-7 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}/libros/las-aventuras-de-curileta`}
              className="inline-flex min-h-12 w-fit max-w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-[#1c3028] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{isEn ? 'Discover the book' : 'Descubre el libro'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#ruta"
              className="inline-flex min-h-12 w-fit max-w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>{isEn ? 'Follow the route' : 'Seguir la ruta'}</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/85 sm:mt-9 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
              {isEn ? 'The journey begins in' : 'La ruta empieza en'}
              <strong className="max-w-52 truncate font-semibold text-white" key={landmarkTitle}>
                {landmarkTitle}
              </strong>
            </span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
            <span>{isEn ? `${publishedBooksCount} published book${publishedBooksCount === 1 ? '' : 's'}` : `${publishedBooksCount} ${publishedBooksCount === 1 ? 'libro publicado' : 'libros publicados'}`}</span>
          </div>
        </div>
      </div>

      <a href="#ruta" className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium text-white/75 lg:inline-flex">
        <span>{isEn ? 'Scroll to begin' : 'Desliza para empezar'}</span>
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
};
