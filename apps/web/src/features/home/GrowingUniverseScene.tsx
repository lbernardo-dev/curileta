'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import type { UniverseRoadmapItem } from '@curileta/cms';
import { Sparkles, Book, Music, ShoppingBag, Calendar, Users, Radio } from 'lucide-react';
import { SectionEmblem } from '@/components/SectionEmblem';

interface GrowingUniverseSceneProps {
  locale: Locale;
  items?: UniverseRoadmapItem[];
}

export const GrowingUniverseScene: React.FC<GrowingUniverseSceneProps> = ({ locale, items = [] }) => {
  const isEn = locale === 'en';

  const iconMap: Record<string, React.ReactNode> = {
    Book: <Book className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
    Music: <Music className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    Calendar: <Calendar className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
    ShoppingBag: <ShoppingBag className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
    Users: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    Sparkles: <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
    Radio: <Radio className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
  };

  return (
    <section className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)] bg-[#FAFDF7] px-5 py-24 text-slate-900 transition-colors duration-500 dark:border-[#272727] dark:bg-[#181818] dark:text-white sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <SectionEmblem icon={Sparkles} tone="emerald" label={isEn ? 'The expanding universe' : 'El universo en expansión'} />
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {isEn ? 'More than a story: a living expedition' : 'Más que una historia: una expedición viva'}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            {isEn
              ? "The world of Curileta expands into physical and digital experiences designed for children's imagination."
              : 'El mundo de Curileta se ramifica en nuevas experiencias físicas y digitales para acompañar el crecimiento de los niños.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((b) => {
            const title = isEn ? b.title.en || b.title.es : b.title.es;
            const desc = isEn ? b.desc.en || b.desc.es : b.desc.es;
            const badge = isEn ? b.badge.en || b.badge.es : b.badge.es;
            const icon = iconMap[b.iconName] || <Sparkles className="h-6 w-6 text-emerald-500" />;

            return (
              <div
                key={b.id || title}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl dark:border-[#313131] dark:bg-[#1F1F1F] dark:hover:border-emerald-400/40"
              >
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 dark:border-[#272727] dark:bg-[#181818]">
                    {icon}
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:bg-[#272727] dark:text-emerald-300">
                    {badge}
                  </span>
                  <h3 className="mb-2 mt-3 font-display text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
