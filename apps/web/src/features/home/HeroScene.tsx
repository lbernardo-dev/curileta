'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Button } from '@curileta/design-system';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { Sparkles, MapPin, Compass, ArrowDown } from 'lucide-react';

export const HeroScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { isSeasonalActive, themeKey } = useSeasonalTheme();
  const isEn = locale === 'en';
  const isHalloween = isSeasonalActive && themeKey === 'halloween';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-100/90 via-emerald-50 to-emerald-100/80 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-950 text-slate-900 dark:text-white px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Dynamic ambient background glow & forest mist (warm pumpkin tint when Halloween theme is active) */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isHalloween
            ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.18),rgba(255,255,255,0))]'
            : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.25),rgba(255,255,255,0))]'
        }`}
      />
      
      {/* Decorative floating fireflies / magical particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-300 animate-pulse blur-[1px]" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-300 animate-pulse delay-700 blur-[1px]" />
        <div className="absolute top-2/3 left-1/3 w-2.5 h-2.5 rounded-full bg-sky-400 dark:bg-sky-300 animate-pulse delay-1000 blur-[1px]" />
        <div className="absolute bottom-1/4 right-1/6 w-2 h-2 rounded-full bg-amber-300 dark:bg-amber-200 animate-pulse delay-500 blur-[1px]" />
        {isHalloween && (
          <>
            <div className="absolute top-1/5 right-1/6 text-xl animate-bounce delay-300 opacity-60">
              🎃
            </div>
            <div className="absolute bottom-1/3 left-1/8 text-lg animate-pulse delay-700 opacity-50">
              🍂
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-md shadow-md transition-all duration-500 ${
            isHalloween
              ? 'bg-orange-500/20 dark:bg-orange-950/70 border-orange-500/50 text-orange-900 dark:text-orange-200'
              : 'bg-emerald-200/80 dark:bg-emerald-800/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <Sparkles
            className={`w-4 h-4 animate-spin ${
              isHalloween ? 'text-orange-500 dark:text-orange-400' : 'text-amber-500 dark:text-amber-400'
            }`}
            style={{ animationDuration: '6s' }}
          />
          <span>
            {isHalloween
              ? isEn
                ? 'The Enchanted Forest — Halloween Season 🎃'
                : 'El Bosque Encantado — Especial de Halloween 🎃'
              : isEn
              ? 'The Enchanted Forest — Starting Point'
              : 'El Bosque Encantado — Punto de Partida'}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-emerald-900 to-emerald-700 dark:from-white dark:via-emerald-100 dark:to-emerald-300 drop-shadow-sm max-w-4xl">
          Un mundo por descubrir<span className="text-amber-500">.</span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-emerald-950/80 dark:text-emerald-100/90 font-medium max-w-2xl leading-relaxed">
          Curileta abre su mapa mágico. El viento susurra nuevos destinos y la mayor aventura de tu vida está a un scroll de distancia.
        </p>

        {/* Interactive Curileta 3D Hero Character with Companion Peeks */}
        <div className="relative my-8 group cursor-pointer flex items-center justify-center">
          {/* Pompón peeking on the left */}
          <div className="hidden md:flex absolute -left-28 lg:-left-36 top-1/2 -translate-y-1/2 flex-col items-center group/pompon hover:scale-110 transition-transform duration-300">
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-300 p-1 shadow-xl shadow-sky-500/20 rotate-[-8deg]">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/characters/pompon-main.webp"
                  alt="Pompón"
                  className="w-20 h-20 lg:w-24 lg:h-24 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] group-hover/pompon:scale-115 transition-transform"
                />
              </div>
            </div>
            <span className="mt-2 text-[10px] font-black uppercase tracking-wider bg-sky-200 dark:bg-sky-950 text-sky-900 dark:text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/40 shadow-sm">
              🐰 Pompón
            </span>
          </div>

          {/* Curileta Main 3D Avatar */}
          <div className="relative w-56 h-56 sm:w-68 sm:h-68 rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-teal-300 p-2 shadow-[0_20px_50px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-all duration-500">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 flex flex-col items-center justify-end p-2 border-2 border-emerald-400/50 relative overflow-hidden">
              <img
                src="/images/characters/curileta-main.webp"
                alt="Curileta la Lagartija Exploradora"
                className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-radial-to-t from-emerald-500/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Quetzal peeking on the right */}
          <div className="hidden md:flex absolute -right-28 lg:-right-36 top-1/2 -translate-y-1/2 flex-col items-center group/quetzal hover:scale-110 transition-transform duration-300">
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-tr from-teal-400 to-amber-300 p-1 shadow-xl shadow-teal-500/20 rotate-[8deg]">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/characters/quetzal-main.webp"
                  alt="Quetzal"
                  className="w-20 h-20 lg:w-24 lg:h-24 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)] group-hover/quetzal:scale-115 transition-transform"
                />
              </div>
            </div>
            <span className="mt-2 text-[10px] font-black uppercase tracking-wider bg-teal-200 dark:bg-teal-950 text-teal-900 dark:text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-400/40 shadow-sm">
              🦜 Quetzal
            </span>
          </div>

          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 text-emerald-950 text-xs sm:text-sm font-black px-6 py-2 rounded-full shadow-[0_6px_16px_rgba(245,158,11,0.4)] whitespace-nowrap border-2 border-amber-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-900" />
            <span>
              {isHalloween
                ? isEn
                  ? 'Hi, I’m Curileta! 👋 🎃'
                  : '¡Hola, soy Curileta! 👋 🎃'
                : isEn
                ? 'Hi, I’m Curileta! 👋'
                : '¡Hola, soy Curileta! 👋'}
            </span>
          </div>
        </div>

        {/* CTAs con botones táctiles 3D estilo Toybox */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <a
            href="#escena-mapa"
            className="px-9 py-4 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 border-b-4 border-amber-600 hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-[4px] shadow-[0_8px_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center gap-2.5"
          >
            <Compass className="w-5 h-5 text-emerald-950" />
            <span>Comenzar la Aventura</span>
          </a>
          <Link
            href={`/${locale}/curileta`}
            className="px-9 py-4 rounded-2xl font-bold text-base sm:text-lg bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 border-2 border-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/30 backdrop-blur-md hover:scale-105 active:scale-95 transition-all shadow-md"
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
