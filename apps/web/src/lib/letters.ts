import type { LetterItem, LetterPhoto } from '@curileta/cms';

const emptyLocalized = { es: '', en: '' };

function censoredPhoto(photo?: LetterPhoto): LetterPhoto {
  return {
    title: emptyLocalized,
    fact: emptyLocalized,
    tag: '',
    imageUrl: photo?.censoredImageUrl || '',
    visibility: 'censored',
  };
}

function publicPhoto(photo: LetterPhoto): LetterPhoto {
  return {
    photoId: photo.photoId,
    title: photo.title,
    fact: photo.fact,
    tag: photo.tag,
    tagEn: photo.tagEn,
    imageUrl: photo.imageUrl,
    visibility: 'public',
  };
}

function safeEpisodeUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isYouTube = host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com');
    return url.protocol === 'https:' && !url.username && !url.password && isYouTube ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Return only the content that the public landing page is allowed to receive. */
export function getLandingLetters(letters: LetterItem[]): LetterItem[] {
  const visibleLetters: LetterItem[] = [];
  for (const letter of letters) {
    const status = letter.publicationStatus || 'public';
    if (status !== 'public' && status !== 'censored') continue;

    if (status === 'censored') {
      visibleLetters.push({
        ...letter,
        publicationStatus: 'censored',
        episodeUrl: safeEpisodeUrl(letter.episodeUrl),
        greeting: emptyLocalized,
        body: { es: [], en: [] },
        signOff: emptyLocalized,
        photos: (letter.photos || [])
          .filter((photo) => photo.visibility !== 'hidden')
          .map((photo) => censoredPhoto(photo)),
      });
      continue;
    }

    visibleLetters.push({
      ...letter,
      publicationStatus: 'public',
      episodeUrl: safeEpisodeUrl(letter.episodeUrl),
      photos: (letter.photos || [])
        .filter((photo) => (photo.visibility || 'public') === 'public' || photo.visibility === 'censored')
        .map((photo) => (photo.visibility === 'censored' ? censoredPhoto(photo) : publicPhoto(photo))),
    });
  }
  return visibleLetters;
}
