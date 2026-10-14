'use client';

import { ContentImage } from '@/components/ContentImage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Locale } from '@curileta/i18n';
import type { SiteSettings, Video } from '@curileta/cms';
import { ShareActions } from '@/components/ShareActions';
import { VideoVote } from '@/components/VideoVote';
import { YouTubeTrackedPlayer } from '@/components/YouTubeTrackedPlayer';
import { SectionEmblem } from '@/components/SectionEmblem';
import { setBrowserStorageValue, useBrowserStorageValue, useClientHydrated } from '@/lib/browser-storage';
import {
  Youtube,
  Play,
  Clock,
  Sparkles,
  ExternalLink,
  Film,
  Music,
  Smartphone,
  Heart,
  X,
  Clapperboard,
  ListVideo,
} from 'lucide-react';

interface YouTubeSceneProps {
  locale: Locale;
  videos?: Video[];
  settings?: SiteSettings;
  voteCounts?: Record<string, number>;
  hideHeader?: boolean;
}

const DEFAULT_VIDEOS: Video[] = [];

function youtubeUrlForVideo(video: Video) {
  const videoId = encodeURIComponent(video.youtubeId);
  return video.type === 'short'
    ? 'https://www.youtube.com/shorts/' + videoId
    : 'https://www.youtube.com/watch?v=' + videoId;
}

export const YouTubeScene: React.FC<YouTubeSceneProps> = ({
  locale,
  videos: propVideos = [],
  settings,
  voteCounts = {},
  hideHeader = false,
}) => {
  // Filtramos estrictamente solo vídeos reales que tengan un youtubeId auténtico (no Rickroll ni dummy)
  const realVideos = useMemo(() => {
    return (propVideos || DEFAULT_VIDEOS).filter(
      (v) => v.youtubeId && v.youtubeId.trim() !== '' && v.youtubeId !== 'dQw4w9WgXcQ'
    );
  }, [propVideos]);

  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'episode' | 'trailer' | 'song' | 'short' | 'favoritos'>('todos');
  const [selectedChannelTab, setSelectedChannelTab] = useState<'videos' | 'shorts' | 'playlists'>('videos');
  const [activeModalVideo, setActiveModalVideo] = useState<Video | null>(null);
  const [favoriteStorageUnavailable, setFavoriteStorageUnavailable] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogCloseButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const favoriteStorageValue = useBrowserStorageValue('local', 'curileta:favorite-videos', '[]');
  const favoriteSlugs = useMemo(() => {
    try {
      const saved: unknown = JSON.parse(favoriteStorageValue || '[]');
      return Array.isArray(saved) ? saved.filter((value): value is string => typeof value === 'string') : [];
    } catch {
      return [];
    }
  }, [favoriteStorageValue]);
  const isEn = locale === 'en';
  const configuredChannelUrl = settings?.youtubeChannelUrl;
  const channelUrl = configuredChannelUrl?.startsWith('https://') ? configuredChannelUrl : 'https://www.youtube.com/@curileta';
  const subscribeUrl = `${channelUrl}${channelUrl.includes('?') ? '&' : '?'}sub_confirmation=1`;
  const favoriteSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const favoritesReady = useClientHydrated();

  function toggleFavorite(slug: string) {
    const next = favoriteSet.has(slug) ? favoriteSlugs.filter((item) => item !== slug) : [...favoriteSlugs, slug];
    const saved = setBrowserStorageValue('local', 'curileta:favorite-videos', JSON.stringify(next));
    setFavoriteStorageUnavailable(!saved);
  }

  function openVideo(video: Video) {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveModalVideo(video);
  }

  useEffect(() => {
    if (!activeModalVideo) return;
    dialogCloseButtonRef.current?.focus();

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveModalVideo(null);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleDialogKeys);
    return () => {
      document.removeEventListener('keydown', handleDialogKeys);
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [activeModalVideo]);

  useEffect(() => {
    if (!activeModalVideo) return;

    const scrollY = window.scrollY;
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    root.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = '-' + scrollY + 'px';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth) body.style.paddingRight = bodyPaddingRight + scrollbarWidth + 'px';

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [activeModalVideo]);

  const counts = useMemo(() => {
    const playlists = new Set(realVideos.map((video) => video.playlistId?.trim()).filter((id): id is string => Boolean(id && /^[A-Za-z0-9_-]{10,128}$/.test(id))));
    return {
      todos: realVideos.length,
      videos: realVideos.filter((v) => v.type !== 'short').length,
      episode: realVideos.filter((v) => v.type === 'episode').length,
      trailer: realVideos.filter((v) => v.type === 'trailer').length,
      song: realVideos.filter((v) => v.type === 'song').length,
      short: realVideos.filter((v) => v.type === 'short').length,
      playlists: playlists.size,
      favoritos: realVideos.filter((v) => favoriteSet.has(v.slug)).length,
    };
  }, [realVideos, favoriteSet]);

  const playlists = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; videos: Video[] }>();

    for (const video of realVideos) {
      const id = video.playlistId?.trim();
      if (!id || !/^[A-Za-z0-9_-]{10,128}$/.test(id)) continue;

      const name = video.playlistName?.[locale]?.trim()
        || video.playlistName?.es?.trim()
        || (isEn ? 'Curileta episodes' : 'Episodios de Curileta');
      const existing = groups.get(id);
      if (existing) {
        existing.videos.push(video);
      } else {
        groups.set(id, { id, name, videos: [video] });
      }
    }

    return [...groups.values()];
  }, [realVideos, locale, isEn]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'todos') return realVideos;
    if (selectedCategory === 'favoritos') return realVideos.filter((v) => favoriteSet.has(v.slug));
    return realVideos.filter((v) => v.type === selectedCategory);
  }, [realVideos, selectedCategory, favoriteSet]);

  const hasRealVideos = realVideos.length > 0;

  return (
    <section
      id="escena-youtube"
      className={`relative z-10 overflow-hidden bg-[#f3f6f3] text-slate-900 transition-colors duration-300 dark:bg-[#131209] dark:text-white ${hideHeader ? 'py-10 sm:py-12' : 'py-20 sm:py-24'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera de la sección con Zipi-Bot 3D */}
        {!hideHeader && (
          <div className="relative mx-auto mb-14 max-w-4xl text-center">
            <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center gap-5 sm:flex-row sm:justify-center sm:text-left">
              {settings?.youtubeChannelAvatarUrl ? (
                <ContentImage
                  src={settings.youtubeChannelAvatarUrl}
                  alt={settings.youtubeChannelTitle?.[locale] || settings.youtubeChannelTitle?.es || (isEn ? 'YouTube channel avatar' : 'Avatar del canal de YouTube')}
                  className="h-20 w-20 shrink-0 rounded-full border-4 border-white object-cover shadow-lg dark:border-[#272727] sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg sm:h-24 sm:w-24" aria-hidden="true">
                  <Youtube className="h-10 w-10" />
                </div>
              )}
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  <Youtube className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span>{isEn ? 'Official YouTube channel' : 'Canal oficial de YouTube'}</span>
                </div>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  {settings?.youtubeChannelTitle?.[locale] || settings?.youtubeChannelTitle?.es || (isEn ? 'Curileta official channel' : 'Canal oficial de Curileta')}
                </h2>
              </div>
            </div>

            <p className="mx-auto max-w-2xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300 sm:text-lg">
              {settings?.youtubeChannelDescription?.[locale] || settings?.youtubeChannelDescription?.es || (isEn
                ? 'Episodes, songs and short videos from Curileta.'
                : 'Episodios, canciones y vídeos cortos de Curileta.')}
            </p>
          </div>
        )}

        {/* CASO A: CUANDO NO HAY VÍDEOS PUBLICADOS REALES */}
        {/* No finge recursos: espacio limpio, honesto y presentación del canal oficial */}
        {!hasRealVideos ? (
          <div className="w-full">
            {/* Tarjeta de Producción Oficial sin recursos falsos */}
            <div className="relative mb-12 w-full overflow-hidden rounded-3xl border-2 border-dashed border-[#b9d4c4] bg-[#fffdf7] p-6 text-center shadow-[0_20px_55px_rgba(34,53,45,0.08)] dark:border-emerald-900 dark:bg-[#1f1f1f] sm:p-10 lg:p-12">

              <SectionEmblem icon={Clapperboard} tone="rose" label={isEn ? 'Curileta videos' : 'Vídeos de Curileta'} />
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 dark:border-rose-900 dark:bg-[#272727] dark:text-rose-200 mb-5">
                <span>{isEn ? 'Official channel' : 'Canal oficial'}</span>
              </div>

              <h3 className="mx-auto mb-3 max-w-3xl text-balance text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {isEn
                  ? 'No videos are listed here yet'
                  : 'Aún no hay vídeos publicados en esta página'}
              </h3>

              <p className="mx-auto mb-8 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {isEn
                  ? 'Only videos with a real YouTube link are shown. This space will update when a published video is added to the catalogue.'
                  : 'Solo mostramos vídeos con un enlace real de YouTube. Este espacio se actualizará cuando añadamos una publicación al catálogo.'}
              </p>

              {/* Los 3 formatos en preparación */}
              <div className="mb-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-700 ease-fluid hover:-translate-y-1 hover:shadow-lg dark:border-[#414141] dark:bg-[#181818]">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-800 dark:bg-[#272727] dark:text-sky-300">
                    <Film className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {isEn ? 'Animated Series' : 'Serie Animada 3D'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Published animated episodes will appear in this collection.'
                      : 'Aquí aparecerán los episodios animados cuando se publiquen.'}
                  </p>
                  <span className="mt-3 inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-sky-800 dark:bg-[#272727] dark:text-sky-200">
                    {isEn ? 'No releases listed' : 'Sin publicaciones'}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-700 ease-fluid hover:-translate-y-1 hover:shadow-lg dark:border-[#414141] dark:bg-[#181818]">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-[#272727] dark:text-emerald-300">
                    <Music className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {isEn ? 'Music & Songs' : 'Banda Sonora & Videoclips'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Published music videos will appear in this collection.'
                      : 'Aquí aparecerán los vídeos musicales cuando se publiquen.'}
                  </p>
                  <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-900 dark:bg-[#272727] dark:text-emerald-200">
                    {isEn ? 'No releases listed' : 'Sin publicaciones'}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-700 ease-fluid hover:-translate-y-1 hover:shadow-lg dark:border-[#414141] dark:bg-[#181818]">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800 dark:bg-[#272727] dark:text-rose-300">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {isEn ? 'YouTube Shorts' : 'YouTube Shorts (9:16)'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Published short-form videos will appear in this collection.'
                      : 'Aquí aparecerán los vídeos cortos cuando se publiquen.'}
                  </p>
                  <span className="mt-3 inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-rose-800 dark:bg-[#272727] dark:text-rose-200">
                    {isEn ? 'No releases listed' : 'Sin publicaciones'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* CASO B: CUANDO EXISTEN VÍDEOS REALES AUTÉNTICOS */
          <>
            {hideHeader && (
              <div className="mb-7 border-b border-slate-300 dark:border-[#313131]">
                <div role="group" aria-label={isEn ? 'Channel content' : 'Contenido del canal'} className="-mb-px flex gap-7 overflow-x-auto">
                  {([
                    { id: 'videos', label: isEn ? 'Videos' : 'Vídeos', count: counts.videos, icon: Film },
                    { id: 'shorts', label: 'Shorts', count: counts.short, icon: Smartphone },
                    { id: 'playlists', label: isEn ? 'Playlists' : 'Listas', count: counts.playlists, icon: ListVideo },
                  ] as const).map((tab) => {
                    const Icon = tab.icon;
                    const selected = selectedChannelTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setSelectedChannelTab(tab.id);
                          setSelectedCategory('todos');
                        }}
                        className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-600 ${selected ? 'border-red-600 text-slate-950 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{tab.label}</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{tab.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pestañas de filtrado de formatos */}
            {(!hideHeader || selectedChannelTab === 'videos') && <div className="mb-8 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === 'todos'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                <span>{isEn ? `All Videos (${hideHeader ? counts.videos : counts.todos})` : `Todos los Vídeos (${hideHeader ? counts.videos : counts.todos})`}</span>
              </button>

              {counts.trailer > 0 && (
                <button
                  onClick={() => setSelectedCategory('trailer')}
                  aria-pressed={selectedCategory === 'trailer'}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${selectedCategory === 'trailer' ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-[#313131] dark:bg-[#1f1f1f] dark:text-slate-200 dark:hover:bg-[#272727]'}`}
                >
                  <Clapperboard className="h-3.5 w-3.5" />
                  <span>{isEn ? `Trailers (${counts.trailer})` : `Tráilers (${counts.trailer})`}</span>
                </button>
              )}

              {(!hideHeader || selectedChannelTab === 'videos') && (
                <button
                  onClick={() => setSelectedCategory('favoritos')}
                  disabled={!favoritesReady}
                  aria-pressed={selectedCategory === 'favoritos'}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-700 ease-fluid active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${selectedCategory === 'favoritos' ? 'border-emerald-700 bg-emerald-800 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-[#313131] dark:bg-[#1f1f1f] dark:text-slate-200 dark:hover:bg-[#272727]'}`}
                >
                  {isEn ? `Saved (${counts.favoritos})` : `Favoritos (${counts.favoritos})`}
                </button>
              )}

              {counts.episode > 0 && (
                <button
                  onClick={() => setSelectedCategory('episode')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === 'episode'
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-xs'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>{isEn ? `Series Episodes (${counts.episode})` : `Capítulos de la Serie (${counts.episode})`}</span>
                </button>
              )}

              {counts.song > 0 && (
                <button
                  onClick={() => setSelectedCategory('song')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === 'song'
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-xs'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>{isEn ? `Music Videos (${counts.song})` : `Vídeos Musicales (${counts.song})`}</span>
                </button>
              )}

              {!hideHeader && counts.short > 0 && (
                <button
                  onClick={() => setSelectedCategory('short')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === 'short'
                      ? 'bg-linear-to-r from-red-600 to-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 scale-105 font-black'
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:text-slate-950 dark:hover:text-white shadow-xs'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span>{isEn ? `YouTube Shorts (${counts.short})` : `YouTube Shorts (${counts.short})`}</span>
                </button>
              )}
            </div>}
            {favoriteStorageUnavailable && (
              <p role="status" className="mx-auto -mt-8 mb-8 max-w-2xl text-center text-sm text-amber-800 dark:text-amber-200">
                {isEn ? 'This browser could not save favorites. Check its storage settings and try again.' : 'El navegador no pudo guardar los favoritos. Revisa sus ajustes de almacenamiento e inténtalo de nuevo.'}
              </p>
            )}

            <div
              role={hideHeader ? 'region' : undefined}
              id={hideHeader ? 'channel-content-panel' : undefined}
              aria-label={hideHeader ? (selectedChannelTab === 'videos' ? (isEn ? 'Videos' : 'Vídeos') : selectedChannelTab === 'shorts' ? 'Shorts' : (isEn ? 'Playlists' : 'Listas')) : undefined}
            >
            {/* Vídeos Horizontales 16:9 */}
            {(!hideHeader || selectedChannelTab === 'videos' || selectedCategory === 'favoritos') && filteredVideos.filter((v) => v.type !== 'short').length > 0 && (
              <div className="mb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredVideos
                    .filter((v) => v.type !== 'short')
                    .map((video) => {
                      const title = video.title[locale] || video.title.es;
                      const description = video.description ? video.description[locale] || video.description.es : '';
                      const tag = video.highlightTag ? video.highlightTag[locale] || video.highlightTag.es : null;

                      return (
                        <div
                          key={video.id}
                          className="group rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 overflow-hidden shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                            <ContentImage
                              src={video.thumbnail}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-85"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                                  video.type === 'episode'
                                    ? 'bg-sky-500/90 text-slate-950 font-black'
                                    : video.type === 'trailer'
                                      ? 'bg-amber-400/90 text-slate-950 font-black'
                                      : 'bg-emerald-500/90 text-slate-950 font-black'
                                }`}
                              >
                                {video.type === 'episode'
                                  ? video.episodeNumber
                                    ? `Capítulo ${video.episodeNumber}`
                                    : 'Serie Animada'
                                  : video.type === 'trailer'
                                    ? (isEn ? 'Trailer' : 'Tráiler')
                                    : video.type === 'song'
                                      ? (isEn ? 'Music video' : 'Vídeo musical')
                                      : (isEn ? 'Video' : 'Vídeo')}
                              </span>
                              {tag && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                                  {tag}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleFavorite(video.slug)}
                              disabled={!favoritesReady}
                              aria-label={favoriteSet.has(video.slug)
                                ? (isEn ? `Remove ${title} from favorites on this device` : `Quitar ${title} de favoritos en este dispositivo`)
                                : (isEn ? `Save ${title} to favorites on this device` : `Guardar ${title} en favoritos en este dispositivo`)}
                              aria-pressed={favoriteSet.has(video.slug)}
                              className="absolute right-3 top-3 z-10 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/75 text-white transition-all duration-700 ease-fluid hover:scale-105 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                            >
                              <Heart className={`h-5 w-5 ${favoriteSet.has(video.slug) ? 'fill-current text-rose-300' : ''}`} />
                            </button>

                            <button
                              onClick={() => openVideo(video)}
                              className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                              aria-label={`Ver vídeo: ${title}`}
                            >
                              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                            </button>

                            {video.duration && (
                              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold text-white flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{video.duration}</span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                                {title}
                              </h4>
                              {description && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                  {description}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                              <button
                                onClick={() => openVideo(video)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>{isEn ? 'Play now' : 'Reproducir ahora'}</span>
                              </button>

                              <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noopener"
                                className="p-2 rounded-full bg-slate-100 hover:bg-red-600 text-slate-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                                aria-label="Abrir en YouTube"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* YouTube Shorts (Formato Vertical 9:16) */}
            {(!hideHeader || selectedChannelTab === 'shorts' || selectedCategory === 'favoritos') && filteredVideos.filter((v) => v.type === 'short').length > 0 && (
              <div className="mt-8 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-linear-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-rose-900/40">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {isEn ? 'Curileta YouTube Shorts' : 'YouTube Shorts de Curileta'}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                        9:16
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                  {filteredVideos
                    .filter((v) => v.type === 'short')
                    .map((video) => {
                      const title = video.title[locale] || video.title.es;

                      return (
                        <div
                          key={video.id}
                          className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 overflow-hidden shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative"
                        >
                          <div className="relative aspect-9/16 w-full bg-slate-950 overflow-hidden">
                            <ContentImage
                              src={video.thumbnail}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 dark:opacity-80"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-black/40" />

                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                              <Smartphone className="w-2.5 h-2.5" />
                              <span>Short</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => openVideo(video)}
                              aria-label={`${isEn ? 'Play short' : 'Reproducir short'}: ${title}`}
                              className="absolute inset-0 m-auto z-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition-transform duration-300 group-hover:scale-125 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                            >
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleFavorite(video.slug)}
                              disabled={!favoritesReady}
                              aria-label={favoriteSet.has(video.slug)
                                ? (isEn ? `Remove ${title} from favorites on this device` : `Quitar ${title} de favoritos en este dispositivo`)
                                : (isEn ? `Save ${title} to favorites on this device` : `Guardar ${title} en favoritos en este dispositivo`)}
                              aria-pressed={favoriteSet.has(video.slug)}
                              className="absolute right-2 top-2 z-10 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/75 text-white transition-all duration-700 ease-fluid hover:scale-105 hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                            >
                              <Heart className={`h-5 w-5 ${favoriteSet.has(video.slug) ? 'fill-current text-rose-300' : ''}`} />
                            </button>

                            <div className="absolute bottom-0 inset-x-0 p-2.5 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent">
                              <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-tight">
                                {title}
                              </p>
                              {video.duration && (
                                <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                                  ⏱ {video.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {hideHeader && selectedChannelTab === 'shorts' && filteredVideos.filter((v) => v.type === 'short').length === 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-[#313131] dark:bg-[#1f1f1f]" aria-live="polite">
                <Smartphone className="mx-auto h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{isEn ? 'No Shorts published yet' : 'Todavía no hay Shorts publicados'}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-5 text-slate-600 dark:text-slate-400">{isEn ? 'New short adventures will appear here when they are published.' : 'Aquí aparecerán las nuevas aventuras breves cuando se publiquen.'}</p>
              </section>
            )}

            {hideHeader && selectedChannelTab === 'playlists' && playlists.length > 0 && (
              <section aria-label={isEn ? 'Channel playlists' : 'Listas del canal'}>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">{isEn ? 'Watch the journey in order' : 'Sigue la aventura en orden'}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{isEn ? 'Collections published on the official channel.' : 'Colecciones publicadas en el canal oficial.'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {playlists.map((playlist) => {
                    const previewVideos = playlist.videos.slice(0, 3);
                    const countLabel = isEn
                      ? `${playlist.videos.length} ${playlist.videos.length === 1 ? 'video' : 'videos'}`
                      : `${playlist.videos.length} ${playlist.videos.length === 1 ? 'vídeo' : 'vídeos'}`;

                    return (
                      <a
                        key={playlist.id}
                        href={`https://www.youtube.com/playlist?list=${encodeURIComponent(playlist.id)}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-700 ease-fluid hover:-translate-y-1 hover:border-red-500/60 hover:shadow-xl active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-600 dark:border-[#313131] dark:bg-[#1f1f1f]"
                        aria-label={isEn ? `Open playlist ${playlist.name} on YouTube, ${countLabel}` : `Abrir la lista ${playlist.name} en YouTube, ${countLabel}`}
                      >
                        <div className={`relative grid aspect-video overflow-hidden bg-slate-950 ${previewVideos.length === 1 ? 'grid-cols-1' : previewVideos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                          {previewVideos.map((video) => (
                            <ContentImage key={video.id} src={video.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ))}
                          {previewVideos.length === 1 && <div className="absolute inset-0 bg-black/10" aria-hidden="true" />}
                          <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-sm font-semibold text-white backdrop-blur-xs">
                            <ListVideo className="h-4 w-4" aria-hidden="true" />
                            {countLabel}
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-700 ease-fluid group-hover:bg-black/20 group-hover:opacity-100" aria-hidden="true">
                            <Play className="h-12 w-12 fill-current drop-shadow-lg" />
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 p-4">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-bold text-slate-950 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-300">{playlist.name}</h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{isEn ? 'Curileta official channel' : 'Canal oficial de Curileta'}</p>
                          </div>
                          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {hideHeader && selectedChannelTab === 'playlists' && playlists.length === 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-[#313131] dark:bg-[#1f1f1f]" aria-live="polite">
                <ListVideo className="mx-auto h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{isEn ? 'Playlists are on their way' : 'Las listas se están preparando'}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-5 text-slate-600 dark:text-slate-400">{isEn ? 'Published playlists will appear here as soon as videos are assigned to them in the channel editor.' : 'Aquí aparecerán las listas publicadas cuando sus vídeos estén asociados desde la gestión del canal.'}</p>
              </section>
            )}

            {selectedCategory === 'favoritos' && favoritesReady && filteredVideos.length === 0 && (
              <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-[#313131] dark:bg-[#1f1f1f]">
                <h3 className="text-xl font-bold">{isEn ? 'No saved videos yet' : 'Aún no has guardado vídeos'}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{isEn ? 'Use the heart on a video card to save it on this device.' : 'Pulsa el corazón de una tarjeta para guardarlo en este dispositivo.'}</p>
              </section>
            )}
            </div>
          </>
        )}

        {/* Modal de Reproducción (Solo si hay un vídeo activo válido) */}
        {activeModalVideo && activeModalVideo.youtubeId !== 'dQw4w9WgXcQ' && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-1000 flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/90 p-2 backdrop-blur-xl animate-in fade-in duration-200 sm:p-4">
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="youtube-modal-title"
              tabIndex={-1}
              className="relative max-h-[calc(100dvh-1rem)] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-h-[calc(100dvh-2rem)]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      activeModalVideo.type === 'episode'
                        ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40'
                        : activeModalVideo.type === 'song'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : activeModalVideo.type === 'trailer'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {activeModalVideo.type === 'episode'
                      ? 'Capítulo'
                      : activeModalVideo.type === 'song'
                      ? 'Canción'
                      : activeModalVideo.type === 'trailer'
                      ? (isEn ? 'Trailer' : 'Tráiler')
                      : 'Short'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                    {activeModalVideo.duration}
                  </span>
                </div>

                <button
                  ref={dialogCloseButtonRef}
                  onClick={() => setActiveModalVideo(null)}
                  className="p-2 rounded-full bg-slate-200 hover:bg-red-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={isEn ? 'Close video player' : 'Cerrar reproductor'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`relative shrink-0 bg-black ${
                  activeModalVideo.type === 'short' ? 'mx-auto h-[65vh] max-h-168 w-auto max-w-full aspect-9/16' : 'aspect-video w-full'
                }`}
              >
                <YouTubeTrackedPlayer
                  key={activeModalVideo.id}
                  videoId={activeModalVideo.youtubeId}
                  videoSlug={activeModalVideo.slug}
                  title={activeModalVideo.title[locale] || activeModalVideo.title.es}
                  thumbnail={activeModalVideo.thumbnail}
                  youtubeUrl={youtubeUrlForVideo(activeModalVideo)}
                  locale={locale}
                />
              </div>
              <p className="px-4 py-2 text-center text-xs text-slate-500 dark:bg-[#181818] dark:text-slate-400">
                {isEn
                  ? 'Curileta records a video specific playback start. YouTube calculates its official views separately.'
                  : 'Curileta registra el inicio de reproducción de cada vídeo. YouTube calcula sus visualizaciones oficiales por separado.'}
              </p>

              <div className="p-6 bg-slate-50 dark:bg-slate-950">
                <h3 id="youtube-modal-title" className="text-xl font-black text-slate-900 dark:text-white">
                  {activeModalVideo.title[locale] || activeModalVideo.title.es}
                </h3>
                {activeModalVideo.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {activeModalVideo.description[locale] || activeModalVideo.description.es}
                  </p>
                )}

                {activeModalVideo.playlistName && (
                  <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {isEn ? 'Playlist:' : 'Lista:'} {activeModalVideo.playlistName[locale] || activeModalVideo.playlistName.es}
                  </p>
                )}
                {activeModalVideo.tags?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label={isEn ? 'Video tags' : 'Etiquetas del vídeo'}>
                    {activeModalVideo.tags.map((tag) => <li key={tag} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-[#272727] dark:text-slate-200">{tag}</li>)}
                  </ul>
                ) : null}

                <button
                  type="button"
                  onClick={() => toggleFavorite(activeModalVideo.slug)}
                  disabled={!favoritesReady}
                  aria-pressed={favoriteSet.has(activeModalVideo.slug)}
                  className="mt-4 min-h-10 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-fluid hover:bg-slate-100 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]"
                >
                  {favoriteSet.has(activeModalVideo.slug)
                    ? (isEn ? 'Remove from favorites on this device' : 'Quitar de favoritos en este dispositivo')
                    : (isEn ? 'Save to favorites on this device' : 'Guardar en favoritos en este dispositivo')}
                </button>
                {favoriteStorageUnavailable && (
                  <p role="status" className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                    {isEn ? 'This browser could not save the favorite.' : 'El navegador no pudo guardar el favorito.'}
                  </p>
                )}

                <ShareActions
                  contentType="video"
                  contentSlug={activeModalVideo.slug}
                  title={activeModalVideo.title[locale] || activeModalVideo.title.es}
                  description={activeModalVideo.description?.[locale] || activeModalVideo.description?.es}
                  url={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
                  locale={locale}
                />

                {activeModalVideo.votingEnabled === true ? (
                  <VideoVote
                    slug={activeModalVideo.slug}
                    title={activeModalVideo.title[locale] || activeModalVideo.title.es}
                    prompt={activeModalVideo.votePrompt?.[locale] || activeModalVideo.votePrompt?.es}
                    initialVotes={voteCounts[activeModalVideo.slug] || 0}
                    locale={locale}
                  />
                ) : null}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isEn ? 'Like on YouTube' : 'Dar Me gusta en YouTube'}</span>
                  </a>

                  <a
                    href={subscribeUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Subscribe' : 'Suscribirse al Canal'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

        {/* Banner de suscripción de la portada. La página de canal ya lo muestra junto a su identidad. */}
        {!hideHeader && <div className="mt-12 flex flex-col items-center justify-between gap-8 rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-[#313131] dark:bg-[#181818] sm:p-10 md:flex-row">
          <div className="flex items-center gap-5">
            {settings?.youtubeChannelAvatarUrl
              ? <ContentImage src={settings.youtubeChannelAvatarUrl} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20" />
              : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-600 sm:h-20 sm:w-20"><Youtube className="h-10 w-10 text-white" /></div>}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {settings?.youtubeChannelTitle?.[locale] || settings?.youtubeChannelTitle?.es || (isEn ? 'Curileta official channel' : 'Canal oficial de Curileta')}
                </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                {settings?.youtubeChannelDescription?.[locale] || settings?.youtubeChannelDescription?.es || (isEn
                  ? 'Follow Curileta’s adventures, songs and short videos.'
                  : 'Sigue las aventuras, canciones y vídeos cortos de Curileta.')}
              </p>
              {settings?.youtubeChannelTags?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2 text-xs" aria-label={isEn ? 'Channel tags' : 'Etiquetas del canal'}>
                  {settings.youtubeChannelTags.map((tag) => <li key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 dark:border-[#313131] dark:bg-[#1f1f1f] dark:text-slate-200">{tag}</li>)}
                </ul>
              ) : null}
            </div>
          </div>

          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener"
            className="px-8 py-4 rounded-2xl font-black text-base bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
          >
            <Youtube className="w-5 h-5" />
            <span>{isEn ? 'Subscribe to Channel' : 'Suscribirme al Canal'}</span>
          </a>
        </div>}
      </div>
    </section>
  );
};
