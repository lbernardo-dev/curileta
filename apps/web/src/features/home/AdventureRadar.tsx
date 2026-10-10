'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@curileta/i18n';
import { Location, NarrativeMilestone } from '@curileta/cms';
import {
  Compass,
  MapPin,
  Sparkles,
  Play,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { SectionEmblem } from '@/components/SectionEmblem';

interface AdventureRadarProps {
  locale: Locale;
  locations?: Location[];
  milestones?: NarrativeMilestone[];
}

interface UserCoords {
  lat: number;
  lng: number;
  cityName?: string;
  countryName?: string;
}

// Preset cities for quick testing
const PRESET_CITIES = [
  { name: 'Madrid, España', en: 'Madrid, Spain', lat: 40.4168, lng: -3.7038 },
  { name: 'Ciudad de México, México', en: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Cusco, Perú', en: 'Cusco, Peru', lat: -13.5319, lng: -71.9675 },
  { name: 'El Cairo, Egipto', en: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Reikiavik, Islandia', en: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 },
  { name: 'Tokio, Japón', en: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Sídney, Australia', en: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Roma, Italia', en: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'París, Francia', en: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Buenos Aires, Argentina', en: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Bogotá, Colombia', en: 'Bogota, Colombia', lat: 4.711, lng: -74.0721 },
];

// Haversine formula to compute distance in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const AdventureRadar: React.FC<AdventureRadarProps> = ({
  locale,
  locations = [],
  milestones = [],
}) => {
  const [userCoords, setUserCoords] = useState<UserCoords>(() => ({
    lat: PRESET_CITIES[0].lat,
    lng: PRESET_CITIES[0].lng,
    cityName: locale === 'en' ? PRESET_CITIES[0].en : PRESET_CITIES[0].name,
  }));
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);

  // City presets are processed locally; the browser location is never requested.
  const activeCoords: UserCoords = userCoords;

  // Calculate sorted destinations by distance to user
  const sortedDestinations = useMemo(() => {
    if (!locations.length) return [];

    return locations
      .map((loc) => {
        const distanceKm = calculateHaversineDistance(
          activeCoords.lat,
          activeCoords.lng,
          loc.coordinates.lat,
          loc.coordinates.lng
        );

        // Find milestones in this location
        const matchedMilestones = milestones.filter(
          (m) =>
            (m.country[locale] || m.country.es).toLowerCase().includes(
              (loc.country[locale] || loc.country.es).toLowerCase()
            ) ||
            (m.place[locale] || m.place.es).toLowerCase().includes(
              (loc.name[locale] || loc.name.es).toLowerCase()
            )
        );

        return {
          location: loc,
          distanceKm,
          milestones: matchedMilestones,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [locations, milestones, activeCoords, locale]);

  const nearest = sortedDestinations[0] || null;
  const currentDestination = sortedDestinations[selectedDestinationIndex] || nearest;

  return (
    <section
      id="radar-curileta"
      className="relative z-10 overflow-hidden bg-[#0b241c] py-24 text-white transition-colors duration-300"
    >
      {/* Resplandor y círculos de radar de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full border border-emerald-300/70 animate-radar-breathe" />
        <div className="h-[300px] w-[300px] rounded-full border border-amber-300/45 sm:h-[500px] sm:w-[500px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* El atlas se presenta como una herramienta de exploración, sin atribuirlo a otro personaje. */}
        <div className="relative max-w-4xl mx-auto mb-14 text-center">
          <SectionEmblem icon={Compass} tone="emerald" label={locale === 'en' ? 'Interactive expedition atlas' : 'Atlas interactivo de la expedición'} />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-widest mb-3 shadow-md backdrop-blur-md">
                <span>{locale === 'en' ? 'Interactive expedition atlas' : 'Atlas interactivo de la expedición'}</span>
              </div>

              <h2 className="text-balance text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                {locale === 'en' ? 'Which stop is near you?' : '¿Qué parada queda cerca?'}<br />
                <span className="text-amber-300">
                  {locale === 'en' ? 'Choose a city and follow the route.' : 'Elige una ciudad y sigue la ruta.'}
                </span>
              </h2>
            </div>
          </div>

          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {locale === 'en'
              ? 'Pick a sample city to find the closest place from the book in a straight line. We never request or store your location.'
              : 'Elige una ciudad de ejemplo y descubre qué lugar del libro queda más cerca en línea recta. No pedimos ni guardamos tu ubicación.'}
          </p>

          {/* Sample city selector. The browser location is never requested. */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="mr-1 font-bold text-slate-300">{locale === 'en' ? 'Choose a sample city:' : 'Elige una ciudad de ejemplo:'}</span>
            {PRESET_CITIES.map((city) => {
              const cityName = locale === 'en' ? city.en : city.name;
              const isSelected = activeCoords.cityName === cityName;
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    setUserCoords({ lat: city.lat, lng: city.lng, cityName });
                    setSelectedDestinationIndex(0);
                  }}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-amber-300 bg-amber-300 text-slate-950 font-bold shadow-md'
                      : 'border-emerald-900 bg-[#071b17] text-slate-200 hover:border-emerald-300/50 hover:text-white'
                  }`}
                >
                  {cityName.split(',')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta de Resultado del Radar */}
        {currentDestination && (
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-emerald-200/25 bg-[#12382e] p-6 shadow-[0_24px_70px_rgba(2,18,13,0.38)] sm:p-10">
            {/* Cabecera del hallazgo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-[#07231b] shadow-lg shadow-emerald-950/40">
                  <MapPin className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black uppercase text-amber-400">
                      {locale === 'en' ? 'CLOSEST STORY PLACE TO' : 'LUGAR DEL RELATO MÁS CERCANO A'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activeCoords.cityName || (locale === 'en' ? 'Selected city' : 'Ciudad elegida')}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                    {currentDestination.location.name[locale] || currentDestination.location.name.es}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    {currentDestination.location.country[locale] || currentDestination.location.country.es}
                  </p>
                </div>
              </div>

              {/* Indicador de Distancia */}
              <div className="text-left sm:text-right bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  {locale === 'en' ? 'APPROXIMATE DISTANCE' : 'DISTANCIA APROXIMADA'}
                </span>
                <span className="font-mono text-3xl font-bold text-emerald-300 sm:text-4xl">
                  {currentDestination.distanceKm.toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Qué ocurrió allí según el libro oficial */}
            <div className="py-6 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{locale === 'en' ? 'A moment from the story' : 'Un momento de la historia'}</span>
              </h4>

              <p className="text-base text-slate-200 leading-relaxed">
                {currentDestination.location.description[locale] || currentDestination.location.description.es}
              </p>

              {/* Hito narrativo específico si existe */}
              {currentDestination.milestones.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-300 mb-1">
                    {locale === 'en' ? `From the story (stop ${currentDestination.milestones[0].order}):` : `Un momento del relato (parada ${currentDestination.milestones[0].order}):`}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    «{currentDestination.milestones[0].whatHappens[locale] || currentDestination.milestones[0].whatHappens.es}»
                  </p>
                </div>
              )}
            </div>

            {/* Recomendaciones conectadas: Episodio & Carta Postal */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tarjeta de Episodio Recomendado */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-sky-400 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{locale === 'en' ? 'THE BOOK' : 'EL LIBRO'}</span>
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">
                    {locale === 'en' ? 'Curileta’s journey to ' : 'El viaje de Curileta por '}{currentDestination.location.name[locale] || currentDestination.location.name.es}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {locale === 'en' ? 'Read about the places and story moments in the book.' : 'Lee sobre los lugares y momentos de la historia en el libro.'}
                  </p>
                </div>

                <a
                  href={`/${locale}/libros/las-aventuras-de-curileta`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{locale === 'en' ? 'Explore the book' : 'Conocer el libro'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta de Carta a Pompón */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-amber-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{locale === 'en' ? 'MEET THE FRIENDS' : 'CONOCE A SUS AMIGOS'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400/20 text-amber-300">
                      {locale === 'en' ? 'PASSPORT' : 'PASAPORTE'} #{currentDestination.location.passportStamp?.code || '01'}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">
                    {locale === 'en' ? 'Friends along the way' : 'Amistades que acompañan el viaje'}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {locale === 'en' ? 'Meet the characters who bring each part of the journey to life.' : 'Conoce a los personajes que acompañan cada tramo de la aventura.'}
                  </p>
                </div>

                <a
                  href={`/${locale}/personajes`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{locale === 'en' ? 'Meet the crew' : 'Conocer a la tripulación'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Navegación por otros destinos cercanos */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-bold">{locale === 'en' ? 'Explore other nearby story places:' : 'Explora otros lugares cercanos del relato:'}</span>
              <div className="flex flex-wrap gap-2">
                {sortedDestinations.slice(0, 4).map((dest, idx) => (
                  <button
                    key={dest.location.id}
                    onClick={() => setSelectedDestinationIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDestinationIndex === idx
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    #{idx + 1} {dest.location.name[locale] || dest.location.name.es} ({dest.distanceKm} km)
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
