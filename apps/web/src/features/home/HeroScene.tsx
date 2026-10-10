'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import type { SiteSettings } from '@curileta/cms';
import {
  Compass,
  Sparkles,
  ArrowDown,
  BookOpen,
  Globe2,
  Users,
  ShieldCheck,
  Quote,
  Feather,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface CharacterSpotlight {
  id: 'curileta' | 'pompon' | 'quetzal';
  name: string;
  role: { es: string; en: string };
  quote: { es: string; en: string };
  image: string;
  badge: { es: string; en: string };
  origin: { es: string; en: string };
}

const SPOTLIGHT_CHARACTERS: CharacterSpotlight[] = [
  {
    id: 'curileta',
    name: 'Curileta',
    role: {
      es: 'Exploradora Principal y Cartógrafa',
      en: 'Lead Explorer & Cartographer',
    },
    quote: {
      es: '«Cada rincón del mundo guarda un asombro amable. Alista tu mochila, mantén el corazón abierto y deja que la curiosidad dibuje el camino.»',
      en: '«Every corner of the world holds a friendly wonder. Pack light, keep an open heart, and let curiosity draw the path.»',
    },
    image: '/images/characters/curileta-main.webp',
    badge: {
      es: 'Cuaderno y Brújula',
      en: 'Compass & Journal',
    },
    origin: {
      es: 'Bosque Nublado',
      en: 'Cloud Forest',
    },
  },
  {
    id: 'pompon',
    name: 'Pompón',
    role: {
      es: 'Guardián Postal del Árbol Centenario',
      en: 'Treehouse Postal Guardian',
    },
    quote: {
      es: '«Una carta manuscrita viaja más rápido que el viento cuando viaja llena de afecto y noticias del bosque.»',
      en: '«A handwritten letter travels faster than the wind when it carries genuine affection and forest secrets.»',
    },
    image: '/images/characters/pompon-main.webp',
    badge: {
      es: 'Sello de Lacre y Correo',
      en: 'Wax Seal & Airmail',
    },
    origin: {
      es: 'Madriguera Esmeralda',
      en: 'Emerald Hollows',
    },
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    role: {
      es: 'Guía de las Alturas y Cronista',
      en: 'Sky Pathfinder & Chronicler',
    },
    quote: {
      es: '«Desde las alturas, las fronteras se desvanecen y los monumentos antiguos pertenecen a todo aquel que los mire con respeto.»',
      en: '«From above, borders dissolve and ancient wonders belong to anyone who gazes upon them with respect.»',
    },
    image: '/images/characters/quetzal-main.webp',
    badge: {
      es: 'Vuelo Astral y Ruinas',
      en: 'Solar Flight & Ruins',
    },
    origin: {
      es: 'Selva Mesoamericana',
      en: 'Mesoamerican Canopy',
    },
  },
];

export const HeroScene: React.FC<{ locale: Locale; settings?: SiteSettings }> = ({
  locale,
  settings,
}) => {
  const { isSeasonalActive, themeKey } = useSeasonalTheme();
  const isEn = locale === 'en';
  const isHalloween = isSeasonalActive && themeKey === 'halloween';

  const charCount = settings?.totalCharactersCount || 19;
  const locationsCount = settings?.totalCountriesCount || 11;
  const booksCount = settings?.totalBooksCount || 2;

  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const activeChar = SPOTLIGHT_CHARACTERS[activeCharIndex];

  return (
    <section
      id="hero-scene"
      className="relative z-10 min-h-[94vh] flex flex-col justify-between overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-12 text-slate-900 dark:text-white transition-colors duration-700"
    >
      {/* ============================================================
          ATMÓSFERA Y AMBIENTACIÓN CINEMÁTICA CON LUZ ORGÁNICA
          ============================================================ */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
          isHalloween
            ? 'bg-gradient-to-b from-[#130722] via-[#0b0314] to-[#06020c]'
            : 'bg-gradient-to-b from-emerald-50/70 via-background to-background dark:from-[#031913] dark:via-[#020b08] dark:to-[#010504]'
        }`}
      />

      {/* Resplandor radial de luz cenital suave */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isHalloween
            ? 'bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(249,115,22,0.18),transparent_70%)]'
            : 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(52,211,153,0.22),transparent_75%)]'
        }`}
      />

      {/* Orbes de luz atmosférica desenfocados (efecto aurora / godrays) */}
      <div
        className={`absolute -top-32 left-1/4 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none animate-pulse-soft ${
          isHalloween ? 'bg-orange-600/12' : 'bg-emerald-400/15 dark:bg-emerald-500/10'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-24 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none animate-pulse-soft ${
          isHalloween ? 'bg-purple-600/15' : 'bg-teal-400/12 dark:bg-teal-500/10'
        }`}
        style={{ animationDelay: '3s' }}
      />
      <div
        className={`absolute -bottom-20 left-10 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none ${
          isHalloween ? 'bg-amber-600/10' : 'bg-amber-300/10 dark:bg-amber-500/5'
        }`}
      />

      {/* Sutiles partículas lumínicas etéreas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/12 w-2 h-2 rounded-full bg-emerald-400/40 dark:bg-emerald-300/30 blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/3 right-1/8 w-2 h-2 rounded-full bg-amber-400/50 dark:bg-amber-300/30 blur-[0.5px] animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-teal-300/40 blur-[0.5px] animate-pulse delay-1000" />
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 rounded-full bg-emerald-300/30 blur-[1px] animate-pulse delay-500" />
      </div>

      {/* ============================================================
          ESCENARIO PRINCIPAL A 2 COLUMNAS EDITORIALES Y CINEMÁTICAS
          ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto py-8 lg:py-12">
        {/* ============================================================
            COLUMNA IZQUIERDA: EDITORIAL NARRATIVO Y LLAMADOS A LA ACCIÓN (7 COLS)
            ============================================================ */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge superior sutil y cristalino */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md mb-6 transition-all duration-500 border ${
              isHalloween
                ? 'bg-orange-500/10 border-orange-500/25 text-orange-950 dark:text-orange-200'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-300'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                isHalloween ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            />
            <span>
              {isHalloween
                ? isEn
                  ? 'Halloween Special • The Enchanted Forest'
                  : 'Especial de Halloween • El Bosque Encantado'
                : isEn
                ? 'Illustrated Literary Universe • For Young Explorers'
                : 'Universo Literario Ilustrado • Pequeños Exploradores'}
            </span>
          </div>

          {/* Gran Título Editorial con Gradiente Armónico */}
          <h1 className="font-extrabold tracking-tight text-4xl sm:text-6xl lg:text-[68px] leading-[1.08] text-slate-900 dark:text-white max-w-3xl">
            <span>{isEn ? 'Where curiosity' : 'Donde la curiosidad'}</span>
            <br />
            <span
              className={`text-transparent bg-clip-text transition-colors duration-500 ${
                isHalloween
                  ? 'bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 dark:from-emerald-300 dark:via-teal-200 dark:to-amber-300'
              }`}
            >
              {isEn ? 'becomes an expedition.' : 'se convierte en aventura.'}
            </span>
          </h1>

          {/* Sinopsis poética y clara */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
            {isEn
              ? 'Join Curileta and her companions on an illustrated journey across 40 cultures. Real heritage, hardcover storybooks, original melodies, and lifelong family values.'
              : 'Acompaña a Curileta y su tripulación en una travesía ilustrada por 40 culturas del planeta. Patrimonio real, libros en tapa dura, música original y valores para compartir en familia.'}
          </p>

          {/* Tarjeta de Cita Narrativa del Personaje Activo (Diseño Editorial Glassmorphism) */}
          <div className="mt-7 w-full max-w-xl rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 p-4 sm:p-5 shadow-xl shadow-slate-900/5 transition-all duration-300">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Quote className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-snug">
                  {activeChar.quote[isEn ? 'en' : 'es']}
                </p>
                <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {activeChar.name}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {activeChar.role[isEn ? 'en' : 'es']}
                    </span>
                  </div>

                  {/* Selector rápido y elegante de narrador */}
                  <div className="flex items-center gap-1">
                    {SPOTLIGHT_CHARACTERS.map((char, index) => (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => setActiveCharIndex(index)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all ${
                          activeCharIndex === index
                            ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={char.name}
                      >
                        {char.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grupo de Acciones Principales (Estilo Premium y Fluido) */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
            {/* CTA Primario: Explorar Travesías */}
            <a
              href="#escena-globo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 text-center group cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-100 group-hover:rotate-45 transition-transform duration-500" />
              <span>{isEn ? 'Explore the World' : 'Explorar Travesías'}</span>
              <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* CTA Secundario: Conocer la Tripulación */}
            <a
              href="#escena-personajes"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-center cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                {isEn ? `Meet the Crew (${charCount})` : `Conocer la Tripulación (${charCount})`}
              </span>
            </a>
          </div>

          {/* Garantías y sellos de calidad discretos */}
          <div className="mt-8 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400 flex-wrap justify-center lg:justify-start">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {isEn ? 'Safe Family Content' : 'Contenido Seguro Infantil'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Globe2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              {isEn ? '40+ Real World Cultures' : '40+ Culturas Reales'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {isEn ? 'Physical Hardcovers' : 'Libros en Tapa Dura'}
            </span>
          </div>
        </div>

        {/* ============================================================
            COLUMNA DERECHA: SPOTLIGHT CINEMÁTICO DEL PERSONAJE (5 COLS)
            ============================================================ */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] flex items-center justify-center">
            {/* Halo radiante concéntrico detrás del personaje */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-400/10 dark:via-teal-400/5 blur-2xl pointer-events-none" />

            {/* Anillo de cristal orbital decorativo */}
            <div className="absolute inset-8 rounded-full border border-emerald-500/20 dark:border-white/10 backdrop-blur-xs pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-dashed border-emerald-500/15 dark:border-white/5 pointer-events-none" />

            {/* Figura Central Flotante */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-6 animate-float-gentle">
              <img
                key={activeChar.id}
                src={activeChar.image}
                alt={activeChar.name}
                className="max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_25px_45px_rgba(16,185,129,0.2)] transition-all duration-700"
              />
            </div>

            {/* Tarjeta Satélite Flotante 1: Origen del Personaje (Esquina Superior Izquierda) */}
            <div className="absolute top-6 left-0 z-20 px-3.5 py-2 rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/10 flex items-center gap-2.5 animate-float-slow">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                🌿
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block leading-none">
                  {isEn ? 'Home' : 'Origen'}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeChar.origin[isEn ? 'en' : 'es']}
                </span>
              </div>
            </div>

            {/* Tarjeta Satélite Flotante 2: Distintivo de Aventura (Esquina Inferior Derecha) */}
            <div
              className="absolute bottom-10 right-0 z-20 px-3.5 py-2 rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/10 flex items-center gap-2.5 animate-float-slow"
              style={{ animationDelay: '2.5s' }}
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                🧭
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block leading-none">
                  {isEn ? 'Companion Trait' : 'Especialidad'}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeChar.badge[isEn ? 'en' : 'es']}
                </span>
              </div>
            </div>

            {/* Selector de Personajes de la Galería Spotlight (Parte inferior de la figura) */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-md">
              {SPOTLIGHT_CHARACTERS.map((char, index) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => setActiveCharIndex(index)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeCharIndex === index
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">
                    {char.id === 'curileta' ? '🦎' : char.id === 'pompon' ? '🐰' : '🦜'}
                  </span>
                  <span>{char.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          BARRA DE MÉTRICAS EDITORIALES Y ANCLAJE AL MAPA DE EXPEDICIÓN
          ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-6 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Métricas consolidadas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center sm:text-left w-full md:w-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {locationsCount}+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isEn ? 'World Cultures' : 'Países Documentados'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {charCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isEn ? 'Story Characters' : 'Personajes Originales'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {booksCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isEn ? 'Hardcover Editions' : 'Volúmenes Publicados'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              100%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isEn ? 'Safe & Ad-Free' : 'Libre de Publicidad'}
            </div>
          </div>
        </div>

        {/* Indicador de Desplazamiento Sutil hacia el Mapa */}
        <a
          href="#escena-mapa"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors py-2 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
        >
          <span>{isEn ? 'Follow the Expedition Trail' : 'Recorrer el Sendero del Mapa'}</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
