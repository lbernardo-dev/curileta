import type { Book } from '@curileta/cms';
import { CURILETA_BOOK_SLUG } from '@/lib/amazon-marketplace';

const bookAssetRoot = '/images/books/las-aventuras-de-curileta';

export const CURILETA_BOOK_BACK_COVER = {
  src: `${bookAssetRoot}/contraportada.webp`,
  width: 1600,
  height: 2560,
  alt: {
    es: 'Contraportada de Las Aventuras de Curileta, con la sinopsis del viaje y Curileta junto a Pompón.',
    en: 'Back cover of The Adventures of Curileta, with the journey synopsis and Curileta beside Pompón.',
  },
} as const;

export const CURILETA_BOOK_APLUS = [
  {
    src: `${bookAssetRoot}/a-plus/01-mapa-del-viaje.webp`,
    width: 1595,
    height: 986,
    title: {
      es: 'Un mapa para recorrer el mundo con Curileta',
      en: 'A map for travelling the world with Curileta',
    },
    alt: {
      es: 'Curileta recorre un mapa ilustrado con lugares y monumentos de sus aventuras.',
      en: 'Curileta follows an illustrated map of places and landmarks from her adventures.',
    },
  },
  {
    src: `${bookAssetRoot}/a-plus/02-lo-que-aporta-el-libro.webp`,
    width: 1594,
    height: 986,
    title: {
      es: 'Curiosidad, culturas y aprendizaje en cada historia',
      en: 'Curiosity, cultures and learning in every story',
    },
    alt: {
      es: 'Contenido A+ que presenta seis motivos para leer el libro: curiosidad, culturas, aventuras, datos reales, lectura compartida y tesoros de cada ciudad.',
      en: 'A+ content presenting six reasons to read the book: curiosity, cultures, adventures, real facts, shared reading and treasures from each city.',
    },
  },
  {
    src: `${bookAssetRoot}/a-plus/03-nuevas-amistades.webp`,
    width: 970,
    height: 600,
    title: {
      es: 'Nuevos amigos en cada rincón del mundo',
      en: 'New friends in every corner of the world',
    },
    alt: {
      es: 'Curileta conoce animales y personajes de distintos lugares y culturas.',
      en: 'Curileta meets animals and characters from different places and cultures.',
    },
  },
  {
    src: `${bookAssetRoot}/a-plus/04-curileta-y-pompon.webp`,
    width: 970,
    height: 600,
    title: {
      es: 'Las cartas mantienen cerca a Curileta y Pompón',
      en: 'Letters keep Curileta and Pompón close',
    },
    alt: {
      es: 'Curileta escribe a Pompón durante sus viajes y ambos conservan su amistad a través de las cartas.',
      en: 'Curileta writes to Pompón during her travels, keeping their friendship alive through letters.',
    },
  },
] as const;

export function getBookCoverImage(
  book: Pick<Book, 'id' | 'slug' | 'coverImage'>,
): Book['coverImage'] {
  if (book.slug !== CURILETA_BOOK_SLUG && book.id !== CURILETA_BOOK_SLUG) {
    return book.coverImage;
  }

  return {
    url: `${bookAssetRoot}/portada.webp`,
    alt: {
      es: 'Portada publicada de Las Aventuras de Curileta, con Curileta, Pompón y sus amigos listos para viajar.',
      en: 'Published cover of The Adventures of Curileta, with Curileta, Pompón and their friends ready to travel.',
    },
  };
}
