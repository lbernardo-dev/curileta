'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import type { CollaborationOpportunity } from '@curileta/cms';
import { Briefcase, Building2, Newspaper, Award, ArrowRight } from 'lucide-react';

interface CollaborationsSceneProps {
  locale: Locale;
  collaborations?: CollaborationOpportunity[];
}

export const CollaborationsScene: React.FC<CollaborationsSceneProps> = ({ locale, collaborations = [] }) => {
  const isEn = locale === 'en';

  const iconMap: Record<string, React.ReactNode> = {
    Building2: <Building2 className="w-6 h-6 text-emerald-400" />,
    Award: <Award className="w-6 h-6 text-amber-400" />,
    Newspaper: <Newspaper className="w-6 h-6 text-sky-400" />,
    Briefcase: <Briefcase className="w-6 h-6 text-emerald-400" />,
  };

  return (
    <section className="relative z-10 py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 border border-emerald-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-xl dark:shadow-2xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
              <Briefcase className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{isEn ? 'Scene 09 — Professional Alliances & Licensing' : 'Escena 09 — Alianzas Profesionales & Licencias'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Growing with the best partners' : 'Creciendo junto a los mejores socios'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'A universe of universal values, global appeal, and rigorous narrative care. Built to partner with publishers, ethical brands, and educational institutions.'
                : 'Un universo de valores universales, con vocación global y rigurosa calidad narrativa. Diseñado para colaborar con sellos editoriales, marcas éticas y plataformas educativas.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            {collaborations.map((c) => {
              const title = isEn ? c.title.en || c.title.es : c.title.es;
              const desc = isEn ? c.desc.en || c.desc.es : c.desc.es;
              const icon = iconMap[c.iconName] || <Building2 className="w-6 h-6 text-emerald-400" />;

              return (
                <div key={c.id || title} className="p-6 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-900 flex items-center justify-center mb-3">
                    {icon}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href={`/${locale}/colaboraciones`}
              className="px-8 py-3.5 rounded-full font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg transition-all flex items-center gap-2"
            >
              <span>{isEn ? 'Discuss a collaboration' : 'Hablar sobre una colaboración'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${locale}/prensa`}
              className="px-8 py-3.5 rounded-full font-bold text-sm bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 transition-all shadow-sm"
            >
              {isEn ? 'Request press information' : 'Solicitar información de prensa'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
