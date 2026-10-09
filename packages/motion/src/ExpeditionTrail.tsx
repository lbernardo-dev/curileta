'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Tent,
  Ghost,
  Globe2,
  Radar,
  Mail,
  Users,
  BookOpen,
  Clapperboard,
  Image,
  Trophy,
  Compass,
  Navigation,
  Sun,
  Mountain,
  Snowflake,
  Anchor,
  Bot,
  Footprints,
  Shield,
  Heart,
  UtensilsCrossed,
  Palette,
  Sparkles,
  X,
  MapPin,
  ChevronDown,
  ChevronRight,
  ArrowDown,
  Flag,
} from 'lucide-react';
import { TrailWaypoint } from '@curileta/cms';

/**
 * Mapeo temático exhaustivo de iconos representativos de cada capítulo y hito.
 * Evita iconos genéricos y asocia a cada capítulo de aventura un icono único y distintivo.
 */
export const getChapterIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Tent':
    case 'Camp':
      return <Tent className={className} />;
    case 'Ghost':
    case 'Pumpkin':
    case 'Halloween':
      return <Ghost className={className} />;
    case 'Globe2':
    case 'Globe':
    case 'Earth':
      return <Globe2 className={className} />;
    case 'Radar':
    case 'Gps':
      return <Radar className={className} />;
    case 'Mail':
    case 'Letter':
    case 'Post':
      return <Mail className={className} />;
    case 'Users':
    case 'Crew':
    case 'Friends':
      return <Users className={className} />;
    case 'BookOpen':
    case 'Book':
      return <BookOpen className={className} />;
    case 'Clapperboard':
    case 'Cinema':
    case 'Video':
    case 'Tv':
    case 'Radio':
      return <Clapperboard className={className} />;
    case 'Image':
    case 'Wallpaper':
    case 'Photo':
      return <Image className={className} />;
    case 'Trophy':
    case 'Treasure':
    case 'Award':
      return <Trophy className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Navigation':
      return <Navigation className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Mountain':
      return <Mountain className={className} />;
    case 'Snowflake':
      return <Snowflake className={className} />;
    case 'Anchor':
      return <Anchor className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <Compass className={className} />;
  }
};

export interface AdventureTrailConnectorProps {
  stepNumber: number;
  destinationTitle: { es: string; en: string } | string;
  departureTitle?: { es: string; en: string } | string;
  coordinatesText?: string;
  distanceText?: { es: string; en: string } | string;
  targetId: string;
  curveVariant?: 'left-to-center' | 'center-to-right' | 'right-to-left' | 'zigzag' | 'center-straight';
  themeColor?: string;
  locale?: string;
  isHalloweenSpecial?: boolean;
  className?: string;
}

export interface TreasureDestinationMarkProps {
  locale?: string;
  targetId?: string;
  onOpenPassport?: () => void;
  className?: string;
}

export interface ChapterRailItem {
  id: string;
  targetId: string;
  stepNumber: number;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  iconName: string;
  themeColor: string;
}

export const HOME_CHAPTER_RAIL_ITEMS: ChapterRailItem[] = [
  {
    id: 'hero-scene',
    targetId: '#hero-scene',
    stepNumber: 1,
    title: { es: 'Campamento Base', en: 'Base Camp' },
    subtitle: { es: 'El Bosque Encantado', en: 'The Enchanted Forest' },
    iconName: 'Tent',
    themeColor: '#10B981',
  },
  {
    id: 'evento-halloween',
    targetId: '#evento-halloween',
    stepNumber: 2,
    title: { es: 'Huerto de Calabazas', en: 'Pumpkin Orchard' },
    subtitle: { es: 'Especial de Halloween 🎃', en: 'Halloween Special 🎃' },
    iconName: 'Ghost',
    themeColor: '#F97316',
  },
  {
    id: 'escena-mapa',
    targetId: '#escena-mapa',
    stepNumber: 3,
    title: { es: 'Globo Aerostático 3D', en: '3D Hot Air Balloon' },
    subtitle: { es: 'Cartografía de 40 Culturas', en: '40 Cultures Cartography' },
    iconName: 'Globe2',
    themeColor: '#0EA5E9',
  },
  {
    id: 'radar-curileta',
    targetId: '#radar-curileta',
    stepNumber: 4,
    title: { es: 'Radar GPS de Aventuras', en: 'GPS Adventure Radar' },
    subtitle: { es: 'Sonda y Rastreos Cercanos', en: 'Atmospheric Tracking' },
    iconName: 'Radar',
    themeColor: '#06B6D4',
  },
  {
    id: 'escena-cartas',
    targetId: '#escena-cartas',
    stepNumber: 5,
    title: { es: 'El Baúl Postal de Pompón', en: "Pompón's Mail Chest" },
    subtitle: { es: 'Cartas, Matasellos & Polaroids', en: 'Letters, Postmarks & Polaroids' },
    iconName: 'Mail',
    themeColor: '#F43F5E',
  },
  {
    id: 'escena-personajes',
    targetId: '#escena-personajes',
    stepNumber: 6,
    title: { es: 'La Tripulación (19 Amigos)', en: 'The Crew (19 Friends)' },
    subtitle: { es: 'Campamento de Amistad', en: 'Friendship Camp' },
    iconName: 'Users',
    themeColor: '#8B5CF6',
  },
  {
    id: 'escena-libros',
    targetId: '#escena-libros',
    stepNumber: 7,
    title: { es: 'Bóveda de Libros Ilustrados', en: 'Illustrated Books Vault' },
    subtitle: { es: 'Historias Físicas 3D & Secretos', en: 'Physical 3D Books & Secrets' },
    iconName: 'BookOpen',
    themeColor: '#EC4899',
  },
  {
    id: 'escena-youtube',
    targetId: '#escena-youtube',
    stepNumber: 8,
    title: { es: 'Estación de Transmisión', en: 'Broadcast Station' },
    subtitle: { es: 'Cine, Canciones & YouTube', en: 'Cinema, Songs & YouTube' },
    iconName: 'Clapperboard',
    themeColor: '#EF4444',
  },
  {
    id: 'galeria-fondos',
    targetId: '#galeria-fondos',
    stepNumber: 9,
    title: { es: 'Mirador de Recuerdos 2K', en: '2K Memory Viewpoint' },
    subtitle: { es: 'Fondos de Pantalla & Postales', en: 'Wallpapers & Postcards' },
    iconName: 'Image',
    themeColor: '#A855F7',
  },
  {
    id: 'cierre-expedicion',
    targetId: '#meta-gran-tesoro',
    stepNumber: 10,
    title: { es: 'La Gran X del Tesoro', en: 'The Big Treasure X' },
    subtitle: { es: 'Meta Oficial de la Expedición', en: 'Official Expedition Goal' },
    iconName: 'Trophy',
    themeColor: '#FBBF24',
  },
];

export interface LateralChapterRailProps {
  items?: ChapterRailItem[];
  locale?: string;
  className?: string;
}

export interface ExpeditionTrailProps {
  waypoints?: TrailWaypoint[];
  locale?: string;
  className?: string;
}

const DEFAULT_WAYPOINTS: TrailWaypoint[] = [
  {
    id: 'bosque-encantado',
    stepNumber: 1,
    title: { es: 'Campamento Base', en: 'Base Camp' },
    subtitle: { es: 'El Bosque Encantado', en: 'The Enchanted Forest' },
    stampCode: 'CAMP-BASE-001',
    coordinatesText: "19°25'N, 99°08'W",
    badgeIcon: 'Tent',
    dateStamp: '01 OCT — INICIO',
    note: {
      es: 'Curileta despliega el mapa y enciende la brújula solar en el claro del bosque.',
      en: 'Curileta unrolls the map and sparks the solar compass in the forest clearing.',
    },
    color: '#10B981',
  },
  {
    id: 'globo-cartografia',
    stepNumber: 2,
    title: { es: 'Globo Aerostático 3D', en: '3D Hot Air Balloon' },
    subtitle: { es: 'Cartografía Orbital 3D', en: '3D Orbital Cartography' },
    stampCode: 'AERO-CART-002',
    coordinatesText: 'Alt. 3.200m | Sonda Viento',
    badgeIcon: 'Globe2',
    dateStamp: '03 OCT — VUELO',
    note: {
      es: 'El globo asciende sobre las nubes para trazar las rutas de 40 culturas en 3D.',
      en: 'The balloon ascends above clouds to chart 40 world cultures in 3D.',
    },
    color: '#0EA5E9',
  },
  {
    id: 'radar-aventuras',
    stepNumber: 3,
    title: { es: 'Radar GPS de Aventuras', en: 'GPS Adventure Radar' },
    subtitle: { es: 'Detección de Coordenadas Cercanas', en: 'Nearby Coordinates Detection' },
    stampCode: 'RADAR-GPS-003',
    coordinatesText: 'Sonda Atmosférica • Proximidad',
    badgeIcon: 'Radar',
    dateStamp: '05 OCT — RASTREO',
    note: {
      es: 'El radar sintoniza las historias más cercanas a la posición de la familia exploradora.',
      en: 'The radar tunes into stories closest to the explorer family’s current location.',
    },
    color: '#06B6D4',
  },
  {
    id: 'baul-cartas',
    stepNumber: 4,
    title: { es: 'El Baúl Postal de Pompón', en: "Pompón's Mail Chest" },
    subtitle: { es: 'Cartas, Matasellos & Polaroids', en: 'Letters, Postmarks & Polaroids' },
    stampCode: 'POST-POMP-004',
    coordinatesText: 'Buzón del Bosque • Matasellos',
    badgeIcon: 'Mail',
    dateStamp: '07 OCT — CORRESPONDENCIA',
    note: {
      es: 'Pompón clasifica cartas selladas con cera y polaroids de amigos de los 5 continentes.',
      en: 'Pompón sorts wax-sealed letters and polaroids from friends across 5 continents.',
    },
    color: '#F43F5E',
  },
  {
    id: 'tripulacion-amigos',
    stepNumber: 5,
    title: { es: 'Campamento de Amigos', en: 'Friends Camp' },
    subtitle: { es: 'Encuentro con los 19 Personajes', en: 'Meeting with the 19 Characters' },
    stampCode: 'CREW-AMIG-005',
    coordinatesText: 'Valle de la Buena Amistad',
    badgeIcon: 'Users',
    dateStamp: '10 OCT — ALIANZA',
    note: {
      es: 'Cada compañero aporta un don indispensable: prudencia, vuelo, destreza marina y música.',
      en: 'Each companion brings an essential gift: prudence, flight, marine skill, and song.',
    },
    color: '#8B5CF6',
  },
  {
    id: 'biblioteca-relatos',
    stepNumber: 6,
    title: { es: 'Biblioteca de Aventuras', en: 'Adventure Library' },
    subtitle: { es: 'Libros Físicos Ilustrados & Secretos', en: 'Illustrated Physical Books & Secrets' },
    stampCode: 'BIBL-DEST-006',
    coordinatesText: 'Bóveda de Relatos Secretos',
    badgeIcon: 'BookOpen',
    dateStamp: '14 OCT — ARCHIVO',
    note: {
      es: 'Las historias cobran vida en encuadernaciones 3D con mapas desplegables y secretos.',
      en: 'Stories come alive in 3D hardcovers with fold-out maps and hidden secrets.',
    },
    color: '#EC4899',
  },
  {
    id: 'senales-musica',
    stepNumber: 7,
    title: { es: 'Estación de Transmisión', en: 'Broadcast Station' },
    subtitle: { es: 'Frecuencia YouTube & Música', en: 'YouTube Frequency & Music' },
    stampCode: 'WAVE-CURI-007',
    coordinatesText: 'Onda Corta 104.7 MHz',
    badgeIcon: 'Clapperboard',
    dateStamp: '18 OCT — AL AIRE',
    note: {
      es: 'Canciones y capítulos animados transmitidos para toda la comunidad exploradora.',
      en: 'Animated episodes and songs broadcasted for young explorers everywhere.',
    },
    color: '#EF4444',
  },
  {
    id: 'galeria-recuerdos',
    stepNumber: 8,
    title: { es: 'Mirador de Recuerdos 2K', en: '2K Memory Viewpoint' },
    subtitle: { es: 'Fondos de Pantalla para Dispositivos', en: 'Device Wallpapers' },
    stampCode: 'WALL-MEM-008',
    coordinatesText: 'Cumbre de las Postales 2K',
    badgeIcon: 'Image',
    dateStamp: '22 OCT — GALERÍA',
    note: {
      es: 'Postales panorámicas descargables en alta resolución para llevar la aventura siempre contigo.',
      en: 'Downloadable panoramic high-resolution postcards to carry the adventure anywhere.',
    },
    color: '#A855F7',
  },
  {
    id: 'pasaporte-dorado',
    stepNumber: 9,
    title: { es: 'LA GRAN X DEL TESORO', en: 'THE BIG TREASURE X' },
    subtitle: { es: 'Pasaporte de Explorador Oficial', en: 'Official Explorer Passport' },
    stampCode: 'EXP-GOLD-999',
    coordinatesText: 'Destino: Horizonte Abierto',
    badgeIcon: 'Trophy',
    dateStamp: 'EXPEDICIÓN COMPLETA',
    note: {
      es: 'El verdadero tesoro no es el oro, sino la amistad forjada en cada frontera recorrida.',
      en: 'The true treasure is not gold, but the friendships made at every border crossed.',
    },
    color: '#FBBF24',
  },
];

/**
 * ============================================================================
 * 1. ADVENTURE TRAIL CONNECTOR (CONECTOR DE SENDERO DE AVENTURA ENTRE SECCIONES)
 * ============================================================================
 * Colocado en el flujo natural del DOM ENTRE cada sección.
 * GARANTIZA al 100% que NUNCA pasa por delante de ningún texto, tarjeta o botón.
 * Emula fielmente el camino de un auténtico mapa de aventuras:
 * - Trazo discontinuo de tinta de cartógrafo (rojo tesoro / ámbar)
 * - Hendidura / surco de cuero en el mapa
 * - Huellitas de Curileta (botitas) y Pompón (patitas de conejo)
 * - Curvas de nivel topográficas sutiles
 * - Medallón central de latón con indicador de rumbo y salto suave
 */
export const AdventureTrailConnector: React.FC<AdventureTrailConnectorProps> = ({
  stepNumber,
  destinationTitle,
  departureTitle,
  coordinatesText = "Lat 19°25'N • Altitud 3.200m",
  distanceText,
  targetId,
  curveVariant = 'zigzag',
  themeColor = '#dc2626',
  locale = 'es',
  isHalloweenSpecial = false,
  className = '',
}) => {
  const isEn = locale === 'en';
  const destTitleText =
    typeof destinationTitle === 'object'
      ? destinationTitle[locale as 'es' | 'en'] || destinationTitle.es
      : destinationTitle;

  const defaultDist = isEn ? `+${stepNumber * 8} Exploration Leagues` : `+${stepNumber * 8} Leguas de Exploración`;
  const distanceStr =
    typeof distanceText === 'object'
      ? distanceText[locale as 'es' | 'en'] || distanceText.es
      : distanceText || defaultDist;

  // Variantes de curvas según la dirección de la expedición
  let pathD = 'M 400,0 C 420,70 600,60 600,110 C 600,160 780,150 800,220';
  if (curveVariant === 'left-to-center') {
    pathD = 'M 250,0 C 260,80 500,70 600,110 C 700,150 900,140 920,220';
  } else if (curveVariant === 'right-to-left') {
    pathD = 'M 950,0 C 920,80 700,70 600,110 C 500,150 280,140 260,220';
  } else if (curveVariant === 'center-to-right') {
    pathD = 'M 500,0 C 520,70 620,70 600,110 C 580,150 780,150 820,220';
  } else if (curveVariant === 'center-straight') {
    pathD = 'M 600,0 C 600,60 600,70 600,110 C 600,150 600,160 600,220';
  }

  const inkColor = isHalloweenSpecial ? '#f97316' : themeColor || '#dc2626';

  return (
    <div
      className={`relative w-full overflow-hidden py-6 sm:py-8 select-none ${className}`}
      aria-label={`Sendero de expedición: Hito ${stepNumber}`}
    >
      {/* Lienzo SVG cartográfico con trazo continuo, sombras y huellas */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <svg
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            {/* Filtro de resplandor suave de tinta de mapa */}
            <filter id={`trailGlow-${stepNumber}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={inkColor} floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Curvas de nivel topográficas tenues en el pergamino */}
          <path
            d="M 0,35 Q 300,15 600,40 T 1200,25"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeOpacity="0.08"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 0,185 Q 400,210 800,175 T 1200,195"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeOpacity="0.08"
            vectorEffect="non-scaling-stroke"
          />

          {/* Cruces de coordenadas cartográficas en los márgenes */}
          <g stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.18">
            <line x1="80" y1="55" x2="90" y2="55" />
            <line x1="85" y1="50" x2="85" y2="60" />
            <line x1="1110" y1="165" x2="1120" y2="165" />
            <line x1="1115" y1="160" x2="1115" y2="170" />
          </g>

          {/* CAPA 1: Hendidura / surco de cuero en el mapa (sombra de tierra) */}
          <path
            d={pathD}
            fill="none"
            stroke="#78350f"
            strokeWidth="6"
            strokeDasharray="10 8"
            strokeOpacity="0.22"
            vectorEffect="non-scaling-stroke"
          />

          {/* CAPA 2: Trazo principal discontinuo de mapa de aventuras (Tinta carmesí/ámbar) */}
          <path
            d={pathD}
            fill="none"
            stroke={inkColor}
            strokeWidth="2.8"
            strokeDasharray="10 8"
            strokeLinecap="round"
            filter={`url(#trailGlow-${stepNumber})`}
            vectorEffect="non-scaling-stroke"
          />

          {/* CAPA 3: Huellitas de Curileta (botitas) y Pompón (patitas) caminando por el sendero */}
          {/* Huellas de Curileta (Botitas) en el tramo superior */}
          <g transform="translate(480, 50) rotate(15)" opacity="0.65">
            <ellipse cx="-4" cy="0" rx="2.5" ry="5.5" fill="#92400e" />
            <ellipse cx="4" cy="5" rx="2.5" ry="5.5" fill="#92400e" />
          </g>

          {/* Huellas de Pompón (Patitas de conejo) en el tramo inferior */}
          <g transform="translate(710, 165) rotate(20)" opacity="0.65">
            <ellipse cx="-3" cy="2" rx="2" ry="3.5" fill="#d97706" />
            <circle cx="-4.5" cy="-2.5" r="1.1" fill="#d97706" />
            <circle cx="-3" cy="-4" r="1.1" fill="#d97706" />
            <circle cx="-1.5" cy="-2.5" r="1.1" fill="#d97706" />

            <ellipse cx="4" cy="7" rx="2" ry="3.5" fill="#d97706" />
            <circle cx="2.5" cy="2.5" r="1.1" fill="#d97706" />
            <circle cx="4" cy="1" r="1.1" fill="#d97706" />
            <circle cx="5.5" cy="2.5" r="1.1" fill="#d97706" />
          </g>
        </svg>
      </div>

      {/* Contenido interactivo: Medallón de hito central con brújula y coordenadas */}
      <div className="relative z-10 max-w-xl mx-auto px-4 flex flex-col items-center text-center">
        <a
          href={targetId}
          className="group inline-flex flex-col items-center gap-2 p-3 sm:p-4 rounded-3xl bg-slate-950/85 hover:bg-slate-900/95 border-2 border-dashed border-amber-400/60 hover:border-amber-300 text-white shadow-[0_8px_30px_rgba(245,158,11,0.22)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
          title={isEn ? `Go to ${destTitleText}` : `Avanzar hacia ${destTitleText}`}
        >
          {/* Fila superior: Badge de Hito y rosa de los vientos */}
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1"
              style={{
                backgroundColor: isHalloweenSpecial ? '#ea580c' : inkColor,
                color: '#ffffff',
              }}
            >
              {isHalloweenSpecial ? '🎃 DESVÍO ESPECIAL' : `🧭 HITO 0${stepNumber}`}
            </span>

            <span className="text-[10px] font-mono font-bold text-amber-300/90 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {coordinatesText}
            </span>
          </div>

          {/* Título de la siguiente estación */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-amber-100 group-hover:text-amber-300 transition-colors">
              {destTitleText}
            </span>
            <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </div>

          {/* Fila inferior: Distancia en leguas */}
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
            {distanceStr} • {isEn ? 'Tap to continue trail' : 'Toca para continuar por la ruta'}
          </span>
        </a>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 2. TREASURE DESTINATION MARK (LA GRAN X DEL TESORO • META DE LA EXPEDICIÓN)
 * ============================================================================
 * Remate icónico del mapa de aventuras de Curileta al final de la página.
 * Presenta la gran "X" roja clásica de los mapas del tesoro, con sello de cera
 * de Curileta y mensaje de celebración del viaje completado.
 */
export const TreasureDestinationMark: React.FC<TreasureDestinationMarkProps> = ({
  locale = 'es',
  targetId = '#cierre-expedicion',
  onOpenPassport,
  className = '',
}) => {
  const isEn = locale === 'en';

  return (
    <div
      id="meta-gran-tesoro"
      className={`relative w-full py-16 sm:py-20 overflow-hidden select-none ${className}`}
      aria-label={isEn ? 'Expedition Goal: The Great Treasure' : 'Meta de la Expedición: El Gran Tesoro'}
    >
      {/* Fondo de pergamino de mapa del tesoro con curvas y estelas doradas */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg
          viewBox="0 0 1200 360"
          preserveAspectRatio="none"
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Líneas cartográficas decorativas */}
          <path
            d="M 600,0 C 600,60 550,100 600,180"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3"
            strokeDasharray="10 8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="600" cy="180" r="90" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.25" />
          <circle cx="600" cy="180" r="130" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.15" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
        {/* LA GRAN X DEL TESORO CON SELLO DE CERA ROJA */}
        <div className="relative mb-6">
          {/* Círculo de cera de sello oficial de expedición */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-red-700 via-red-800 to-amber-950 border-4 border-amber-400 p-1 shadow-[0_0_35px_rgba(220,38,38,0.5)] flex items-center justify-center relative group hover:scale-105 transition-transform duration-300">
            {/* Clásica X de mapa pirata / explorador */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <span className="absolute text-5xl sm:text-6xl font-black text-amber-200 select-none leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                ✕
              </span>
            </div>

            {/* Micro badge giratorio */}
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
              ★ META ★
            </div>
          </div>
        </div>

        {/* Textos del tesoro de Curileta */}
        <span className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-amber-400 mb-2">
          {isEn ? 'DESTINATION REACHED • X MARKS THE SPOT' : 'DESTINO ALCANZADO • X MARCA EL TESORO'}
        </span>

        <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          {isEn ? 'The Greatest Treasure of All' : 'El Mayor Tesoro del Mundo'}
        </h3>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mb-6 leading-relaxed italic">
          {isEn
            ? '«The true treasure is not coins of gold, but the friendships made, the stories shared, and the spark of wonder in young hearts.»'
            : '«El verdadero tesoro no son las monedas de oro, sino las amistades forjadas, las historias compartidas en familia y la curiosidad por conocer el mundo.»'}
        </p>

        {/* Botón para saltar a la escena de cierre o ver pasaporte */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={targetId}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
          >
            {isEn ? 'Explore Closing Narrative ↓' : 'Descubrir Cierre Narrativo ↓'}
          </a>

          {onOpenPassport && (
            <button
              onClick={onOpenPassport}
              className="px-6 py-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/50 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isEn ? 'View Official Passport 📖' : 'Ver Pasaporte Oficial 📖'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 3. LATERAL CHAPTER RAIL (MARCADORES LATERALES DE LOS CAPÍTULOS DE AVENTURA)
 * ============================================================================
 * Carril de navegación flotante en el lateral derecho de la pantalla con iconos
 * distintivos y temáticos para cada capítulo del viaje.
 * Permite salto suave a cada hito, seguimiento en tiempo real del scroll y
 * tooltips cartográficos descriptivos.
 */
export const LateralChapterRail: React.FC<LateralChapterRailProps> = ({
  items = HOME_CHAPTER_RAIL_ITEMS,
  locale = 'es',
  className = '',
}) => {
  const [mountedItems, setMountedItems] = useState<ChapterRailItem[]>(items);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const isEn = locale === 'en';

  // Solo mostrar hitos que existen en el DOM (ej. evento de Halloween si está activo)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const filterExisting = () => {
      const activeInDom = items.filter((item) => {
        const el = document.querySelector(item.targetId) || document.getElementById(item.id);
        return !!el;
      });
      if (activeInDom.length > 0) {
        setMountedItems(activeInDom);
      }
    };
    filterExisting();
    const timer = setTimeout(filterExisting, 600);
    return () => clearTimeout(timer);
  }, [items]);

  // Rastrear la sección activa al hacer scroll por el documento
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentId = '';

      for (let i = 0; i < mountedItems.length; i++) {
        const item = mountedItems[i];
        const el = document.querySelector(item.targetId) || document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          if (scrollPos >= elementTop - 120) {
            currentId = item.id;
          }
        }
      }

      if (currentId) {
        setActiveSectionId(currentId);
      } else if (mountedItems.length > 0) {
        setActiveSectionId(mountedItems[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mountedItems]);

  const handleScrollTo = (targetId: string, id: string) => {
    const el = document.querySelector(targetId) || document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (mountedItems.length === 0) return null;

  return (
    <aside
      className={`fixed right-3 lg:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center pointer-events-auto select-none ${className}`}
      aria-label={isEn ? 'Expedition Chapter Markers' : 'Marcadores laterales de los capítulos'}
    >
      <nav
        className="relative flex flex-col items-center gap-2 p-2 rounded-full bg-slate-950/90 border-2 border-amber-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl"
        role="navigation"
      >
        {/* Hilo de sendero vertical discontinuo que une los marcadores de los capítulos */}
        <div
          className="absolute top-5 bottom-5 left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-amber-400/30 pointer-events-none -z-0"
          aria-hidden="true"
        />

        {mountedItems.map((item) => {
          const isActive = activeSectionId === item.id;
          const title = item.title[locale as 'es' | 'en'] || item.title.es;
          const subtitle = item.subtitle[locale as 'es' | 'en'] || item.subtitle.es;

          return (
            <button
              key={item.id}
              onClick={() => handleScrollTo(item.targetId, item.id)}
              className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 z-10 cursor-pointer"
              style={{
                backgroundColor: isActive ? item.themeColor : '#0f172a',
                color: isActive ? '#020617' : '#e2e8f0',
                border: isActive
                  ? `2.5px solid #fef08a`
                  : `1.5px solid ${item.themeColor}55`,
                boxShadow: isActive
                  ? `0 0 18px ${item.themeColor}aa, 0 0 30px ${item.themeColor}55`
                  : '0 2px 8px rgba(0,0,0,0.4)',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}
              aria-label={`${title} (${subtitle})`}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Icono temático representativo de cada capítulo */}
              <div className="transition-transform duration-300 group-hover:scale-115">
                {getChapterIcon(
                  item.iconName,
                  isActive
                    ? 'w-5 h-5 text-slate-950 stroke-[2.5]'
                    : 'w-4 h-4 text-slate-200 group-hover:text-amber-300'
                )}
              </div>

              {/* Indicador de pulso activo */}
              {isActive && (
                <span
                  className="absolute -inset-1 rounded-full animate-ping opacity-30 pointer-events-none"
                  style={{ backgroundColor: item.themeColor }}
                  aria-hidden="true"
                />
              )}

              {/* Tooltip interactivo deslizante hacia la izquierda con título e icono temático */}
              <div
                className="absolute right-13 sm:right-15 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-50 flex items-center shadow-2xl"
                role="tooltip"
              >
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-950/95 border-2 border-amber-400/60 backdrop-blur-xl text-left whitespace-nowrap shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
                  {/* Badge con el número de capítulo */}
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shadow-md flex-shrink-0"
                    style={{ backgroundColor: item.themeColor, color: '#020617' }}
                  >
                    {item.stepNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                        {isEn ? `CH. ${item.stepNumber}` : `CAP. ${item.stepNumber}`}
                      </span>
                      <span className="text-xs font-black text-white">
                        {title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {subtitle}
                    </span>
                  </div>
                </div>

                {/* Flechita apuntando al marcador */}
                <div
                  className="w-2.5 h-2.5 bg-slate-950 border-r-2 border-t-2 border-amber-400/60 rotate-45 -ml-1 flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

/**
 * ============================================================================
 * 4. EXPEDITION COMPASS HUD (ROSA DE LOS VIENTOS FLOTANTE & PASAPORTE)
 * ============================================================================
 * Icono de brújula de bronce y oro en la esquina inferior derecha.
 * Permite ver el itinerario completo de la expedición y saltar a cualquier hito.
 */
export const ExpeditionCompassHUD: React.FC<{
  waypoints?: TrailWaypoint[];
  locale?: string;
  className?: string;
}> = ({ waypoints = DEFAULT_WAYPOINTS, locale = 'es', className = '' }) => {
  const [activeWaypoint, setActiveWaypoint] = useState<TrailWaypoint | null>(null);
  const [isCompassMenuOpen, setIsCompassMenuOpen] = useState(false);
  const isEn = locale === 'en';

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto ${className}`}>
        {/* Menú desplegable con los hitos de la ruta */}
        {isCompassMenuOpen && (
          <div className="mb-2 w-72 rounded-3xl bg-slate-950/95 border-2 border-amber-400/60 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 text-white">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  {isEn ? 'Adventure Map Trail' : 'Ruta del Mapa'}
                </span>
              </div>
              <button
                onClick={() => setIsCompassMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar ruta"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {waypoints.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => {
                    setActiveWaypoint(wp);
                    setIsCompassMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-102 group cursor-pointer"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-md flex-shrink-0"
                    style={{ backgroundColor: wp.color, color: '#020617' }}
                  >
                    {getChapterIcon(wp.badgeIcon, 'w-3.5 h-3.5 text-slate-950')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-black text-slate-100 group-hover:text-amber-300 block truncate transition-colors">
                      {wp.title[locale as 'es' | 'en'] || wp.title.es}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {wp.subtitle[locale as 'es' | 'en'] || wp.subtitle.es}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón interactivo de la Brújula de Expedición */}
        <button
          onClick={() => setIsCompassMenuOpen(!isCompassMenuOpen)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border-2 border-amber-400/70 hover:border-amber-300 text-white shadow-[0_8px_25px_rgba(245,158,11,0.35)] backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title={isEn ? 'View adventure map milestones' : 'Ver hitos del mapa de aventuras'}
          aria-label={isEn ? 'View adventure map milestones' : 'Ver hitos del mapa de aventuras'}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
            <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block leading-tight">
              {isEn ? 'Adventure Trail' : 'Ruta de Aventuras'}
            </span>
            <span className="text-[9px] text-slate-400 block font-bold leading-tight">
              {waypoints.length} {isEn ? 'Milestones' : 'Hitos Cartográficos'}
            </span>
          </div>
        </button>
      </div>

      {/* Modal del Pasaporte Oficial al hacer clic en un hito */}
      {activeWaypoint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-white overflow-hidden">
            <button
              onClick={() => setActiveWaypoint(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar ficha de hito"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: activeWaypoint.color, color: '#020617' }}
              >
                {getChapterIcon(activeWaypoint.badgeIcon, 'w-6 h-6 text-slate-950')}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400">
                  {activeWaypoint.stampCode} • HITO 0{activeWaypoint.stepNumber}
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                  {activeWaypoint.title[locale as 'es' | 'en'] || activeWaypoint.title.es}
                </h3>
              </div>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-dashed border-amber-400/40 relative">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeWaypoint.coordinatesText}
                </span>
                <span className="text-amber-400 font-bold">{activeWaypoint.dateStamp}</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 mt-2">
                {activeWaypoint.subtitle[locale as 'es' | 'en'] || activeWaypoint.subtitle.es}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">
                «{activeWaypoint.note[locale as 'es' | 'en'] || activeWaypoint.note.es}»
              </p>

              <div className="absolute right-3 -bottom-3 rotate-12 border-2 border-amber-400/70 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 shadow-md">
                ★ PASAPORTE CURILETA ★
              </div>
            </div>

            <button
              onClick={() => setActiveWaypoint(null)}
              className="w-full py-3 rounded-full font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isEn ? 'Continue Expedition' : 'Continuar Expedición'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * ============================================================================
 * 5. ADVENTURE MAP BACKDROP (REGLA DE COORDENADAS CARTOGRÁFICAS EN MÁRGENES)
 * ============================================================================
 * Cuadrícula de coordenadas en los laterales exteriores (márgenes),
 * totalmente a nivel z-0 y pointer-events-none.
 */
export const AdventureMapBackdrop: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-35 dark:opacity-20 ${className}`}
      aria-hidden="true"
    >
      {/* Regla de latitudes y longitudes en margen izquierdo */}
      <div className="hidden lg:flex flex-col justify-between absolute top-0 bottom-0 left-3 w-6 py-12 text-[9px] font-mono font-bold text-amber-500/60 select-none">
        <span>00°N</span>
        <span>15°N</span>
        <span>30°N</span>
        <span>45°N</span>
        <span>60°N</span>
        <span>75°N</span>
        <span>90°N</span>
      </div>

      {/* Regla de coordenadas en margen derecho */}
      <div className="hidden lg:flex flex-col justify-between absolute top-0 bottom-0 right-3 w-6 py-12 text-[9px] font-mono font-bold text-amber-500/60 text-right select-none">
        <span>00°W</span>
        <span>30°W</span>
        <span>60°W</span>
        <span>90°W</span>
        <span>120°W</span>
        <span>150°W</span>
        <span>180°W</span>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 6. EXPEDITION TRAIL (COMPONENTE COMPATIBLE CON EL HOME GLOBAL)
 * ============================================================================
 * Integra la ambientación cartográfica de fondo, los marcadores laterales de
 * los capítulos con iconos temáticos y la Brújula HUD de la expedición.
 */
export const ExpeditionTrail: React.FC<ExpeditionTrailProps> = ({
  waypoints = DEFAULT_WAYPOINTS,
  locale = 'es',
  className = '',
}) => {
  return (
    <>
      <AdventureMapBackdrop className={className} />
      <LateralChapterRail locale={locale} />
      <ExpeditionCompassHUD waypoints={waypoints} locale={locale} />
    </>
  );
};
