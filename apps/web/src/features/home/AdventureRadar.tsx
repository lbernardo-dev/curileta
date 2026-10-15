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
  Navigation,
  Locate,
  ShieldCheck,
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
  isGps?: boolean;
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

// Haversine formula to compute great-circle distance in kilometers
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

// Azimuth bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  const bearing = (theta * 180) / Math.PI;
  return Math.round((bearing + 360) % 360);
}

function getCompassDirection(bearing: number, locale: Locale): string {
  const directionsEs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const directionsEn = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return locale === 'en' ? directionsEn[index] : directionsEs[index];
}

export const AdventureRadar: React.FC<AdventureRadarProps> = ({
  locale,
  locations = [],
  milestones = [],
}) => {
  const isEn = locale === 'en';
  const [userCoords, setUserCoords] = useState<UserCoords>(() => ({
    lat: PRESET_CITIES[0].lat,
    lng: PRESET_CITIES[0].lng,
    cityName: isEn ? PRESET_CITIES[0].en : PRESET_CITIES[0].name,
    isGps: false,
  }));
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);
  const [geoState, setGeoState] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'>('idle');
  const [geoFeedback, setGeoFeedback] = useState<string | null>(null);

  const activeCoords: UserCoords = userCoords;

  const handleRequestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGeoState('unsupported');
      setGeoFeedback(isEn ? 'Browser geolocation is not available on this device.' : 'Tu navegador no admite geolocalización.');
      return;
    }

    setGeoState('requesting');
    setGeoFeedback(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = Number(pos.coords.latitude.toFixed(4));
        const detectedLng = Number(pos.coords.longitude.toFixed(4));
        setUserCoords({
          lat: detectedLat,
          lng: detectedLng,
          cityName: isEn ? 'Your current location' : 'Tu ubicación actual',
          isGps: true,
        });
        setGeoState('granted');
        setSelectedDestinationIndex(0);
        setGeoFeedback(
          isEn
            ? `Exact position acquired (${detectedLat > 0 ? `${detectedLat}°N` : `${Math.abs(detectedLat)}°S`}, ${detectedLng > 0 ? `${detectedLng}°E` : `${Math.abs(detectedLng)}°W`})`
            : `Ubicación detectada (${detectedLat > 0 ? `${detectedLat}°N` : `${Math.abs(detectedLat)}°S`}, ${detectedLng > 0 ? `${detectedLng}°E` : `${Math.abs(detectedLng)}°W`})`
        );
      },
      (err) => {
        setGeoState('denied');
        setGeoFeedback(
          err.code === 1
            ? (isEn ? 'Location permission was denied. You can select any city from the list.' : 'Permiso de ubicación denegado. Puedes pulsar cualquier ciudad de la lista.')
            : (isEn ? 'Unable to retrieve your current location. Please choose a city below.' : 'No se pudo leer la ubicación. Elige una ciudad de la lista.')
        );
      },
      { timeout: 12000, enableHighAccuracy: false, maximumAge: 120000 }
    );
  };

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

        const bearing = calculateBearing(
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
          bearing,
          milestones: matchedMilestones,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [locations, milestones, activeCoords, locale]);

  const nearest = sortedDestinations[0] || null;
  const currentDestination = sortedDestinations[selectedDestinationIndex] || nearest;
  const currentBearing = currentDestination?.bearing ?? 0;
  const compassLabel = getCompassDirection(currentBearing, locale);

  return (
    <section
      id="radar-curileta"
      className="relative z-10 overflow-hidden border-t border-[var(--border-subtle)] bg-[#102925] px-5 py-24 text-white transition-colors duration-500 dark:border-[#272727] sm:px-8 sm:py-28 lg:px-12"
    >
      {/* Resplandor y círculos de radar de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20" aria-hidden="true">
        <div className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full border border-emerald-300/70 animate-radar-breathe" />
        <div className="h-[300px] w-[300px] rounded-full border border-amber-300/45 sm:h-[500px] sm:w-[500px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Cabecera del Atlas de exploración */}
        <div className="relative mx-auto mb-12 max-w-4xl text-center">
          <SectionEmblem icon={Compass} tone="emerald" label={isEn ? 'Interactive expedition atlas' : 'Atlas interactivo de la expedición'} />
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            {isEn ? 'Which stop is near you?' : '¿Qué parada queda cerca?'}{' '}
            <span className="block text-amber-300">
              {isEn ? 'Calculate your distance to Curileta’s journey.' : 'Calcula la distancia hacia el viaje de Curileta.'}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg">
            {isEn
              ? 'Connect your browser location or pick a city to measure straight distance and compass heading to each chapter in the book.'
              : 'Conecta la ubicación de tu navegador o elige una ciudad para medir en línea recta la distancia y el rumbo hacia cada capítulo del libro.'}
          </p>

          {/* Botón interactivo de geolocalización y selector de ciudades */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRequestLocation}
                disabled={geoState === 'requesting'}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/30 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-60 cursor-pointer"
              >
                <Locate className={`h-4 w-4 ${geoState === 'requesting' ? 'animate-spin' : ''}`} />
                <span>
                  {geoState === 'requesting'
                    ? (isEn ? 'Locating your device…' : 'Localizando tu dispositivo…')
                    : geoState === 'granted'
                    ? (isEn ? 'Update my location' : 'Actualizar mi ubicación')
                    : (isEn ? 'Use my current location' : 'Usar mi ubicación actual')}
                </span>
              </button>

              <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-400/30 bg-[#071b17] px-3.5 py-2 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>{isEn ? 'Calculated privately in your browser' : 'Cálculo privado en tu propio navegador'}</span>
              </div>
            </div>

            {geoFeedback && (
              <p className={`text-xs font-semibold ${geoState === 'denied' ? 'text-amber-300' : 'text-emerald-300'}`}>
                {geoFeedback}
              </p>
            )}

            {/* Selector rápido de ciudades */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="mr-1 font-semibold text-slate-300">
                {isEn ? 'Or choose a reference city:' : 'O elige una ciudad de referencia:'}
              </span>
              {PRESET_CITIES.map((city) => {
                const cityName = isEn ? city.en : city.name;
                const isSelected = !activeCoords.isGps && activeCoords.cityName === cityName;
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => {
                      setUserCoords({ lat: city.lat, lng: city.lng, cityName, isGps: false });
                      setSelectedDestinationIndex(0);
                      setGeoFeedback(null);
                    }}
                    aria-pressed={isSelected}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer border ${
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
        </div>

        {/* Tarjeta de Resultado del Radar con ancho completo max-w-7xl */}
        {currentDestination && (
          <div className="relative mx-auto w-full overflow-hidden rounded-3xl border border-emerald-200/25 bg-[#12382e] p-6 shadow-[0_24px_70px_rgba(2,18,13,0.38)] sm:p-10">
            {/* Cabecera del hallazgo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-[#07231b] shadow-lg shadow-emerald-950/40">
                  <MapPin className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-amber-400">
                      {isEn ? 'CLOSEST STORY PLACE' : 'PARADA MÁS CERCANA'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activeCoords.cityName || (isEn ? 'Selected position' : 'Punto elegido')}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-bold text-white mt-1">
                    {currentDestination.location.name[locale] || currentDestination.location.name.es}
                  </h3>
                  <p className="text-sm font-semibold text-slate-300">
                    {currentDestination.location.country[locale] || currentDestination.location.country.es}
                  </p>
                </div>
              </div>

              {/* Indicador de Distancia y Rumbo */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-emerald-900/80 text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {isEn ? 'COMPASS BEARING' : 'RUMBO DE BRÚJULA'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 justify-start sm:justify-end">
                    <Navigation
                      className="w-4 h-4 text-amber-300 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{ transform: `rotate(${currentBearing}deg)` }}
                    />
                    <span className="font-mono text-xl font-bold text-amber-300">
                      {currentBearing.toString().padStart(3, '0')}° {compassLabel}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-emerald-900/80 text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {isEn ? 'GEODESIC DISTANCE' : 'DISTANCIA EN LÍNEA RECTA'}
                  </span>
                  <span className="font-mono text-3xl font-bold text-emerald-300 sm:text-4xl">
                    {currentDestination.distanceKm.toLocaleString()} km
                  </span>
                </div>
              </div>
            </div>

            {/* Cuadrícula de Instrumentos y Narrativa */}
            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 py-8 items-center">
              {/* Radar circular y brújula animada */}
              <div className="rounded-2xl border border-emerald-500/20 bg-[#071b17] p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-slate-950 shadow-inner">
                  {/* Círculos concéntricos de rango */}
                  <div className="absolute h-36 w-36 rounded-full border border-emerald-400/20" />
                  <div className="absolute h-24 w-24 rounded-full border border-emerald-400/30" />
                  <div className="absolute h-12 w-12 rounded-full border border-emerald-400/40" />

                  {/* Ejes cardinales */}
                  <div className="absolute inset-x-2 top-1/2 h-px bg-emerald-400/20 -translate-y-1/2" />
                  <div className="absolute inset-y-2 left-1/2 w-px bg-emerald-400/20 -translate-x-1/2" />

                  {/* Letras cardinales */}
                  <span className="absolute top-1 text-[9px] font-mono font-bold text-slate-400">N</span>
                  <span className="absolute bottom-1 text-[9px] font-mono font-bold text-slate-400">S</span>
                  <span className="absolute left-1 text-[9px] font-mono font-bold text-slate-400">W</span>
                  <span className="absolute right-1 text-[9px] font-mono font-bold text-slate-400">E</span>

                  {/* Aguja de brújula animada que apunta al destino */}
                  <div
                    className="relative flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{ transform: `rotate(${currentBearing}deg)` }}
                    aria-hidden="true"
                  >
                    <div className="h-20 w-1.5 rounded-full bg-gradient-to-t from-transparent via-amber-400 to-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
                    <div className="absolute -top-2 h-3.5 w-3.5 rotate-45 border-t-2 border-l-2 border-amber-300 bg-amber-400" />
                  </div>

                  {/* Centro del radar */}
                  <div className="absolute h-3 w-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
                </div>

                <div className="space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-950/60 px-3 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30">
                    <Compass className="h-3.5 w-3.5" />
                    <span>{isEn ? `Heading ${currentBearing}° towards ${compassLabel}` : `Rumbo directo ${currentBearing}° ${compassLabel}`}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {isEn ? 'Expedition Navigation Sensor' : 'Sensor de navegación de la expedición'}
                  </h4>
                  <p className="text-xs leading-5 text-slate-300">
                    {isEn
                      ? `Calculated from coordinates (${activeCoords.lat}, ${activeCoords.lng}) towards Curileta's location in ${currentDestination.location.name[locale] || currentDestination.location.name.es}.`
                      : `Calculado desde las coordenadas (${activeCoords.lat}, ${activeCoords.lng}) hacia la parada de Curileta en ${currentDestination.location.name[locale] || currentDestination.location.name.es}.`}
                  </p>
                  <p className="text-xs font-semibold text-amber-300">
                    {isEn
                      ? `Estimated balloon crossing: ~${Math.round(currentDestination.distanceKm / 75)} hours with fair winds.`
                      : `Travesía estimada en globo: ~${Math.round(currentDestination.distanceKm / 75)} horas con viento favorable.`}
                  </p>
                </div>
              </div>

              {/* Qué ocurrió allí según el libro oficial */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'A moment from the story' : 'Un momento de la historia'}</span>
                </h4>

                <p className="text-base text-slate-200 leading-relaxed text-pretty">
                  {currentDestination.location.description[locale] || currentDestination.location.description.es}
                </p>

                {/* Hito narrativo específico si existe */}
                {currentDestination.milestones.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
                    <div className="text-xs font-bold text-emerald-300 mb-1">
                      {isEn ? `From the book (stop ${currentDestination.milestones[0].order}):` : `Momento del libro (parada ${currentDestination.milestones[0].order}):`}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                      «{currentDestination.milestones[0].whatHappens[locale] || currentDestination.milestones[0].whatHappens.es}»
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recomendaciones conectadas: Episodio & Pasaporte */}
            <div className="pt-6 border-t border-emerald-900/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tarjeta de Episodio Recomendado */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-sky-400 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isEn ? 'THE BOOK' : 'EL LIBRO'}</span>
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">
                    {isEn ? 'Curileta’s journey to ' : 'El viaje de Curileta por '}{currentDestination.location.name[locale] || currentDestination.location.name.es}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {isEn ? 'Read about the places and story moments in the book.' : 'Lee sobre los lugares y momentos de la historia en el libro.'}
                  </p>
                </div>

                <a
                  href={`/${locale}/libros/las-aventuras-de-curileta`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{isEn ? 'Explore the book' : 'Conocer el libro'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta de Carta y Pasaporte */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{isEn ? 'MEET THE FRIENDS' : 'CONOCE A SUS AMIGOS'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-400/20 text-amber-300">
                      {isEn ? 'PASSPORT' : 'PASAPORTE'} #{currentDestination.location.passportStamp?.code || '01'}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">
                    {isEn ? 'Friends along the way' : 'Amistades que acompañan el viaje'}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {isEn ? 'Meet the characters who bring each part of the journey to life.' : 'Conoce a los personajes que acompañan cada tramo de la aventura.'}
                  </p>
                </div>

                <a
                  href={`/${locale}/personajes`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{isEn ? 'Meet the crew' : 'Conocer a la tripulación'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Navegación por otros destinos cercanos */}
            <div className="mt-6 pt-5 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                {isEn ? 'Explore all destinations sorted by distance:' : 'Explora los lugares del relato ordenados por distancia:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {sortedDestinations.slice(0, 6).map((dest, idx) => (
                  <button
                    key={dest.location.id}
                    type="button"
                    onClick={() => setSelectedDestinationIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer ${
                      selectedDestinationIndex === idx
                        ? 'bg-amber-300 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    #{idx + 1} {dest.location.name[locale] || dest.location.name.es} ({dest.distanceKm.toLocaleString()} km)
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

