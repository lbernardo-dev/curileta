import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com').replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
