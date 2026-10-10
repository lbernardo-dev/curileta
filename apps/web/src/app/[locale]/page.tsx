import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { HeroScene } from '@/features/home/HeroScene';
import { StoryLanding } from '@/features/home/StoryLanding';
import { SeasonalEventSectionWrapper } from '@/features/events/SeasonalEventSectionWrapper';
import { Globe3DScene } from '@/features/home/Globe3DScene';
import { AdventureRadar } from '@/features/home/AdventureRadar';
import { LettersScene } from '@/features/home/LettersScene';
import { CharacterHubScene } from '@/features/home/CharacterHubScene';
import { BooksScene } from '@/features/home/BooksScene';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { WallpapersScene } from '@/features/wallpapers/WallpapersScene';
import { GrowingUniverseScene } from '@/features/home/GrowingUniverseScene';
import { CollaborationsScene } from '@/features/home/CollaborationsScene';
import { ClosingScene } from '@/features/home/ClosingScene';
import { detectAmazonCountryFromHeaders } from '@/lib/amazon-marketplace';
import { cmsProvider } from '@curileta/cms';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://curileta.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const baseUrl = siteUrl.replace(/\/$/, '');

  return {
    title: isEn ? 'Official Website' : 'Web Oficial',
    description: isEn
      ? 'Discover Curileta: an illustrated journey through books, places, friendship and the joy of exploring the world together.'
      : 'Descubre a Curileta: un viaje ilustrado por libros, lugares, amistad y la alegría de explorar el mundo en familia.',
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'es-ES': `${baseUrl}/es`,
        'en-US': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: isEn ? 'Curileta — Official Website' : 'Curileta — Web Oficial',
      description: isEn
        ? 'An illustrated journey through books, places and friendship.'
        : 'Un viaje ilustrado por libros, lugares y amistad.',
      url: `${baseUrl}/${locale}`,
      images: [HERO_SOCIAL_IMAGE],
    },
  };
}

const HERO_SOCIAL_IMAGE = '/images/hero/curileta-world-expedition-clean-v1.jpg';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [
    locations,
    characters,
    books,
    letters,
    milestones,
    videos,
    wallpapers,
    activeEvent,
    universeRoadmap,
    collaborations,
    settings,
    requestHeaders,
  ] = await Promise.all([
    cmsProvider.getLocations(locale),
    cmsProvider.getCharacters(locale),
    cmsProvider.getBooks(locale),
    cmsProvider.getLetters(locale),
    cmsProvider.getNarrativeMilestones(locale),
    cmsProvider.getVideos(locale),
    cmsProvider.getWallpapers(locale),
    cmsProvider.getActiveEvent(locale),
    cmsProvider.getUniverseRoadmap(locale),
    cmsProvider.getCollaborations(locale),
    cmsProvider.getSiteSettings(locale),
    headers(),
  ]);

  const publishedBooksCount = books.filter(
    (book) => Date.parse(`${book.publicationDate}T23:59:59.999Z`) <= Date.now()
  ).length;
  const amazonCountry = detectAmazonCountryFromHeaders(requestHeaders);

  return (
    <article className="relative flex w-full flex-col">
      <HeroScene
        locale={locale as Locale}
        settings={settings}
        publishedBooksCount={publishedBooksCount}
      />
      <SeasonalEventSectionWrapper locale={locale as Locale} event={activeEvent} />
      <StoryLanding
        locale={locale as Locale}
        locations={locations}
        characters={characters}
        books={books}
        amazonCountry={amazonCountry}
      />
      <Globe3DScene locale={locale as Locale} locations={locations} milestones={milestones} />
      <AdventureRadar locale={locale as Locale} locations={locations} milestones={milestones} />
      <LettersScene locale={locale as Locale} letters={letters} />
      <CharacterHubScene locale={locale as Locale} characters={characters} />
      <BooksScene locale={locale as Locale} books={books} amazonCountry={amazonCountry} />
      <YouTubeScene locale={locale as Locale} videos={videos} />
      <WallpapersScene locale={locale as Locale} wallpapers={wallpapers} embedded />
      <GrowingUniverseScene locale={locale as Locale} items={universeRoadmap} />
      <CollaborationsScene locale={locale as Locale} collaborations={collaborations} />
      <ClosingScene locale={locale as Locale} />
    </article>
  );
}
