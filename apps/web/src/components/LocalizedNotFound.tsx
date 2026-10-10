'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SeasonalEvent } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { Compass, Home, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SeasonalThemeProvider } from '@/providers/SeasonalThemeProvider';

function NotFoundContent({ locale }: { locale: Locale }) {
  const isEn = locale === 'en';

  return (
    <section className="grid min-h-[65vh] place-items-center bg-[var(--background-canvas)] px-5 py-16 text-[var(--text-primary)]">
      <div className="max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--background-secondary)] text-[var(--seasonal-accent-strong)] ring-1 ring-[var(--border-subtle)]"><Compass className="h-8 w-8" /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--seasonal-accent-strong)]">{isEn ? 'A wrong turn on the map' : 'Un desvío en el mapa'}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{isEn ? 'This page is not here' : 'Esta página no está aquí'}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">{isEn ? 'The address may have changed, or this trail may not exist yet. Let’s find another part of the adventure.' : 'Puede que la dirección haya cambiado o que este camino todavía no exista. Busquemos otra parte de la aventura.'}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={'/' + locale} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]"><Home className="h-4 w-4" />{isEn ? 'Back to home' : 'Volver al inicio'}</Link>
          <Link href={'/' + locale + '/mundo'} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--background-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)] transition hover:text-[var(--seasonal-accent-strong)]"><Search className="h-4 w-4" />{isEn ? 'Explore the world' : 'Explorar el mundo'}</Link>
        </div>
      </div>
    </section>
  );
}

export function LocalizedNotFound({ withSiteChrome = false }: { withSiteChrome?: boolean }) {
  const pathname = usePathname() || '/es';
  const locale = (pathname.split('/')[1] === 'en' ? 'en' : 'es') as Locale;
  const [activeEvent, setActiveEvent] = useState<SeasonalEvent | null>(null);

  useEffect(() => {
    if (!withSiteChrome) return;
    const controller = new AbortController();
    fetch('/api/v1/events/active?locale=' + locale, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result: { data?: SeasonalEvent | null } | null) => setActiveEvent(result?.data || null))
      .catch(() => setActiveEvent(null));
    return () => controller.abort();
  }, [locale, withSiteChrome]);

  if (!withSiteChrome) return <NotFoundContent locale={locale} />;

  return (
    <SeasonalThemeProvider activeEvent={activeEvent}>
      <Header locale={locale} />
      <main id="main-content" className="flex-grow"><NotFoundContent locale={locale} /></main>
      <Footer locale={locale} />
    </SeasonalThemeProvider>
  );
}
