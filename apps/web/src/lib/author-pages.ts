export interface AuthorPage {
  slug: string;
  author_name: string;
  name: { es: string; en: string };
  biography: { es: string; en: string };
  quote: { es: string; en: string };
  portrait_url: string;
  portrait_path: string;
  website_url: string;
  instagram_url: string;
  youtube_url: string;
  sort_order: number;
  is_published: boolean;
}

export function normalizeAuthorName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLocaleLowerCase();
}

export function getBookAuthorPage<T extends { author?: string }>(book: T, pages: AuthorPage[]) {
  const author = book.author?.trim();
  if (!author) return null;
  const normalized = normalizeAuthorName(author);
  return (
    pages.find((page) => {
      const pageAuthor = normalizeAuthorName(page.author_name);
      const pageNameEs = normalizeAuthorName(page.name?.es || '');
      const pageNameEn = normalizeAuthorName(page.name?.en || '');
      return (
        pageAuthor === normalized ||
        pageNameEs === normalized ||
        pageNameEn === normalized ||
        pageAuthor.includes(normalized) ||
        normalized.includes(pageAuthor)
      );
    }) || null
  );
}
