import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { cmsProvider } from '@curileta/cms';
import { Youtube, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canal Oficial de YouTube — Las Aventuras de Curileta',
  description: 'Mira los capítulos de la serie animada, videoclips oficiales y Shorts de Curileta en YouTube.',
};

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const videos = await cmsProvider.getVideos(locale);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="pt-16 sm:pt-24 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          El Canal de YouTube Oficial
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          Capítulos completos de la serie, vídeos musicales con coreografías y divertidos YouTube Shorts en formato vertical.
        </p>
      </div>

      <YouTubeScene locale={locale as Locale} videos={videos} hideHeader={true} />
    </div>
  );
}
