'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@curileta/i18n';
import { Character } from '@curileta/cms';
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
} from 'lucide-react';

interface CharacterHubSceneProps {
  locale: Locale;
  characters?: Character[];
}

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'curileta',
    name: 'Curileta',
    slug: 'curileta',
    passportRole: {
      es: 'Gran Cartógrafa & Líder de Expedición',
      en: 'Master Cartographer & Expedition Leader',
    },
    shortDescription: {
      es: 'Valiente, bondadosa y eternamente curiosa. Lleva siempre su mapa y su brújula mágica.',
      en: 'Brave, kind-hearted, and perpetually curious. Always carries her magical map and compass.',
    },
    biography: {
      es: 'Curileta nació en el corazón del Bosque Encantado. Su mayor anhelo es conocer todas las culturas, idiomas y maravillas naturales del planeta junto a sus inseparables amigos.',
      en: 'Curileta was born in the heart of the Enchanted Forest. Her greatest wish is to explore all cultures, languages, and natural wonders of the planet alongside her friends.',
    },
    species: 'Aventurera Principal',
    personality: ['Curiosa', 'Empática', 'Aventurera', 'Leal'],
    values: ['Respeto por la naturaleza', 'Amistad', 'Diversidad cultural'],
    explorerStats: {
      curiosity: 99,
      courage: 92,
      agility: 88,
      wisdom: 85,
    },
    backpackItems: [
      { es: 'Brújula solar de latón dorado', en: 'Golden solar brass compass' },
      { es: 'Cuaderno de bitácora con mapas secretos', en: 'Logbook with secret expedition maps' },
      { es: 'Lupa de cristal de cuarzo esmeralda', en: 'Emerald quartz magnifying glass' },
    ],
    curiosityFacts: [
      { es: 'Sabe orientarse de noche siguiendo la Constelación de la Liebre Dorada.', en: 'Navigates by night following the Golden Hare Constellation.' },
      { es: 'Colecciona semillas de árboles antiguos de cada país que visita.', en: 'Collects ancient tree seeds from every visited country.' },
    ],
    voiceQuote: {
      es: '«¡El mundo es demasiado grande y hermoso como para quedarse quietos!»',
      en: '“The world is too vast and wonderful to ever stand still!”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Retrato oficial de Curileta exploradora', en: 'Official portrait of explorer Curileta' },
    },
    relatedBooks: ['el-misterio-del-quetzal', 'las-auroras-de-hielo'],
    relatedLocations: ['mexico', 'islandia', 'peru'],
  },
  {
    id: 'pompon',
    name: 'Pompón',
    slug: 'pompon',
    passportRole: {
      es: 'Guardián de Provisiones & Logística',
      en: 'Quartermaster & Provisions Guardian',
    },
    shortDescription: {
      es: 'El fiel compañero prudente. Cuida las provisiones y tiene un corazón gigantesco.',
      en: 'The prudent and loyal companion. Watches over the supplies and has a gigantic heart.',
    },
    biography: {
      es: 'Pompón es un conejo de pelaje blanco que ama la tranquilidad del Bosque Encantado, pero su lealtad incondicional hacia Curileta lo lleva a superar cualquier temor en cada expedición.',
      en: 'Pompón is a white-furred rabbit who loves the calm of the Enchanted Forest, but his loyalty to Curileta leads him to conquer all fears on each expedition.',
    },
    species: 'Conejo del Bosque Encantado',
    personality: ['Prudente', 'Tierno', 'Organizado', 'Divertido'],
    values: ['Cuidado mutuo', 'Previsión', 'Valentía interior'],
    explorerStats: {
      curiosity: 82,
      courage: 76,
      agility: 94,
      wisdom: 90,
    },
    backpackItems: [
      { es: 'Kit de primeros auxilios y vendajes suaves', en: 'First-aid kit and herbal balms' },
      { es: 'Frasco de zanahorias confitadas energéticas', en: 'Jar of energizing candied carrots' },
      { es: 'Cantimplora de agua de manantial', en: 'Pure mountain spring water canteen' },
    ],
    curiosityFacts: [
      { es: 'Sus orejas pueden detectar cambios en la dirección del viento 30 minutos antes.', en: 'His ears detect wind shifts 30 minutes in advance.' },
      { es: 'Tiene un registro contable de cada manzana y provisión de la expedición.', en: 'Keeps an exact inventory of every apple and ration.' },
    ],
    voiceQuote: {
      es: '«¡Revisemos la mochila dos veces antes de cruzar ese puente colgante!»',
      en: '“Let’s check the backpack twice before crossing that rope bridge!”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Pompón con su pequeña mochila de explorador', en: 'Pompón with his explorer backpack' },
    },
    relatedBooks: ['el-misterio-del-quetzal'],
    relatedLocations: ['mexico'],
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    slug: 'quetzal',
    passportRole: {
      es: 'Vigía Aéreo & Descifrador de Leyendas',
      en: 'Aerial Scout & Legend Decipherer',
    },
    shortDescription: {
      es: 'El sabio vigía de los vientos tropicales. Conoce los secretos de las selvas y templos.',
      en: 'The wise lookout of tropical winds. Knows the secrets of rainforests and ancient temples.',
    },
    biography: {
      es: 'Guardián milenario de plumaje iridiscente que habita en las copas de los árboles de Mesoamérica. Ayuda a Curileta y sus amigos a descifrar leyendas y respetar la fauna local.',
      en: 'An ancient guardian with iridescent feathers dwelling in Mesoamerican tree canopies. Helps Curileta and her friends decipher legends and honor local wildlife.',
    },
    species: 'Ave Sagrada de Mesoamérica',
    personality: ['Sabio', 'Ágil', 'Protector', 'Poético'],
    values: ['Preservación de la selva', 'Historia ancestral', 'Libertad'],
    explorerStats: {
      curiosity: 95,
      courage: 90,
      agility: 99,
      wisdom: 98,
    },
    backpackItems: [
      { es: 'Amuleto de jade para invocar corrientes térmicas', en: 'Jade thermal talisman' },
      { es: 'Prisma de luz para emitir señales en vuelo', en: 'Light prism for flight signaling' },
    ],
    curiosityFacts: [
      { es: 'Puede volar en silencio absoluto entre el dosel selvático.', en: 'Can glide in total silence across rainforest canopies.' },
      { es: 'Entiende más de 12 dialectos antiguos de los pájaros de América.', en: 'Understands over 12 ancient bird dialects.' },
    ],
    voiceQuote: {
      es: '«Mira la tierra desde lo alto: no hay fronteras, solo valles que abrazan ríos.»',
      en: '“Gaze upon the earth from above: no borders exist, only valleys embracing rivers.”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Quetzal en pleno vuelo sobre la selva', en: 'Quetzal in full flight over the canopy' },
    },
    relatedBooks: ['el-misterio-del-quetzal'],
    relatedLocations: ['mexico'],
  },
  {
    id: 'lulu',
    name: 'Lulú',
    slug: 'lulu',
    passportRole: {
      es: 'Navegante de Mares & Aguas Glaciares',
      en: 'Sea Navigator & Glacial Waters Guide',
    },
    shortDescription: {
      es: 'La experta en corrientes marinas, risas y saltos de ola. Siempre dispuesta a jugar.',
      en: 'The expert in ocean currents, laughter, and wave riding. Always ready to play.',
    },
    biography: {
      es: 'Lulú es una nutria marina apasionada por las aguas cristalinas. Conoce los secretos de los arrecifes y enseña a los exploradores a nadar sin miedo a lo desconocido.',
      en: 'Lulú is a sea otter passionate about crystal-clear waters. She knows reef secrets and teaches explorers to swim without fear of the unknown.',
    },
    species: 'Nutria Marina de las Costas',
    personality: ['Jovial', 'Atlética', 'Solidaria', 'Curiosa'],
    values: ['Protección de los océanos', 'Alegría de vivir', 'Generosidad'],
    explorerStats: {
      curiosity: 91,
      courage: 88,
      agility: 96,
      wisdom: 80,
    },
    backpackItems: [
      { es: 'Piedra pulida favorita para abrir caracoles', en: 'Favorite smooth pebble for shells' },
      { es: 'Cuerda de algas marinas ultra resistente', en: 'Ultra-durable kelp fiber rope' },
    ],
    curiosityFacts: [
      { es: 'Aguanta la respiración bajo el agua helada más de 6 minutos.', en: 'Holds breath in freezing waters for over 6 minutes.' },
      { es: 'Duerme flotando sobre su espalda agarrada de la mano de sus amigos.', en: 'Sleeps floating on her back holding hands with friends.' },
    ],
    voiceQuote: {
      es: '«¡Zambúllete hondo! Quien no se moja nunca descubre los tesoros del fondo.»',
      en: '“Dive deep! Whoever stays dry never discovers the seabed treasures.”',
    },
    mainImage: {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      alt: { es: 'Lulú flotando feliz en el agua', en: 'Lulú floating joyfully in the water' },
    },
    relatedBooks: ['las-auroras-de-hielo'],
    relatedLocations: ['islandia'],
  },
];

// Componente individual de Tarjeta con Efecto 3D Tilt
const TiltCharacterCard: React.FC<{
  character: Character;
  locale: Locale;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ character, locale, isSelected, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // Inclinación eje X
    const rotateY = ((x - centerX) / centerX) * 12; // Inclinación eje Y

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
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
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`group relative rounded-3xl p-6 cursor-pointer border transition-all duration-300 backdrop-blur-xl ${
        isSelected
          ? 'bg-gradient-to-b from-emerald-900/90 via-slate-900/95 to-slate-950 border-amber-400 shadow-2xl shadow-emerald-500/30 ring-2 ring-amber-400/50'
          : 'bg-slate-900/70 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-900/90 shadow-xl'
      }`}
    >
      {/* Brillo dinámico de reflejo 3D */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 60%)`,
        }}
      />

      {/* Sello / Insignia de Rol de Aventurero */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
          <Award className="w-3 h-3 text-amber-400" />
          <span>{character.species || 'Explorador'}</span>
        </span>
        <span className="text-xs font-mono text-emerald-400 font-bold">
          ID: {character.id.toUpperCase()}
        </span>
      </div>

      {/* Retrato del personaje con marco circular de latón */}
      <div className="relative w-28 h-28 mx-auto my-3 group-hover:scale-105 transition-transform duration-500">
        <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-sky-400 p-1 shadow-lg shadow-emerald-900/50">
          <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 relative">
            <img
              src={character.mainImage.url}
              alt={character.mainImage.alt[locale] || character.mainImage.alt.es}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Nombre y Rol */}
      <div className="text-center mt-3">
        <h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
          {character.name}
        </h3>
        <p className="text-xs font-extrabold text-emerald-400 mt-1 uppercase tracking-wide">
          {roleText}
        </p>
      </div>

      {/* Cita célebre de expedición */}
      {character.voiceQuote && (
        <p className="text-xs text-slate-300/90 text-center italic mt-3 px-2 line-clamp-2">
          {character.voiceQuote[locale] || character.voiceQuote.es}
        </p>
      )}

      {/* Barras Rápidas de Atributos */}
      {character.explorerStats && (
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1 text-amber-300">
              <Compass className="w-3 h-3" /> Curiosidad
            </span>
            <span className="font-mono text-amber-400">{character.explorerStats.curiosity}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-700"
              style={{ width: `${character.explorerStats.curiosity}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pt-1">
            <span className="flex items-center gap-1 text-emerald-300">
              <Shield className="w-3 h-3" /> Valentía
            </span>
            <span className="font-mono text-emerald-400">{character.explorerStats.courage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full transition-all duration-700"
              style={{ width: `${character.explorerStats.courage}%` }}
            />
          </div>
        </div>
      )}

      {/* Botón interactivo */}
      <div className="mt-5 text-center">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
            isSelected
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'text-slate-300 group-hover:text-amber-400'
          }`}
        >
          <span>{isSelected ? '★ Ficha Activa' : 'Abrir Pasaporte'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export const CharacterHubScene: React.FC<CharacterHubSceneProps> = ({
  locale,
  characters: initialCharacters = [],
}) => {
  const charactersList = initialCharacters && initialCharacters.length > 0 ? initialCharacters : DEFAULT_CHARACTERS;
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(charactersList[0]);
  const [activeTab, setActiveTab] = useState<'biografia' | 'mochila' | 'curiosidades'>('biografia');

  return (
    <section id="escena-personajes" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      {/* Línea divisoria superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-sky-400 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />

      {/* Partículas de ambiente */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Escena 03 — El Espacio de los Personajes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            La Alianza de los<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-200">
              Grandes Exploradores.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Mueve el cursor sobre las fichas 3D para sentir el relieve de su pasaporte oficial. Cada personaje posee habilidades únicas indispensables para descifrar los enigmas del mundo.
          </p>
        </div>

        {/* Cuadrícula de Tarjetas con Efecto 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {charactersList.map((character) => (
            <TiltCharacterCard
              key={character.id}
              character={character}
              locale={locale}
              isSelected={selectedCharacter.id === character.id}
              onSelect={() => setSelectedCharacter(character)}
            />
          ))}
        </div>

        {/* Panel Detallado: Ficha de Expedicionario / Pasaporte Oficial */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Sello de agua del Pasaporte */}
          <div className="absolute right-6 -bottom-10 opacity-5 pointer-events-none font-black text-9xl text-amber-400 select-none">
            PASAPORTE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Retrato y datos principales */}
            <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-sky-400 shadow-2xl mb-4">
                <img
                  src={selectedCharacter.mainImage.url}
                  alt={selectedCharacter.mainImage.alt[locale] || selectedCharacter.mainImage.alt.es}
                  className="w-full h-full object-cover rounded-[22px]"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
                ★ PASAPORTE OFICIAL: {selectedCharacter.id.toUpperCase()}
              </div>

              <h3 className="text-3xl font-black text-white">{selectedCharacter.name}</h3>
              <p className="text-sm font-bold text-emerald-400 mt-1">
                {selectedCharacter.passportRole
                  ? selectedCharacter.passportRole[locale] || selectedCharacter.passportRole.es
                  : selectedCharacter.species}
              </p>

              {/* Valores del personaje */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center lg:justify-start">
                {selectedCharacter.personality?.map((trait) => (
                  <span
                    key={trait}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Pestañas Interactivas de Contenido */}
            <div className="lg:col-span-8">
              {/* Selector de pestañas */}
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <button
                  onClick={() => setActiveTab('biografia')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'biografia'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  📖 Historia & Biografía
                </button>
                <button
                  onClick={() => setActiveTab('mochila')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'mochila'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  🎒 Mochila de Expedición
                </button>
                <button
                  onClick={() => setActiveTab('curiosidades')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'curiosidades'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  🔍 Secretos & Curiosidades
                </button>
              </div>

              {/* Contenido de la pestaña Biografía */}
              {activeTab === 'biografia' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <p className="text-base text-slate-200 leading-relaxed">
                      {selectedCharacter.biography
                        ? selectedCharacter.biography[locale] || selectedCharacter.biography.es
                        : selectedCharacter.shortDescription[locale] || selectedCharacter.shortDescription.es}
                    </p>
                  </div>

                  {selectedCharacter.voiceQuote && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                      <Volume2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold italic">
                        {selectedCharacter.voiceQuote[locale] || selectedCharacter.voiceQuote.es}
                      </p>
                    </div>
                  )}

                  {/* Estadísticas de explorador completas */}
                  {selectedCharacter.explorerStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">Curiosidad</span>
                        <span className="text-xl font-black text-white">{selectedCharacter.explorerStats.curiosity}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block">Valentía</span>
                        <span className="text-xl font-black text-white">{selectedCharacter.explorerStats.courage}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-sky-400 block">Agilidad</span>
                        <span className="text-xl font-black text-white">{selectedCharacter.explorerStats.agility}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] uppercase font-bold text-purple-400 block">Sabiduría</span>
                        <span className="text-xl font-black text-white">{selectedCharacter.explorerStats.wisdom}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contenido de la pestaña Mochila */}
              {activeTab === 'mochila' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <p className="text-sm text-slate-300">
                    Objetos imprescindibles que {selectedCharacter.name} guarda en su equipaje de aventura:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCharacter.backpackItems && selectedCharacter.backpackItems.length > 0 ? (
                      selectedCharacter.backpackItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-950/80 border border-amber-400/30 flex items-start gap-3 shadow-lg"
                        >
                          <Briefcase className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-slate-200">
                            {item[locale] || item.es}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">Equipo en preparación para la próxima misión.</p>
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
                        className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-start gap-3"
                      >
                        <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-200">
                          {fact[locale] || fact.es}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Descubre sus secretos en las páginas del libro.</p>
                  )}
                </div>
              )}

              {/* Enlace al perfil completo del personaje */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href={`/${locale}/personajes/${selectedCharacter.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
                >
                  <span>Conocer a fondo a {selectedCharacter.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/${locale}/personajes`}
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Ver todos los personajes →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
