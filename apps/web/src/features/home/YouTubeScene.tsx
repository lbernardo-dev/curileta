'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@curileta/i18n';
import { Video } from '@curileta/cms';
import {
  Youtube,
  Play,
  Clock,
  Sparkles,
  ExternalLink,
  Film,
  Music,
  Smartphone,
  CheckCircle2,
  Bell,
  X,
  Clapperboard,
} from 'lucide-react';

interface YouTubeSceneProps {
  locale: Locale;
  videos?: Video[];
  hideHeader?: boolean;
}

const DEFAULT_VIDEOS: Video[] = [];

export const YouTubeScene: React.FC<YouTubeSceneProps> = ({
  locale,
  videos: propVideos = [],
  hideHeader = false,
}) => {
  // Filtramos estrictamente solo vídeos reales que tengan un youtubeId auténtico (no Rickroll ni dummy)
  const realVideos = useMemo(() => {
    return (propVideos || DEFAULT_VIDEOS).filter(
      (v) => v.youtubeId && v.youtubeId.trim() !== '' && v.youtubeId !== 'dQw4w9WgXcQ'
    );
  }, [propVideos]);

  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'episode' | 'song' | 'short'>('todos');
  const [activeModalVideo, setActiveModalVideo] = useState<Video | null>(null);
  const isEn = locale === 'en';

  const counts = useMemo(() => {
    return {
      todos: realVideos.length,
      episode: realVideos.filter((v) => v.type === 'episode').length,
      song: realVideos.filter((v) => v.type === 'song').length,
      short: realVideos.filter((v) => v.type === 'short').length,
    };
  }, [realVideos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'todos') return realVideos;
    return realVideos.filter((v) => v.type === selectedCategory);
  }, [realVideos, selectedCategory]);

  const hasRealVideos = realVideos.length > 0;

  return (
    <section
      id="escena-youtube"
      className="relative z-10 py-24 sm:py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
    >
      {/* Resplandor ambiental de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(239,68,68,0.12),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera de la sección con Zipi-Bot 3D */}
        {!hideHeader && (
          <div className="relative max-w-4xl mx-auto mb-14 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-fuchsia-500 via-red-500 to-amber-400 p-1 shadow-2xl shadow-red-500/30 group-hover:rotate-3 transition-transform duration-300">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                    <img
                      src="/images/characters/zipi-bot-main.webp"
                      alt="Zipi-Bot Operador de Cine"
                      className="w-24 h-24 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-115 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-red-400 animate-pulse">
                  ▶ CINE 3D
                </div>
              </div>

              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-300 text-xs font-black uppercase tracking-widest mb-3 shadow-md backdrop-blur-md">
                  <Youtube className="w-4 h-4 text-red-600 dark:text-red-500" />
                  <span>
                    {isEn ? 'Scene 05 — The Official YouTube Channel' : 'Escena 05 — El Canal Oficial de YouTube'}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {isEn ? 'The page moves.' : 'La página se mueve.'}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-rose-500 dark:from-red-400 dark:via-amber-300 dark:to-rose-400">
                    {isEn ? 'Stories sing and come to life.' : 'Las historias cantan y cobran vida.'}
                  </span>
                </h2>
              </div>
            </div>

            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {isEn
                ? 'Our audiovisual universe is in full production: animated episodes, official music videos, and educational Shorts for the whole family.'
                : 'Nuestro universo audiovisual está en plena producción: capítulos de la serie animada, canciones con coreografías oficiales y micro-momentos educativos en Shorts.'}
            </p>
          </div>
        )}

        {/* CASO A: CUANDO NO HAY VÍDEOS PUBLICADOS REALES */}
        {/* No finge recursos: espacio limpio, honesto y presentación del canal oficial */}
        {!hasRealVideos ? (
          <div className="max-w-4xl mx-auto">
            {/* Tarjeta de Producción Oficial sin recursos falsos */}
            <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-red-300 dark:border-red-500/30 p-8 sm:p-12 shadow-xl backdrop-blur-xl text-center relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider mb-5">
                <Clapperboard className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>{isEn ? 'Content in Production • Coming Soon' : 'Contenido en Producción • Próximamente'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                {isEn
                  ? 'Official Episodes and Shorts Coming Soon'
                  : 'Los primeros capítulos y Shorts se estrenarán próximamente'}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
                {isEn
                  ? 'To maintain transparency and not display mock resources, video players will become active as official episodes are released on our verified YouTube channel.'
                  : 'Para garantizar total autenticidad y no mostrar recursos ficticios, los reproductores y fichas se habilitarán en cuanto se publiquen los episodios oficiales en nuestro canal de YouTube.'}
              </p>

              {/* Los 3 formatos en preparación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                    <Film className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {isEn ? 'Animated Series' : 'Serie Animada 3D'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Episodes of 8–12 minutes journeying across 40 cultures with Curileta and Pompón.'
                      : 'Capítulos completos de 8 a 12 minutos recorriendo 40 culturas con Curileta y sus amigos.'}
                  </p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/10 text-sky-600 dark:text-sky-300">
                    {isEn ? 'In Production' : 'En Producción'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Music className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {isEn ? 'Music & Songs' : 'Banda Sonora & Videoclips'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Original family songs with choreographies and values of empathy and nature.'
                      : 'Canciones oficiales con coreografías para cantar en familia y aprender jugando.'}
                  </p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    {isEn ? 'In Production' : 'En Producción'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {isEn ? 'YouTube Shorts' : 'YouTube Shorts (9:16)'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Vertical quick curiosities and funny micro-moments in 30–60 seconds.'
                      : 'Curiosidades geográficas exprés y micro-momentos divertidos en formato vertical.'}
                  </p>
                  <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-300">
                    {isEn ? 'In Production' : 'En Producción'}
                  </span>
                </div>
              </div>

              {/* Botón CTA al canal de YouTube */}
              <a
                href="https://www.youtube.com/@curileta?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Youtube className="w-5 h-5 fill-current" />
                <span>
                  {isEn
                    ? 'Subscribe to @curileta on YouTube'
                    : 'Suscribirse al Canal Oficial @curileta en YouTube'}
                </span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </a>
            </div>
          </div>
        ) : (
          /* CASO B: CUANDO EXISTEN VÍDEOS REALES AUTÉNTICOS */
          <>
            {/* Pestañas de filtrado de formatos */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === 'todos'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                <span>{isEn ? `All Videos (${counts.todos})` : `Todos los Vídeos (${counts.todos})`}</span>
              </button>

              {counts.episode > 0 && (
                <button
                  onClick={() => setSelectedCategory('episode')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === 'episode'
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
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
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>{isEn ? `Music Videos (${counts.song})` : `Vídeos Musicales (${counts.song})`}</span>
                </button>
              )}

              {counts.short > 0 && (
                <button
                  onClick={() => setSelectedCategory('short')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === 'short'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 scale-105 font-black'
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span>{isEn ? `YouTube Shorts (${counts.short})` : `YouTube Shorts (${counts.short})`}</span>
                </button>
              )}
            </div>

            {/* Vídeos Horizontales 16:9 */}
            {filteredVideos.filter((v) => v.type !== 'short').length > 0 && (
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
                            <img
                              src={video.thumbnail}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-85"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                                  video.type === 'episode'
                                    ? 'bg-sky-500/90 text-slate-950 font-black'
                                    : 'bg-emerald-500/90 text-slate-950 font-black'
                                }`}
                              >
                                {video.type === 'episode'
                                  ? video.episodeNumber
                                    ? `Capítulo ${video.episodeNumber}`
                                    : 'Serie Animada'
                                  : 'Vídeo Musical'}
                              </span>
                              {tag && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                                  {tag}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => setActiveModalVideo(video)}
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
                                onClick={() => setActiveModalVideo(video)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>{isEn ? 'Play now' : 'Reproducir ahora'}</span>
                              </button>

                              <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
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
            {filteredVideos.filter((v) => v.type === 'short').length > 0 && (
              <div className="mt-8 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-rose-900/40">
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
                          onClick={() => setActiveModalVideo(video)}
                          className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 overflow-hidden shadow-lg dark:shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative"
                        >
                          <div className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden">
                            <img
                              src={video.thumbnail}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 dark:opacity-80"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                              <Smartphone className="w-2.5 h-2.5" />
                              <span>Short</span>
                            </div>

                            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>

                            <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
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
          </>
        )}

        {/* Modal de Reproducción (Solo si hay un vídeo activo válido) */}
        {activeModalVideo && activeModalVideo.youtubeId !== 'dQw4w9WgXcQ' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      activeModalVideo.type === 'episode'
                        ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40'
                        : activeModalVideo.type === 'song'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {activeModalVideo.type === 'episode'
                      ? 'Capítulo'
                      : activeModalVideo.type === 'song'
                      ? 'Canción'
                      : 'Short'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                    {activeModalVideo.duration}
                  </span>
                </div>

                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="p-2 rounded-full bg-slate-200 hover:bg-red-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Cerrar reproductor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`relative w-full bg-black ${
                  activeModalVideo.type === 'short' ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'
                }`}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.youtubeId}?autoplay=1`}
                  title={activeModalVideo.title[locale] || activeModalVideo.title.es}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-950">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {activeModalVideo.title[locale] || activeModalVideo.title.es}
                </h3>
                {activeModalVideo.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {activeModalVideo.description[locale] || activeModalVideo.description.es}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isEn ? 'Watch on YouTube' : 'Ver en YouTube'}</span>
                  </a>

                  <a
                    href="https://www.youtube.com/@curileta?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Subscribe' : 'Suscribirse al Canal'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Oficial de Suscripción al Canal de YouTube */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-red-50 via-amber-50/50 to-rose-50 dark:from-red-950/80 dark:via-slate-900 dark:to-amber-950/80 border-2 border-red-200 dark:border-red-900/50 p-8 sm:p-10 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-red-600/40">
              <Youtube className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Canal Oficial: @curileta
                </h4>
                <CheckCircle2 className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                {isEn
                  ? 'Official animated episodes, family songs with choreographies, and educational Shorts. Join the journey!'
                  : 'Capítulos de la serie, videoclips para cantar en casa y Shorts educativos. ¡Acompáñanos en cada travesía suscribiéndote gratis!'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold border border-slate-200 dark:border-transparent shadow-sm">
                  🎬 {isEn ? 'Animated Series' : 'Serie Animada'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-bold border border-slate-200 dark:border-transparent shadow-sm">
                  🎵 {isEn ? 'Songs & Dances' : 'Canciones & Coreografías'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold border border-slate-200 dark:border-transparent shadow-sm">
                  📱 {isEn ? 'Vertical Shorts' : 'Shorts 9:16'}
                </span>
              </div>
            </div>
          </div>

          <a
            href="https://www.youtube.com/@curileta?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl font-black text-base bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
          >
            <Bell className="w-5 h-5 animate-bounce" />
            <span>{isEn ? 'Subscribe to Channel' : 'Suscribirme al Canal'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
