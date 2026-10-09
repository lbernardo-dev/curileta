import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { Youtube, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vídeos y Canciones Oficiales — Las Aventuras de Curileta',
  description: 'Mira los episodios animados oficiales, trailers y canciones del canal de YouTube de Curileta.',
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

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <div className="pt-16 sm:pt-24 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          El Canal Audiovisual
        </h1>
        <p className="mt-4 text-slate-300 text-base sm:text-lg">
          Episodios, videoclips y cortos musicales pensados para aprender y reír en familia.
        </p>
      </div>

      <YouTubeScene locale={locale as Locale} />
    </div>
  );
}
