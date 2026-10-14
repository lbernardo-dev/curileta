import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { ArrowLeft, Compass, MapPin, Mountain } from 'lucide-react';
import { ShareActions } from '@/components/ShareActions';
import { DestinationMediaGallery } from '@/features/destinations/DestinationMediaGallery';
import { getPublicDestinations } from '@/lib/destinations.server';
import { cmsProvider } from '@/lib/cms';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const locations = await getPublicDestinations(locale as Locale);
  const location = locations.find((item) => item.slug === slug);
  if (!location) return {};
  const title = location.name[locale] || location.name.es;
  const description = location.description[locale] || location.description.es;
  return {
    title: `${title} — ${locale === 'en' ? 'Curileta’s Journey' : 'El viaje de Curileta'}`,
    description,
    alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/${locale}/destinos/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      images: location.heroImage.url ? [{ url: location.heroImage.url, alt: location.heroImage.alt[locale] || location.heroImage.alt.es }] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const [locations, characters] = await Promise.all([
    getPublicDestinations(locale as Locale),
    cmsProvider.getCharacters(locale as Locale),
  ]);
  const location = locations.find((item) => item.slug === slug);
  if (!location) notFound();
  const isEn = locale === 'en';
  const name = location.name[locale] || location.name.es;
  const country = location.country[locale] || location.country.es;
  const relatedCharacters = (location.characters || [])
    .map((id) => characters.find((character) => character.slug === id || character.id === id))
    .filter((character): character is (typeof characters)[number] => Boolean(character));

  return <main id="main-content" className="min-h-screen bg-[#faf9f4] px-5 pb-24 pt-12 text-[#20352c] sm:px-8 sm:pt-16 lg:px-12">
    <div className="mx-auto max-w-7xl">
      <Link href={`/${locale}/destinos`} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-fluid hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"><ArrowLeft className="h-4 w-4" />{isEn ? 'All destinations' : 'Todos los destinos'}</Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <DestinationMediaGallery location={location} locale={locale as Locale} />
        <article className="flex flex-col justify-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800"><Compass className="h-4 w-4" />{isEn ? 'A stop on the journey' : 'Una parada del viaje'}</p>
          <h1 style={{ textWrap: 'balance' }} className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{name}</h1>
          <p className="mt-3 inline-flex items-center gap-2 text-base font-medium text-[#5c6b61]"><MapPin className="h-4 w-4 text-amber-600" />{country}</p>
          <p style={{ textWrap: 'pretty' }} className="mt-6 max-w-2xl text-base leading-7 text-[#4d5f54]">{location.description[locale] || location.description.es}</p>
          {location.theme && <p className="mt-5 rounded-xl border border-[#dbe1d4] bg-[#fffdf8] p-4 text-sm leading-6 text-[#486454]"><span className="font-semibold">{isEn ? 'Journey theme: ' : 'Tema del viaje: '}</span>{location.theme[locale] || location.theme.es}</p>}
          <div className="mt-5 flex flex-wrap gap-2">{location.climate?.[locale] && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef2ea] px-3 py-1.5 text-xs font-medium text-[#486454]"><Mountain className="h-3.5 w-3.5" />{location.climate[locale]}</span>}{(location.segments || []).map((segment) => <span key={segment} className="rounded-full bg-[#eef2ea] px-3 py-1.5 text-xs font-medium text-[#486454]">{segment.replaceAll('-', ' ')}</span>)}</div>
          {location.passportStamp?.code && <p className="mt-5 text-xs font-medium uppercase tracking-wide text-[#718078]">{isEn ? 'Passport stamp' : 'Matasellos de pasaporte'} · {location.passportStamp.code}</p>}
          <div className="mt-4"><ShareActions contentType="location" contentSlug={location.slug} title={name} description={location.description[locale] || location.description.es} url={`/${locale}/destinos/${location.slug}`} locale={locale} /></div>
        </article>
      </div>

      <div className="mt-14 grid gap-8 border-t border-[#dbe1d4] pt-10 lg:grid-cols-[1fr_0.8fr]">
        {location.curiosities && location.curiosities.length > 0 && <section aria-labelledby="destination-curiosities-heading"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{isEn ? 'Look a little closer' : 'Mira más de cerca'}</p><h2 id="destination-curiosities-heading" className="mt-2 font-display text-2xl font-semibold">{isEn ? 'Small discoveries' : 'Pequeños descubrimientos'}</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{location.curiosities.map((curiosity, index) => <li key={`${location.slug}-curiosity-${index}`} className="rounded-xl border border-[#dbe1d4] bg-[#fffdf8] p-4 text-sm leading-6 text-[#4d5f54]">{curiosity[locale] || curiosity.es}</li>)}</ul></section>}
        {relatedCharacters.length > 0 && <section aria-labelledby="destination-characters-heading"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{isEn ? 'Friends along the way' : 'Amistades del camino'}</p><h2 id="destination-characters-heading" className="mt-2 font-display text-2xl font-semibold">{isEn ? 'Meet the local guides' : 'Conoce a quienes guían la parada'}</h2><ul className="mt-4 flex flex-wrap gap-2">{relatedCharacters.map((character) => <li key={character.slug}><Link href={`/${locale}/personajes/${character.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-[#cbd6c8] bg-[#fffdf8] px-4 py-2 text-sm font-semibold transition-all duration-700 ease-fluid hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700">{character.name}</Link></li>)}</ul></section>}
      </div>

      <section className="mt-14 rounded-2xl border border-[#dbe1d4] bg-[#e9efe4] p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{isEn ? 'Keep exploring' : 'Sigue explorando'}</p><h2 className="mt-2 font-display text-2xl font-semibold">{isEn ? 'There is another story nearby.' : 'Hay otra historia a la vuelta del mapa.'}</h2></div><Link href={`/${locale}/destinos`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-[#27634e] active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700">{isEn ? 'Browse every destination' : 'Ver todos los destinos'}<span aria-hidden="true">→</span></Link></div></section>
    </div>
  </main>;
}
