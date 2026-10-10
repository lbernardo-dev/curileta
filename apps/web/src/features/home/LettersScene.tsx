'use client';

import React, { useState } from 'react';
import { Locale } from '@curileta/i18n';
import type { LetterItem } from '@curileta/cms';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
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

const POSTMARKS_EN: Record<string, string> = {
  mexico: 'TEOTIHUACÁN • 19.69°N • LETTER 01',
  peru: 'MACHU PICCHU • 2,430m • LETTER 02',
  egipto: 'GIZA • NILE VALLEY • LETTER 03',
  islandia: 'REYKJAVÍK • 64.96°N • LETTER 04',
  japon: 'TOKYO • SHINKANSEN • LETTER 05',
  australia: 'OUTBACK • ULURU • LETTER 06',
  'nueva-zelanda': 'WAITOMO • HOBBITON • LETTER 07',
  china: 'GREAT WALL • 21,000km • LETTER 08',
  italia: 'FLORENCE • PISA • LETTER 09',
  francia: 'PARIS • EIFFEL TOWER • LETTER 10',
  'espana-regreso': 'ENCHANTED FOREST • HEART • LETTER 11',
};

const PHOTO_TAGS_EN: Record<string, string> = {
  'ORIGEN DEL CHICLE': 'GUM’S ORIGINS', 'MONEDA ANCESTRAL': 'ANCIENT CURRENCY',
  'VOLCÁN ENANO': 'TINY VOLCANO', BIODIVERSIDAD: 'BIODIVERSITY',
  'MISTERIO ANDINO': 'ANDEAN MYSTERY', 'PARIENTES DE POMPÓN': 'POMPÓN’S COUSINS',
  'AGUA SAGRADA': 'SACRED WATER', 'INVENTO EGIPCIO': 'EGYPTIAN INVENTION',
  'GUÍA DEL DESIERTO': 'DESERT GUIDE', 'MAGIA VOLCÁNICA': 'VOLCANIC MAGIC',
  'CIELO MÁGICO': 'MAGIC IN THE SKY', 'FUERZA PURA': 'PURE STRENGTH',
  'INVENTO CURIOSO': 'CURIOUS INVENTION', 'VOLCÁN SAGRADO': 'SACRED VOLCANO',
  'FUTURO Y TRADICIÓN': 'FUTURE & TRADITION', 'PUZZLE VIVIENTE': 'A LIVING PUZZLE',
  'CORAZÓN ROJO': 'RED HEART', 'COLOR MÁGICO': 'MAGIC COLORS',
  'CONSTELACIÓN SUBTERRÁNEA': 'UNDERGROUND CONSTELLATION', 'REINO DIMINUTO': 'TINY KINGDOM',
  'GUÍA NATURAL': 'NATURE’S GUIDE', 'MURALLA INFINITA': 'ENDLESS WALL',
  'TRAZOS SAGRADOS': 'SACRED STROKES', 'ARTE DEL TÉ': 'THE ART OF TEA',
  'EL MEJOR HELADO': 'THE BEST GELATO', 'EQUILIBRIO MÁGICO': 'MAGIC BALANCE',
  'CIUDAD SOBRE AGUA': 'CITY ON THE WATER', 'ESTIRAMIENTO MATINAL': 'MORNING STRETCH',
  'SABOR A NUBES': 'A TASTE OF CLOUDS', 'PALACIO REAL': 'ROYAL PALACE',
  'MAPA DEL CORAZÓN': 'MAP OF THE HEART', 'TIERRA DE HISTORIAS': 'LAND OF STORIES',
  'EL MAYOR TESORO': 'THE GREATEST TREASURE',
};

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
  const postmark = isEn ? POSTMARKS_EN[letter.id] || letter.postmark : letter.postmark;

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
        <div className="mb-8 flex items-center justify-start gap-2 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center">
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

        {/* Escaparate Central: la carta física y sus recuerdos */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Columna Izquierda: Carta Postal estilo Parchment (7 cols) */}
          <article className="relative flex flex-col overflow-hidden rounded-lg border border-[#dcc8a2] bg-[#fffaf0] p-6 shadow-[0_18px_52px_rgba(103,77,39,0.15)] before:pointer-events-none before:absolute before:inset-3 before:rounded-md before:border before:border-[#eadcc2] before:content-[''] sm:p-10 lg:col-span-7 lg:h-full lg:min-h-[50rem]">
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-2 bg-[#eadcc2]/70" />
            {/* Trama de matasellos vintage de fondo */}
            <div className="pointer-events-none absolute right-5 top-5 z-0 opacity-80 sm:right-7 sm:top-7">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-amber-700/40 flex flex-col items-center justify-center p-2 transform rotate-12">
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-amber-800 text-center leading-tight">
                  {postmark}
                </span>
                <Stamp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 my-0.5" />
                <span className="text-[8px] font-mono text-amber-800">CURILETA POST</span>
              </div>
            </div>

            {/* Sello Postal Oficial */}
            <div className="relative z-10 mb-8 flex items-start justify-between pr-16 sm:pr-24">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>{letter.city[locale] || letter.city.es}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#33291e]">
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
            <div className="relative z-10 my-6 border-y border-[#d8c49d] py-6 text-base leading-relaxed text-[#473b2c] sm:text-lg lg:flex-1">
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 800 400">
                <defs>
                  <pattern id="letter-paper-rules" width="800" height="36" patternUnits="userSpaceOnUse">
                    <path d="M0 35.5H800" fill="none" stroke="#bba77e" strokeOpacity=".28" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="800" height="400" fill="url(#letter-paper-rules)" />
                <path d="M36 0V400" fill="none" stroke="#c77b68" strokeOpacity=".22" strokeWidth="1" />
              </svg>
              <div className="relative space-y-4 pl-3 sm:pl-6">
                <p className="font-sans text-lg font-bold text-amber-800">
                  {letter.greeting[locale] || letter.greeting.es}
                </p>
                {(letter.body[locale] || letter.body.es).map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <p className="pt-2 font-sans text-sm font-bold text-amber-900">
                  {letter.signOff[locale] || letter.signOff.es}
                </p>
              </div>
            </div>

            {/* Controles de Navegación de Cartas */}
            <div className="relative z-10 flex items-center justify-between pt-2 lg:mt-auto">
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
          </article>

          {/* Columna Derecha: Fotos Polaroid Adjuntas en el Sobre (5 cols) */}
          <aside className="flex flex-col gap-6 lg:col-span-5 lg:h-full lg:min-h-[50rem]">
            <div className="flex flex-col rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:p-8 lg:flex-1">
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
                <div className="mt-6 rounded-lg border border-[#e3d7bd] bg-[#fffdf7] p-4 text-slate-900 shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-rotate-1 lg:my-auto">
                  <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-md border border-[#d8c7a5] bg-[#dce8e2] p-4 text-[#344236]">
                    {letter.photos[activePhotoIndex].imageUrl ? (
                      <img
                        src={letter.photos[activePhotoIndex].imageUrl}
                        alt={letter.photos[activePhotoIndex].title[locale] || letter.photos[activePhotoIndex].title.es}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#dce8e2]" />
                        <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-[14%] h-12 w-12 rounded-full bg-[#f4c66b] shadow-[0_0_0_12px_rgba(244,198,107,0.16)]" />
                        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-3/5 bg-[#9bb39b] [clip-path:polygon(0_54%,24%_22%,42%_52%,66%_10%,100%_44%,100%_100%,0_100%)]" />
                        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-[32%] bg-[#526f59] [clip-path:polygon(0_35%,26%_0,55%_48%,79%_12%,100%_40%,100%_100%,0_100%)]" />
                      </>
                    )}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <span className="self-start rounded-full bg-[#fffaf0] px-2 py-1 text-[9px] font-mono font-bold uppercase text-[#4f4634] shadow-sm">
                        {isEn ? PHOTO_TAGS_EN[letter.photos[activePhotoIndex].tag] || letter.photos[activePhotoIndex].tag : letter.photos[activePhotoIndex].tag}
                      </span>
                      {!letter.photos[activePhotoIndex].imageUrl && <Camera aria-hidden="true" className="h-5 w-5 text-[#fffaf0] drop-shadow" />}
                    </div>
                    <div className="relative z-10 rounded-md bg-[#fffaf0]/95 px-3 py-2 shadow-sm">
                      <h4 className="text-lg font-bold leading-tight text-[#263b30]">
                        {letter.photos[activePhotoIndex].title[locale] || letter.photos[activePhotoIndex].title.es}
                      </h4>
                      <p className="mt-1 text-xs font-medium text-[#6d604b]">
                        {isEn ? "Curileta's Secret Field Journal" : 'Cuaderno Secreto de Curileta'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                      «{letter.photos[activePhotoIndex].fact[locale] || letter.photos[activePhotoIndex].fact.es}»
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cuadro de Amistad y Hogar con el avatar de Pompón */}
            <div className="bg-gradient-to-br from-amber-50 via-sky-50/40 to-teal-50 dark:from-sky-950/70 dark:via-slate-900 dark:to-emerald-950/70 border-2 border-sky-300 dark:border-sky-500/40 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-20 w-20 shrink-0 rounded-full bg-gradient-to-tr from-sky-400 via-amber-300 to-indigo-400 p-1 shadow-xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 sm:h-24 sm:w-24">
                  <div className="h-full w-full overflow-hidden rounded-full bg-slate-950">
                    <CharacterAvatarImage
                      slug="pompon"
                      name="Pompón"
                      alt={isEn ? 'Portrait of Pompón' : 'Retrato de Pompón'}
                      size={96}
                      className="h-full w-full object-cover"
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
          </aside>
        </div>
      </div>
    </section>
  );
};
