import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { WallpapersScene } from '@/features/wallpapers/WallpapersScene';
import { cmsProvider } from '@curileta/cms';
import { Sparkles, Download } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Wallpapers', description: 'Download Curileta illustrations prepared for mobile and desktop screens.' }
    : { title: 'Fondos de pantalla', description: 'Descarga ilustraciones de Curileta preparadas para móvil y escritorio.' };
}

export default async function FondosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const wallpapers = await cmsProvider.getWallpapers(locale);
  const isEn = locale === 'en';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="pt-16 sm:pt-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{isEn ? 'Free screen art' : 'Ilustraciones para tus pantallas'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {isEn ? 'Curileta wallpapers' : 'Fondos de Curileta'}
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {isEn
            ? 'Bring Curileta’s adventures to your phone, tablet or computer.'
            : 'Lleva las aventuras de Curileta a tu móvil, tableta u ordenador.'}
        </p>
      </div>

      <WallpapersScene locale={locale as Locale} wallpapers={wallpapers} hideHeader={true} />
    </div>
  );
}
