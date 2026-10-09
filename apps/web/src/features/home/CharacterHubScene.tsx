'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Character, INITIAL_CHARACTERS } from '@curileta/cms';
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
  Volume2,
  X,
  MapPin,
  Smile,
  Download,
  ZoomIn,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface CharacterHubSceneProps {
  locale: Locale;
  characters?: Character[];
}

interface CharacterTheme {
  flag: string;
  region: string;
  gradient: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
}

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

// Galería Oficial de Renders 3D Pixar de Alta Fidelidad
export const PIXAR_3D_GALLERY: Record<string, string> = {
  curileta: '/images/characters/gallery_3d/curileta-pixar-3d.jpg',
  pompon: '/images/characters/gallery_3d/pompon-pixar-3d.jpg',
  quetzal: '/images/characters/gallery_3d/quetzal-pixar-3d.jpg',
  lulu: '/images/characters/gallery_3d/lulu-pixar-3d.jpg',
  emi: '/images/characters/gallery_3d/emi-pixar-3d.jpg',
  'zipi-bot': '/images/characters/gallery_3d/zipibot-pixar-3d.jpg',
  bao: '/images/characters/gallery_3d/bao-pixar-3d.jpg',
  gino: '/images/characters/gallery_3d/gino-pixar-3d.jpg',
};

// Mapa de rutas WebP locales clásicas
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
      return '/images/characters/canguro-mama-main.webp';
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

// Componente de Avatar con fallback dinámico y soporte 3D Pixar
const CharacterAvatar: React.FC<{
  character: Character;
  locale: Locale;
  className?: string;
  renderMode?: 'pixar3d' | 'classic';
}> = ({ character, locale, className = 'w-full h-full object-cover', renderMode = 'pixar3d' }) => {
  const pixarPath = PIXAR_3D_GALLERY[character.id] || PIXAR_3D_GALLERY[character.slug];
  const usePixar = renderMode === 'pixar3d' && Boolean(pixarPath);
  const initialPath = usePixar ? pixarPath! : (character.mainImage?.url || getCharacterImagePath(character.slug));
  const [imgSrc, setImgSrc] = useState<string>(initialPath);

  useEffect(() => {
    const pPath = PIXAR_3D_GALLERY[character.id] || PIXAR_3D_GALLERY[character.slug];
    const isP = renderMode === 'pixar3d' && Boolean(pPath);
    setImgSrc(isP ? pPath! : (character.mainImage?.url || getCharacterImagePath(character.slug)));
  }, [character.slug, character.id, character.mainImage?.url, renderMode]);

  const handleError = () => {
    const fallback = getCharacterImagePath(character.slug);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={character.mainImage?.alt?.[locale] || character.mainImage?.alt?.es || character.name}
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const theme = getCharacterTheme(character.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition({ x: 50, y: 50, opacity: 0 });
  };

  const roleText = character.passportRole
    ? character.passportRole[locale] || character.passportRole.es
    : character.species;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      style={{
        transform,
        transition: 'transform 0.15s ease-out, border-color 0.2s ease, box-shadow 0.2s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`group relative rounded-3xl p-5 cursor-pointer border transition-all duration-300 backdrop-blur-xl flex flex-col justify-between ${
        isSelected
          ? 'bg-gradient-to-b from-amber-50 to-white dark:from-slate-900/95 dark:via-slate-900 dark:to-slate-950 border-amber-400 shadow-2xl ring-2 ring-amber-400/40 text-slate-900 dark:text-white'
          : 'bg-white/95 dark:bg-slate-900/75 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/90 shadow-md dark:shadow-xl text-slate-800 dark:text-white'
      }`}
    >
      {/* Glare 3D interactivo */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 60%)`,
        }}
      />

      <div>
        {/* Cabecera de la tarjeta: País / Región + ID */}
        <div className="flex items-center justify-between gap-1.5 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme.badgeBg} ${theme.badgeText} shadow-sm`}
          >
            <span>{theme.flag}</span>
            <span className="truncate max-w-[120px]">{theme.region}</span>
          </span>
          <div className="flex items-center gap-1">
            {(Boolean(PIXAR_3D_GALLERY[character.id]) || Boolean(PIXAR_3D_GALLERY[character.slug])) && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-sm flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>3D</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold shrink-0">
              #{character.id.toUpperCase().slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Retrato 3D con halo cromático */}
        <div className="relative w-28 h-28 mx-auto my-2 group-hover:scale-105 transition-transform duration-500">
          <div className={`w-full h-full rounded-2xl bg-gradient-to-tr ${theme.gradient} p-1 shadow-lg`}>
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 relative">
              <CharacterAvatar
                character={character}
                locale={locale}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Botón de lupa rápida */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenZoom(character);
                }}
                title="Ampliar Render 3D"
                className="absolute bottom-1 right-1 p-1 rounded-lg bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Nombre y Rol */}
        <div className="text-center mt-2.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
            {character.name}
          </h3>
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wide line-clamp-1">
            {roleText}
          </p>
        </div>

        {/* Cita célebre de expedición */}
        {character.voiceQuote && (
          <p className="text-[11px] text-slate-600 dark:text-slate-300/85 text-center italic mt-2.5 px-1 line-clamp-2 leading-relaxed">
            {character.voiceQuote[locale] || character.voiceQuote.es}
          </p>
        )}
      </div>

      {/* Sección inferior: Atributos y Botón Pasaporte */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        {character.explorerStats && (
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300">
                <Compass className="w-3 3" /> Curiosidad
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{character.explorerStats.curiosity}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                style={{ width: `${character.explorerStats.curiosity}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300 pt-0.5">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                <Shield className="w-3 h-3" /> Valentía
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{character.explorerStats.courage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full"
                style={{ width: `${character.explorerStats.courage}%` }}
              />
            </div>
          </div>
        )}

        <div className="text-center pt-1">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors w-full justify-center ${
              isSelected
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950'
            }`}
          >
            <span>{isSelected ? '★ Pasaporte Activo' : 'Abrir Pasaporte'}</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

export const CharacterHubScene: React.FC<CharacterHubSceneProps> = ({
  locale,
  characters: initialCharacters = [],
}) => {
  const charactersList =
    initialCharacters && initialCharacters.length > 0 ? initialCharacters : INITIAL_CHARACTERS;
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(charactersList[0]);
  const [activeTab, setActiveTab] = useState<'biografia' | 'mochila' | 'curiosidades'>('biografia');
  const [filterCategory, setFilterCategory] = useState<
    'todos' | 'protagonistas' | 'america-africa' | 'europa' | 'asia-oceania'
  >('todos');
  const [lightboxCharacter, setLightboxCharacter] = useState<Character | null>(null);
  const [lightboxMode, setLightboxMode] = useState<'pixar3d' | 'classic'>('pixar3d');

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
    <section id="escena-personajes" className="relative py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Línea divisoria superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-sky-400 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />

      {/* Partículas de ambiente */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-md backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Escena 03 — El Espacio de los Personajes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            La Alianza de los<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-500 dark:from-emerald-300 dark:via-amber-300 dark:to-emerald-200">
              19 Grandes Exploradores.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Mueve el cursor sobre las fichas 3D para sentir el relieve de su pasaporte oficial. Cada personaje posee habilidades únicas indispensables para descifrar los enigmas del mundo. Haz clic en la lupa para ampliar su diseño 3D en alta definición.
          </p>
        </div>

        {/* Filtros por Región / Categoría */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'todos', label: `Todos los Exploradores (${charactersList.length})` },
            { id: 'protagonistas', label: 'Protagonistas (2)' },
            { id: 'america-africa', label: 'América & África (4)' },
            { id: 'europa', label: 'Europa (4)' },
            { id: 'asia-oceania', label: 'Asia & Oceanía (9)' },
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
        <div className="bg-white/95 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Sello de agua del Pasaporte */}
          <div className="absolute right-6 -bottom-10 opacity-5 pointer-events-none font-black text-9xl text-amber-500 select-none">
            PASAPORTE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Retrato y datos principales */}
            <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-sky-400 shadow-2xl mb-4 group">
                <CharacterAvatar
                  key={selectedCharacter.id}
                  character={selectedCharacter}
                  locale={locale}
                  className="w-full h-full object-cover rounded-[22px] group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setLightboxCharacter(selectedCharacter)}
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-bold text-xs rounded-[22px] transition-opacity cursor-pointer backdrop-blur-xs"
                >
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>Ampliar Render 3D</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                  ★ PASAPORTE: {selectedCharacter.id.toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${selectedTheme.badgeBg} ${selectedTheme.badgeText}`}
                >
                  <span>{selectedTheme.flag}</span>
                  <span>{selectedTheme.region}</span>
                </span>
              </div>

              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{selectedCharacter.name}</h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {selectedCharacter.passportRole
                  ? selectedCharacter.passportRole[locale] || selectedCharacter.passportRole.es
                  : selectedCharacter.species}
              </p>

              {/* Nota Canónica especial si es Pompón o la familia Canguro */}
              {selectedCharacter.id === 'pompon' && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed text-left">
                  <strong>Nota Canónica:</strong> Pompón permanece en el Bosque Encantado custodiando el árbol más alto y el buzón postal. No viaja físicamente por el mundo, pero vive cada aventura en las cartas de Curileta.
                </div>
              )}

              {selectedCharacter.id === 'joey' && (
                <div className="mt-3 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-900 dark:text-teal-200 text-xs leading-relaxed text-left">
                  <strong>Amigo Inseparable:</strong> Joey es el koala de peluche del bebé canguro que Curileta rescató en Uluru para devolverle la sonrisa a la familia del Outback.
                </div>
              )}

              {/* Valores del personaje */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center lg:justify-start">
                {selectedCharacter.personality?.map((trait) => (
                  <span
                    key={trait}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    ✨ {trait}
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
                <span>Examinar modelo 3D en alta definición</span>
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
                  📖 Historia & Biografía
                </button>
                <button
                  onClick={() => setActiveTab('mochila')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'mochila'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🎒 Mochila de Expedición
                </button>
                <button
                  onClick={() => setActiveTab('curiosidades')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'curiosidades'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🔍 Secretos & Curiosidades
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
                      <Volume2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold italic">
                        {selectedCharacter.voiceQuote[locale] || selectedCharacter.voiceQuote.es}
                      </p>
                    </div>
                  )}

                  {/* Estadísticas de Explorador en 4 Dimensiones */}
                  {selectedCharacter.explorerStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">Curiosidad</span>
                        <span className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
                          {selectedCharacter.explorerStats.curiosity}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">Valentía</span>
                        <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {selectedCharacter.explorerStats.courage}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">Agilidad</span>
                        <span className="text-lg font-mono font-black text-sky-600 dark:text-sky-400">
                          {selectedCharacter.explorerStats.agility}%
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">Sabiduría</span>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">Objetos mágicos y herramientas que lleva en su bolsa de viaje:</p>
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
                      <p className="text-xs text-slate-500 dark:text-slate-400">Equipo en preparación para la próxima misión.</p>
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">Descubre sus secretos en las páginas del libro.</p>
                  )}
                </div>
              )}

              {/* Enlace al perfil completo del personaje */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/${locale}/personajes/${selectedCharacter.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                >
                  <span>Conocer a fondo a {selectedCharacter.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLightboxCharacter(selectedCharacter)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ampliar 3D</span>
                  </button>
                  <Link
                    href={`/${locale}/fondos`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 px-4 py-2.5 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Fondos 2K</span>
                  </Link>
                  <Link
                    href={`/${locale}/personajes`}
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Ver los 19 →
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
              aria-label="Cerrar vista 3D"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Resplandor del tema */}
            <div
              className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: getCharacterTheme(lightboxCharacter.id).glowColor }}
            />

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Imagen 3D ampliada con marco de expedición */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-sky-400 shadow-2xl">
                  <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center">
                    <CharacterAvatar
                      character={lightboxCharacter}
                      locale={locale}
                      renderMode={lightboxMode}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Switcher de estilo: Pixar 3D vs Álbum Clásico */}
                {(Boolean(PIXAR_3D_GALLERY[lightboxCharacter.id]) || Boolean(PIXAR_3D_GALLERY[lightboxCharacter.slug])) && (
                  <div className="inline-flex rounded-full p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setLightboxMode('pixar3d')}
                      className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                        lightboxMode === 'pixar3d'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      ✨ Pixar 3D Cinema
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxMode('classic')}
                      className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                        lightboxMode === 'classic'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      🎨 Álbum Clásico
                    </button>
                  </div>
                )}
              </div>

              {/* Información y botones */}
              <div className="text-center sm:text-left space-y-3 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400">
                    ★ {lightboxMode === 'pixar3d' && (PIXAR_3D_GALLERY[lightboxCharacter.id] || PIXAR_3D_GALLERY[lightboxCharacter.slug]) ? 'RENDER PIXAR 3D' : 'ILUSTRACIÓN OFICIAL'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {getCharacterTheme(lightboxCharacter.id).flag} {getCharacterTheme(lightboxCharacter.id).region}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {lightboxCharacter.name}
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
                  <p className="text-xs text-amber-700 dark:text-amber-300/90 italic border-l-2 border-amber-400 pl-3">
                    {lightboxCharacter.voiceQuote[locale] || lightboxCharacter.voiceQuote.es}
                  </p>
                )}

                {/* Botones de acción */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <a
                    href={
                      lightboxMode === 'pixar3d' && (PIXAR_3D_GALLERY[lightboxCharacter.id] || PIXAR_3D_GALLERY[lightboxCharacter.slug])
                        ? (PIXAR_3D_GALLERY[lightboxCharacter.id] || PIXAR_3D_GALLERY[lightboxCharacter.slug])
                        : (lightboxCharacter.mainImage?.url || getCharacterImagePath(lightboxCharacter.slug))
                    }
                    download={`Curileta_${lightboxCharacter.slug}_${lightboxMode}.jpg`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Imagen</span>
                  </a>

                  <Link
                    href={`/${locale}/personajes/${lightboxCharacter.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 transition-colors"
                  >
                    <span>Abrir Pasaporte</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/${locale}/fondos`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <span>Fondos 2K</span>
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
