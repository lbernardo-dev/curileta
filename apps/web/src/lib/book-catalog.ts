import type { Book, LocalizedString } from '@curileta/cms';

export interface UpcomingBookRecord {
  id: string;
  slug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  publicationDate: string;
}

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
    slug: record.slug,
    title: record.title,
    subtitle: { es: 'Próxima expedición', en: 'Coming expedition' },
    description: {
      es: record.description.es || 'Una nueva aventura de Curileta está tomando forma.',
      en: record.description.en || 'A new Curileta adventure is taking shape.',
    },
    coverImage: { url: '/images/books/coming-soon-cover.svg', alt: coverAlt },
    publicationDate: record.publicationDate,
    publicationStatus: 'coming-soon',
    languages: ['Español', 'English'],
    ageRange: '',
    badge: { es: 'Próximamente', en: 'Coming soon' },
  };
}

export function mergeBookCatalog(books: Book[], settings: BookCatalogSettings): Book[] {
  const existingSlugs = new Set(books.map((book) => book.slug));
  const teasers = settings.upcomingBooks
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
