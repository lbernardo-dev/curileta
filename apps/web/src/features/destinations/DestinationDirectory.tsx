'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Location } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { Compass, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import { ContentImage } from '@/components/ContentImage';

export function DestinationDirectory({ locale, locations }: { locale: Locale; locations: Location[] }) {
  const isEn = locale === 'en';
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('all');
  const [segment, setSegment] = useState('all');
  const countries = useMemo(() => [...new Set(locations.map((location) => location.country[locale] || location.country.es))].sort((a, b) => a.localeCompare(b, locale)), [locations, locale]);
  const segments = useMemo(() => [...new Set(locations.flatMap((location) => location.segments || []))].sort((a, b) => a.localeCompare(b)), [locations]);
  const results = useMemo(() => locations.filter((location) => {
    const text = [location.name.es, location.name.en, location.country.es, location.country.en, location.theme?.es, location.theme?.en, location.description.es, location.description.en, ...(location.segments || [])].filter(Boolean).join(' ').toLocaleLowerCase(locale);
    if (query && !text.includes(query.toLocaleLowerCase(locale))) return false;
    if (country !== 'all' && (location.country[locale] || location.country.es) !== country) return false;
    if (segment !== 'all' && !location.segments?.includes(segment)) return false;
    return true;
  }), [locations, query, country, segment, locale]);
  const filtersActive = Boolean(query || country !== 'all' || segment !== 'all');

  function clearFilters() {
    setQuery('');
    setCountry('all');
    setSegment('all');
  }

  return <main id="main-content" className="min-h-screen bg-[#faf9f4] px-5 pb-24 pt-16 text-[#20352c] sm:px-8 sm:pt-20 lg:px-12">
    <div className="mx-auto max-w-7xl">
      <Link href={`/${locale}`} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-fluid hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700">← {isEn ? 'Back to the home page' : 'Volver a la portada'}</Link>
      <header className="mt-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800"><Compass className="h-4 w-4" />{isEn ? 'Curileta’s illustrated atlas' : 'Atlas ilustrado de Curileta'}</div>
        <h1 style={{ textWrap: 'balance' }} className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{isEn ? 'Every place has a story to discover.' : 'Cada lugar guarda una historia por descubrir.'}</h1>
        <p style={{ textWrap: 'pretty' }} className="mt-4 max-w-2xl text-base leading-7 text-[#5c6b61]">{isEn ? 'Browse every stop on Curileta’s journey. Search by place, country or theme, then open a destination to see its photos and video scenes.' : 'Recorre todas las paradas del viaje de Curileta. Busca por lugar, país o tema y abre cada destino para ver sus fotografías y escenas de vídeo.'}</p>
      </header>

      <section className="mt-9 rounded-2xl border border-[#dbe1d4] bg-[#fffdf8] p-5 shadow-xs sm:p-6" aria-labelledby="destination-filters-heading">
        <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-emerald-800" /><h2 id="destination-filters-heading" className="text-sm font-semibold">{isEn ? 'Find a destination' : 'Encuentra un destino'}</h2></div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.6fr]">
          <label className="text-sm font-medium">{isEn ? 'Search' : 'Buscar'}
            <span className="relative mt-1.5 block"><Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718078]" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isEn ? 'Place, country or story theme' : 'Lugar, país o tema del viaje'} className="block min-h-11 w-full rounded-lg border border-[#cbd6c8] bg-white py-2.5 pl-10 pr-3 text-sm text-[#20352c] outline-hidden transition-all duration-700 ease-fluid focus-visible:ring-2 focus-visible:ring-emerald-700" /></span>
          </label>
          <label className="text-sm font-medium">{isEn ? 'Country or region' : 'País o región'}<select value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#cbd6c8] bg-white px-3 py-2.5 text-sm outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="all">{isEn ? 'All countries' : 'Todos los países'}</option>{countries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
        {segments.length > 0 && <div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5c6b61]">{isEn ? 'Story segments' : 'Segmentos del relato'}</p><div className="flex flex-wrap gap-2" role="group" aria-label={isEn ? 'Filter by story segment' : 'Filtrar por segmento'}><button type="button" aria-pressed={segment === 'all'} onClick={() => setSegment('all')} className={`min-h-9 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-700 ease-fluid focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 ${segment === 'all' ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-[#cbd6c8] bg-white hover:bg-emerald-50'}`}>{isEn ? 'All segments' : 'Todos'}</button>{segments.map((item) => <button type="button" key={item} aria-pressed={segment === item} onClick={() => setSegment(item)} className={`min-h-9 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-700 ease-fluid focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 ${segment === item ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-[#cbd6c8] bg-white hover:bg-emerald-50'}`}>{item.replaceAll('-', ' ')}</button>)}</div></div>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6e9e1] pt-4"><p aria-live="polite" className="text-sm text-[#5c6b61]">{isEn ? `${results.length} of ${locations.length} destinations` : `${results.length} de ${locations.length} destinos`}</p>{filtersActive && <button type="button" onClick={clearFilters} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"><X className="h-4 w-4" />{isEn ? 'Clear filters' : 'Limpiar filtros'}</button>}</div>
      </section>

      {results.length ? <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((location, index) => <li key={location.slug}>
          <Link href={`/${locale}/destinos/${location.slug}`} className="group block h-full overflow-hidden rounded-2xl bg-[#fffdf8] shadow-[0_16px_55px_rgba(24,54,41,0.08)] ring-1 ring-[#20352c]/8 transition-all duration-700 ease-fluid hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700">
            <div className="relative aspect-4/3 overflow-hidden bg-[#e7ece5]">{location.heroImage.url ? <ContentImage src={location.heroImage.url} alt={location.heroImage.alt[locale] || location.heroImage.alt.es || location.name[locale] || location.name.es} loading={index < 3 ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-700 ease-fluid group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-emerald-900"><MapPin className="h-8 w-8" /></div>}<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[#12261f]/75 px-5 py-4 text-white"><span className="inline-flex items-center gap-1.5 text-sm font-medium"><MapPin className="h-4 w-4 text-amber-300" />{location.country[locale] || location.country.es}</span><span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#20352c]">{String(index + 1).padStart(2, '0')}</span></div></div>
            <div className="p-5 sm:p-6"><h2 style={{ textWrap: 'balance' }} className="font-display text-2xl font-semibold tracking-tight text-[#20352c]">{location.name[locale] || location.name.es}</h2><p style={{ textWrap: 'pretty' }} className="mt-3 line-clamp-3 text-sm leading-6 text-[#4d5f54]">{location.description[locale] || location.description.es}</p><div className="mt-4 flex flex-wrap gap-1.5">{(location.segments || []).map((item) => <span key={item} className="rounded-full bg-[#eef2ea] px-2.5 py-1 text-xs font-medium text-[#486454]">{item.replaceAll('-', ' ')}</span>)}</div><span className="mt-5 inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-emerald-900">{isEn ? 'Open destination' : 'Abrir destino'}<span aria-hidden="true" className="transition-transform duration-700 ease-fluid group-hover:translate-x-1">→</span></span></div>
          </Link>
        </li>)}
      </ul> : <section className="mt-8 rounded-2xl border border-dashed border-[#cbd6c8] bg-[#fffdf8] px-6 py-12 text-center" aria-live="polite"><Search className="mx-auto h-7 w-7 text-emerald-800" /><h2 className="mt-3 font-display text-xl font-semibold">{isEn ? 'No destinations match those filters' : 'No encontramos destinos con esos filtros'}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#5c6b61]">{isEn ? 'Try another search or clear the filters to see the whole journey.' : 'Prueba otra búsqueda o limpia los filtros para recorrer todo el viaje.'}</p><button type="button" onClick={clearFilters} className="mt-4 min-h-10 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700">{isEn ? 'Show every destination' : 'Mostrar todos los destinos'}</button></section>}
    </div>
  </main>;
}
