'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { Globe, MapPin, Compass, BookOpen, Youtube, Music, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface WorldLocation {
  id: string;
  name: string;
  country: string;
  flag: string;
  heroImage: string;
  description: string;
  characterId: string;
  characterName: string;
  bookId: string;
  bookTitle: string;
  curiosities: string[];
  coordinates: { x: number; y: number };
}

const WORLD_DESTINATIONS: WorldLocation[] = [
  {
    id: 'mexico',
    name: 'Teotihuacán y las Selvas del Sureste',
    country: 'México',
    flag: '🇲🇽',
    heroImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1000&auto=format&fit=crop&q=80',
    description: 'Tierra de pirámides sagradas, jaguares y el vuelo sagrado del Quetzal. Aquí Curileta descubre los primeros enigmas del mapa.',
    characterId: 'quetzal',
    characterName: 'Quetzal',
    bookId: 'el-misterio-del-quetzal',
    bookTitle: 'El Misterio del Quetzal Dorado',
    curiosities: [
      'Las pirámides fueron construidas con perfecta alineación con las estrellas.',
      'El cacao se utilizaba antiguamente como semilla sagrada y moneda de intercambio.',
    ],
    coordinates: { x: 22, y: 46 },
  },
  {
    id: 'peru',
    name: 'Valle Sagrado y Machu Picchu',
    country: 'Perú',
    flag: '🇵🇪',
    heroImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&auto=format&fit=crop&q=80',
    description: 'Las imponentes cumbres de los Andes donde las nubes abrazan antiguas ciudades de piedra y los cóndores vigilan las alturas.',
    characterId: 'curileta',
    characterName: 'Curileta',
    bookId: 'el-misterio-del-quetzal',
    bookTitle: 'El Misterio del Quetzal Dorado',
    curiosities: [
      'Los antiguos chasquis recorrían miles de kilómetros a pie llevando mensajes en quipus.',
      'En los Andes crecen más de 4.000 variedades de patatas multicolores.',
    ],
    coordinates: { x: 28, y: 65 },
  },
  {
    id: 'egipto',
    name: 'El Gran Río Nilo y las Pirámides de Guiza',
    country: 'Egipto',
    flag: '🇪🇬',
    heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1000&auto=format&fit=crop&q=80',
    description: 'Arenas bañadas por el sol dorado donde las aguas del Nilo dan vida a templos monumentales y misterios jeroglíficos.',
    characterId: 'pompon',
    characterName: 'Pompón',
    bookId: 'el-misterio-del-quetzal',
    bookTitle: 'El Misterio del Quetzal Dorado',
    curiosities: [
      'Los gatos eran considerados guardianes sagrados del hogar.',
      'El Nilo es el río que inspiró una de las civilizaciones más duraderas de la humanidad.',
    ],
    coordinates: { x: 54, y: 44 },
  },
  {
    id: 'islandia',
    name: 'Geysir y los Glaciares del Norte',
    country: 'Islandia',
    flag: '🇮🇸',
    heroImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1000&auto=format&fit=crop&q=80',
    description: 'La isla de fuego y hielo. Fuentes de agua hirviente expulsadas al cielo y auroras boreales que iluminan las noches glaciares.',
    characterId: 'lulu',
    characterName: 'Lulú',
    bookId: 'las-auroras-de-hielo',
    bookTitle: 'Las Auroras del Confín Helado',
    curiosities: [
      'No hay mosquitos en toda la isla debido a su ecosistema único.',
      'Muchas familias creen en la existencia de los "huldufólk" (el pueblo oculto de los elfos).',
    ],
    coordinates: { x: 44, y: 20 },
  },
  {
    id: 'japon',
    name: 'Kioto y el Monte Fuji',
    country: 'Japón',
    flag: '🇯🇵',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80',
    description: 'Bosques de bambú, templos ancestrales bajo cerezos en flor y linternas rojas que guían a los caminantes hacia la serenidad.',
    characterId: 'curileta',
    characterName: 'Curileta',
    bookId: 'el-misterio-del-quetzal',
    bookTitle: 'El Misterio del Quetzal Dorado',
    curiosities: [
      'El Monte Fuji es un volcán sagrado considerado símbolo de equilibrio espiritual.',
      'En los jardines zen cada piedra y grano de arena representa el fluir del agua.',
    ],
    coordinates: { x: 84, y: 42 },
  },
];

export default function WorldExplorerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [activeLocation, setActiveLocation] = useState<WorldLocation>(WORLD_DESTINATIONS[0]);
  const [resolvedLocale, setResolvedLocale] = useState<Locale>('es');

  React.useEffect(() => {
    params.then((p) => {
      if (isValidLocale(p.locale)) {
        setResolvedLocale(p.locale);
      }
    });
  }, [params]);

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>El Mundo de Curileta — Atlas Interactivo</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Explora cada rincón del planeta
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Selecciona un destino para descubrir sus monumentos, tradiciones, personajes vinculados y el libro donde transcurre la expedición.
          </p>
        </div>

        {/* Interactive Stylized World Map Grid */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden mb-12">
          {/* Map Surface View */}
          <div className="relative w-full aspect-[2/1] min-h-[320px] max-h-[500px] rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

            {/* Pins */}
            {WORLD_DESTINATIONS.map((loc) => {
              const isSelected = activeLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group cursor-pointer ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                  }`}
                  aria-label={`Destino: ${loc.name}`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-2xl font-black text-sm transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/50 scale-110'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    <span>{loc.flag}</span>
                  </div>
                  <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-700 text-xs font-bold text-white whitespace-nowrap shadow-md">
                    {loc.country}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Destination Detail Card */}
          <div className="mt-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 p-8 sm:p-10 flex flex-col lg:flex-row gap-10 items-center">
            {/* Scenic Image */}
            <div className="w-full lg:w-96 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 shrink-0 relative group">
              <img
                src={activeLocation.heroImage}
                alt={activeLocation.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-400">
                {activeLocation.flag} {activeLocation.country}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 flex-1">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Destino Oficial de la Expedición
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                  {activeLocation.name}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeLocation.description}
              </p>

              {/* Curiosities */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  💡 Curiosidades para pequeños exploradores:
                </h3>
                <ul className="space-y-1.5">
                  {activeLocation.curiosities.map((c, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cross references */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${resolvedLocale}/personajes/${activeLocation.characterId}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Amigo local: {activeLocation.characterName}</span>
                </Link>
                <Link
                  href={`/${resolvedLocale}/libros/${activeLocation.bookId}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                  <span>Ver libro: {activeLocation.bookTitle}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
