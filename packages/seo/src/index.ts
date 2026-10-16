export function generateBookSchema(book: {
  title: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  datePublished: string;
  description: string;
  image: string;
  inLanguage: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    isbn: book.isbn,
    author: {
      '@type': 'Person',
      name: book.author || 'Las Aventuras de Curileta',
    },
    publisher: {
      '@type': 'Organization',
      name: book.publisher || 'Curileta Publishing',
    },
    datePublished: book.datePublished,
    description: book.description,
    image: book.image,
    inLanguage: book.inLanguage,
  };
}

export function generateVideoSchema(video: {
  title: string;
  description: string;
  thumbnailUrl: string[];
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
  };
}

export function generateOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Las Aventuras de Curileta',
    alternateName: ['Curileta', 'Curileta Oficial'],
    url: siteUrl,
    logo: `${siteUrl}/images/curileta-logo.png`,
    sameAs: [
      'https://www.youtube.com/@AventurasdeCurileta',
    ],
  };
}

export function generateSeriesSchema(series: {
  siteUrl: string;
  inLanguage?: string;
  name?: string;
  alternateNames?: string[];
  description?: string;
  genre?: string[];
  trailerUrl?: string;
  characters?: Array<{
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    role?: string;
  }>;
  locations?: Array<{
    name: string;
    country: string;
    slug?: string;
    description?: string;
  }>;
  keywords?: string[];
}) {
  const language = series.inLanguage || 'es';
  const isEn = language === 'en';
  const defaultCharacters = [
    {
      name: 'Curileta',
      description: isEn
        ? 'Curious explorer and mapmaker lizard with sticky paws and a traveler backpack.'
        : 'Pequeña exploradora y cartógrafa curiosa con sombrero y mochila de viaje.',
    },
    {
      name: 'Pompón',
      description: isEn
        ? 'Loyal friend and guardian of the enchanted forest who keeps travel letters.'
        : 'Fiel amigo y guardián del bosque encantado que custodia las cartas de viaje.',
    },
  ];

  const characterList = (series.characters && series.characters.length > 0)
    ? series.characters.map((char) => ({
        '@type': 'Person',
        name: char.name,
        ...(char.description || char.role ? { description: char.description || char.role } : {}),
        ...(char.image ? { image: char.image } : {}),
        ...(char.slug ? { url: `${series.siteUrl}/${language}/personajes/${char.slug}` } : {}),
      }))
    : defaultCharacters.map((char) => ({
        '@type': 'Person',
        name: char.name,
        description: char.description,
      }));

  const locationsList = series.locations && series.locations.length > 0
    ? series.locations.map((loc) => ({
        '@type': 'Place',
        name: loc.name,
        containedInPlace: {
          '@type': 'Country',
          name: loc.country,
        },
        ...(loc.description ? { description: loc.description } : {}),
        ...(loc.slug ? { url: `${series.siteUrl}/${language}/destinos/${loc.slug}` } : {}),
      }))
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    '@id': `${series.siteUrl}/#series`,
    name: series.name || (isEn ? 'Curileta Adventures' : 'Las Aventuras de Curileta'),
    alternateName: series.alternateNames || [
      'Curileta',
      'Curileta Serie Animada',
      'Las Aventuras de Curileta Serie',
      'Curileta Adventures',
      'Curileta serie animada española',
    ],
    url: `${series.siteUrl}/${language}`,
    description:
      series.description ||
      (isEn
        ? 'Original Spanish animated series and adventure books for children and families. Follow explorer Curileta and Pompon as they travel across continents discovering geography, wildlife, diverse cultures and friendship.'
        : 'Serie animada española original y libros infantiles de aventuras y viajes por el mundo. Sigue a la exploradora Curileta y a Pompón por los cinco continentes descubriendo geografía, naturaleza, culturas y valores de amistad.'),
    inLanguage: [language],
    countryOfOrigin: {
      '@type': 'Country',
      name: 'España',
    },
    genre: series.genre || (isEn
      ? [
          'Spanish animated series',
          'Children animated series',
          'World travel adventures',
          'Geography for kids',
          'Educational',
          'Family animation',
        ]
      : [
          'Serie animada',
          'Serie animada española',
          'Serie infantil de animación',
          'Viajes por el mundo',
          'Aventuras infantiles',
          'Geografía y diversidad cultural',
          'Dibujos animados educativos',
          'Familiar',
        ]),
    ...(series.keywords ? { keywords: series.keywords.join(', ') } : {}),
    creator: {
      '@type': 'Organization',
      name: 'Las Aventuras de Curileta',
      url: series.siteUrl,
    },
    productionCompany: {
      '@type': 'Organization',
      name: 'Las Aventuras de Curileta',
      url: series.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Las Aventuras de Curileta',
      url: series.siteUrl,
    },
    character: characterList,
    ...(locationsList && locationsList.length > 0
      ? {
          contentLocation: locationsList,
          spatialCoverage: locationsList,
        }
      : {}),
    about: [
      {
        '@type': 'Thing',
        name: isEn ? 'World Travel & Geography' : 'Viajes por el mundo y geografía infantil',
      },
      {
        '@type': 'Thing',
        name: isEn ? 'Wildlife & Nature Exploration' : 'Exploración de la naturaleza y fauna mundial',
      },
      {
        '@type': 'Thing',
        name: isEn ? 'Cultural Diversity & Friendship' : 'Diversidad cultural y amistad',
      },
    ],
    ...(series.trailerUrl
      ? {
          trailer: {
            '@type': 'VideoObject',
            name: isEn
              ? 'Curileta Animated Series Trailer'
              : 'Tráiler oficial de la serie animada Curileta',
            description: isEn
              ? 'Watch the official trailer for the Spanish animated series Curileta.'
              : 'Descubre el tráiler oficial de la serie animada española infantil Las Aventuras de Curileta.',
            thumbnailUrl: [`${series.siteUrl}/images/hero/curileta-world-expedition-clean-v1.jpg`],
            uploadDate: '2025-01-01',
            embedUrl: series.trailerUrl,
          },
        }
      : {}),
  };
}

export function generateCharactersItemListSchema(
  characters: Array<{ name: string; slug: string; description?: string }>,
  siteUrl: string,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/${locale}#characters-list`,
    name: locale === 'en' ? 'Characters of the Curileta Series' : 'Personajes de la serie Curileta',
    itemListElement: characters.map((char, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: char.name,
      url: `${siteUrl}/${locale}/personajes/${char.slug}`,
      ...(char.description ? { description: char.description } : {}),
    })),
  };
}

export function generateDestinationsItemListSchema(
  locations: Array<{ name: string; country: string; slug: string }>,
  siteUrl: string,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/${locale}#destinations-list`,
    name: locale === 'en' ? 'Travel Destinations & Route of Curileta' : 'Destinos y ruta de viajes de Curileta',
    itemListElement: locations.map((loc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${loc.name} (${loc.country})`,
      url: `${siteUrl}/${locale}/destinos/${loc.slug}`,
    })),
  };
}

export function generateFAQSchema(faqList: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

