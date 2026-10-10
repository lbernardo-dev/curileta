import type { Book, Character, LocalizedString, Video } from '@curileta/cms';

export interface HomeStorySource {
  slug: string;
  title: LocalizedString;
  kind: 'episode' | 'book';
}

export function getLatestStorySource(videos: Video[], books: Book[], now = Date.now()): HomeStorySource | null {
  const latestEpisode = videos
    .filter((video) => video.type === 'episode' && Date.parse(video.publishedAt) <= now)
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))[0];
  const latestBook = books
    .filter((book) => Date.parse(`${book.publicationDate}T23:59:59.999Z`) <= now)
    .sort((left, right) => Date.parse(right.publicationDate) - Date.parse(left.publicationDate))[0];
  if (!latestEpisode) return latestBook ? { slug: latestBook.slug, title: latestBook.title, kind: 'book' } : null;
  if (!latestBook || Date.parse(latestEpisode.publishedAt) >= Date.parse(`${latestBook.publicationDate}T23:59:59.999Z`)) {
    return { slug: latestEpisode.slug, title: latestEpisode.title, kind: 'episode' };
  }
  return { slug: latestBook.slug, title: latestBook.title, kind: 'book' };
}

export function resolveHomeCrew(
  characters: Character[],
  latestSource: HomeStorySource | null,
  configuredSlug: string | null | undefined,
  configuredCharacters: string[] | null | undefined,
  latestEpisode?: Video | null,
  latestBook?: Book | null,
) {
  const participants = latestSource?.kind === 'episode'
    ? latestEpisode?.tags?.flatMap((tag) => characters.filter((character) => character.slug === tag || character.id === tag)) || []
    : latestBook?.characters?.flatMap((slug) => characters.filter((character) => character.slug === slug || character.id === slug)) || [];
  const eligibleSlugs = new Set(participants.map((character) => character.slug));
  const configuredSelection = latestSource && configuredSlug === latestSource.slug && configuredCharacters?.length
    ? configuredCharacters.filter((slug) => eligibleSlugs.has(slug))
    : [];
  const selected = configuredSelection.length
    ? configuredSelection
    : latestSource?.kind === 'episode'
      ? participants.map((character) => character.slug)
      : participants.map((character) => character.slug);
  const crew = selected
    .map((slug) => characters.find((character) => character.slug === slug))
    .filter((character): character is Character => Boolean(character))
    .slice(0, 6);
  return crew;
}
