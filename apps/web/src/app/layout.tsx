import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { generateOrganizationSchema } from '@curileta/seo';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com').replace(/\/$/, '');
const organizationSchema = generateOrganizationSchema(siteUrl);
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Curileta',
  alternateName: ['Las Aventuras de Curileta', 'Curileta Adventures', 'Curileta — Web Oficial'],
  url: siteUrl,
  inLanguage: ['es', 'en'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/es/videos?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const metadata: Metadata = {
  title: {
    template: '%s | Las Aventuras de Curileta',
    default: 'Curileta — Serie Animada en Español y Libros Infantiles | Web Oficial',
  },
  description:
    'Web oficial de Curileta: serie animada infantil original en español y libros de aventuras para familias. Descubre episodios, canciones, dibujos y viajes por el mundo.',
  metadataBase: new URL(siteUrl),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'Las Aventuras de Curileta',
    title: 'Curileta — Serie Animada en Español y Libros Infantiles | Web Oficial',
    description:
      'Web oficial de Curileta: serie animada infantil original en español y libros de aventuras para familias. Descubre episodios, canciones, dibujos y viajes por el mundo.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/hero/curileta-world-expedition-clean-v1.jpg`,
        width: 1200,
        height: 630,
        alt: 'Las Aventuras de Curileta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curileta — Serie Animada en Español y Libros Infantiles | Web Oficial',
    description:
      'Web oficial de Curileta: serie animada infantil original en español y libros de aventuras para familias. Descubre episodios, canciones, dibujos y viajes por el mundo.',
    images: [`${siteUrl}/images/hero/curileta-world-expedition-clean-v1.jpg`],
  },
};

import { ThemeProvider } from '@/providers/ThemeProvider';
import { AnalyticsRouteTracker } from '@/components/AnalyticsRouteTracker';
import { AnalyticsConsentManager } from '@/components/AnalyticsConsentManager';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var locale = window.location.pathname.split('/')[1];
                  document.documentElement.lang = locale === 'en' ? 'en' : 'es';
                  var stored = localStorage.getItem('curileta-theme');
                  var mql = window.matchMedia('(prefers-color-scheme: dark)');
                  var isDark = stored === 'dark' || ((!stored || stored === 'system') && mql.matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geist.variable} font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-300 selection:text-emerald-950 transition-colors duration-300`}>
        <ThemeProvider>
          <AnalyticsConsentManager />
          <AnalyticsRouteTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
