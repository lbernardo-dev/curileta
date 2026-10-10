import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { cmsProvider } from '@/lib/cms';
import { getVideoVoteCounts } from '@/lib/video-votes';
import { resolveYouTubeChannelSettings } from '@/lib/youtube-channel-settings.server';

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

  const [videos, baseSettings, voteCounts] = await Promise.all([
    cmsProvider.getVideos(locale),
    cmsProvider.getSiteSettings(locale),
    getVideoVoteCounts(),
  ]);
  const settings = await resolveYouTubeChannelSettings(baseSettings);
  const isEn = locale === 'en';
  const channelTitle = settings.youtubeChannelTitle?.[locale] || settings.youtubeChannelTitle?.es || (isEn ? 'Curileta official channel' : 'Canal oficial de Curileta');
  const channelDescription = settings.youtubeChannelDescription?.[locale] || settings.youtubeChannelDescription?.es || '';
  const channelBanner = settings.youtubeChannelHeaderUrl || '/images/hero/curileta-world-expedition-clean-v1.jpg';

  return (
    <div className="min-h-screen bg-[#f3f6f3] text-slate-900 transition-colors duration-300 dark:bg-[#131209] dark:text-white">
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <section className="relative isolate min-h-56 overflow-hidden rounded-3xl border border-[#cfd9d1] bg-[#173e35] shadow-[0_20px_60px_rgba(21,54,43,0.14)] dark:border-[#313131]" aria-label={isEn ? 'Channel information' : 'Información del canal'}>
          <img src={channelBanner} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#102d27]/70" aria-hidden="true" />
          <div className="relative flex min-h-56 flex-col items-center gap-5 p-6 text-center text-white sm:flex-row sm:items-center sm:p-8 sm:text-left">
            {settings.youtubeChannelAvatarUrl ? (
              <img src={settings.youtubeChannelAvatarUrl} alt={channelTitle} className="h-20 w-20 shrink-0 rounded-full border-4 border-white/80 object-cover shadow-xl sm:h-24 sm:w-24" />
            ) : (
              <img src="/images/characters/avatars/curileta.webp" alt={isEn ? 'Curileta channel avatar' : 'Avatar del canal de Curileta'} className="h-20 w-20 shrink-0 rounded-full border-4 border-white/80 object-cover shadow-xl sm:h-24 sm:w-24" />
            )}
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">{isEn ? 'Curileta on YouTube' : 'Curileta en YouTube'}</p>
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
