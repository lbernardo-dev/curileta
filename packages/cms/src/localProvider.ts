import { CMSProvider } from './CMSProvider';
import { Character, Book, Adventure, Video, Song, Location } from './models';

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'curileta',
    name: 'Curileta',
    slug: 'curileta',
    shortDescription: {
      es: 'Valiente, bondadosa y eternamente curiosa. Lleva siempre su mapa y su brújula mágica.',
      en: 'Brave, kind-hearted, and perpetually curious. Always carries her magical map and compass.',
    },
    biography: {
      es: 'Curileta nació en el corazón del Bosque Encantado. Su mayor anhelo es conocer todas las culturas, idiomas y maravillas naturales del planeta junto a sus inseparables amigos.',
      en: 'Curileta was born in the heart of the Enchanted Forest. Her greatest wish is to explore all cultures, languages, and natural wonders of the planet alongside her friends.',
    },
    species: 'Aventurera Principal',
    personality: ['Curiosa', 'Empática', 'Aventurera', 'Leal'],
    values: ['Respeto por la naturaleza', 'Amistad', 'Diversidad cultural'],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Retrato oficial de Curileta exploradora', en: 'Official portrait of explorer Curileta' },
    },
    relatedBooks: ['el-misterio-del-quetzal', 'las-auroras-de-hielo'],
    relatedLocations: ['mexico', 'islandia'],
  },
  {
    id: 'pompon',
    name: 'Pompón',
    slug: 'pompon',
    shortDescription: {
      es: 'El fiel compañero prudente. Cuida las provisiones y tiene un corazón gigantesco.',
      en: 'The prudent and loyal companion. Watches over the supplies and has a gigantic heart.',
    },
    biography: {
      es: 'Pompón es un conejo de pelaje blanco que ama la tranquilidad del Bosque Encantado, pero su lealtad incondicional hacia Curileta lo lleva a superar cualquier temor en cada expedición.',
      en: 'Pompón is a white-furred rabbit who loves the calm of the Enchanted Forest, but his loyalty to Curileta leads him to conquer all fears on each expedition.',
    },
    species: 'Conejo del Bosque Encantado',
    personality: ['Prudente', 'Tierno', 'Organizado', 'Divertido'],
    values: ['Cuidado mutuo', 'Previsión', 'Valentía interior'],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pompón con su pequeña mochila de explorador', en: 'Pompón with his explorer backpack' },
    },
    relatedBooks: ['el-misterio-del-quetzal'],
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    slug: 'quetzal',
    shortDescription: {
      es: 'El sabio vigía de los vientos tropicales. Conoce los secretos de las selvas y templos.',
      en: 'The wise lookout of tropical winds. Knows the secrets of rainforests and ancient temples.',
    },
    biography: {
      es: 'Guardián milenario de plumaje iridiscente que habita en las copas de los árboles de Mesoamérica. Ayuda a Curileta y sus amigos a descifrar leyendas y respetar la fauna local.',
      en: 'An ancient guardian with iridescent feathers dwelling in Mesoamerican tree canopies. Helps Curileta and her friends decipher legends and honor local wildlife.',
    },
    species: 'Ave Sagrada de Mesoamérica',
    personality: ['Sabio', 'Ágil', 'Protector', 'Poético'],
    values: ['Preservación de la selva', 'Historia ancestral', 'Libertad'],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Quetzal en pleno vuelo sobre la selva', en: 'Quetzal in full flight over the canopy' },
    },
    relatedBooks: ['el-misterio-del-quetzal'],
    relatedLocations: ['mexico'],
  },
  {
    id: 'lulu',
    name: 'Lulú',
    slug: 'lulu',
    shortDescription: {
      es: 'La experta en corrientes marinas, risas y saltos de ola. Siempre dispuesta a jugar.',
      en: 'The expert in ocean currents, laughter, and wave riding. Always ready to play.',
    },
    biography: {
      es: 'Lulú es una nutria marina apasionada por las aguas cristalinas. Conoce los secretos de los arrecifes y enseña a los exploradores a nadar sin miedo a lo desconocido.',
      en: 'Lulú is a sea otter passionate about crystal-clear waters. She knows reef secrets and teaches explorers to swim without fear of the unknown.',
    },
    species: 'Nutria Marina de las Costas',
    personality: ['Jovial', 'Atlética', 'Solidaria', 'Curiosa'],
    values: ['Protección de los océanos', 'Alegría de vivir', 'Generosidad'],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Lulú flotando feliz en el agua', en: 'Lulú floating joyfully in the water' },
    },
    relatedBooks: ['las-auroras-de-hielo'],
    relatedLocations: ['islandia'],
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'el-misterio-del-quetzal',
    title: {
      es: 'El Misterio del Quetzal Dorado',
      en: 'The Mystery of the Golden Quetzal',
    },
    slug: 'el-misterio-del-quetzal',
    subtitle: {
      es: 'Volumen 1 — México y las Selvas Mágicas',
      en: 'Volume 1 — Mexico and the Magic Rainforests',
    },
    coverImage: {
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Portada de El Misterio del Quetzal Dorado', en: 'Cover of The Mystery of the Golden Quetzal' },
    },
    description: {
      es: 'Curileta y Pompón aterrizan en las tierras del sol para descifrar un antiguo mapa de plumas y templos perdidos. Una historia sobre el coraje, la riqueza de las culturas mesoamericanas y el valor de no rendirse.',
      en: 'Curileta and Pompón land in the lands of the sun to decipher an ancient map of feathers and lost temples. A story about courage, Mesoamerican culture, and the spirit of perseverance.',
    },
    publicationDate: '2026-04-15',
    isbn: ['978-84-123456-0-1'],
    languages: ['Español', 'English'],
    ageRange: '5–10 años',
    pageCount: 48,
    publisher: 'Curileta Publishing',
    purchaseLinks: [
      { storeName: 'Casa del Libro', url: 'https://www.casadellibro.com' },
      { storeName: 'Amazon Libros', url: 'https://www.amazon.es' },
      { storeName: 'Librerías Independientes (TodosTusLibros)', url: 'https://www.todostuslibros.com' },
    ],
    characters: ['curileta', 'pompon', 'quetzal'],
    locations: ['mexico'],
  },
  {
    id: 'las-auroras-de-hielo',
    title: {
      es: 'Las Auroras del Confín Helado',
      en: 'The Auroras of the Frozen Realm',
    },
    slug: 'las-auroras-de-hielo',
    subtitle: {
      es: 'Volumen 2 — Islandia y los Géiseres',
      en: 'Volume 2 — Iceland and the Geysers',
    },
    coverImage: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Portada de Las Auroras del Confín Helado', en: 'Cover of The Auroras of the Frozen Realm' },
    },
    description: {
      es: 'Bajo el manto de la noche polar, Curileta y Lulú siguen el brillo de las auroras para devolver una piedra mágica al corazón de un géiser ancestral.',
      en: 'Beneath the polar night sky, Curileta and Lulú follow the aurora glow to return a magical stone to the heart of an ancient geyser.',
    },
    publicationDate: '2026-11-20',
    isbn: ['978-84-123456-1-8'],
    languages: ['Español', 'English'],
    ageRange: '6–12 años',
    pageCount: 56,
    publisher: 'Curileta Publishing',
    purchaseLinks: [
      { storeName: 'Preventa Oficial', url: 'https://curileta.com' },
    ],
    characters: ['curileta', 'lulu'],
    locations: ['islandia'],
  },
];

export class LocalCMSProvider implements CMSProvider {
  async getCharacters(locale?: string): Promise<Character[]> {
    return INITIAL_CHARACTERS;
  }

  async getCharacterBySlug(slug: string, locale?: string): Promise<Character | null> {
    return INITIAL_CHARACTERS.find((c) => c.slug === slug) || null;
  }

  async getBooks(locale?: string): Promise<Book[]> {
    return INITIAL_BOOKS;
  }

  async getBookBySlug(slug: string, locale?: string): Promise<Book | null> {
    return INITIAL_BOOKS.find((b) => b.slug === slug) || null;
  }

  async getAdventures(locale?: string): Promise<Adventure[]> {
    return [];
  }

  async getVideos(locale?: string): Promise<Video[]> {
    return [];
  }

  async getSongs(locale?: string): Promise<Song[]> {
    return [];
  }

  async getLocations(locale?: string): Promise<Location[]> {
    return [];
  }
}

export const cmsProvider = new LocalCMSProvider();
