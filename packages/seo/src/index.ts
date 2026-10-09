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
    name: 'Las Aventuras de Curileta',
    url: siteUrl,
    logo: `${siteUrl}/images/curileta-logo.png`,
    sameAs: [
      'https://www.youtube.com/@curileta',
    ],
  };
}
