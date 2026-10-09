import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { WallpapersScene } from '@/features/wallpapers/WallpapersScene';
import { cmsProvider } from '@curileta/cms';
import { Sparkles, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fondos de Pantalla 2K Oficiales — Las Aventuras de Curileta',
  description:
    'Descarga fondos de pantalla oficiales en resolución 2K Ultra HD para móviles y ordenadores. Personajes 3D, mapas e ilustraciones de Curileta.',
};

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

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <div className="pt-16 sm:pt-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Descargas Gratuitas en Alta Fidelidad</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Fondos de Pantalla 2K
        </h1>
        <p className="mt-4 text-slate-300 text-base sm:text-lg">
          Viste la pantalla de tu smartphone, tablet o portátil con las aventuras de Curileta, Pompón y sus amigos por el mundo.
        </p>
      </div>

      <WallpapersScene locale={locale as Locale} wallpapers={wallpapers} />
    </div>
  );
}
