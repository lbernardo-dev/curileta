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
  }, [pathname]);

  return null;
}
