import { MetadataRoute } from 'next';
import { locales } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://curileta.com').replace(/\/$/, '');
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths = [
    '',
    '/curileta',
    '/personajes',
    '/libros',
    '/videos',
    '/canciones',
    '/fondos',
    '/mundo',
    '/novedades',
    '/eventos',
    '/colaboraciones',
    '/prensa',
    '/contacto',
    '/privacidad',
    '/cookies',
    '/legal',
    '/accesibilidad',
  ];

  // Rutas estáticas para cada idioma con hreflang
  for (const path of staticPaths) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            es: `${baseUrl}/es${path}`,
            en: `${baseUrl}/en${path}`,
          },
        },
      });
    }
  }

  // Rutas dinámicas de personajes
  const characters = await cmsProvider.getCharacters('es');
  for (const char of characters) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}/personajes/${char.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            es: `${baseUrl}/es/personajes/${char.slug}`,
            en: `${baseUrl}/en/personajes/${char.slug}`,
          },
        },
      });
    }
  }

  // Rutas dinámicas de libros
  const books = await cmsProvider.getBooks('es');
  for (const book of books) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}/libros/${book.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: {
            es: `${baseUrl}/es/libros/${book.slug}`,
            en: `${baseUrl}/en/libros/${book.slug}`,
          },
        },
      });
    }
  }

  return routes;
}
