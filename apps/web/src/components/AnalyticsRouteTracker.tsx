'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@curileta/analytics';

export function AnalyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === '/admin' || pathname.startsWith('/admin/')) return;
    const locale = pathname.split('/')[1] === 'en' ? 'en' : 'es';
    analytics.track({ name: 'page_view', properties: { path: pathname, locale } });

    const bookRoute = pathname.match(/^\/(?:es|en)\/libros\/([^/]+)$/);
    if (bookRoute) {
      analytics.track({ name: 'book_view', properties: { bookId: bookRoute[1], slug: bookRoute[1] } });
    }

    const characterRoute = pathname.match(/^\/(?:es|en)\/personajes\/([^/]+)$/);
    if (characterRoute) {
      analytics.track({ name: 'character_view', properties: { characterId: characterRoute[1], name: characterRoute[1] } });
    }
  }, [pathname]);

  return null;
}
