'use client';

import React, { useState } from 'react';
import { Locale } from '@curileta/i18n';
import type { LetterItem } from '@curileta/cms';
import {
  Mail,
  Compass,
  MapPin,
  Stamp,
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Award,
  Send,
  Camera,
  ExternalLink,
} from 'lucide-react';

interface LettersSceneProps {
  locale: Locale;
  letters: LetterItem[];
}

export const LettersScene: React.FC<LettersSceneProps> = ({ locale, letters = [] }) => {
  const [selectedLetterId, setSelectedLetterId] = useState<string>(letters[0]?.id || 'mexico');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isReadModalOpen, setIsReadModalOpen] = useState<boolean>(false);

  const activeIndex = letters.findIndex((l) => l.id === selectedLetterId);
  const letter = letters[activeIndex !== -1 ? activeIndex : 0] || letters[0];

  const handlePrev = () => {
    if (!letters.length) return;
    const prev = (activeIndex - 1 + letters.length) % letters.length;
    setSelectedLetterId(letters[prev].id);
    setActivePhotoIndex(0);
  };

  const handleNext = () => {
    if (!letters.length) return;
    const next = (activeIndex + 1) % letters.length;
    setSelectedLetterId(letters[next].id);
    setActivePhotoIndex(0);
  };

  if (!letter) {
    return null;
  }

  const isEn = locale === 'en';

  return (
    <section id="escena-cartas" className="relative z-10 py-28 bg-amber-50/40 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Trazado estético superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/50 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <Mail className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{isEn ? "The Expedition's Mail Chest" : 'El Baúl Postal de la Expedición'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {isEn ? 'Letters to Pompón.' : 'Cartas a Pompón.'}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 dark:from-amber-300 dark:via-rose-300 dark:to-sky-300">
              {isEn ? 'Words that crossed oceans.' : 'Palabras que cruzaron océanos.'}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? '«Don’t be sad, Pompón: I will write to you whenever I reach a new land». Read all the genuine letters written by Curileta from across the globe.'
              : '«No estés triste, Pompón: te enviaré una carta siempre que llegue a un nuevo sitio». Lee las cartas auténticas escritas por Curileta desde cada rincón del planeta.'}
          </p>
        </div>

        {/* Carrusel de Sobres / Selector de Cartas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-amber-400/40 scrollbar-track-slate-200 dark:scrollbar-track-slate-900 justify-start md:justify-center">
          {letters.map((item, idx) => {
            const isSelected = item.id === selectedLetterId;
            const countryName = item.country[locale] || item.country.es;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedLetterId(item.id);
                  setActivePhotoIndex(0);
                }}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 scale-105 font-black'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400/50 hover:bg-amber-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
                <span>{countryName}</span>
              </button>
            );
          })}
        </div>

        {/* Escaparate Central: La Carta Física & Polaroids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Carta Postal estilo Parchment (7 cols) */}
          <div className="lg:col-span-7 bg-[#fdfbf7] dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border-4 border-amber-200/70 dark:border-slate-800 relative overflow-hidden">
            {/* Trama de matasellos vintage de fondo */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none opacity-80 dark:opacity-40">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-amber-600/40 dark:border-amber-400/30 flex flex-col items-center justify-center p-2 transform rotate-12">
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-amber-700 dark:text-amber-300 text-center leading-tight">
                  {letter.postmark}
                </span>
                <Stamp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700 dark:text-amber-300 my-0.5" />
                <span className="text-[8px] font-mono text-amber-700 dark:text-amber-300">CURILETA POST</span>
              </div>
            </div>

            {/* Sello Postal Oficial */}
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-600">
                  <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>{letter.city[locale] || letter.city.es}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {letter.country[locale] || letter.country.es}
                </h3>
              </div>

              {/* Sello troquelado */}
              <div
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg shadow-lg flex flex-col items-center justify-between p-2 border-2 border-dashed border-white transform rotate-3"
                style={{ backgroundColor: letter.postageColor }}
              >
                <span className="text-[8px] font-black text-white uppercase tracking-tighter">AIR MAIL</span>
                <span className="text-xl sm:text-2xl">🦎</span>
                <span className="text-[9px] font-mono font-bold text-white">0{letter.order}¢</span>
              </div>
            </div>

            {/* Cuerpo Manuscrito de la Carta */}
            <div className="space-y-4 font-serif text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed relative z-10 border-t border-b border-amber-200/60 dark:border-slate-800 py-6 my-6">
              <p className="font-sans font-bold text-amber-800 dark:text-amber-400 text-lg">
                {letter.greeting[locale] || letter.greeting.es}
              </p>
              {(letter.body[locale] || letter.body.es).map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <p className="font-sans font-black text-amber-900 dark:text-amber-300 text-sm pt-2">
                {letter.signOff[locale] || letter.signOff.es}
              </p>
            </div>

            {/* Controles de Navegación de Cartas */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isEn ? 'Previous Letter' : 'Carta Anterior'}</span>
              </button>

              <span className="font-mono text-xs font-black text-slate-500 dark:text-slate-400">
                {activeIndex + 1} / {letters.length}
              </span>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{isEn ? 'Next Letter' : 'Siguiente Carta'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Fotos Polaroid Adjuntas en el Sobre (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? 'Photos Attached in Envelope' : 'Fotos Adjuntas en el Sobre'}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {letter.photos.length} {isEn ? 'snapshots' : 'polaroids'}
                </span>
              </div>

              {/* Selector de Polaroid */}
              <div className="mt-4 flex gap-2">
                {letter.photos.map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setActivePhotoIndex(pIdx)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      activePhotoIndex === pIdx
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isEn ? `Photo #${pIdx + 1}` : `Foto #${pIdx + 1}`}
                  </button>
                ))}
              </div>

              {/* Polaroid Activa */}
              {letter.photos[activePhotoIndex] && (
                <div className="mt-6 p-4 bg-white text-slate-900 rounded-2xl shadow-xl transform rotate-[1deg] transition-all duration-300 border border-slate-200/80 dark:border-transparent">
                  <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/80 p-4 flex flex-col justify-between text-white relative overflow-hidden border border-slate-800">
                    <span className="self-start text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {letter.photos[activePhotoIndex].tag}
                    </span>
                    <div>
                      <h4 className="text-lg font-black leading-tight text-white">
                        {letter.photos[activePhotoIndex].title[locale] || letter.photos[activePhotoIndex].title.es}
                      </h4>
                      <p className="text-[11px] text-amber-300/90 font-medium mt-1">
                        {isEn ? "Curileta's Secret Field Journal" : 'Cuaderno Secreto de Curileta'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="font-serif text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      «{letter.photos[activePhotoIndex].fact[locale] || letter.photos[activePhotoIndex].fact.es}»
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cuadro de Amistad y Hogar con Pompón 3D integrado */}
            <div className="bg-gradient-to-br from-amber-50 via-sky-50/40 to-teal-50 dark:from-sky-950/70 dark:via-slate-900 dark:to-emerald-950/70 border-2 border-sky-300 dark:border-sky-500/40 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-sky-400 via-amber-300 to-indigo-400 p-1 shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/characters/pompon-main.webp"
                      alt={isEn ? 'Pompón the Bunny' : 'Pompón el Conejito'}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-115 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-200 dark:bg-sky-950 text-sky-800 dark:text-sky-300 mb-1 border border-sky-400/40">
                    <Heart className="w-3 h-3 fill-current text-rose-500" />
                    <span>{isEn ? "THE FOREST'S AIRMAIL CHEST" : 'EL BUZÓN POSTAL DEL BOSQUE'}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {isEn ? "Pompón's Treasure" : 'El Tesoro de Pompón'}
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    {isEn ? '«Every letter is a piece of the world in my paws»' : '«Cada carta es un trocito de mundo en mis patitas»'}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Pompón guards every envelope in his hand-carved oak chest under the great tree. Each stamp is a fulfilled promise: traveling five continents to return home and hug those you love.'
                  : 'Pompón custodia cada sobre en su buzón de roble tallado bajo el gran árbol. Cada sello es una promesa cumplida: explorar los cinco continentes para volver y abrazar a quien más quieres en el hogar.'}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                <span>{isEn ? 'Complete Postal Collection' : 'Colección Postal Completa'}</span>
                <span className="font-mono bg-amber-100 dark:bg-slate-950 px-2.5 py-1 rounded-full border border-amber-300 dark:border-slate-700">
                  {letters.length} {isEn ? 'Sealed Envelopes' : 'Sobres Sellados'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
