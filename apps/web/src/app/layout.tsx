import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Las Aventuras de Curileta',
    default: 'Las Aventuras de Curileta — Web Oficial',
  },
  description:
    'El universo oficial de Curileta: libros, aventuras, canciones, episodios y amistad para familias y niños exploradores del mundo.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://curileta.com'),
};

import { ThemeProvider } from '@/providers/ThemeProvider';
import { AnalyticsRouteTracker } from '@/components/AnalyticsRouteTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-300 selection:text-emerald-950 transition-colors duration-300">
        <ThemeProvider>
          <AnalyticsRouteTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
