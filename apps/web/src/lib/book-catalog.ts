import type { Book, LocalizedString } from '@curileta/cms';

export interface UpcomingBookRecord {
  id: string;
  slug: string;
  title: { es: string; en: string };
  subtitle?: { es: string; en: string };
  description: { es: string; en: string };
  theme?: { es: string; en: string };
  badge?: { es: string; en: string };
  ageRange?: string;
  pageCount?: number;
  externalUrl?: string;
  author?: string;
  publicationDate: string;
  isPublished?: boolean;
  coverImageUrl?: string;
  coverImagePath?: string;
}

export const INITIAL_AUTHOR_COMPANION_BOOKS: UpcomingBookRecord[] = [
  {
    id: 'upcoming-curileta-y-el-misterio-marino',
    slug: 'curileta-y-el-misterio-marino',
    author: 'Sweety Taless',
    title: {
      es: 'Curileta y el Misterio Marino',
      en: 'Curileta and the Marine Mystery',
    },
    subtitle: {
      es: 'Volumen 2 — El Mar de Filipinas y las Marianas',
      en: 'Volume 2 — The Philippine Sea & the Marianas',
    },
    theme: {
      es: 'Océanos, Misterio y Arrecifes',
      en: 'Oceans, Mystery & Coral Reefs',
    },
    badge: {
      es: 'Volumen 2 • Próxima Expedición',
      en: 'Volume 2 • Upcoming Expedition',
    },
    description: {
      es: 'Inspirado en la travesía en velero con el pez volador Glub y las aguas bioluminiscentes de las Marianas.',
      en: 'Inspired by the sailboat crossing alongside Glub the flying fish and the bioluminescent abyssal waters.',
    },
    ageRange: '5–11 años',
    pageCount: 56,
    publicationDate: '2026-11-15',
    isPublished: true,
    coverImageUrl: '/images/characters/pez-volador-main.webp',
  },
  {
    id: 'upcoming-cuaderno-actividades-curileta',
    slug: 'cuaderno-actividades-curileta',
    author: 'Sweety Taless',
    title: {
      es: 'El Cuaderno Secreto de Curileta & Pompón',
      en: 'Curileta & Pompón Secret Activity Book',
    },
    subtitle: {
      es: 'Actividades, Mapas y Colorear por el Mundo',
      en: 'Activities, World Maps & Creative Coloring',
    },
    theme: {
      es: 'Creatividad, Pasatiempos y Destreza',
      en: 'Creativity, Puzzles & World Games',
    },
    badge: {
      es: 'Actividades & Creatividad',
      en: 'Activities & Creativity',
    },
    description: {
      es: 'Laberintos, sellos de pasaporte, banderas del mundo y láminas para colorear con personajes de la historia.',
      en: 'Mazes, passport stamps, world flags, and coloring sheets featuring characters from the story.',
    },
    ageRange: '4–10 años',
    pageCount: 64,
    externalUrl: 'https://www.amazon.com/dp/B0H2CT8S14',
    publicationDate: '2026-06-01',
    isPublished: true,
    coverImageUrl: '/images/books/las-aventuras-de-curileta/portada.webp',
  },
  {
    id: 'upcoming-cuentos-buenas-noches-bosque',
    slug: 'cuentos-buenas-noches-bosque',
    author: 'Sweety Taless',
    title: {
      es: 'Cuentos de Buenas Noches del Bosque Encantado',
      en: 'Bedtime Tales of the Enchanted Forest',
    },
    subtitle: {
      es: 'Historias Breves de Amistad y Naturaleza',
      en: 'Gentle Stories of Friendship & Nature',
    },
    theme: {
      es: 'Lecturas de Buenas Noches y Valores',
      en: 'Bedtime Stories & Calm Values',
    },
    badge: {
      es: 'Cuentos para Soñar',
      en: 'Bedtime Tales',
    },
    description: {
      es: 'Relatos breves y tiernos sobre las criaturas del bosque antes de que caiga la noche y comiencen los sueños.',
      en: 'Short and gentle stories about forest animals before evening falls and dreams begin.',
    },
    ageRange: '3–8 años',
    pageCount: 48,
    publicationDate: '2026-09-20',
    isPublished: true,
    coverImageUrl: '/images/characters/curileta-main.webp',
  },
];

export interface BookCatalogSettings {
  featuredBookSlugs: string[];
  upcomingBooks: UpcomingBookRecord[];
}

export const EMPTY_BOOK_CATALOG_SETTINGS: BookCatalogSettings = {
  featuredBookSlugs: [],
  upcomingBooks: [],
};

const coverAlt: LocalizedString = {
  es: 'Cubierta reservada de una próxima aventura de Curileta',
  en: 'Reserved cover for an upcoming Curileta adventure',
};

export function upcomingBookToBook(record: UpcomingBookRecord): Book {
  return {
    id: record.id,
    author: record.author || 'Sweety Taless',
    slug: record.slug,
    title: record.title,
    subtitle: record.subtitle || { es: 'Próxima expedición', en: 'Coming expedition' },
    description: {
      es: record.description.es || 'Una nueva aventura de Curileta está tomando forma.',
      en: record.description.en || 'A new Curileta adventure is taking shape.',
    },
    coverImage: record.coverImageUrl
      ? {
        url: record.coverImageUrl,
        alt: {
          es: `Cubierta de ${record.title.es}`,
          en: `Cover of ${record.title.en}`,
        },
      }
      : { url: '/images/books/coming-soon-cover.svg', alt: coverAlt },
    publicationDate: record.publicationDate || '2026-12-31',
    publicationStatus: record.externalUrl ? 'published' : 'coming-soon',
    languages: ['Español', 'English'],
    ageRange: record.ageRange || '',
    pageCount: record.pageCount,
    badge: record.badge || { es: 'Próximamente', en: 'Coming soon' },
    colorTheme: record.theme?.es,
    purchaseLinks: record.externalUrl
      ? [{ storeName: 'Amazon', url: record.externalUrl }]
      : undefined,
  };
}

export function mergeBookCatalog(books: Book[], settings: BookCatalogSettings): Book[] {
  const existingSlugs = new Set(books.map((book) => book.slug));
  const teasers = settings.upcomingBooks
    .filter((book) => book.isPublished !== false)
    .filter((book) => !existingSlugs.has(book.slug))
    .map(upcomingBookToBook);
  return [...books, ...teasers];
}

export function isBookPublished(book: Book, now = Date.now()): boolean {
  if (book.publicationStatus === 'coming-soon') return false;
  const date = Date.parse(`${book.publicationDate}T23:59:59.999Z`);
  return Number.isFinite(date) && date <= now;
}

export function getLatestBooks(books: Book[], featuredBookSlugs: string[] = [], limit = 3): Book[] {
  const bySlug = new Map(books.map((book) => [book.slug, book]));
  const configured = featuredBookSlugs.map((slug) => bySlug.get(slug)).filter((book): book is Book => Boolean(book));
  const candidates = configured.length ? configured : books;
  return candidates
    .slice()
    .sort((left, right) => {
      const leftDate = left.publicationDate ? Date.parse(`${left.publicationDate}T23:59:59.999Z`) : Number.POSITIVE_INFINITY;
      const rightDate = right.publicationDate ? Date.parse(`${right.publicationDate}T23:59:59.999Z`) : Number.POSITIVE_INFINITY;
      const safeLeft = Number.isFinite(leftDate) ? leftDate : Number.POSITIVE_INFINITY;
      const safeRight = Number.isFinite(rightDate) ? rightDate : Number.POSITIVE_INFINITY;
      if (safeLeft === safeRight) return 0;
      if (!Number.isFinite(safeLeft)) return -1;
      if (!Number.isFinite(safeRight)) return 1;
      return safeRight - safeLeft;
    })
    .slice(0, limit);
}
