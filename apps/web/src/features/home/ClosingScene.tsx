'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { ArrowRight, BookOpen, Compass } from 'lucide-react';
import { SectionEmblem } from '@/components/SectionEmblem';

export const ClosingScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const isEn = locale === 'en';

  return (
    <section
      id="cierre-expedicion"
      className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)] bg-[#FAFDF7] px-5 py-24 text-center text-slate-900 transition-colors duration-500 dark:border-[#272727] dark:bg-[#181818] dark:text-white sm:px-8 sm:py-32 lg:px-12"
    >
      {/* Horizon glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(16,185,129,0.15),transparent)]" />

      {/* The golden light path leading to the horizon */}
      <div className="absolute left-1/2 top-0 h-28 w-0.5 -translate-x-1/2 bg-gradient-to-b from-amber-400 via-emerald-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.6)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <SectionEmblem icon={Compass} tone="emerald" label={isEn ? 'The journey home' : 'El camino de regreso a casa'} />

        <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          {isEn ? 'The greatest treasure is finding your way home.' : 'El mayor tesoro es volver a casa.'}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
          {isEn
            ? 'After crossing the world, Curileta discovers that the place she missed most was home, beside her friend Pompón.'
            : 'Después de recorrer el mundo, Curileta descubre que el lugar que más echaba de menos era su hogar, junto a Pompón.'}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}/libros/las-aventuras-de-curileta`}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <BookOpen className="h-4 w-4 text-emerald-950" />
            <span>{isEn ? 'Read the story' : 'Conocer el libro'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/mundo`}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-white dark:hover:bg-[#272727]"
          >
            <Compass className="h-4 w-4" />
            <span>{isEn ? 'Explore the atlas again' : 'Volver a explorar el atlas'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
