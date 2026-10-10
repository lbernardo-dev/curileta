import Image from 'next/image';
import Link from 'next/link';
import type { Book, Character, Location } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { ArrowRight, BookOpen, Compass, Heart, MapPin, Sparkles } from 'lucide-react';
import { AmazonMarketplaceLink } from '@/components/AmazonMarketplaceLink';
import { CURILETA_BOOK_SLUG } from '@/lib/amazon-marketplace';
import { getBookCoverImage } from '@/lib/book-art';
import { getImageFrame, type ImageFrameMap } from '@/lib/image-frames';

interface StoryLandingProps {
  locale: Locale;
  locations: Location[];
  characters: Character[];
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

export function StoryLanding({ locale, locations, characters, books, amazonCountry, imageFrames }: StoryLandingProps) {
  const isEn = locale === 'en';
  const crew = ['curileta', 'pompon', 'quetzal']
    .map((slug) => characters.find((character) => character.slug === slug))
    .filter((character): character is Character => Boolean(character));
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
          <div className="grid items-end gap-8 md:grid-cols-[1fr_0.72fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                <Compass className="h-4 w-4" />
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
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              <Heart className="h-4 w-4" />
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

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
            {crew.map((character, index) => (
              <Link key={character.id} href={`/${locale}/personajes/${character.slug}`} className="group overflow-hidden rounded-[1.6rem] bg-[#fbfcf8] p-5 text-center shadow-sm ring-1 ring-[#20352c]/[0.07] transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative mx-auto flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[1.15rem] bg-[#f3ead8]">
                  <img
                    src={character.mainImage.url}
                    alt={localized(character.mainImage.alt, locale) || character.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-950 shadow-sm">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{crewName(character.slug, character.name, locale)}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5c6b61]">{localized(character.shortDescription, locale)}</p>
              </Link>
            ))}
          </div>
          <div className="mt-9 text-center">
            <Link href={`/${locale}/personajes`} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 underline decoration-emerald-700/40 underline-offset-4 hover:decoration-emerald-800">
              {isEn ? 'Meet the whole crew' : 'Conocer a toda la tripulación'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {featuredBook && featuredCover && (
        <section className="bg-[#fffdf7] px-5 py-20 text-[#20352c] sm:px-8 sm:py-28 lg:px-12">
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
                <BookOpen className="h-4 w-4" />
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
              <Sparkles className="h-4 w-4" />
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
