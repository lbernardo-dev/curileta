import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Las Aventuras de Curileta',
    default: 'Las Aventuras de Curileta — Web Oficial',
  },
  description:
    'El universo oficial de Curileta: libros, aventuras, canciones, episodios y amistad para familias y niños exploradores del mundo.',
  metadataBase: new URL('https://curileta.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-300 selection:text-emerald-950">
        {children}
      </body>
    </html>
  );
}
