'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';
import { SectionEmblem } from '@/components/SectionEmblem';

export const ClosingScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const isEn = locale === 'en';

  return (
    <section
      id="cierre-expedicion"
      className="relative z-10 py-32 bg-gradient-to-b from-white via-emerald-50/40 to-slate-100 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden text-center"
    >
      {/* Horizon glow */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(16,185,129,0.25),transparent)] pointer-events-none" />

      {/* The golden light path leading to the horizon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-36 bg-gradient-to-b from-amber-400 via-emerald-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.8)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionEmblem icon={Compass} tone="emerald" label={isEn ? 'The journey home' : 'El camino de regreso a casa'} />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{isEn ? 'The end of this chapter' : 'El final de esta aventura'}</span>
        </div>

        <h2 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          {isEn ? 'The greatest treasure is finding your way home.' : 'El mayor tesoro es volver a casa.'}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-emerald-100/90 sm:text-lg">
          {isEn
            ? 'After crossing the world, Curileta discovers that the place she missed most was home, beside her friend Pompón.'
            : 'Después de recorrer el mundo, Curileta descubre que el lugar que más echaba de menos era su hogar, junto a Pompón.'}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}/libros/las-aventuras-de-curileta`}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-amber-300"
          >
            <BookOpen className="h-4 w-4 text-emerald-950" />
            <span>{isEn ? 'Read the story' : 'Conocer el libro'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/mundo`}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-emerald-900/20 bg-white/75 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Compass className="h-4 w-4" />
            <span>{isEn ? 'Explore the atlas again' : 'Volver a explorar el atlas'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
