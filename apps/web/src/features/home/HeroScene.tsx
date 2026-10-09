'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Button } from '@curileta/design-system';
import { Sparkles, MapPin, Compass, ArrowDown } from 'lucide-react';

export const HeroScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-100/90 via-emerald-50 to-emerald-100/80 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-950 text-slate-900 dark:text-white px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Dynamic ambient background glow & forest mist */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.25),rgba(255,255,255,0))]" />
      
      {/* Decorative floating fireflies / magical particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-300 animate-pulse blur-[1px]" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-300 animate-pulse delay-700 blur-[1px]" />
        <div className="absolute top-2/3 left-1/3 w-2.5 h-2.5 rounded-full bg-sky-400 dark:bg-sky-300 animate-pulse delay-1000 blur-[1px]" />
        <div className="absolute bottom-1/4 right-1/6 w-2 h-2 rounded-full bg-amber-300 dark:bg-amber-200 animate-pulse delay-500 blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-200/80 dark:bg-emerald-800/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-md shadow-md">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>El Bosque Encantado — Punto de Partida</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-emerald-900 to-emerald-700 dark:from-white dark:via-emerald-100 dark:to-emerald-300 drop-shadow-sm max-w-4xl">
          Un mundo por descubrir<span className="text-amber-500">.</span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-emerald-950/80 dark:text-emerald-100/90 font-medium max-w-2xl leading-relaxed">
          Curileta abre su mapa mágico. El viento susurra nuevos destinos y la mayor aventura de tu vida está a un scroll de distancia.
        </p>

        {/* Interactive Curileta Emblem / Hero Figure preview */}
        <div className="relative my-8 group cursor-pointer">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-400 to-emerald-300 p-1 shadow-2xl shadow-emerald-500/30 group-hover:scale-105 transition-all duration-500">
            <div className="w-full h-full rounded-full bg-emerald-950 flex flex-col items-center justify-center p-4 border border-emerald-400/30 relative overflow-hidden">
              <Compass className="w-20 h-20 text-emerald-400 group-hover:rotate-90 transition-transform duration-700" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 mt-2">
                Mapa en Mano
              </span>
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-950 text-xs font-black px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
            ¡Hola, soy Curileta! 👋
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <a
            href="#escena-mapa"
            className="px-8 py-4 rounded-full font-extrabold text-base sm:text-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-5 h-5 text-emerald-900" />
            <span>Comenzar la Aventura</span>
          </a>
          <Link
            href={`/${locale}/curileta`}
            className="px-8 py-4 rounded-full font-bold text-base sm:text-lg bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 border border-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            Conoce a Curileta
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 flex flex-col items-center gap-2 text-emerald-800 dark:text-emerald-300/70 animate-bounce">
          <span className="text-xs font-bold uppercase tracking-widest">Sigue el sendero luminoso</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
};
