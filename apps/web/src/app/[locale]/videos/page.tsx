import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { cmsProvider } from '@/lib/cms';
import { Youtube, ExternalLink } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Videos', description: 'Watch published episodes and videos from Curileta’s official channel.' }
    : { title: 'Vídeos', description: 'Mira los episodios y vídeos publicados en el canal oficial de Curileta.' };
}

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
  const isEn = locale === 'en';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="pt-16 sm:pt-24 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {isEn ? 'The Official YouTube Channel' : 'El Canal de YouTube Oficial'}
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {isEn
            ? 'Published episodes, music videos and Shorts to enjoy as a family.'
            : 'Episodios publicados, vídeos musicales y Shorts para disfrutar en familia.'}
        </p>
      </div>

      <YouTubeScene locale={locale as Locale} videos={videos} hideHeader={true} />
    </div>
  );
}
