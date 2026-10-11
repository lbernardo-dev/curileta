import Image from 'next/image';
import Link from 'next/link';
import type { Book, Character, Location } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { ArrowRight, BookOpen, Compass, Heart, MapPin } from 'lucide-react';
import { AmazonMarketplaceLink } from '@/components/AmazonMarketplaceLink';
import { CURILETA_BOOK_SLUG } from '@/lib/amazon-marketplace';
import { getBookCoverImage } from '@/lib/book-art';
import { getImageFrame, type ImageFrameMap } from '@/lib/image-frames';
import { FavoriteLeaderboard } from '@/components/CharacterFavoritesProvider';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import { SectionEmblem } from '@/components/SectionEmblem';

interface StoryLandingProps {
  locale: Locale;
  locations: Location[];
  characters: Character[];
  upcomingCharacters: Character[];
  books: Book[];
  amazonCountry: string | null;
  imageFrames: ImageFrameMap;
}

const localized = (value: { es: string; en?: string } | undefined, locale: Locale) =>
  value?.[locale] || value?.es || '';

const crewName = (slug: string, name: string, locale: Locale) => {
  if (locale !== 'en') return name;
  if (slug === 'pompon') return 'Pompón';
  return name;
};

export function StoryLanding({ locale, locations, characters, books, upcomingCharacters, amazonCountry, imageFrames }: StoryLandingProps) {
  const isEn = locale === 'en';
  const today = Date.now();
  const publishedBooks = books.filter((book) => Date.parse(`${book.publicationDate}T23:59:59.999Z`) <= today);
  const featuredBook = publishedBooks[0] || books[0];
  const featuredCover = featuredBook ? getBookCoverImage(featuredBook) : null;
  const isCuriletaBook = featuredBook?.slug === CURILETA_BOOK_SLUG || featuredBook?.id === CURILETA_BOOK_SLUG;
  const coverFrame = isCuriletaBook ? getImageFrame(imageFrames, 'home-book-cover') : null;
  const nextBook = books.find((book) => Date.parse(`${book.publicationDate}T23:59:59.999Z`) > today);
  const routeFromBook = featuredBook?.locations
    ?.map((locationId) => locations.find((location) => location.id === locationId || location.slug === locationId))
    .filter((location): location is Location => Boolean(location));
  const route = (routeFromBook?.length
    ? routeFromBook
    : locations.filter((location) => !location.slug.includes('regreso'))
  ).slice(0, 3);

  return (
    <>
      <section id="ruta" className="bg-[#faf9f4] px-5 py-20 text-[#20352c] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionEmblem icon={Compass} tone="emerald" label={isEn ? 'The expedition route' : 'La ruta de la expedición'} />
          <div className="grid items-end gap-8 md:grid-cols-[1fr_0.72fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                {isEn ? 'The route begins' : 'La ruta comienza'}
              </p>
              <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {isEn ? 'Every stop opens a new chapter.' : 'Cada parada abre un capítulo nuevo.'}
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-[#5c6b61]">
              {isEn
                ? 'From the familiar forest to distant places, Curileta learns by looking closely, asking kind questions and meeting the people who call each place home.'
                : 'Del bosque conocido a lugares lejanos, Curileta aprende observando, haciendo preguntas con respeto y conociendo a quienes llaman hogar a cada destino.'}
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {route.map((location, index) => (
              <article key={location.id} className="group relative overflow-hidden rounded-[1.65rem] bg-[#fffdf8] shadow-[0_16px_55px_rgba(24,54,41,0.08)] ring-1 ring-[#20352c]/[0.08]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e7ece5]">
                  <img
                    src={location.heroImage.url}
                    alt={localized(location.heroImage.alt, locale) || localized(location.name, locale)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12261f]/65 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 px-2 text-xs font-semibold text-[#20352c] shadow-sm">
                    0{index + 1}
                  </span>
                  <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    <MapPin className="h-4 w-4 text-amber-300" />
                    {localized(location.country, locale)}
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{localized(location.name, locale)}</h3>
                  <p className="mt-3 line-clamp-3 text-[15px] leading-6 text-[#4d5f54]">{localized(location.description, locale)}</p>
                  {location.curiosities?.[0] && (
                    <p className="mt-5 border-t border-[#e6e9e1] pt-4 text-sm leading-6 text-[#3f594a]">
                      <span className="font-semibold">{isEn ? 'A little discovery: ' : 'Una pequeña curiosidad: '}</span>
                      {localized(location.curiosities[0], locale)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href={`/${locale}/mundo`} className="inline-flex items-center gap-2 rounded-full border border-[#cbd6c8] px-5 py-3 text-sm font-semibold text-[#254537] transition hover:border-emerald-700 hover:bg-emerald-50">
              <span>{isEn ? 'Explore the illustrated atlas' : 'Explorar el atlas ilustrado'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#e9efe4] px-5 py-20 text-[#20352c] sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionEmblem icon={Heart} tone="rose" label={isEn ? 'Friends on the journey' : 'Amistades del viaje'} />
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              {isEn ? 'A good journey is shared' : 'Los buenos viajes se comparten'}
            </p>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              {isEn ? 'Curiosity grows with friends.' : 'La curiosidad crece en compañía.'}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5c6b61]">
              {isEn
                ? 'Meet the friends who bring different skills, perspectives and kindness to every new part of the map.'
                : 'Conoce a quienes aportan nuevas habilidades, miradas y cariño a cada parte del mapa.'}
            </p>
          </div>

          <FavoriteLeaderboard
            locale={locale}
            characters={characters.map((character) => ({ slug: character.slug, name: crewName(character.slug, character.name, locale), image: character.mainImage.url }))}
          />

          <section aria-labelledby="next-episode-title" className="mx-auto mt-10 max-w-5xl">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{isEn ? 'Coming up' : 'En preparación'}</p>
                <h3 id="next-episode-title" className="mt-1 text-xl font-bold text-[#20352c]">{isEn ? 'Characters in the next episode' : 'Personajes del próximo episodio'}</h3>
              </div>
              {upcomingCharacters.length > 1 && <span className="text-xs text-[#5c6b61]">{isEn ? 'Swipe to meet everyone' : 'Desliza para ver a todos'}</span>}
            </div>

            {upcomingCharacters.length > 0 ? (
              <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                {upcomingCharacters.map((character) => (
                  <li key={character.id} className="w-64 shrink-0 snap-start">
                    <Link href={`/${locale}/personajes/${character.slug}`} className="group flex h-full items-center gap-4 rounded-3xl bg-[#fbfcf8] p-4 shadow-sm ring-1 ring-[#20352c]/[0.07] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
                      <CharacterAvatarImage
                        slug={character.slug}
                        name={crewName(character.slug, character.name, locale)}
                        alt={localized(character.mainImage.alt, locale) || character.name}
                        fallbackSrc={character.mainImage.url}
                        size={80}
                        className="h-20 w-20 border-2 border-[#d7e1d3] bg-[#f3ead8] shadow-sm transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate font-display text-lg font-semibold text-[#20352c]">{crewName(character.slug, character.name, locale)}</h4>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5c6b61]">{localized(character.shortDescription, locale)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-[#d7e1d3] bg-[#fbfcf8] px-6 py-5 text-sm leading-6 text-[#52655a]">
                {isEn
                  ? 'The next episode is being prepared. Its characters will appear here soon.'
                  : 'Estamos preparando el próximo episodio. Sus personajes aparecerán aquí pronto.'}
              </p>
            )}
          </section>
          <div className="mt-9 text-center">
            <Link href={`/${locale}/personajes`} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 underline decoration-emerald-700/40 underline-offset-4 hover:decoration-emerald-800">
              {isEn ? 'Meet the whole crew' : 'Conocer a toda la tripulación'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {featuredBook && featuredCover && (
        <section className="bg-[#fffdf7] px-5 py-20 text-[#20352c] sm:px-8 sm:py-28 lg:px-12">
          <SectionEmblem icon={BookOpen} tone="amber" label={isEn ? 'Curileta’s published book' : 'El libro publicado de Curileta'} />
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#163b32] text-white shadow-[0_28px_90px_rgba(16,48,38,0.18)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[320px] overflow-hidden bg-[#163b32] sm:min-h-[400px] lg:min-h-[560px]">
              <Image
                src={featuredCover.url}
                alt={featuredCover.alt[locale] || featuredCover.alt.es}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={coverFrame ? {
                  objectPosition: `${coverFrame.positionX}% ${coverFrame.positionY}%`,
                  transform: `scale(${coverFrame.zoom})`,
                  transformOrigin: `${coverFrame.positionX}% ${coverFrame.positionY}%`,
                } : undefined}
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-16">
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                {isEn ? 'The story in a book' : 'La historia en un libro'}
              </p>
              <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                {localized(featuredBook.title, locale)}
              </h2>
              {featuredBook.subtitle && <p className="mt-4 text-sm font-medium text-amber-100">{localized(featuredBook.subtitle, locale)}</p>}
              <p className="mt-5 text-base leading-7 text-white/80">{localized(featuredBook.description, locale)}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90">{isEn ? featuredBook.ageRange.replace(/\baños\b/i, 'years') : featuredBook.ageRange}</span>
                {featuredBook.pageCount && <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90">{featuredBook.pageCount} {isEn ? 'pages' : 'páginas'}</span>}
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90">{isEn ? `${publishedBooks.length} published` : `${publishedBooks.length} publicado${publishedBooks.length === 1 ? '' : 's'}`}</span>
              </div>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link href={`/${locale}/libros/${featuredBook.slug}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-[#20352c] transition hover:bg-amber-200">
                  {isEn ? 'Read about the book' : 'Conocer el libro'} <ArrowRight className="h-4 w-4" />
                </Link>
                {nextBook && <span className="text-xs text-white/65">{isEn ? 'Another voyage is on the horizon' : 'Una nueva travesía se prepara'}</span>}
              </div>
              {featuredBook.slug === CURILETA_BOOK_SLUG && (
                <div className="mt-5 border-t border-white/15 pt-5 text-white">
                  <AmazonMarketplaceLink locale={locale} initialCountry={amazonCountry} compact />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f2f0e6] px-5 py-20 text-[#20352c] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-[1.75rem] border border-[#dbe1d4] bg-[#fbfcf8] p-7 sm:p-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              {isEn ? 'Your next stop' : 'Tu próxima parada'}
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              {isEn ? 'There is more to discover beyond the page.' : 'Hay mucho más por descubrir al pasar la página.'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5c6b61]">
              {isEn ? 'Explore the atlas, meet the characters or find a new story to read together.' : 'Explora el atlas, conoce a sus personajes o encuentra una historia para leer en familia.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={`/${locale}/mundo`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]">
              <Compass className="h-4 w-4" /> {isEn ? 'Explore the world' : 'Explorar el mundo'}
            </Link>
            <Link href={`/${locale}/videos`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#cbd6c8] px-5 py-3 text-sm font-semibold text-[#254537] transition hover:bg-emerald-50">
              {isEn ? 'Watch stories' : 'Ver historias'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
