'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Locale } from '@curileta/i18n';
import { Location, NarrativeMilestone } from '@curileta/cms';
import {
  Compass,
  MapPin,
  Sparkles,
  Navigation,
  Play,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react';

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
  { name: 'Madrid, España', lat: 40.4168, lng: -3.7038 },
  { name: 'Ciudad de México, México', lat: 19.4326, lng: -99.1332 },
  { name: 'Cusco, Perú', lat: -13.5319, lng: -71.9675 },
  { name: 'El Cairo, Egipto', lat: 30.0444, lng: 31.2357 },
  { name: 'Reikiavik, Islandia', lat: 64.1466, lng: -21.9426 },
  { name: 'Tokio, Japón', lat: 35.6762, lng: 139.6503 },
  { name: 'Sídney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Roma, Italia', lat: 41.9028, lng: 12.4964 },
  { name: 'París, Francia', lat: 48.8566, lng: 2.3522 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Bogotá, Colombia', lat: 4.711, lng: -74.0721 },
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
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);

  // Request browser geolocation
  const handleDetectLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!('geolocation' in navigator)) {
      setLocationError(
        locale === 'en'
          ? 'Geolocation is not supported by your browser. Please select a city below.'
          : 'La geolocalización no está soportada por tu navegador. Elige una ciudad abajo.'
      );
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          cityName: locale === 'en' ? 'Your Current Location' : 'Tu Ubicación Actual',
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            locale === 'en'
              ? 'Permission denied. You can select any city from the presets to test.'
              : 'Permiso de ubicación no concedido. ¡Puedes probar con una ciudad de la lista!'
          );
        } else {
          setLocationError(
            locale === 'en'
              ? 'Could not obtain location. Try selecting a city preset.'
              : 'No pudimos obtener la ubicación. Prueba seleccionando una ciudad.'
          );
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Default to first preset if no coords detected yet
  const activeCoords: UserCoords = userCoords || PRESET_CITIES[0];

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
      className="relative py-24 bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white overflow-hidden transition-colors duration-300"
    >
      {/* Resplandor y círculos de radar de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full border border-emerald-400 animate-ping duration-1000" />
        <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-amber-400" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <Compass className="w-4 h-4 text-amber-400 animate-spin duration-3000" />
            <span>Radar de Expedición Geográfico</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            ¿Ha estado Curileta cerca de ti?<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-sky-300">
              Descubre qué aventura vivió cerca de tu ciudad.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Activa tu radar para calcular en tiempo real los kilómetros exactos que separan tu ubicación de los 11 destinos del libro. Te recomendaremos el capítulo, los personajes y la carta postal correspondiente.
          </p>

          {/* Botón de Detección GPS */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-black text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Calculando coordenadas GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 fill-current text-slate-950" />
                  <span>Detectar mi ubicación actual</span>
                </>
              )}
            </button>
          </div>

          {locationError && (
            <p className="mt-3 text-xs text-amber-300 font-medium">
              ℹ️ {locationError}
            </p>
          )}

          {/* Selector de Ciudades Preset */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-1">O prueba una ciudad:</span>
            {PRESET_CITIES.map((city) => {
              const isSelected = activeCoords.cityName === city.name;
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    setUserCoords({ lat: city.lat, lng: city.lng, cityName: city.name });
                    setSelectedDestinationIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-emerald-400/50 hover:text-white'
                  }`}
                >
                  {city.name.split(',')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta de Resultado del Radar */}
        {currentDestination && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border-2 border-emerald-400/40 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            {/* Cabecera del hallazgo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                  <MapPin className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black uppercase text-amber-400">
                      DESTINO MÁS CERCANO A TI
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      📍 {activeCoords.cityName || 'Ubicación'}
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
                  DISTANCIA ESTIMADA
                </span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 font-mono">
                  {currentDestination.distanceKm.toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Qué ocurrió allí según el libro oficial */}
            <div className="py-6 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Lo que Curileta vivió en este lugar</span>
              </h4>

              <p className="text-base text-slate-200 leading-relaxed">
                {currentDestination.location.description[locale] || currentDestination.location.description.es}
              </p>

              {/* Hito narrativo específico si existe */}
              {currentDestination.milestones.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-300 mb-1">
                    📖 Crónica del libro (Hito #{currentDestination.milestones[0].order}):
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
                      <span>CAPÍTULO RECOMENDADO</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300">
                      DISPONIBLE
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">
                    Aventuras de Curileta en {currentDestination.location.name[locale] || currentDestination.location.name.es}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Acompaña a la pequeña lagartija en su expedición por estas tierras milenarias.
                  </p>
                </div>

                <a
                  href="#escena-youtube"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Ver capítulo en el reproductor</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta de Carta a Pompón */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-amber-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>CARTA ENVIADA A POMPÓN</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400/20 text-amber-300">
                      MATASELLOS #{currentDestination.location.passportStamp?.code || '01'}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white">
                    Palabras enviadas al Bosque Encantado
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Curileta escribió una carta sellada a mano para compartir sus descubrimientos con su mejor amigo.
                  </p>
                </div>

                <a
                  href="#escena-cartas"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Abrir sobre en el Baúl Postal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Navegación por otros destinos cercanos */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-bold">Explorar los siguientes destinos más cercanos:</span>
              <div className="flex gap-2">
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
