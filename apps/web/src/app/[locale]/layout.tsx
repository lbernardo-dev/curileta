import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, Locale, isValidLocale } from '@curileta/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

import { cmsProvider } from '@/lib/cms';
import { SeasonalThemeProvider } from '@/providers/SeasonalThemeProvider';
import { resolveYouTubeChannelSettings } from '@/lib/youtube-channel-settings.server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      template: locale === 'en' ? '%s | Curileta Adventures' : '%s | Las Aventuras de Curileta',
      default: locale === 'en' ? 'Curileta Adventures — Official Website' : 'Las Aventuras de Curileta — Web Oficial',
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const [activeEvent, baseSettings] = await Promise.all([
    cmsProvider.getActiveEvent(locale),
    cmsProvider.getSiteSettings(locale),
  ]);
  const settings = await resolveYouTubeChannelSettings(baseSettings);

  return (
    <SeasonalThemeProvider activeEvent={activeEvent}>
      <Header locale={locale as Locale} />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer locale={locale as Locale} youtubeChannelUrl={settings.youtubeChannelUrl} />
    </SeasonalThemeProvider>
  );
}
