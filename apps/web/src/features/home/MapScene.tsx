'use client';

import React, { useState } from 'react';
import type { Locale } from '@curileta/i18n';
import { Globe, Compass } from 'lucide-react';

type LocalizedText = Record<Locale, string>;

interface Destination {
  id: string;
  name: LocalizedText;
  country: LocalizedText;
  theme: LocalizedText;
  description: LocalizedText;
  coordinates: { x: number; y: number };
}

const localized = (es: string, en: string): LocalizedText => ({ es, en });

const DESTINATIONS: Destination[] = [
  {
    id: 'mexico',
    name: localized('Teotihuacán y selvas', 'Teotihuacan and the rainforest'),
    country: localized('México', 'Mexico'),
    theme: localized('El misterio de las pirámides y el vuelo del quetzal', 'Pyramid mysteries and the quetzal’s flight'),
    description: localized('Templos antiguos rozan el cielo y el canto de las aves guía el camino.', 'Ancient temples reach for the sky while birdsong guides the way.'),
    coordinates: { x: 25, y: 48 },
  },
  {
    id: 'peru',
    name: localized('Machu Picchu', 'Machu Picchu'),
    country: localized('Perú', 'Peru'),
    theme: localized('Montañas sagradas y caminos entre las nubes', 'Sacred mountains and trails above the clouds'),
    description: localized('Cóndores vigilan las murallas de piedra en las alturas de los Andes.', 'Condors circle the stone walls high in the Andes.'),
    coordinates: { x: 30, y: 65 },
  },
  {
    id: 'egipto',
    name: localized('El Nilo y las pirámides', 'The Nile and the pyramids'),
    country: localized('Egipto', 'Egypt'),
    theme: localized('Arenas doradas y enigmas del pasado', 'Golden sands and puzzles from the past'),
    description: localized('El río legendario atraviesa el desierto y guarda secretos entre jeroglíficos.', 'A legendary river crosses the desert, with secrets hidden in hieroglyphs.'),
    coordinates: { x: 55, y: 45 },
  },
  {
    id: 'islandia',
    name: localized('Auroras y géiseres', 'Auroras and geysers'),
    country: localized('Islandia', 'Iceland'),
    theme: localized('Fuego y hielo en el borde del Ártico', 'Fire and ice at the edge of the Arctic'),
    description: localized('Cascadas, glaciares antiguos y luces que danzan en la noche.', 'Waterfalls, ancient glaciers and lights dancing across the night sky.'),
    coordinates: { x: 45, y: 22 },
  },
  {
    id: 'japon',
    name: localized('Monte Fuji y cerezos', 'Mount Fuji and cherry blossoms'),
    country: localized('Japón', 'Japan'),
    theme: localized('Jardines zen, templos y faroles rojos', 'Zen gardens, temples and red lanterns'),
    description: localized('La tradición, los cerezos en flor y la tecnología conviven en equilibrio.', 'Tradition, cherry blossoms and technology meet in balance.'),
    coordinates: { x: 82, y: 42 },
  },
];

export const MapScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [selectedDestId, setSelectedDestId] = useState(DESTINATIONS[0].id);
  const selectedDest = DESTINATIONS.find(({ id }) => id === selectedDestId) || DESTINATIONS[0];
  const isEnglish = locale === 'en';

  return (
    <section id="escena-mapa" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      {/* Light path beam across top transition */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEnglish ? 'Scene 02 — The map comes alive' : 'Escena 02 — El mapa cobra vida'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {isEnglish ? 'The map lights up. The world is calling.' : 'El mapa se ilumina. La Tierra te llama.'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {isEnglish
              ? 'As we travel, the map awakens. Every point leads to a real place, a living culture and a new discovery.'
              : 'A medida que avanzamos, la tinta del pergamino despierta. Cada punto es un país real, una cultura viva y un episodio de descubrimiento.'}
          </p>
        </div>

        {/* Interactive Stylized World Map Grid */}
        <div className="relative rounded-3xl bg-slate-900/90 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Constellation grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {/* Map Surface View */}
          <div className="relative w-full aspect-[16/9] min-h-[340px] max-h-[520px] rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* SVG Glowing Path connecting points */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 25 48 Q 35 30, 45 22 T 55 45 T 82 42"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-[dash_30s_linear_infinite]"
              />
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Interactive Pins */}
            {DESTINATIONS.map((dest) => {
              const isSelected = selectedDest.id === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  style={{
                    left: `${dest.coordinates.x}%`,
                    top: `${dest.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                  }`}
                  aria-label={isEnglish ? `Explore destination: ${dest.country[locale]}` : `Explorar destino: ${dest.country[locale]}`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 ring-offset-2 ring-offset-slate-950 scale-110'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform" />
                  </div>
                  <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] sm:text-xs font-bold text-white whitespace-nowrap shadow">
                    {dest.country[locale]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Destination Card Reveal */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                  {selectedDest.country[locale]}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{selectedDest.theme[locale]}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{selectedDest.name[locale]}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedDest.description[locale]}</p>
            </div>
            <div className="flex justify-end">
              <a
                href="#escena-amigos"
                className="w-full md:w-auto text-center px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                {isEnglish ? 'Meet the local guides' : 'Conocer a los guías locales'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
