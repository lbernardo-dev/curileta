'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Navigation, Sparkles, BookOpen, Radio, Award, X, MapPin } from 'lucide-react';
import { TrailWaypoint } from '@curileta/cms';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExpeditionTrailProps {
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
    badgeIcon: 'Compass',
    dateStamp: '01 OCT — INICIO',
    note: {
      es: 'Curileta despliega el pergamino y enciende la brújula solar.',
      en: 'Curileta unrolls the parchment and sparks the solar compass.',
    },
    color: '#10B981',
  },
  {
    id: 'globo-cartografia',
    stepNumber: 2,
    title: { es: 'Globo Aerostático', en: 'Hot Air Balloon' },
    subtitle: { es: 'Cartografía Orbital 3D', en: '3D Orbital Cartography' },
    stampCode: 'AERO-CART-002',
    coordinatesText: 'Alt. 3.200m | Sonda Viento',
    badgeIcon: 'Navigation',
    dateStamp: '03 OCT — VUELO',
    note: {
      es: 'El globo asciende sobre las nubes para trazar las rutas del planeta en 3D.',
      en: 'The balloon ascends above clouds to chart Earth’s 3D routes.',
    },
    color: '#F59E0B',
  },
  {
    id: 'tripulacion-amigos',
    stepNumber: 3,
    title: { es: 'Campamento de Amigos', en: 'Friends Camp' },
    subtitle: { es: 'Encuentro con Pompón, Quetzal y Lulú', en: 'Meeting with Pompón, Quetzal & Lulú' },
    stampCode: 'CREW-AMIG-003',
    coordinatesText: 'Valle de la Buena Amistad',
    badgeIcon: 'Sparkles',
    dateStamp: '07 OCT — ALIANZA',
    note: {
      es: 'Cada compañero aporta un don indispensable: prudencia, vuelo y destreza marina.',
      en: 'Each companion brings an essential gift: prudence, flight, and marine skill.',
    },
    color: '#38BDF8',
  },
  {
    id: 'biblioteca-relatos',
    stepNumber: 4,
    title: { es: 'Biblioteca de Aventuras', en: 'Adventure Library' },
    subtitle: { es: 'Libros Ilustrados & Manuscritos', en: 'Illustrated Books & Manuscripts' },
    stampCode: 'BIBL-DEST-004',
    coordinatesText: 'Bóveda de Relatos Secretos',
    badgeIcon: 'BookOpen',
    dateStamp: '12 OCT — ARCHIVO',
    note: {
      es: 'Las historias cobran vida en papel de alta calidad con mapas desplegables.',
      en: 'Stories come alive on premium paper with fold-out maps.',
    },
    color: '#EC4899',
  },
  {
    id: 'senales-musica',
    stepNumber: 5,
    title: { es: 'Estación de Señales', en: 'Signal Station' },
    subtitle: { es: 'Frecuencia YouTube & Música', en: 'YouTube Frequency & Music' },
    stampCode: 'WAVE-CURI-005',
    coordinatesText: 'Onda Corta 104.7 MHz',
    badgeIcon: 'Radio',
    dateStamp: '18 OCT — AL AIRE',
    note: {
      es: 'Canciones y capítulos animados transmitidos para toda la comunidad exploradora.',
      en: 'Animated episodes and songs broadcasted for young explorers everywhere.',
    },
    color: '#EF4444',
  },
  {
    id: 'pasaporte-dorado',
    stepNumber: 6,
    title: { es: 'Sello de Oro', en: 'Golden Stamp' },
    subtitle: { es: 'Pasaporte de Explorador Oficial', en: 'Official Explorer Passport' },
    stampCode: 'EXP-GOLD-999',
    coordinatesText: 'Destino: Horizonte Abierto',
    badgeIcon: 'Award',
    dateStamp: 'EXPEDICIÓN ACTIVA',
    note: {
      es: 'El viaje nunca termina: cada nuevo libro y país añade un sello a tu colección.',
      en: 'The journey never ends: each new book and country adds a stamp to your collection.',
    },
    color: '#FBBF24',
  },
];

export const ExpeditionTrail: React.FC<ExpeditionTrailProps> = ({
  waypoints = DEFAULT_WAYPOINTS,
  locale = 'es',
  className = '',
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<TrailWaypoint | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathRef.current || !containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: '12 8',
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'Navigation':
        return <Navigation className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Radio':
        return <Radio className="w-4 h-4" />;
      case 'Award':
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  // Posiciones porcentuales verticales a lo largo del scroll
  const waypointPositions = [12, 28, 45, 62, 78, 92];

  return (
    <>
      {/* Sendero Cartográfico Flotante en Segundo Plano */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
          opacity: 0.45,
        }}
        className={`pointer-events-none fixed inset-0 z-0 w-full h-full overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
          className="w-full h-full"
        >
          {/* Trazado base sutil de expedición */}
          <path
            d="M 50,0 Q 85,150 50,300 T 15,600 T 80,850 L 50,1000"
            fill="none"
            stroke="rgba(245, 158, 11, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Trazado activo animado con degradado dorado-esmeralda */}
          <path
            ref={pathRef}
            d="M 50,0 Q 85,150 50,300 T 15,600 T 80,850 L 50,1000"
            fill="none"
            stroke="url(#expeditionGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.75))"
          />

          <defs>
            <linearGradient id="expeditionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="75%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Viñetas / Sellos flotantes accesibles en el lateral */}
      <aside
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 pointer-events-auto"
        aria-label="Hitos de la expedición en el mapa"
      >
        <div className="bg-slate-950/90 border border-emerald-500/40 rounded-full p-1.5 shadow-2xl backdrop-blur-xl flex flex-col gap-2">
          {waypoints.map((wp, idx) => (
            <button
              key={wp.id}
              onClick={() => setActiveWaypoint(wp)}
              className="group relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
              style={{
                backgroundColor: activeWaypoint?.id === wp.id ? wp.color : '#0f172a',
                color: activeWaypoint?.id === wp.id ? '#020617' : '#94a3b8',
                border: `1.5px solid ${wp.color}`,
              }}
              aria-label={`Ver hito ${wp.stepNumber}: ${wp.title[locale as 'es' | 'en'] || wp.title.es}`}
            >
              {getIcon(wp.badgeIcon)}

              {/* Tooltip de previsualización */}
              <span className="absolute right-12 whitespace-nowrap px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-amber-400 font-mono mr-1">#{wp.stepNumber}</span>
                {wp.title[locale as 'es' | 'en'] || wp.title.es}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Modal / Viñeta emergente con el Sello de Pasaporte Oficial */}
      {activeWaypoint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-white overflow-hidden">
            {/* Patrón de pergamino / sello de agua */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(245,158,11,0.15),transparent)] pointer-events-none" />

            {/* Botón cerrar */}
            <button
              onClick={() => setActiveWaypoint(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Cerrar ficha de hito"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera del sello de pasaporte */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: activeWaypoint.color, color: '#020617' }}
              >
                {getIcon(activeWaypoint.badgeIcon)}
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

            {/* Sello de pasaporte gráfico */}
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

              {/* Sello circular estético */}
              <div className="absolute right-3 -bottom-3 rotate-12 border-2 border-amber-400/70 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 shadow-md">
                ★ PASAPORTE CURILETA ★
              </div>
            </div>

            {/* Botón de acción */}
            <button
              onClick={() => setActiveWaypoint(null)}
              className="w-full py-3 rounded-full font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Continuar Expedición
            </button>
          </div>
        </div>
      )}
    </>
  );
};
