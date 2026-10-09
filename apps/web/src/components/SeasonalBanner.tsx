'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { Sparkles, Calendar, ChevronRight, Palette, Eye } from 'lucide-react';

export const SeasonalBanner: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { activeEvent, isSeasonalActive, isUserDismissed, toggleSeasonalTheme } = useSeasonalTheme();

  // Si no hay evento estacional programado o activo, no renderiza nada
  if (!activeEvent || !activeEvent.active) {
    return null;
  }

  const isEn = locale === 'en';

  return (
    <div
      role="banner"
      aria-label={isEn ? 'Seasonal Event Announcement' : 'Aviso de Evento Estacional'}
      className="w-full bg-gradient-to-r from-[#1e0b2e] via-[#35144b] to-[#1e0b2e] border-b border-orange-500/30 text-white text-xs sm:text-sm py-2 px-3 sm:px-6 relative z-50 shadow-md shadow-orange-950/30 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Lado izquierdo: Información del evento temporal */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
            <span>🎃</span>
            <span>{isEn ? 'Temporary Event' : 'Evento Temporal'}</span>
          </span>

          <span className="font-bold text-slate-100 flex items-center gap-1.5">
            <span>
              {isEn
                ? 'Halloween Special: The Enchanted Pumpkin Patch'
                : 'Especial de Halloween: El Huerto de Calabazas Encantadas'}
            </span>
            <span className="text-orange-400 font-normal hidden md:inline">
              {isEn ? '(Active until Nov 5)' : '(Activo hasta el 5 de Noviembre)'}
            </span>
          </span>
        </div>

        {/* Lado derecho: Acciones (Ir al evento & Alternar con tema original) */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
          <a
            href="#evento-halloween"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-md shadow-orange-500/30 transition-all hover:scale-105"
          >
            <span>{isEn ? 'Explore Event' : 'Explorar Evento'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>

          {/* Botón para alternar entre el tema de Halloween y el tema original */}
          <button
            onClick={toggleSeasonalTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-[11px] font-bold transition-all"
            title={
              isEn
                ? isUserDismissed
                  ? 'Switch back to Halloween Theme'
                  : 'Temporarily switch to Original Forest Theme'
                : isUserDismissed
                ? 'Volver a activar el Tema Halloween'
                : 'Probar el Tema Original del Bosque'
            }
          >
            <Palette className="w-3 h-3 text-amber-300" />
            <span>
              {isUserDismissed
                ? isEn
                  ? '🎃 Enable Halloween Theme'
                  : '🎃 Activar Tema Halloween'
                : isEn
                ? '🌲 View Original Theme'
                : '🌲 Ver Tema Original'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
