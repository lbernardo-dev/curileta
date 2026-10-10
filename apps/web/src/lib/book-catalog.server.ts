import 'server-only';

import type { Book } from '@curileta/cms';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { EMPTY_BOOK_CATALOG_SETTINGS, mergeBookCatalog, type BookCatalogSettings } from './book-catalog';

export async function getBookCatalogSettings(): Promise<BookCatalogSettings> {
  try {
    const { data, error } = await createSupabaseAdminClient()
      .from('book_catalog_settings')
      .select('featured_book_slugs, upcoming_books')
      .eq('setting_key', 'homepage')
      .maybeSingle();
    if (error || !data) return EMPTY_BOOK_CATALOG_SETTINGS;
    const upcomingBooks = Array.isArray(data.upcoming_books) ? data.upcoming_books : [];
    return {
      featuredBookSlugs: Array.isArray(data.featured_book_slugs)
        ? data.featured_book_slugs.filter((slug: unknown): slug is string => typeof slug === 'string')
        : [],
      upcomingBooks: upcomingBooks.filter((book: unknown) => isUpcomingBookRecord(book)),
    };
  } catch {
    return EMPTY_BOOK_CATALOG_SETTINGS;
  }
}

function isUpcomingBookRecord(value: unknown): value is BookCatalogSettings['upcomingBooks'][number] {
  if (!value || typeof value !== 'object') return false;
  const book = value as Record<string, unknown>;
  const localized = (field: unknown) => Boolean(field && typeof field === 'object'
    && typeof (field as Record<string, unknown>).es === 'string'
    && typeof (field as Record<string, unknown>).en === 'string');
  return typeof book.id === 'string' && typeof book.slug === 'string'
    && localized(book.title) && localized(book.description)
    && typeof book.publicationDate === 'string';
}

export function addManagedUpcomingBooks(books: Book[], settings: BookCatalogSettings): Book[] {
  return mergeBookCatalog(books, settings);
}
