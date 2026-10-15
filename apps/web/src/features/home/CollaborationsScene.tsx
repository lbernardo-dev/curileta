'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import type { CollaborationOpportunity } from '@curileta/cms';
import { Briefcase, Building2, Newspaper, Award, ArrowRight } from 'lucide-react';
import { SectionEmblem } from '@/components/SectionEmblem';

interface CollaborationsSceneProps {
  locale: Locale;
  collaborations?: CollaborationOpportunity[];
}

export const CollaborationsScene: React.FC<CollaborationsSceneProps> = ({ locale, collaborations = [] }) => {
  const isEn = locale === 'en';

  const iconMap: Record<string, React.ReactNode> = {
    Building2: <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    Award: <Award className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
    Newspaper: <Newspaper className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
    Briefcase: <Briefcase className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
  };

  return (
    <section className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)] bg-[#F4F7F1] px-5 py-24 text-slate-900 transition-colors duration-500 dark:border-[#272727] dark:bg-[#1F1F1F] dark:text-white sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-[#313131] dark:bg-[#181818] sm:p-12 lg:p-16">
          <div className="max-w-3xl">
            <SectionEmblem icon={Briefcase} tone="emerald" label={isEn ? 'Alliances & Licensing' : 'Alianzas y licencias'} />
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              {isEn ? 'Growing with the best partners' : 'Creciendo junto a los mejores socios'}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {isEn
                ? 'A universe of universal values, global appeal, and rigorous narrative care. Built to partner with publishers, ethical brands, and educational institutions.'
                : 'Un universo de valores universales, con vocación global y rigurosa calidad narrativa. Diseñado para colaborar con sellos editoriales, marcas éticas y plataformas educativas.'}
            </p>
          </div>

          <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {collaborations.map((c) => {
              const title = isEn ? c.title.en || c.title.es : c.title.es;
              const desc = isEn ? c.desc.en || c.desc.es : c.desc.es;
              const icon = iconMap[c.iconName] || <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;

              return (
                <div key={c.id || title} className="space-y-3 rounded-2xl border border-slate-200/80 bg-[#FAFDF7] p-6 shadow-sm dark:border-[#313131] dark:bg-[#1F1F1F]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 dark:border-[#272727] dark:bg-[#181818]">
                    {icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
            <Link
              href={`/${locale}/colaboraciones`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              <span>{isEn ? 'Discuss a collaboration' : 'Hablar sobre una colaboración'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/prensa`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-slate-200 dark:hover:bg-[#272727]"
            >
              {isEn ? 'Request press information' : 'Solicitar información de prensa'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
