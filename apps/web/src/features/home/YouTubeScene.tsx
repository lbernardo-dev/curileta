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
  Share2,
  X,
  Volume2,
} from 'lucide-react';

interface YouTubeSceneProps {
  locale: Locale;
  videos?: Video[];
  hideHeader?: boolean;
}

const DEFAULT_VIDEOS: Video[] = [
  // --- CAPÍTULOS DE LA SERIE ---
  {
    id: 'capitulo-01',
    title: {
      es: 'Capítulo 1: El Secreto del Árbol Más Alto',
      en: 'Episode 1: The Secret of the Tallest Tree',
    },
    slug: 'capitulo-01-arbol-mas-alto',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 1,
    duration: '09:24',
    publishedAt: '2026-09-01',
    highlightTag: { es: 'Estreno Serie', en: 'Series Premiere' },
    description: {
      es: 'Curileta y Pompón descubren un antiguo mapa entre las ramas más altas del Bosque Encantado. La lagartija prepara su mochila y promete escribirle a su amigo en cada destino.',
      en: 'Curileta and Pompón discover an ancient map atop the highest tree of the Enchanted Forest.',
    },
  },
  {
    id: 'capitulo-02',
    title: {
      es: 'Capítulo 2: Las Estrellas de Teotihuacán',
      en: 'Episode 2: The Stars of Teotihuacan',
    },
    slug: 'capitulo-02-piramide-del-sol',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 2,
    duration: '10:15',
    publishedAt: '2026-09-08',
    highlightTag: { es: 'México Ancestral', en: 'Ancient Mexico' },
    description: {
      es: 'Curileta sube los escalones de la Pirámide del Sol y conoce a Quetzal, quien le enseña a escuchar el baile de los planetas y el eco misterioso de Chichén Itzá.',
      en: 'Curileta climbs the Sun Pyramid and meets Quetzal, who teaches her how the ancient stones converse with the stars.',
    },
  },
  {
    id: 'capitulo-03',
    title: {
      es: 'Capítulo 3: Entre Nubes en Machu Picchu',
      en: 'Episode 3: Among Clouds in Machu Picchu',
    },
    slug: 'capitulo-03-machu-picchu',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 3,
    duration: '08:50',
    publishedAt: '2026-09-15',
    highlightTag: { es: 'Cumbres Andinas', en: 'Andean Peaks' },
    description: {
      es: 'En las alturas de los Andes, la llama Lulú cobija a Curileta con su lana tibia y le muestra la impresionante ciudadela inca construida sin argamasa.',
      en: 'High in the Andes, Lulú the llama shelters Curileta in her warm fleece and reveals the marvelous stone city.',
    },
  },
  {
    id: 'capitulo-04',
    title: {
      es: 'Capítulo 4: La Furia del Galeón de los Sueños',
      en: 'Episode 4: Fury of the Dream Galleon',
    },
    slug: 'capitulo-04-galeon-de-los-suenos',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    type: 'episode',
    episodeNumber: 4,
    duration: '11:02',
    publishedAt: '2026-09-22',
    highlightTag: { es: 'Travesía Oceánica', en: 'Ocean Crossing' },
    description: {
      es: 'Viajando de polizón en un antiguo galeón por el Atlántico, una fuerte tormenta amenaza el timón. Curileta trepa al mástil para amarrar la soga salvadora.',
      en: 'Stowing away aboard an ancient galleon across the Atlantic, Curileta climbs the mast to save the ship rudder during a storm.',
    },
  },

  // --- VÍDEOS MUSICALES ---
  {
    id: 'musical-01',
    title: {
      es: 'Videoclip Oficial: «El Baile del Mapa»',
      en: 'Official Music Video: “The Map Dance”',
    },
    slug: 'cancion-el-baile-del-mapa',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '03:15',
    publishedAt: '2026-09-05',
    highlightTag: { es: 'Coreografía Oficial', en: 'Official Coreography' },
    description: {
      es: '¡Aprende los puntos cardinales y los preparativos de la mochila con Curileta y Pompón al ritmo más pegadizo del Bosque Encantado!',
      en: 'Learn the cardinal points and backpack prep with Curileta and Pompón to the catchiest beat!',
    },
  },
  {
    id: 'musical-02',
    title: {
      es: 'Videoclip: «Cartas en el Viento (Canción de la Amistad)»',
      en: 'Music Video: “Letters in the Wind (Song of Friendship)”',
    },
    slug: 'cancion-cartas-en-el-viento',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '03:42',
    publishedAt: '2026-09-18',
    highlightTag: { es: 'Balada Tendedero', en: 'Friendship Ballad' },
    description: {
      es: 'Una emotiva balada acústica sobre cómo una carta sellada con cariño acorta miles de kilómetros entre dos mejores amigos.',
      en: 'An acoustic ballad celebrating how letters connect best friends across thousands of miles.',
    },
  },
  {
    id: 'musical-03',
    title: {
      es: 'Videoclip: «La Pizza Voladora de Chef Gino»',
      en: 'Music Video: “Chef Gino’s Flying Pizza”',
    },
    slug: 'cancion-la-pizza-de-gino',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    type: 'song',
    duration: '02:40',
    publishedAt: '2026-10-10',
    highlightTag: { es: 'Música Italiana', en: 'Italian Swing' },
    description: {
      es: 'Tarantela alegre y divertida mientras el ratoncito Gino hace girar la masa de pizza y enseña que cocinar es un arte con amor.',
      en: 'A cheerful tarantella as little mouse chef Gino spins pizza dough through Florence streets.',
    },
  },

  // --- YOUTUBE SHORTS ---
  {
    id: 'short-01',
    title: {
      es: '¡Escalando el volcán más pequeño del planeta en 1 segundo! 🌋⚡️',
      en: 'Climbing the smallest volcano on Earth in 1 second! 🌋⚡️',
    },
    slug: 'short-volcan-cuexcomate',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:38',
    publishedAt: '2026-09-04',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: 'Curileta te muestra el Cuexcomate en Puebla, México: ¡un volcán inactivo que puedes subir de un brinco!',
      en: 'Curileta visits Cuexcomate in Mexico: a tiny inactive volcano you can climb in a single hop!',
    },
  },
  {
    id: 'short-02',
    title: {
      es: 'Pompón reacciona a una carta con copos de nieve dentro 📬❄️🐇',
      en: 'Pompón reacts to a letter with snowflakes inside 📬❄️🐇',
    },
    slug: 'short-pompon-nieve-islandia',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:45',
    publishedAt: '2026-09-12',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: '¡El conejito blanco casi congela su bigote al abrir la carta sellada desde la Laguna Azul de Islandia!',
      en: 'The white bunny almost freezes his whiskers opening Curileta’s Iceland postcard!',
    },
  },
  {
    id: 'short-03',
    title: {
      es: '¡Un emú gigante intenta comerse mi sombrero de exploradora! 🎩🏃‍♀️',
      en: 'A giant emu tries to eat my explorer hat! 🎩🏃‍♀️',
    },
    slug: 'short-el-emu-y-el-sombrero',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    duration: '00:32',
    publishedAt: '2026-09-20',
    highlightTag: { es: 'Shorts 9:16', en: 'Shorts 9:16' },
    description: {
      es: '¡En el Outback australiano los emús son muy curiosos! Curileta hace piruetas para esquivar el picotazo.',
      en: 'In the Australian Outback emus are very curious! Curileta dodges pecks with acrobatics.',
    },
  },
];

export const YouTubeScene: React.FC<YouTubeSceneProps> = ({
  locale,
  videos: propVideos = [],
  hideHeader = false,
}) => {
  const allVideos = propVideos && propVideos.length > 0 ? propVideos : DEFAULT_VIDEOS;
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'episode' | 'song' | 'short'>('todos');
  const [activeModalVideo, setActiveModalVideo] = useState<Video | null>(null);

  const counts = useMemo(() => {
    return {
      todos: allVideos.length,
      episode: allVideos.filter((v) => v.type === 'episode').length,
      song: allVideos.filter((v) => v.type === 'song').length,
      short: allVideos.filter((v) => v.type === 'short').length,
    };
  }, [allVideos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'todos') return allVideos;
    return allVideos.filter((v) => v.type === selectedCategory);
  }, [allVideos, selectedCategory]);

  return (
    <section id="escena-youtube" className="relative z-10 py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(239,68,68,0.12),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera de la sección con Zipi-Bot 3D */}
        {!hideHeader && (
          <div className="relative max-w-4xl mx-auto mb-16 text-center">
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
                  <span>Escena 05 — El Canal Oficial de YouTube</span>
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  La página se mueve.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-rose-500 dark:from-red-400 dark:via-amber-300 dark:to-rose-400">
                    Las historias cantan y cobran vida.
                  </span>
                </h2>
              </div>
            </div>

            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Descubre nuestro universo audiovisual en tres formatos pensados para disfrutar en familia: capítulos de la serie animada, canciones con coreografías oficiales y micro-momentos en Shorts.
            </p>
          </div>
        )}

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
            <span>Todos los Vídeos ({counts.todos})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('episode')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === 'episode'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span>Capítulos de la Serie ({counts.episode})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('song')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === 'song'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105 font-black'
                : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Vídeos Musicales ({counts.song})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('short')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === 'short'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 scale-105 font-black'
                : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:text-slate-950 dark:hover:text-white shadow-sm'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>YouTube Shorts ({counts.short})</span>
          </button>
        </div>

        {/* Sección 1: Capítulos de la Serie y Vídeos Musicales (Formato Horizontal 16:9) */}
        {filteredVideos.filter((v) => v.type !== 'short').length > 0 && (
          <div className="mb-14">
            {selectedCategory === 'todos' && (
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Capítulos de la Serie & Vídeos Musicales</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Episodios animados de 8 a 12 minutos y videoclips de la banda sonora oficial.</p>
                </div>
              </div>
            )}

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
                      {/* Portada 16:9 */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-85"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Tag de Categoría / Tipo */}
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

                        {/* Botón de Reproducción */}
                        <button
                          onClick={() => setActiveModalVideo(video)}
                          className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          aria-label={`Ver vídeo: ${title}`}
                        >
                          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                        </button>

                        {/* Duración */}
                        {video.duration && (
                          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold text-white flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{video.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Contenido textual */}
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
                            <span>Reproducir ahora</span>
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

        {/* Sección 2: YouTube Shorts (Formato Vertical 9:16) */}
        {filteredVideos.filter((v) => v.type === 'short').length > 0 && (
          <div className="mt-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-rose-900/40">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">YouTube Shorts de Curileta</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                    Formato Vertical 9:16
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Micro-aventuras, curiosidades geográficas express y momentos divertidos en 30-60 segundos.</p>
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
                      {/* Marco Vertical Aspecto 9:16 */}
                      <div className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 dark:opacity-80"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                        {/* Insignia Shorts Superior */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>Short</span>
                        </div>

                        {/* Botón Central Play */}
                        <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>

                        {/* Título en la parte inferior sobre la imagen */}
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

        {/* Modal Emergente de Reproducción de Vídeo */}
        {activeModalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* Barra superior modal */}
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
                      ? 'Capítulo de la Serie'
                      : activeModalVideo.type === 'song'
                      ? 'Vídeo Musical'
                      : 'YouTube Short'}
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

              {/* Iframe del reproductor */}
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

              {/* Pie con detalles del vídeo */}
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
                    <span>Ver en el canal de YouTube de Curileta</span>
                  </a>

                  <a
                    href="https://www.youtube.com/@curileta?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Suscribirse al Canal</span>
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
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Canal Oficial: @curileta</h4>
                <CheckCircle2 className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Capítulos nuevos de la serie, videoclips para cantar en casa y Shorts educativos todas las semanas. ¡Acompáñanos en cada travesía!
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold border border-slate-200 dark:border-transparent shadow-sm">
                  🎬 Serie Animada
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-bold border border-slate-200 dark:border-transparent shadow-sm">
                  🎵 Canciones & Coreografías
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold border border-slate-200 dark:border-transparent shadow-sm">
                  📱 Shorts Verticales 9:16
                </span>
              </div>
            </div>
          </div>

          <a
            href="https://www.youtube.com/@curileta?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl font-black text-base bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 whitespace-nowrap"
          >
            <Bell className="w-5 h-5 animate-bounce" />
            <span>Suscribirse al Canal</span>
          </a>
        </div>
      </div>
    </section>
  );
};
