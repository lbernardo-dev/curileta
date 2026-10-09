'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { Music, Play, Pause, Disc, Sparkles, BookOpen, Volume2, ArrowLeft } from 'lucide-react';

interface SongTrack {
  id: string;
  title: string;
  album: string;
  duration: string;
  description: string;
  lyricsExcerpt: string;
  character: string;
  color: string;
}

const SONGS: SongTrack[] = [
  {
    id: 'el-baile-del-mapa',
    title: 'El Baile del Mapa',
    album: 'Las Aventuras de Curileta — BSO Vol. 1',
    duration: '03:12',
    description: 'La canción oficial de la expedición. Un ritmo alegre y pegadizo que enseña los puntos cardinales y anima a desplegar el mapa.',
    lyricsExcerpt: '«Gira al norte, salta al sur, busca el brillo en el azul. Si el sendero te sonríe, ¡la aventura sigue aquí!»',
    character: 'Curileta & Pompón',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'el-vuelo-de-quetzal',
    title: 'El Vuelo de Quetzal',
    album: 'Las Aventuras de Curileta — BSO Vol. 1',
    duration: '02:45',
    description: 'Melodía inspirada en instrumentos tradicionales de viento y sonidos de la selva tropical.',
    lyricsExcerpt: '«Entre las copas de esmeralda, sube el viento que te abraza. Vuela libre, vuela alto, deja atrás todo el cansancio.»',
    character: 'Quetzal',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'olas-de-hielo',
    title: 'La Canción de las Olas Frías',
    album: 'Las Aventuras de Curileta — BSO Vol. 1',
    duration: '03:05',
    description: 'Balada juguetona que narra el chapuzón de Lulú entre témpanos de hielo y aguas termales.',
    lyricsExcerpt: '«Brinca el agua, salta el sol, nada con el corazón. En el frío más helado, siempre hay calor al lado.»',
    character: 'Lulú',
    color: 'from-sky-500 to-blue-600',
  },
];

export default function SongsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [resolvedLocale, setResolvedLocale] = useState<Locale>('es');

  React.useEffect(() => {
    params.then((p) => {
      if (isValidLocale(p.locale)) {
        setResolvedLocale(p.locale);
      }
    });
  }, [params]);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${resolvedLocale}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>Cancionero Digital Interactivo</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Música para cantar la aventura
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Temas musicales creados para aprender valores, bailar en familia y viajar por el mundo con la imaginación.
          </p>
        </div>

        {/* Tracks List */}
        <div className="space-y-6">
          {SONGS.map((song) => {
            const isPlaying = playingId === song.id;

            return (
              <div
                key={song.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/40 transition-all shadow-xl"
              >
                {/* Vinyl / Cover simulator */}
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${song.color} p-0.5 shadow-lg shrink-0 flex items-center justify-center cursor-pointer group`}
                    onClick={() => togglePlay(song.id)}
                  >
                    <div className="w-full h-full rounded-[14px] bg-slate-950/80 flex items-center justify-center">
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-amber-400 fill-current animate-pulse" />
                      ) : (
                        <Play className="w-8 h-8 text-white fill-current ml-1 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Voz: {song.character}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {song.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">{song.album} • {song.duration}</p>
                  </div>
                </div>

                {/* Lyrics quote */}
                <div className="w-full md:max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3" /> Letra destacada:
                  </span>
                  <p className="text-xs text-slate-300 italic">{song.lyricsExcerpt}</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlay(song.id)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlaying ? 'Pausar audio' : 'Escuchar muestra'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
