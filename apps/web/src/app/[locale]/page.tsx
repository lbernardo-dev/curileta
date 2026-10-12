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
import { cmsProvider } from '@/lib/cms';
import { getVideoVoteCounts } from '@/lib/video-votes';
import { getImageFrameSettings } from '@/lib/image-frame-settings.server';
import { resolveYouTubeChannelSettings } from '@/lib/youtube-channel-settings.server';
import { getBookCatalogSettings } from '@/lib/book-catalog.server';
import { getLatestBooks, mergeBookCatalog } from '@/lib/book-catalog';
import { getCharacterFavoriteRankings } from '@/lib/character-favorites.server';
import { CharacterFavoritesProvider } from '@/components/CharacterFavoritesProvider';
import { getUpcomingEpisodeCharacterSlugs } from '@/lib/upcoming-episode-characters.server';
import { resolveHomepageSections } from '@/lib/homepage-sections';
import { AuthorLandingFeature } from '@/features/home/AuthorLandingFeature';
import { getAuthorPages } from '@/lib/author-pages.server';
import { getRequestTimestamp } from '@/lib/request-time.server';
import { getLandingLetters } from '@/lib/letters';
import { getPublicDestinations } from '@/lib/destinations.server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com';

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
    videoVoteCounts,
    imageFrames,
    requestHeaders,
    characterRankings,
    upcomingCharacterSlugs,
    bookCatalogSettings,
    authorPages,
  ] = await Promise.all([
    getPublicDestinations(locale),
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
    getVideoVoteCounts(),
    getImageFrameSettings(),
    headers(),
    getCharacterFavoriteRankings(locale),
    getUpcomingEpisodeCharacterSlugs(),
    getBookCatalogSettings(),
    getAuthorPages(),
  ]);

  const displayBooks = mergeBookCatalog(books, bookCatalogSettings);
  const landingLetters = getLandingLetters(letters);
  const featuredBooks = getLatestBooks(displayBooks, bookCatalogSettings.featuredBookSlugs, 3);
  const storyRoute = books.find((book) => book.slug === 'las-aventuras-de-curileta')?.locations || [];
  const routeIndex = (location: (typeof locations)[number]) => {
    const index = storyRoute.findIndex((id) => id === location.id || id === location.slug);
    return index < 0 ? storyRoute.length : index;
  };
  const orderedLocations = locations.slice().sort((left, right) => routeIndex(left) - routeIndex(right));

  const resolvedChannelSettings = await resolveYouTubeChannelSettings(settings);
  const currentTimestamp = getRequestTimestamp();
  const upcomingCharacters = upcomingCharacterSlugs
    .map((slug) => characters.find((character) => character.slug === slug))
    .filter((character): character is (typeof characters)[number] => Boolean(character));

  const publishedBooksCount = books.filter(
    (book) => Date.parse(`${book.publicationDate}T23:59:59.999Z`) <= currentTimestamp
  ).length;
  const amazonCountry = detectAmazonCountryFromHeaders(requestHeaders);

  const sectionComponents = {
    hero: <HeroScene locale={locale as Locale} settings={settings} publishedBooksCount={publishedBooksCount} />,
    seasonalEvent: <SeasonalEventSectionWrapper locale={locale as Locale} event={activeEvent} />,
    story: <StoryLanding locale={locale as Locale} locations={locations} characters={characters} books={books} upcomingCharacters={upcomingCharacters} amazonCountry={amazonCountry} imageFrames={imageFrames} currentTimestamp={currentTimestamp} />,
    globe: <Globe3DScene locale={locale as Locale} locations={orderedLocations} milestones={milestones} />,
    radar: <AdventureRadar locale={locale as Locale} locations={locations} milestones={milestones} />,
    letters: <LettersScene locale={locale as Locale} letters={landingLetters} />,
    characters: <CharacterHubScene locale={locale as Locale} characters={characters} />,
    books: <><BooksScene locale={locale as Locale} books={featuredBooks} amazonCountry={amazonCountry} imageFrames={imageFrames} currentTimestamp={currentTimestamp} /><AuthorLandingFeature locale={locale as Locale} authors={authorPages} books={books} /></>,
    videos: <YouTubeScene locale={locale as Locale} videos={videos} settings={resolvedChannelSettings} voteCounts={videoVoteCounts} />,
    wallpapers: <WallpapersScene locale={locale as Locale} wallpapers={wallpapers} embedded />,
    roadmap: <GrowingUniverseScene locale={locale as Locale} items={universeRoadmap} />,
    collaborations: <CollaborationsScene locale={locale as Locale} collaborations={collaborations} />,
    closing: <ClosingScene locale={locale as Locale} />,
  };
  const configuredSections = resolveHomepageSections(settings.homepageSections);

  return (
    <CharacterFavoritesProvider locale={locale as Locale} initialRankings={characterRankings}>
      <article className="relative flex w-full flex-col">
        {configuredSections
          .filter((section) => section.visible && section.key in sectionComponents)
          .map((section) => (
            <div key={section.key} data-home-section={section.key} className="contents">
              {sectionComponents[section.key as keyof typeof sectionComponents]}
            </div>
          ))}
      </article>
    </CharacterFavoritesProvider>
  );
}
