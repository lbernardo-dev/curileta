'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Compass, Sparkles, Youtube, BookOpen, ArrowUp } from 'lucide-react';

export const ClosingScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Escena 10 — Cierre del Círculo Narrativo</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
          ¿Seguimos explorando?
        </h2>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          El mapa nunca se cierra del todo; solo espera la próxima mirada curiosa. Regresamos al Bosque Encantado para planear la siguiente expedición.
        </p>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            href={`/${locale}/libros`}
            className="px-7 py-3.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-emerald-950" />
            <span>Descubrir los Libros</span>
          </Link>
          <a
            href="https://www.youtube.com/@curileta"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full font-bold text-sm bg-red-600 hover:bg-red-500 text-white shadow-xl transition-all flex items-center gap-2"
          >
            <Youtube className="w-4 h-4" />
            <span>Ver Episodios en YouTube</span>
          </a>
          <button
            onClick={scrollToTop}
            className="px-6 py-3.5 rounded-full font-bold text-sm bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>
    </section>
  );
};
