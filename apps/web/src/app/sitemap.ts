import { MetadataRoute } from 'next';
import { locales } from '@curileta/i18n';
import { cmsProvider } from '@/lib/cms';
import { getAuthorPages } from '@/lib/author-pages.server';
import { getGalleryData } from '@/lib/gallery.server';

// Keep the sitemap current at runtime, even when a backend is unavailable during build.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com').replace(/\/$/, '');
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths = [
    '',
    '/curileta',
    '/personajes',
    '/libros',
    '/autora',
    '/galeria',
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

  const authors = await getAuthorPages();
  for (const author of authors) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}/autora/${author.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            es: `${baseUrl}/es/autora/${author.slug}`,
            en: `${baseUrl}/en/autora/${author.slug}`,
          },
        },
      });
    }
  }

  const galleryData = await getGalleryData();
  for (const category of galleryData.categories) {
    for (const locale of locales) {
      const query = new URLSearchParams({ categoria: category.slug });
      const categoryUrl = `${baseUrl}/${locale}/galeria?${query.toString()}`;
      routes.push({
        url: categoryUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: {
          languages: {
            es: `${baseUrl}/es/galeria?${new URLSearchParams({ categoria: category.slug }).toString()}`,
            en: `${baseUrl}/en/galeria?${new URLSearchParams({ categoria: category.slug }).toString()}`,
          },
        },
      });
    }
  }

  for (const item of galleryData.items) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}/galeria?imagen=${encodeURIComponent(item.slug)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: {
          languages: {
            es: `${baseUrl}/es/galeria?imagen=${encodeURIComponent(item.slug)}`,
            en: `${baseUrl}/en/galeria?imagen=${encodeURIComponent(item.slug)}`,
          },
        },
      });
    }
  }

  return routes;
}
