'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import type { Character, Location, NarrativeMilestone } from '@curileta/cms';
import { ArrowLeft, ArrowRight, Compass, MapPin, Stamp } from 'lucide-react';

const CURILETA_ROUTE = [
  'espana-inicio', 'mexico', 'peru', 'egipto', 'islandia', 'japon',
  'australia', 'nueva-zelanda', 'china', 'italia', 'francia', 'espana-regreso',
];

export function CharacterPassportSpread({
  character,
  locale,
  locations,
  milestones,
  relationship,
}: {
  character: Character;
  locale: Locale;
  locations: Location[];
  milestones: NarrativeMilestone[];
  relationship: string;
}) {
  const isEn = locale === 'en';
  const routeLocations = useMemo(() => {
    const related = locations.filter((location) => character.relatedLocations?.includes(location.id) || character.relatedLocations?.includes(location.slug));
    return related.sort((left, right) => {
      const leftIndex = CURILETA_ROUTE.findIndex((slug) => slug === left.slug || slug === left.id);
      const rightIndex = CURILETA_ROUTE.findIndex((slug) => slug === right.slug || slug === right.id);
      return (leftIndex < 0 ? CURILETA_ROUTE.length : leftIndex) - (rightIndex < 0 ? CURILETA_ROUTE.length : rightIndex);
    });
  }, [character.relatedLocations, locations]);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = routeLocations[activeIndex];
  const currentMilestone = current
    ? milestones.find((milestone) => milestone.charactersPresent.includes(character.slug)
      && (milestone.place.es.toLowerCase().includes((current.name.es || '').split('—')[0].trim().toLowerCase())
        || milestone.country.es === current.country.es))
    : undefined;
  const role = character.passportRole?.[locale] || character.passportRole?.es || character.species || '';

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-[#c6b78f] bg-[#f2ead6] shadow-[0_24px_70px_rgba(50,41,23,0.12)] dark:border-[#665c43]" aria-labelledby="passport-title">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6c9a7] bg-[#e9dfc5] px-5 py-4 dark:border-[#4a4436] dark:bg-[#27251e] sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b79e5f] bg-[#f7f0dd] text-[#775b1c]"><Compass className="h-5 w-5" /></span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#74643b] dark:text-amber-200">{isEn ? 'Explorer document' : 'Documento de expedición'}</p>
            <h2 id="passport-title" className="font-display text-xl font-bold text-[#302a1c] dark:text-[#f5eddb]">{isEn ? `${character.name}’s passport` : `Pasaporte de ${character.name}`}</h2>
          </div>
        </div>
        {routeLocations.length > 0 && <span className="rounded-full border border-[#c7b98f] bg-[#f8f2e1] px-3 py-1 text-xs font-semibold text-[#665630] dark:border-[#4a4436] dark:bg-[#181818] dark:text-amber-100">{isEn ? `${routeLocations.length} visa pages` : `${routeLocations.length} páginas de visado`}</span>}
      </header>

      <div className="grid md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative overflow-hidden bg-[#174438] p-6 text-[#f7f0dd] sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-6 h-36 w-36 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-4">
            <img src={character.mainImage.url} alt="" className="h-20 w-20 rounded-2xl border border-amber-200/40 object-cover" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">{isEn ? 'Passport holder' : 'Titular del pasaporte'}</p>
              <h3 className="mt-1 text-2xl font-bold">{character.name}</h3>
              {role && <p className="mt-1 text-sm text-white/75">{role}</p>}
            </div>
          </div>
          <dl className="relative mt-7 space-y-4 border-t border-white/15 pt-5 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">{isEn ? 'Home base' : 'Lugar de origen'}</dt>
              <dd className="mt-1 font-semibold">{routeLocations[0]?.country?.[locale] || routeLocations[0]?.country?.es || (isEn ? 'Not listed' : 'Sin especificar')}</dd>
              <dd className="mt-0.5 text-white/75">{routeLocations[0]?.name?.[locale] || routeLocations[0]?.name?.es || ''}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">{isEn ? 'Connection to Curileta' : 'Relación con Curileta'}</dt>
              <dd className="mt-1 leading-6 text-white/90">{relationship}</dd>
            </div>
          </dl>
          <Link href={`/${locale}/mundo#escena-mapa`} className="relative mt-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
            <MapPin className="h-4 w-4 text-amber-300" />{isEn ? 'Open the interactive map' : 'Abrir el mapa interactivo'}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex min-h-72 flex-col justify-between bg-[#f8f3e5] p-6 text-[#352c1b] dark:bg-[#e9dfc5] sm:p-8">
          {current ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#867345]">{isEn ? 'Visa page' : 'Página de visado'} {String(activeIndex + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-2xl font-bold">{current.name[locale] || current.name.es}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#71603b]">{current.country[locale] || current.country.es}</p>
                </div>
                <span className="shrink-0 rounded-full border border-[#b8a46d] px-3 py-1 font-mono text-xs text-[#6b5722]">{String(activeIndex + 1).padStart(2, '0')} / {String(routeLocations.length).padStart(2, '0')}</span>
              </div>

              <div className="my-5 flex items-center justify-center">
                <div className="relative flex h-40 w-40 rotate-[-8deg] items-center justify-center rounded-full border-[3px] border-dashed border-[#9b6332]/70 text-center text-[#9b6332]">
                  <div className="absolute inset-2 rounded-full border border-[#9b6332]/60" />
                  <div className="relative flex flex-col items-center">
                    <Stamp className="h-7 w-7" />
                    <span className="mt-1 text-xs font-bold uppercase tracking-[0.16em]">{isEn ? 'Visa granted' : 'Visado concedido'}</span>
                    <span className="mt-1 max-w-28 text-[10px] font-semibold uppercase leading-4">{current.country[locale] || current.country.es}</span>
                    <span className="mt-1 font-mono text-[9px]">CUR • {String(activeIndex + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              {currentMilestone && <p className="line-clamp-3 border-t border-[#d6c9a7] pt-4 text-sm leading-6 text-[#594c32]">{currentMilestone.whatHappens[locale] || currentMilestone.whatHappens.es}</p>}
              {!currentMilestone && <p className="border-t border-[#d6c9a7] pt-4 text-sm leading-6 text-[#594c32]">{isEn ? 'A stop recorded in this explorer’s travel passport.' : 'Una parada registrada en el pasaporte de esta exploradora.'}</p>}

              <div className="mt-5 flex items-center justify-between gap-3">
                <button type="button" onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#c7b98f] px-4 py-2 text-sm font-semibold text-[#54472c] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"><ArrowLeft className="h-4 w-4" />{isEn ? 'Previous visa' : 'Visado anterior'}</button>
                <button type="button" onClick={() => setActiveIndex((index) => Math.min(routeLocations.length - 1, index + 1))} disabled={activeIndex === routeLocations.length - 1} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#174438] px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#205844] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{isEn ? 'Next visa' : 'Siguiente visado'}<ArrowRight className="h-4 w-4" /></button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MapPin className="h-8 w-8 text-[#8e7a4f]" />
              <h3 className="mt-3 text-xl font-bold">{isEn ? 'No visa pages yet' : 'Aún no hay visados'}</h3>
              <p className="mt-2 max-w-sm text-sm text-[#675b41]">{isEn ? 'Add the character’s places in the editorial system to build this passport.' : 'Añade sus lugares en el sistema editorial para crear este pasaporte.'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
