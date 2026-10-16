'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import type { Character, Location } from '@curileta/cms';
import { Compass, Users, MapPin, Sparkles, Film, ArrowRight, Globe } from 'lucide-react';

interface LandingSeoUniverseIndexProps {
  locale: Locale;
  characters: Character[];
  locations: Location[];
}

export function LandingSeoUniverseIndex({
  locale,
  characters,
  locations,
}: LandingSeoUniverseIndexProps) {
  const isEn = locale === 'en';
  const [activeTab, setActiveTab] = useState<'all' | 'characters' | 'locations'>('all');

  const localizedText = (obj: { es: string; en?: string } | string | undefined): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[locale] || obj.es || '';
  };

  return (
    <section
      id="universo-serie-animada"
      aria-labelledby="seo-universe-title"
      className="relative isolate overflow-hidden border-t border-[var(--border-subtle)] bg-[#FAFDF7] px-5 py-24 text-[#20352c] transition-colors duration-500 dark:border-[#272727] dark:bg-[#141414] dark:text-white sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Film className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{isEn ? 'Spanish Animated Series & World Tour' : 'Serie animada española y viajes por el mundo'}</span>
            </div>

            <h2
              id="seo-universe-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              {isEn
                ? 'Characters, destinations and journeys of the Curileta series.'
                : 'Personajes, localizaciones y viajes de la serie Curileta.'}
            </h2>

            <p
              className="mt-4 max-w-2xl text-base leading-7 text-[#5c6b61] dark:text-slate-300"
              style={{ textWrap: 'pretty' }}
            >
              {isEn
                ? 'Curileta Adventures is an original Spanish animated series and illustrated universe designed to inspire curiosity about world geography, diverse cultures, and nature through the expeditions of Curileta, Pompon, and their international crew.'
                : 'Las Aventuras de Curileta es una serie animada original de producción española y universo ilustrado que fomenta la curiosidad por la geografía, las culturas y la naturaleza a través de los viajes de Curileta, Pompón y todos sus amigos del mundo.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-emerald-900/10 bg-white p-1.5 shadow-sm dark:border-[#313131] dark:bg-[#1F1F1F]">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                activeTab === 'all'
                  ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                  : 'text-slate-700 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {isEn ? 'All Universe' : 'Todo el universo'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('characters')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                activeTab === 'characters'
                  ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                  : 'text-slate-700 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isEn ? `Characters (${characters.length})` : `Personajes (${characters.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('locations')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                activeTab === 'locations'
                  ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                  : 'text-slate-700 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isEn ? `Destinations (${locations.length})` : `Destinos (${locations.length})`}</span>
            </button>
          </div>
        </div>

        {/* Characters Grid */}
        {(activeTab === 'all' || activeTab === 'characters') && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between border-b border-emerald-900/10 pb-4 dark:border-[#313131]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Users className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                    {isEn ? 'Characters of the animated series' : 'Personajes de la serie animada'}
                  </h3>
                  <p className="text-xs text-[#5c6b61] dark:text-slate-400">
                    {isEn
                      ? 'Explorers, companions and animal friends from each country'
                      : 'Exploradores, guardianes y amigos autóctonos de cada país'}
                  </p>
                </div>
              </div>

              <Link
                href={`/${locale}/personajes`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
              >
                <span>{isEn ? 'View all characters' : 'Ver todos los personajes'}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {characters.map((char) => {
                const desc = localizedText(char.shortDescription);
                return (
                  <Link
                    key={char.id || char.slug}
                    href={`/${locale}/personajes/${char.slug}`}
                    className="group flex flex-col items-center rounded-2xl border border-emerald-900/10 bg-white p-4 text-center shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-emerald-700/40 hover:shadow-md dark:border-[#313131] dark:bg-[#1F1F1F] dark:hover:border-emerald-500/50"
                  >
                    <div className="relative mb-3 aspect-square h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50/50 p-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                      <Image
                        src={char.mainImage?.url || '/images/hero/curileta-world-expedition-clean-v1.jpg'}
                        alt={char.name}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    </div>
                    <strong className="font-display text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-800 dark:text-white dark:group-hover:text-emerald-300">
                      {char.name}
                    </strong>
                    {desc && (
                      <span className="mt-1 line-clamp-2 text-[11px] leading-tight text-[#5c6b61] dark:text-slate-400">
                        {desc}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Locations Grid */}
        {(activeTab === 'all' || activeTab === 'locations') && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between border-b border-emerald-900/10 pb-4 dark:border-[#313131]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                    {isEn ? 'Travel destinations across continents' : 'Destinos y viajes por los continentes'}
                  </h3>
                  <p className="text-xs text-[#5c6b61] dark:text-slate-400">
                    {isEn
                      ? 'Real-world geography and cultural stops featured in Curileta’s route'
                      : 'Geografía real, paradas culturales y países visitados en la expedición'}
                  </p>
                </div>
              </div>

              <Link
                href={`/${locale}/destinos`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
              >
                <span>{isEn ? 'Explore all destinations' : 'Explorar todos los destinos'}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {locations.map((loc) => {
                const locName = localizedText(loc.name);
                const countryName = localizedText(loc.country);
                return (
                  <Link
                    key={loc.id || loc.slug}
                    href={`/${locale}/destinos/${loc.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-emerald-700/40 hover:shadow-md dark:border-[#313131] dark:bg-[#1F1F1F] dark:hover:border-emerald-500/50"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <MapPin className="h-3 w-3" />
                          <span>{countryName}</span>
                        </span>
                      </div>
                      <strong className="block font-display text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-800 dark:text-white dark:group-hover:text-emerald-300">
                        {locName}
                      </strong>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-700 group-hover:underline dark:text-emerald-400">
                      <span>{isEn ? 'View guide' : 'Ver destino'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Series Highlights Card */}
        <div className="mt-14 rounded-2xl border border-emerald-900/10 bg-emerald-950/90 p-8 text-white shadow-xl dark:border-[#313131] dark:bg-[#1B2925]">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-white">
                  {isEn ? 'Spanish Animated Series' : 'Producción española original'}
                </h4>
                <p className="mt-1 text-xs leading-5 text-emerald-100/80">
                  {isEn
                    ? 'Created in Spain with international values, culturally rich storytelling, and family-first pacing.'
                    : 'Serie de animación concebida y creada en España con doblaje neutro, rica en valores culturales y ritmo adaptado a la infancia.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-white">
                  {isEn ? 'World Travel & Geography' : 'Viajes por los cinco continentes'}
                </h4>
                <p className="mt-1 text-xs leading-5 text-emerald-100/80">
                  {isEn
                    ? 'Each episode and chapter visits authentic historical landmarks, geography, and world wonders.'
                    : 'Cada capítulo y libro transporta a los niños a monumentos, paisajes reales y maravillas del mundo para aprender jugando.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-400/20 text-rose-300">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-white">
                  {isEn ? 'Episodes, Songs & Books' : 'Episodios, canciones y libros'}
                </h4>
                <p className="mt-1 text-xs leading-5 text-emerald-100/80">
                  {isEn
                    ? 'Complete audiovisual ecosystem: free YouTube streaming episodes, music, illustrated books, and crafts.'
                    : 'Ecosistema audiovisual completo: episodios en YouTube, canciones infantiles, libros ilustrados en tapa dura y recortables.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
