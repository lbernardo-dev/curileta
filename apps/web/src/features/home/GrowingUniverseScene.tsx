'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import type { UniverseRoadmapItem } from '@curileta/cms';
import { Sparkles, Book, Music, ShoppingBag, Calendar, Users, Radio } from 'lucide-react';

interface GrowingUniverseSceneProps {
  locale: Locale;
  items?: UniverseRoadmapItem[];
}

export const GrowingUniverseScene: React.FC<GrowingUniverseSceneProps> = ({ locale, items = [] }) => {
  const isEn = locale === 'en';

  const iconMap: Record<string, React.ReactNode> = {
    Book: <Book className="w-6 h-6 text-amber-400" />,
    Music: <Music className="w-6 h-6 text-emerald-400" />,
    Calendar: <Calendar className="w-6 h-6 text-sky-400" />,
    ShoppingBag: <ShoppingBag className="w-6 h-6 text-rose-400" />,
    Users: <Users className="w-6 h-6 text-indigo-400" />,
    Sparkles: <Sparkles className="w-6 h-6 text-amber-400" />,
    Radio: <Radio className="w-6 h-6 text-teal-400" />,
  };

  return (
    <section className="relative z-10 py-28 bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-emerald-50/60 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{isEn ? 'Scene 08 — The Universe Keeps Growing' : 'Escena 08 — El Universo Sigue Creciendo'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {isEn ? 'More than a story: a living expedition' : 'Más que una historia: una expedición viva'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-emerald-100/80">
            {isEn
              ? "The world of Curileta expands into physical and digital experiences designed for children's imagination."
              : 'El mundo de Curileta se ramifica en nuevas experiencias físicas y digitales para acompañar el crecimiento de los niños.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((b) => {
            const title = isEn ? b.title.en || b.title.es : b.title.es;
            const desc = isEn ? b.desc.en || b.desc.es : b.desc.es;
            const badge = isEn ? b.badge.en || b.badge.es : b.badge.es;
            const icon = iconMap[b.iconName] || <Sparkles className="w-6 h-6 text-emerald-400" />;

            return (
              <div
                key={b.id || title}
                className="rounded-3xl bg-white dark:bg-slate-900/70 border border-emerald-200 dark:border-emerald-500/20 p-6 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-400/50 hover:bg-emerald-50/30 dark:hover:bg-slate-900 transition-all shadow-lg dark:shadow-xl group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-950 border border-emerald-100 dark:border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-slate-400 bg-emerald-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-3 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
