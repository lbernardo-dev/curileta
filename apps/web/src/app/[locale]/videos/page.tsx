import { ContentImage } from '@/components/ContentImage';
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

function getChannelHandle(channelUrl: string, locale: Locale) {
  try {
    const handle = new URL(channelUrl).pathname.split('/').find((segment) => segment.startsWith('@'));
    if (handle) return handle;
  } catch {
    // The configured link is validated before it reaches the page.
  }

  return locale === 'en' ? 'Official channel' : 'Canal oficial';
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
  const channelUrl = settings.youtubeChannelUrl?.startsWith('https://')
    ? settings.youtubeChannelUrl
    : 'https://www.youtube.com/@AventurasdeCurileta';
  const subscribeUrl = `${channelUrl}${channelUrl.includes('?') ? '&' : '?'}sub_confirmation=1`;
  const channelHandle = getChannelHandle(channelUrl, locale as Locale);
  const listedVideoCount = new Intl.NumberFormat(locale).format(videos.length);
  const listedVideosLabel = isEn
    ? `${listedVideoCount} ${videos.length === 1 ? 'video' : 'videos'}`
    : `${listedVideoCount} ${videos.length === 1 ? 'vídeo' : 'vídeos'}`;
  const channelAvatar = settings.youtubeChannelAvatarUrl || '/images/characters/avatars/curileta.webp';

  return (
    <div className="min-h-screen bg-[#f3f6f3] text-slate-900 transition-colors duration-300 dark:bg-[#131209] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <section
          className="overflow-hidden rounded-2xl bg-[#181818]"
          aria-label={isEn ? 'Channel banner' : 'Banner del canal'}
        >
          <div className="relative aspect-[3/1] sm:aspect-[6/1]">
            <ContentImage src={channelBanner} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          </div>
        </section>

        <section
          className="flex items-start gap-4 border-b border-slate-200 py-6 dark:border-[#313131] sm:gap-6 sm:py-8"
          aria-label={isEn ? 'Channel profile' : 'Perfil del canal'}
        >
          <ContentImage
            src={channelAvatar}
            alt={channelTitle}
            className="h-20 w-20 shrink-0 rounded-full object-cover shadow-md sm:h-28 sm:w-28 lg:h-36 lg:w-36"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
              {channelTitle}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              <span>{channelHandle}</span>
              <span aria-hidden="true"> · </span>
              <span>{listedVideosLabel}</span>
            </p>
            <p className="mt-3 max-w-3xl text-pretty text-sm leading-5 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-6">
              {channelDescription || (isEn ? 'Episodes, songs and short videos from Curileta.' : 'Episodios, canciones y vídeos cortos de Curileta.')}
            </p>
            {settings.youtubeChannelTags?.length ? (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={isEn ? 'Channel tags' : 'Etiquetas del canal'}>
                {settings.youtubeChannelTags.map((tag) => (
                  <li key={tag} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-[#272727] dark:text-slate-200">
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={subscribeUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#131209]"
              >
                {isEn ? 'Subscribe' : 'Suscribirme'}
              </a>
              <a
                href={channelUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-[#414141] dark:text-slate-100 dark:hover:bg-[#272727]"
              >
                {isEn ? 'Visit channel' : 'Ver canal'}
              </a>
            </div>
          </div>
        </section>
      </div>

      <YouTubeScene locale={locale as Locale} videos={videos} settings={settings} voteCounts={voteCounts} hideHeader={true} />
    </div>
  );
}
