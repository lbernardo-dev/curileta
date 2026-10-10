'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Character, INITIAL_CHARACTERS } from '@curileta/cms';
import { getCharacterImageAspectRatio } from '@/lib/character-image';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import { CharacterFavoriteButton, FavoriteRankBadge } from '@/components/CharacterFavoritesProvider';
import { SectionEmblem } from '@/components/SectionEmblem';
import {
  Sparkles,
  Compass,
  Shield,
  Zap,
  BookOpen,
  Briefcase,
  ChevronRight,
  Heart,
  Award,
  X,
  MapPin,
  Smile,
  Download,
  ZoomIn,
  Eye,
  ExternalLink,
  Users,
} from 'lucide-react';

interface CharacterHubSceneProps {
  locale: Locale;
  characters?: Character[];
  hideHeader?: boolean;
}

interface CharacterTheme {
  flag: string;
  region: string;
  gradient: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
}

const copy = (locale: Locale, es: string, en: string) => locale === 'en' ? en : es;

const CHARACTER_NAME_EN: Record<string, string> = {
  curileta: 'Curileta', pompon: 'Pompón', quetzal: 'Quetzal',
  lulu: 'Lulu the Llama', emi: 'Emi the Beetle', picu: 'Picu the Puffin',
  'zipi-bot': 'Zipi-Bot', kiki: 'Kiki the Kiwi', bao: 'Bao the Panda',
  gino: 'Gino the Mouse Chef', lola: 'Lola the Moorish Tortoise',
  'canguro-mama': 'Mama Kangaroo', 'mama-canguro': 'Mama Kangaroo',
  'canguro-bebe': 'Baby Kangaroo', 'bebe-canguro': 'Baby Kangaroo',
  joey: 'Joey, the plush koala', 'joey-peluche': 'Joey, the plush koala',
  'pez-volador': 'Glub the Flying Fish', glub: 'Glub the Flying Fish',
  ornitorrinco: 'The Wise Platypus', emu: 'The Curious Emu',
  basset: 'Barnaby the Basset Hound', barnaby: 'Barnaby the Basset Hound',
  cobaya: 'Andean Guinea Pig', cuy: 'Andean Guinea Pig',
};

const CHARACTER_TRAIT_EN: Record<string, string> = {
  Curiosa: 'Curious', Curioso: 'Curious', Valiente: 'Brave', Leal: 'Loyal',
  Observadora: 'Observant', Observador: 'Observant', Empática: 'Empathetic',
  Tierno: 'Tender', Tierna: 'Tender', Fiel: 'Faithful', Hogareño: 'Home-loving',
  Alegre: 'Cheerful', Saltarín: 'Hoppy', Místico: 'Mystical', Majestuoso: 'Majestic',
  Sabio: 'Wise', Sabia: 'Wise', Ágil: 'Agile', Generosa: 'Generous',
  Tranquila: 'Calm', Tranquilo: 'Calm', Acogedora: 'Welcoming', Fuerte: 'Strong',
  Filosófico: 'Thoughtful', Tenaz: 'Tenacious', Amable: 'Kind', Perspicaz: 'Perceptive',
  Divertido: 'Playful', Divertida: 'Playful', Expresivo: 'Expressive', Expresiva: 'Expressive',
  Acróbata: 'Acrobatic', Entusiasta: 'Enthusiastic', Musical: 'Musical', Tímido: 'Shy',
  Nocturno: 'Nocturnal', Glotón: 'Food-loving', Sereno: 'Serene', Bondadoso: 'Kind-hearted',
  Rilax: 'Relaxed', Relajado: 'Relaxed', Apasionado: 'Passionate', Gourmet: 'Gourmet', Creativo: 'Creative',
  Serena: 'Serene', Cálida: 'Warm', Agradecida: 'Grateful', Protectora: 'Protective',
  Veloz: 'Fast', Cariñosa: 'Affectionate', Juguetón: 'Playful', Juguetona: 'Playful',
  Silencioso: 'Quiet', Reconfortante: 'Comforting', Suave: 'Gentle', Incondicional: 'Devoted',
  Luminoso: 'Bright', Vivaz: 'Lively', Enigmático: 'Mysterious',
  Pacífico: 'Peaceful', Acelerado: 'Energetic', Simpático: 'Friendly', Incansable: 'Tireless',
  Bonachón: 'Good-natured', Despistado: 'Absent-minded', Sociable: 'Sociable',
};

const characterName = (character: Character, locale: Locale) =>
  locale === 'en' ? CHARACTER_NAME_EN[character.id] || character.name : character.name;

const characterTrait = (trait: string, locale: Locale) => {
  if (locale === 'en') return CHARACTER_TRAIT_EN[trait] || trait;
  return trait === 'Rilax' ? 'Relajado' : trait;
};

const CHARACTER_REGION_EN: Record<string, string> = {
  curileta: 'Enchanted Forest / Global',
  pompon: 'Enchanted Forest (Spain)',
  quetzal: 'Teotihuacan (Mexico)',
  lulu: 'Machu Picchu (Peru)',
  emi: 'Giza & Cairo (Egypt)',
  picu: 'Blue Lagoon (Iceland)',
  'zipi-bot': 'Tokyo & Shibuya (Japan)',
  'canguro-mama': 'Uluru & Outback (Australia)',
  'mama-canguro': 'Uluru & Outback (Australia)',
  'canguro-bebe': 'Uluru & Hyams Beach (Australia)',
  'bebe-canguro': 'Uluru & Hyams Beach (Australia)',
  joey: 'Uluru (Australia)',
  'joey-peluche': 'Uluru (Australia)',
  kiki: 'Waitomo Caves (New Zealand)',
  bao: 'Great Wall & Bamboo (China)',
  gino: 'Florence & Rome (Italy)',
  lola: 'Andalusia & Forest (Spain)',
  ornitorrinco: 'Outback Creeks (Australia)',
  emu: 'Outback Plains (Australia)',
  'pez-volador': 'Philippine Sea & Pacific Ocean',
  glub: 'Philippine Sea & Pacific Ocean',
  cobaya: 'Sacred Valley of the Andes (Peru)',
  cuy: 'Sacred Valley of the Andes (Peru)',
  basset: 'French Alps (France)',
  barnaby: 'French Alps (France)',
};

const localizedRegion = (id: string, region: string, locale: Locale) =>
  locale === 'en' ? CHARACTER_REGION_EN[id] || region : region;

const CHARACTER_THEMES: Record<string, CharacterTheme> = {
  curileta: {
    flag: '🇪🇸',
    region: 'Bosque Encantado / Global',
    gradient: 'from-emerald-400 via-amber-300 to-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-950/90 border-emerald-500/50',
    badgeText: 'text-emerald-300',
  },
  pompon: {
    flag: '🇪🇸',
    region: 'Bosque Encantado (España)',
    gradient: 'from-slate-100 via-sky-200 to-indigo-300',
    glowColor: 'rgba(186, 230, 253, 0.45)',
    badgeBg: 'bg-sky-950/90 border-sky-400/50',
    badgeText: 'text-sky-300',
  },
  quetzal: {
    flag: '🇲🇽',
    region: 'Teotihuacán (México)',
    gradient: 'from-emerald-500 via-teal-300 to-amber-400',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    badgeBg: 'bg-teal-950/90 border-teal-500/50',
    badgeText: 'text-teal-300',
  },
  lulu: {
    flag: '🇵🇪',
    region: 'Machu Picchu (Perú)',
    gradient: 'from-amber-400 via-orange-400 to-rose-400',
    glowColor: 'rgba(251, 146, 60, 0.45)',
    badgeBg: 'bg-amber-950/90 border-amber-500/50',
    badgeText: 'text-amber-300',
  },
  emi: {
    flag: '🇪🇬',
    region: 'Giza & El Cairo (Egipto)',
    gradient: 'from-amber-300 via-yellow-500 to-blue-600',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    badgeBg: 'bg-yellow-950/90 border-yellow-500/50',
    badgeText: 'text-yellow-300',
  },
  picu: {
    flag: '🇮🇸',
    region: 'Laguna Azul (Islandia)',
    gradient: 'from-sky-400 via-cyan-300 to-orange-400',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    badgeBg: 'bg-cyan-950/90 border-cyan-500/50',
    badgeText: 'text-cyan-300',
  },
  'zipi-bot': {
    flag: '🇯🇵',
    region: 'Tokio & Shibuya (Japón)',
    gradient: 'from-fuchsia-500 via-purple-400 to-cyan-400',
    glowColor: 'rgba(217, 70, 239, 0.45)',
    badgeBg: 'bg-purple-950/90 border-fuchsia-500/50',
    badgeText: 'text-fuchsia-300',
  },
  'canguro-mama': {
    flag: '🇦🇺',
    region: 'Uluru & Outback (Australia)',
    gradient: 'from-orange-500 via-amber-400 to-red-500',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    badgeBg: 'bg-orange-950/90 border-orange-500/50',
    badgeText: 'text-orange-300',
  },
  'canguro-bebe': {
    flag: '🇦🇺',
    region: 'Uluru & Hyams Beach (Australia)',
    gradient: 'from-amber-300 via-yellow-200 to-orange-300',
    glowColor: 'rgba(252, 211, 77, 0.45)',
    badgeBg: 'bg-amber-950/90 border-amber-400/50',
    badgeText: 'text-yellow-300',
  },
  joey: {
    flag: '🇦🇺',
    region: 'Uluru (Australia)',
    gradient: 'from-teal-300 via-emerald-200 to-slate-300',
    glowColor: 'rgba(94, 234, 212, 0.45)',
    badgeBg: 'bg-slate-900 border-teal-400/50',
    badgeText: 'text-teal-200',
  },
  kiki: {
    flag: '🇳🇿',
    region: 'Cuevas de Waitomo (Nueva Zelanda)',
    gradient: 'from-teal-400 via-emerald-400 to-sky-300',
    glowColor: 'rgba(45, 212, 191, 0.45)',
    badgeBg: 'bg-emerald-950/90 border-emerald-500/50',
    badgeText: 'text-emerald-300',
  },
  bao: {
    flag: '🇨🇳',
    region: 'Gran Muralla & Bambú (China)',
    gradient: 'from-emerald-400 via-lime-300 to-amber-400',
    glowColor: 'rgba(132, 204, 22, 0.45)',
    badgeBg: 'bg-lime-950/90 border-lime-500/50',
    badgeText: 'text-lime-300',
  },
  gino: {
    flag: '🇮🇹',
    region: 'Florencia & Roma (Italia)',
    gradient: 'from-emerald-500 via-amber-300 to-red-400',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    badgeBg: 'bg-rose-950/90 border-rose-500/50',
    badgeText: 'text-rose-300',
  },
  lola: {
    flag: '🇪🇸',
    region: 'Andalucía & Bosque (España)',
    gradient: 'from-amber-500 via-yellow-400 to-emerald-600',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    badgeBg: 'bg-amber-950/90 border-amber-500/50',
    badgeText: 'text-amber-300',
  },
  'pez-volador': {
    flag: '🌊',
    region: 'Mar de Filipinas & Océano Pacífico',
    gradient: 'from-cyan-400 via-blue-400 to-indigo-500',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    badgeBg: 'bg-blue-950/90 border-cyan-500/50',
    badgeText: 'text-cyan-300',
  },
  ornitorrinco: {
    flag: '🇦🇺',
    region: 'Arroyos del Outback (Australia)',
    gradient: 'from-teal-500 via-cyan-400 to-amber-600',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    badgeBg: 'bg-teal-950/90 border-teal-500/50',
    badgeText: 'text-teal-300',
  },
  emu: {
    flag: '🇦🇺',
    region: 'Llanuras del Outback (Australia)',
    gradient: 'from-emerald-500 via-teal-400 to-amber-500',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-950/90 border-emerald-500/50',
    badgeText: 'text-emerald-300',
  },
  basset: {
    flag: '🇫🇷',
    region: 'Alpes Franceses (Francia)',
    gradient: 'from-amber-600 via-orange-400 to-yellow-300',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    badgeBg: 'bg-amber-950/90 border-amber-600/50',
    badgeText: 'text-amber-300',
  },
  cobaya: {
    flag: '🇵🇪',
    region: 'Valle Sagrado de los Andes (Perú)',
    gradient: 'from-purple-500 via-pink-400 to-amber-400',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    badgeBg: 'bg-purple-950/90 border-purple-500/50',
    badgeText: 'text-purple-300',
  },
};

const getCharacterTheme = (id: string): CharacterTheme => {
  return (
    CHARACTER_THEMES[id] || {
      flag: '🗺️',
      region: 'Expedición Mundial',
      gradient: 'from-emerald-400 via-amber-300 to-sky-400',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      badgeBg: 'bg-slate-900 border-slate-700',
      badgeText: 'text-slate-300',
    }
  );
};

// Mapa de rutas WebP locales oficiales
const getCharacterImagePath = (slug: string): string => {
  switch (slug) {
    case 'curileta':
      return '/images/characters/curileta-main.webp';
    case 'pompon':
      return '/images/characters/pompon-main.webp';
    case 'quetzal':
      return '/images/characters/quetzal-main.webp';
    case 'lulu':
      return '/images/characters/lulu-main.webp';
    case 'emi':
      return '/images/characters/emi-main.webp';
    case 'picu':
      return '/images/characters/picu-main.webp';
    case 'zipi-bot':
      return '/images/characters/zipi-bot-main.webp';
    case 'canguro-mama':
    case 'mama-canguro':
      return '/images/characters/canguro-mama-main.webp';
    case 'canguro-bebe':
    case 'bebe-canguro':
      return '/images/characters/canguro-bebe-main.webp';
    case 'joey':
    case 'joey-peluche':
      return '/images/characters/joey-main.webp';
    case 'joey-canguro':
      return '/images/characters/joey-main.webp';
    case 'kiki':
      return '/images/characters/kiki-main.webp';
    case 'bao':
      return '/images/characters/bao-main.webp';
    case 'gino':
      return '/images/characters/gino-main.webp';
    case 'lola':
      return '/images/characters/lola-main.webp';
    case 'ornitorrinco':
      return '/images/characters/ornitorrinco-main.webp';
    case 'emu':
      return '/images/characters/emu-main.webp';
    case 'pez-volador':
    case 'glub':
      return '/images/characters/pez-volador-main.webp';
    case 'cobaya':
    case 'cuy':
      return '/images/characters/cobaya-main.webp';
    case 'basset':
    case 'barnaby':
      return '/images/characters/basset-main.webp';
    default:
      return `/images/characters/${slug}-main.webp`;
  }
};

// Componente de Avatar con fallback dinámico
const CharacterAvatar: React.FC<{
  character: Character;
  locale: Locale;
  className?: string;
}> = ({ character, locale, className = 'w-full h-full object-contain' }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => character.mainImage?.url || getCharacterImagePath(character.slug));

  useEffect(() => {
    setImgSrc(character.mainImage?.url || getCharacterImagePath(character.slug));
  }, [character.slug, character.mainImage?.url]);

  const handleError = () => {
    const fallback = getCharacterImagePath(character.slug);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={character.mainImage?.alt?.[locale] || character.mainImage?.alt?.es || characterName(character, locale)}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// Tarjeta individual con Efecto 3D Tilt y Glare
const TiltCharacterCard: React.FC<{
  character: Character;
  locale: Locale;
  isSelected: boolean;
  onSelect: () => void;
  onOpenZoom: (c: Character) => void;
}> = ({ character, locale, isSelected, onSelect, onOpenZoom }) => {
  const theme = getCharacterTheme(character.id);

  const roleText = character.passportRole
    ? character.passportRole[locale] || character.passportRole.es
    : character.species;

  return (
    <div
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`group relative rounded-[1.65rem] p-4 sm:p-5 cursor-pointer border transition-all duration-300 flex flex-col justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
        isSelected
          ? 'bg-[#fff9ed] dark:bg-slate-900 border-amber-400 shadow-[0_14px_36px_rgba(104,75,22,0.14)] ring-1 ring-amber-300/70 text-slate-900 dark:text-white -translate-y-1'
          : 'bg-[#fffdf8] dark:bg-slate-900/80 border-[#e8e1d5] dark:border-slate-800 hover:border-emerald-700/45 hover:bg-white dark:hover:bg-slate-900 shadow-[0_10px_30px_rgba(24,54,41,0.06)] text-slate-800 dark:text-white hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Cabecera de la tarjeta: País / Región + ID */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${theme.badgeBg} ${theme.badgeText}`}
          >
            <span>{theme.flag}</span>
            <span className="truncate max-w-[120px]">{localizedRegion(character.id, theme.region, locale)}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 font-semibold shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            #{character.id.toUpperCase().slice(0, 8)}
          </span>
        </div>

        {/* Avatar circular; la ilustración completa se conserva para la ficha ampliada */}
        <div
          className={`relative mx-auto my-4 h-44 w-44 max-w-full rounded-full border-2 bg-gradient-to-tr bg-[#f5edde] p-1 shadow-[0_12px_30px_rgba(61,45,23,0.12)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 ${theme.gradient}`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-[#f5edde]">
            <CharacterAvatarImage
              slug={character.slug}
              name={characterName(character, locale)}
              size={176}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.025]"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom(character);
              }}
              title={copy(locale, 'Ampliar retrato', 'Enlarge portrait')}
              aria-label={copy(locale, `Ampliar retrato de ${characterName(character, locale)}`, `Enlarge ${characterName(character, locale)} portrait`)}
              className="absolute bottom-2 right-2 rounded-full border border-white/80 bg-white/95 p-2 text-emerald-950 shadow-md transition-colors hover:bg-amber-300 cursor-pointer"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nombre y Rol */}
        <div className="text-center mt-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-emerald-800 dark:group-hover:text-amber-300 transition-colors">
            {characterName(character, locale)}
          </h3>
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1.5 tracking-wide line-clamp-2 min-h-[2.5rem] flex items-center justify-center leading-5">
            {roleText}
          </p>
          <div className="mt-2 flex justify-center">
            <FavoriteRankBadge slug={character.slug} locale={locale} />
          </div>
        </div>

        {/* Cita célebre de expedición */}
        {character.voiceQuote && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#f7f4ec] px-2 py-2 dark:bg-slate-950/50">
            <CharacterAvatarImage
              slug={character.slug}
              name={characterName(character, locale)}
              size={32}
            />
            <p className="line-clamp-2 text-xs leading-5 text-slate-700 dark:text-slate-300">
              «{character.voiceQuote[locale] || character.voiceQuote.es}»
            </p>
          </div>
        )}
      </div>

      {/* Sección inferior: Atributos 3D y Botón Pasaporte con bisel táctil */}
      <div className="mt-4 pt-3 border-t-2 border-slate-100 dark:border-slate-800/80">
        {character.explorerStats && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300">
                <Compass className="w-3.5 h-3.5" /> {copy(locale, 'Curiosidad', 'Curiosity')}
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-black">{character.explorerStats.curiosity}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner p-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full shadow-xs"
                style={{ width: `${character.explorerStats.curiosity}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-black text-slate-700 dark:text-slate-300 pt-0.5">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                <Shield className="w-3.5 h-3.5" /> {copy(locale, 'Valentía', 'Courage')}
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">{character.explorerStats.courage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full shadow-xs"
                style={{ width: `${character.explorerStats.courage}%` }}
              />
            </div>
          </div>
        )}

        <div className="text-center pt-1">
          <span
            className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider py-2.5 px-4 rounded-2xl transition-all w-full justify-center ${
              isSelected
                ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-black border-b-4 border-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.4)]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b-4 border-slate-300 dark:border-slate-700 group-hover:bg-gradient-to-b group-hover:from-amber-300 group-hover:via-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 group-hover:border-amber-600 shadow-sm'
            }`}
          >
            <span>{isSelected ? copy(locale, '★ Pasaporte abierto', '★ Passport open') : copy(locale, 'Abrir pasaporte', 'Open passport')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export const CharacterHubScene: React.FC<CharacterHubSceneProps> = ({
  locale,
  characters: initialCharacters = [],
  hideHeader = false,
}) => {
  const characterSource =
    initialCharacters && initialCharacters.length > 0 ? initialCharacters : INITIAL_CHARACTERS;
  const charactersList = useMemo(() => {
    const leadOrder: Record<string, number> = { curileta: 0, pompon: 1 };
    return [...characterSource].sort(
      (a, b) => (leadOrder[a.id] ?? 2) - (leadOrder[b.id] ?? 2)
    );
  }, [characterSource]);
  const initialCharacter = charactersList.find((character) => character.id === 'curileta') || charactersList[0];
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(initialCharacter);
  const [activeTab, setActiveTab] = useState<'biografia' | 'mochila' | 'curiosidades'>('biografia');
  const [filterCategory, setFilterCategory] = useState<
    'todos' | 'protagonistas' | 'america-africa' | 'europa' | 'asia-oceania'
  >('todos');
  const [lightboxCharacter, setLightboxCharacter] = useState<Character | null>(null);

  // Escuchar tecla Escape para cerrar modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxCharacter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCharacters = useMemo(() => {
    if (filterCategory === 'protagonistas') {
      return charactersList.filter((c) => ['curileta', 'pompon'].includes(c.id));
    }
    if (filterCategory === 'america-africa') {
      return charactersList.filter((c) => ['quetzal', 'lulu', 'cobaya', 'emi'].includes(c.id));
    }
    if (filterCategory === 'europa') {
      return charactersList.filter((c) => ['picu', 'gino', 'basset', 'lola'].includes(c.id));
    }
    if (filterCategory === 'asia-oceania') {
      return charactersList.filter((c) =>
        [
          'zipi-bot',
          'pez-volador',
          'canguro-mama',
          'canguro-bebe',
          'joey',
          'ornitorrinco',
          'emu',
          'kiki',
          'bao',
        ].includes(c.id)
      );
    }
    return charactersList;
  }, [charactersList, filterCategory]);

  const selectedTheme = getCharacterTheme(selectedCharacter.id);

  return (
    <section id="escena-personajes" className="relative z-10 py-24 sm:py-28 bg-[#f7f5ed] dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Línea divisoria superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-700/45 to-transparent" />

      {/* Partículas de ambiente */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionEmblem icon={Users} tone="emerald" label={copy(locale, 'Tripulación de exploradores', 'Explorer crew')} />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-md backdrop-blur-md">
              <span>{copy(locale, 'Escena 03 — El espacio de los personajes', 'Scene 03 — Meet the characters')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {copy(locale, 'La alianza de los', 'Meet the')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-500 dark:from-emerald-300 dark:via-amber-300 dark:to-emerald-200">
                {copy(locale, '19 grandes exploradores.', '19 great explorers.')}
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {copy(
                locale,
                'Explora el pasaporte de cada personaje y descubre las habilidades que ayudan a descifrar los enigmas del mundo. Pulsa la lupa para ampliar su diseño 3D en alta definición.',
                'Explore each character’s passport and discover the skills they bring to the adventure. Select the magnifier to view a high-resolution 3D portrait.'
              )}
            </p>
          </div>
        )}

        {/* Filtros por Región / Categoría */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'todos', label: copy(locale, `Todos los exploradores (${charactersList.length})`, `All explorers (${charactersList.length})`) },
            { id: 'protagonistas', label: copy(locale, 'Protagonistas (2)', 'Main characters (2)') },
            { id: 'america-africa', label: copy(locale, 'América y África (4)', 'The Americas & Africa (4)') },
            { id: 'europa', label: copy(locale, 'Europa (4)', 'Europe (4)') },
            { id: 'asia-oceania', label: copy(locale, 'Asia y Oceanía (9)', 'Asia & Oceania (9)') },
          ].map((cat) => {
            const isCatActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  isCatActive
                    ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105 font-black'
                    : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:text-slate-900 dark:hover:text-white shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Cuadrícula de Tarjetas con Efecto 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredCharacters.map((character) => (
            <TiltCharacterCard
              key={character.id}
              character={character}
              locale={locale}
              isSelected={selectedCharacter.id === character.id}
              onSelect={() => setSelectedCharacter(character)}
              onOpenZoom={(c) => setLightboxCharacter(c)}
            />
          ))}
        </div>

        {/* Panel Detallado: Ficha de Expedicionario / Pasaporte Oficial */}
        <div className="bg-[#fffdf8] dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border border-[#e7e1d5] dark:border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_18px_55px_rgba(24,54,41,0.09)] relative overflow-hidden">
          {/* Sello de agua del Pasaporte */}
          <div className="absolute right-6 -bottom-10 opacity-5 pointer-events-none font-black text-9xl text-amber-500 select-none">
            {copy(locale, 'PASAPORTE', 'PASSPORT')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Retrato y datos principales */}
            <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="relative w-44 sm:w-52 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-amber-300 via-emerald-300 to-emerald-500 shadow-lg mb-4 group" style={{ aspectRatio: getCharacterImageAspectRatio(selectedCharacter.mainImage?.url || getCharacterImagePath(selectedCharacter.slug), selectedCharacter.mainImage?.aspectRatio) }}>
                <CharacterAvatar
                  key={selectedCharacter.id}
                  character={selectedCharacter}
                  locale={locale}
                  className="w-full h-full object-cover rounded-[22px] group-hover:scale-[1.025] transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() => setLightboxCharacter(selectedCharacter)}
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-bold text-xs rounded-[22px] transition-opacity cursor-pointer backdrop-blur-xs"
                >
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>{copy(locale, 'Ampliar render 3D', 'Enlarge 3D render')}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                  ★ {copy(locale, 'PASAPORTE', 'PASSPORT')}: {selectedCharacter.id.toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${selectedTheme.badgeBg} ${selectedTheme.badgeText}`}
                >
                  <span>{selectedTheme.flag}</span>
                  <span>{localizedRegion(selectedCharacter.id, selectedTheme.region, locale)}</span>
                </span>
              </div>

              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{characterName(selectedCharacter, locale)}</h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {selectedCharacter.passportRole
                  ? selectedCharacter.passportRole[locale] || selectedCharacter.passportRole.es
                  : selectedCharacter.species}
              </p>
              <div className="mt-3 flex justify-center lg:justify-start">
                <CharacterFavoriteButton slug={selectedCharacter.slug} locale={locale} />
              </div>

              {/* Nota Canónica especial si es Pompón o la familia Canguro */}
              {selectedCharacter.id === 'pompon' && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed text-left">
                  <strong>{copy(locale, 'Nota canónica:', 'Story note:')}</strong>{' '}
                  {copy(locale, 'Pompón permanece en el Bosque Encantado, junto al árbol más alto y el buzón postal. No viaja físicamente, pero acompaña cada aventura a través de las cartas de Curileta.', 'Pompón stays in the Enchanted Forest, guarding the tallest tree and the mailbox. He does not travel in person, but follows every adventure through Curileta’s letters.')}
                </div>
              )}

              {selectedCharacter.id === 'joey' && (
                <div className="mt-3 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-900 dark:text-teal-200 text-xs leading-relaxed text-left">
                  <strong>{copy(locale, 'Amigo inseparable:', 'Faithful companion:')}</strong>{' '}
                  {copy(locale, 'Joey es el koala de peluche del bebé canguro que Curileta ayudó a reunir con su familia en Uluru.', 'Joey is the baby kangaroo’s plush koala. Curileta helped reunite them with their family at Uluru.')}
                </div>
              )}

              {/* Valores del personaje */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center lg:justify-start">
                {selectedCharacter.personality?.map((trait) => (
                  <span
                    key={trait}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    ✨ {characterTrait(trait, locale)}
                  </span>
                ))}
              </div>

              {/* Botón rápido para abrir lightbox */}
              <button
                type="button"
                onClick={() => setLightboxCharacter(selectedCharacter)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>{copy(locale, 'Examinar modelo 3D en alta definición', 'View the high-resolution 3D model')}</span>
              </button>
            </div>

            {/* Pestañas Interactivas de Contenido */}
            <div className="lg:col-span-8">
              {/* Selector de pestañas */}
              <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <button
                  onClick={() => setActiveTab('biografia')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'biografia'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {copy(locale, '📖 Historia y biografía', '📖 Story & biography')}
                </button>
                <button
                  onClick={() => setActiveTab('mochila')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'mochila'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {copy(locale, '🎒 Mochila de expedición', '🎒 Explorer’s backpack')}
                </button>
                <button
                  onClick={() => setActiveTab('curiosidades')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'curiosidades'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {copy(locale, '🔍 Secretos y curiosidades', '🔍 Secrets & curiosities')}
                </button>
              </div>

              {/* Contenido de la pestaña Biografía */}
              {activeTab === 'biografia' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                    <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                      {selectedCharacter.biography
                        ? selectedCharacter.biography[locale] || selectedCharacter.biography.es
                        : selectedCharacter.shortDescription[locale] || selectedCharacter.shortDescription.es}
                    </p>
                  </div>

                  {selectedCharacter.voiceQuote && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200">
                      <CharacterAvatarImage
                        slug={selectedCharacter.slug}
                        name={characterName(selectedCharacter, locale)}
                        size={48}
                      />
                      <p className="text-sm font-semibold">
                        {selectedCharacter.voiceQuote[locale] || selectedCharacter.voiceQuote.es}
                      </p>
                    </div>
                  )}

                  {/* Estadísticas de Explorador en 4 Dimensiones */}
                  {selectedCharacter.explorerStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">{copy(locale, 'Curiosidad', 'Curiosity')}</span>
                        <span className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
                          {selectedCharacter.explorerStats.curiosity}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">{copy(locale, 'Valentía', 'Courage')}</span>
                        <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {selectedCharacter.explorerStats.courage}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">{copy(locale, 'Agilidad', 'Agility')}</span>
                        <span className="text-lg font-mono font-black text-sky-600 dark:text-sky-400">
                          {selectedCharacter.explorerStats.agility}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">{copy(locale, 'Sabiduría', 'Wisdom')}</span>
                        <span className="text-lg font-mono font-black text-purple-600 dark:text-purple-400">
                          {selectedCharacter.explorerStats.wisdom}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contenido de la pestaña Mochila */}
              {activeTab === 'mochila' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{copy(locale, 'Objetos mágicos y herramientas que lleva en su bolsa de viaje:', 'Magical objects and tools packed for the journey:')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCharacter.backpackItems && selectedCharacter.backpackItems.length > 0 ? (
                      selectedCharacter.backpackItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-950/80 border border-amber-200 dark:border-amber-400/30 flex items-start gap-3 shadow-md"
                        >
                          <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item[locale] || item.es}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{copy(locale, 'Equipo en preparación para la próxima misión.', 'Gear is being prepared for the next mission.')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Contenido de la pestaña Curiosidades */}
              {activeTab === 'curiosidades' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {selectedCharacter.curiosityFacts && selectedCharacter.curiosityFacts.length > 0 ? (
                    selectedCharacter.curiosityFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3"
                      >
                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {fact[locale] || fact.es}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{copy(locale, 'Descubre sus secretos en las páginas del libro.', 'Discover more secrets in the pages of the book.')}</p>
                  )}
                </div>
              )}

              {/* Enlace al perfil completo del personaje */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/${locale}/personajes/${selectedCharacter.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                >
                  <span>{copy(locale, `Conocer a fondo a ${characterName(selectedCharacter, locale)}`, `Meet ${characterName(selectedCharacter, locale)}`)}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLightboxCharacter(selectedCharacter)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-500" />
                    <span>{copy(locale, 'Ampliar 3D', 'View 3D')}</span>
                  </button>
                  <Link
                    href={`/${locale}/personajes`}
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {copy(locale, 'Ver los 19 →', 'See all 19 →')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Lightbox 3D a pantalla completa */}
      {lightboxCharacter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setLightboxCharacter(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setLightboxCharacter(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer z-20"
              aria-label={copy(locale, 'Cerrar vista 3D', 'Close 3D view')}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Resplandor del tema */}
            <div
              className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: getCharacterTheme(lightboxCharacter.id).glowColor }}
            />

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Imagen oficial con marco de expedición */}
              <div className="relative w-56 sm:w-64 rounded-3xl p-1 bg-gradient-to-tr from-amber-300 via-emerald-300 to-emerald-500 shadow-xl shrink-0" style={{ aspectRatio: getCharacterImageAspectRatio(lightboxCharacter.mainImage?.url || getCharacterImagePath(lightboxCharacter.slug), lightboxCharacter.mainImage?.aspectRatio) }}>
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-[#f5edde] flex items-center justify-center">
                  <CharacterAvatar
                    character={lightboxCharacter}
                    locale={locale}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Información y botones */}
              <div className="text-center sm:text-left space-y-3 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400">
                    ★ {copy(locale, 'FICHA OFICIAL', 'OFFICIAL PROFILE')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {getCharacterTheme(lightboxCharacter.id).flag} {localizedRegion(lightboxCharacter.id, getCharacterTheme(lightboxCharacter.id).region, locale)}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {characterName(lightboxCharacter, locale)}
                  </h3>
                  <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mt-0.5">
                    {lightboxCharacter.passportRole
                      ? lightboxCharacter.passportRole[locale] || lightboxCharacter.passportRole.es
                      : lightboxCharacter.species}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lightboxCharacter.shortDescription[locale] || lightboxCharacter.shortDescription.es}
                </p>

                {lightboxCharacter.voiceQuote && (
                  <div className="flex items-center gap-3">
                    <CharacterAvatarImage
                      slug={lightboxCharacter.slug}
                      name={characterName(lightboxCharacter, locale)}
                      size={40}
                    />
                    <p className="text-xs text-amber-700 dark:text-amber-300/90">
                      {lightboxCharacter.voiceQuote[locale] || lightboxCharacter.voiceQuote.es}
                    </p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <a
                    href={lightboxCharacter.mainImage?.url || getCharacterImagePath(lightboxCharacter.slug)}
                    download={`Curileta_Personaje_${lightboxCharacter.slug}_Oficial.webp`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{copy(locale, 'Descargar imagen oficial', 'Download official image')}</span>
                  </a>

                  <Link
                    href={`/${locale}/personajes/${lightboxCharacter.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 transition-colors"
                  >
                    <span>{copy(locale, 'Abrir pasaporte', 'Open passport')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
