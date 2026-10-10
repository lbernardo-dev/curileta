import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { cmsProvider } from '@/lib/cms';
import { getVideoVoteCounts } from '@/lib/video-votes';

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

  const [videos, settings, voteCounts] = await Promise.all([
    cmsProvider.getVideos(locale),
    cmsProvider.getSiteSettings(locale),
    getVideoVoteCounts(),
  ]);
  const isEn = locale === 'en';
  const channelTitle = settings.youtubeChannelTitle?.[locale] || settings.youtubeChannelTitle?.es || (isEn ? 'Curileta official channel' : 'Canal oficial de Curileta');
  const channelDescription = settings.youtubeChannelDescription?.[locale] || settings.youtubeChannelDescription?.es || '';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-8 sm:pt-16">
        <section className="relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#181818]" aria-label={isEn ? 'Channel information' : 'Información del canal'}>
          {settings.youtubeChannelHeaderUrl && <img src={settings.youtubeChannelHeaderUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-slate-950/65" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-5 p-6 text-white sm:flex-row sm:items-center sm:p-8">
            {settings.youtubeChannelAvatarUrl ? (
              <img src={settings.youtubeChannelAvatarUrl} alt={channelTitle} className="h-20 w-20 shrink-0 rounded-full border border-white/50 object-cover" />
            ) : (
              <div className="h-20 w-20 shrink-0 rounded-full border border-white/50 bg-[#272727]" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{channelTitle}</h1>
              <p className="mt-2 max-w-3xl text-pretty text-base leading-6 text-white/90">{channelDescription || (isEn ? 'Episodes, songs and short videos from Curileta.' : 'Episodios, canciones y vídeos cortos de Curileta.')}</p>
              {settings.youtubeChannelTags?.length ? (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={isEn ? 'Channel tags' : 'Etiquetas del canal'}>
                  {settings.youtubeChannelTags.map((tag) => <li key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{tag}</li>)}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <YouTubeScene locale={locale as Locale} videos={videos} settings={settings} voteCounts={voteCounts} hideHeader={true} />
    </div>
  );
}
