'use client';

import React, { useState } from 'react';
import { Locale } from '@curileta/i18n';
import { Youtube, Play, Clock, Sparkles, ExternalLink } from 'lucide-react';

interface VideoPreview {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  type: string;
  thumbnailUrl: string;
}

const VIDEOS: VideoPreview[] = [
  {
    id: 'ep1',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder para reproductor seguro
    title: 'Episodio 1: La Llegada al Bosque Encantado',
    duration: '08:45',
    type: 'Episodio Completo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'ep2',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Canción Oficial: El Baile del Mapa',
    duration: '03:12',
    type: 'Canción & Videoclip',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  },
];

export const YouTubeScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <section className="py-28 bg-slate-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>Escena 06 — YouTube & Audiovisual</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            La página se mueve. Las historias cantan.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Episodios animados llenos de música, valores educativos y aventuras para ver en familia.
          </p>
        </div>

        {/* Video Cards Grid with Zero Initial Iframe Burden */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VIDEOS.map((video) => {
            const isPlaying = playingVideoId === video.id;

            return (
              <div
                key={video.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center group overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
                      title={video.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {/* Optimized Poster Image */}
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                      {/* Play Button Trigger */}
                      <button
                        onClick={() => setPlayingVideoId(video.id)}
                        className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        aria-label={`Reproducir vídeo: ${video.title}`}
                      >
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </button>

                      {/* Duration Tag */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{video.duration}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      {video.type}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{video.title}</h3>
                  </div>

                  <a
                    href="https://www.youtube.com/@curileta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                    aria-label="Abrir en YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Channel Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/60 border border-red-900/40 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold text-white">¿Quieres no perderte ningún estreno?</h4>
            <p className="text-sm text-slate-300">
              Suscríbete al canal oficial de Curileta en YouTube para ver nuevos episodios cada semana.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@curileta"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-black text-sm bg-red-600 hover:bg-red-500 text-white shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Youtube className="w-4 h-4" />
            <span>Suscribirse al Canal</span>
          </a>
        </div>
      </div>
    </section>
  );
};
