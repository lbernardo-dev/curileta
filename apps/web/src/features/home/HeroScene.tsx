'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowDown,
  BookOpen,
  Globe2,
  Mail,
  Play,
  Backpack,
  Star,
  MapPin,
  ChevronRight,
  Flame,
  Award,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const HeroScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { isSeasonalActive, themeKey } = useSeasonalTheme();
  const isEn = locale === 'en';
  const isHalloween = isSeasonalActive && themeKey === 'halloween';

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<'curileta' | 'pompon' | 'quetzal'>('curileta');

  // Mensajes de los personajes
  const speechMessages = {
    curileta: isEn
      ? '«Pack your canteen and compass! Every corner of Earth holds a friendly secret waiting for us.»'
      : '«¡Alista tu cantimplora y tu mapa! Cada rincón de la Tierra guarda un misterio amistoso esperando ser descubierto.»',
    pompon: isEn
      ? '«I have safe airmail letters in my treehouse! Write to me from anywhere in the world.»'
      : '«¡Tengo cartas selladas en mi casita del árbol! Escríbeme y te enviaré noticias del Bosque.»',
    quetzal: isEn
      ? '«The ancient pyramids and the open skies are waiting. Spread your wings and travel with us!»'
      : '«¡Las pirámides antiguas y el cielo abierto nos esperan. ¡Abre tus alas y viaja con nosotros!»',
  };

  // Reproductor interactivo de sonido de carillón y voz de Curileta
  const playCuriletaGreeting = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    try {
      // Carillón pentatónico Pixar (C5 -> E5 -> G5 -> C6)
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

          gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + idx * 0.12 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
        });
      }

      // Síntesis de voz infantil y aventurera
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = isEn
          ? 'Hello big explorer! I am Curileta. Get your backpack ready, we are going to explore the whole world together!'
          : '¡Hola, pequeño gran explorador! Soy Curileta. ¡Prepara tu mochila y tu mapa porque nos vamos a recorrer el mundo entero juntos!';

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = isEn ? 'en-US' : 'es-ES';
        utterance.rate = 1.05;
        utterance.pitch = 1.25;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 3000);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  return (
    <section
      id="hero-scene"
      className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center overflow-hidden py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-500"
    >
      {/* ============================================================
          FONDO Y AMBIENTACIÓN CINEMÁTICA CON PROFUNDIDAD
          ============================================================ */}
      <div
        className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
          isHalloween
            ? 'bg-gradient-to-b from-[#180829] via-[#240e3b] to-[#0c0517]'
            : 'bg-gradient-to-b from-emerald-100/90 via-emerald-50/60 to-emerald-100/95 dark:from-[#031d17] dark:via-[#021310] dark:to-[#010907]'
        }`}
      />

      {/* Haz celestial de sol / Godrays matutinos */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isHalloween
            ? 'bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(249,115,22,0.22),transparent_70%)]'
            : 'bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(52,211,153,0.35),transparent_70%)]'
        }`}
      />

      {/* Resplandores de niebla mágica en esquinas */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-emerald-500/15 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-amber-400/20 dark:bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Partículas y luciérnagas flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/10 w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-300 animate-pulse blur-[1px]" />
        <div className="absolute top-1/3 right-1/12 w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-300 animate-pulse delay-500 blur-[1px]" />
        <div className="absolute bottom-1/3 left-1/6 w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-300 animate-pulse delay-1000 blur-[1px]" />
        <div className="absolute top-2/3 right-1/4 w-3.5 h-3.5 rounded-full bg-amber-300 dark:bg-amber-400 animate-pulse delay-700 blur-[1px]" />

        {isHalloween && (
          <>
            <div className="absolute top-12 left-8 text-3xl animate-bounce opacity-60">🎃</div>
            <div className="absolute top-28 right-12 text-2xl animate-pulse opacity-50">🍂</div>
            <div className="absolute bottom-20 left-16 text-xl animate-bounce delay-300 opacity-40">✨</div>
          </>
        )}
      </div>

      {/* ============================================================
          CONTENEDOR PRINCIPAL: COMPOSICIÓN A 2 COLUMNAS CINEMÁTICA
          ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ============================================================
            COLUMNA IZQUIERDA: HISTORIA, TÍTULO, VOZ Y CTAS (7 COLS)
            ============================================================ */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge superior temático */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full border text-xs sm:text-sm font-black tracking-wider uppercase mb-5 shadow-lg backdrop-blur-xl transition-all duration-500 ${
              isHalloween
                ? 'bg-orange-500/20 dark:bg-orange-950/80 border-orange-400/50 text-orange-900 dark:text-orange-200 shadow-orange-950/40'
                : 'bg-emerald-200/90 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-emerald-900/20'
            }`}
          >
            <Sparkles
              className={`w-4 h-4 animate-spin ${isHalloween ? 'text-orange-500 dark:text-orange-400' : 'text-amber-500'}`}
              style={{ animationDuration: '6s' }}
            />
            <span>
              {isHalloween
                ? isEn
                  ? '🎃 Halloween Season • The Enchanted Forest'
                  : '🎃 Especial de Halloween • El Bosque Encantado'
                : isEn
                ? '✨ Official Expedition • Discover the World'
                : '✨ Expedición Oficial • Descubre el Mundo'}
            </span>
          </div>

          {/* Gran Título Pixar 3D */}
          <h1 className="font-black tracking-tight leading-[1.08] text-4xl sm:text-6xl md:text-7xl lg:text-[76px] text-slate-900 dark:text-white">
            <span>{isEn ? 'A magical world' : 'Un mundo mágico'}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-500 dark:from-amber-400 dark:via-emerald-300 dark:to-teal-300 drop-shadow-md">
              {isEn ? 'to explore together.' : 'por descubrir juntos.'}
            </span>
          </h1>

          {/* Subtítulo narrativo */}
          <p className="mt-4 text-base sm:text-xl text-slate-700 dark:text-emerald-100/90 font-medium max-w-2xl leading-relaxed">
            {isEn
              ? 'Join Curileta and her companions on a heartwarming journey across 40 cultures. Real monuments, illustrated books, original songs, and friendship.'
              : 'Únete a Curileta y sus amigos en un viaje entrañable por 40 culturas del planeta. Monumentos en 3D, libros ilustrados, canciones originales y aventuras educativas para toda la familia.'}
          </p>

          {/* Bocadillo Interactivo de Voz con Audio */}
          <div className="mt-6 w-full max-w-xl p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border-2 border-amber-400/70 shadow-xl shadow-amber-500/15 backdrop-blur-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-xl">
              {activeCharacter === 'curileta' ? '🦎' : activeCharacter === 'pompon' ? '🐰' : '🦜'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {activeCharacter === 'curileta'
                    ? isEn
                      ? 'Curileta says:'
                      : 'Curileta dice:'
                    : activeCharacter === 'pompon'
                    ? isEn
                      ? 'Pompón says:'
                      : 'Pompón dice:'
                    : isEn
                    ? 'Quetzal says:'
                    : 'Quetzal dice:'}
                </span>
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                  {isEn ? 'Audio enabled' : 'Con voz'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate sm:whitespace-normal">
                {speechMessages[activeCharacter]}
              </p>
            </div>
            <button
              onClick={playCuriletaGreeting}
              disabled={isPlayingAudio}
              className={`px-3 py-2 rounded-xl border font-black text-xs transition-all flex items-center gap-1.5 shadow-md flex-shrink-0 ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 border-amber-600 animate-bounce'
                  : 'bg-amber-300 hover:bg-amber-400 text-slate-950 border-amber-400 hover:scale-105 active:scale-95'
              }`}
              title={isEn ? 'Listen to Curileta' : 'Escuchar a Curileta'}
              aria-label={isEn ? 'Listen to Curileta' : 'Escuchar a Curileta'}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isPlayingAudio ? (isEn ? 'Playing...' : 'Hablando...') : isEn ? 'Listen' : 'Escuchar'}
              </span>
            </button>
          </div>

          {/* Botones de Acción Chunky 3D Estilo Toybox */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
            {/* Botón Principal Dorado Táctil */}
            <a
              href="#escena-globo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 border-b-6 border-amber-600 hover:border-b-4 hover:translate-y-[2px] active:border-b-0 active:translate-y-[6px] shadow-[0_10px_25px_rgba(245,158,11,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-center"
            >
              <Compass className="w-6 h-6 text-emerald-950 animate-spin" style={{ animationDuration: '10s' }} />
              <span>{isEn ? 'Start Expedition' : 'Comenzar la Expedición'}</span>
            </a>

            {/* Botón Secundario Acrílico */}
            <a
              href="#escena-personajes"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-emerald-600/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border-b-6 border-slate-400 dark:border-b-6 dark:border-emerald-900 hover:border-b-4 hover:translate-y-[2px] active:border-b-0 active:translate-y-[6px] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 text-center"
            >
              <Backpack className="w-5 h-5 text-emerald-500" />
              <span>{isEn ? 'View 19 Characters' : 'Ver 19 Personajes'}</span>
            </a>
          </div>

          {/* Insignias de garantía de contenido */}
          <div className="mt-8 flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 flex-wrap justify-center lg:justify-start">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isEn ? 'Safe Family Content' : 'Contenido Seguro Infantil'}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-sky-500" />
              {isEn ? '40+ Real World Cultures' : '40+ Culturas Reales'}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              {isEn ? 'Illustrated Hardcovers' : 'Libros Físicos Ilustrados'}
            </span>
          </div>
        </div>

        {/* ============================================================
            COLUMNA DERECHA: EL GRAN DIORAMA 3D TOYBOX DEL TRÍO (5 COLS)
            ============================================================ */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          {/* El Diorama Box físico estilo Toybox / Estuche Coleccionable */}
          <div className="relative w-full max-w-md sm:max-w-lg rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-[#2a1b3d] via-[#1a0f28] to-[#12071d] p-3.5 sm:p-5 border-4 border-amber-400/80 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl group/diorama">
            {/* Ranura superior de caja coleccionable */}
            <div className="w-20 h-2.5 mx-auto bg-slate-900/90 rounded-full border border-amber-400/40 mb-3 shadow-inner" />

            {/* Encabezado del diorama con distintivo oficial */}
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🌟</span>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  {isEn ? 'Official Diorama 3D' : 'Diorama Oficial 3D'}
                </span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-widest shadow-sm">
                SERIE 01
              </span>
            </div>

            {/* --- ESCENARIO DE LOS 3 PERSONAJES INTEGRADOS --- */}
            <div className="relative w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#eadecc] via-[#e5d4be] to-[#d8bf9f] p-2 sm:p-3 border-2 border-amber-200/50 shadow-inner flex flex-col items-center">
              {/* Brillo especular acrílico sobre el escaparate */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Los Tres Personajes en Composición Escénica */}
              <div className="relative w-full flex items-end justify-center min-h-[300px] sm:min-h-[360px] pt-4">
                {/* 1. Pompón (Izquierda) */}
                <button
                  type="button"
                  onClick={() => setActiveCharacter('pompon')}
                  className={`group/char relative -mr-5 sm:-mr-8 z-10 flex flex-col items-center transition-all duration-300 hover:scale-110 focus:outline-none ${
                    activeCharacter === 'pompon' ? 'scale-105 z-30 brightness-110' : 'opacity-85 hover:opacity-100'
                  }`}
                  title="Pompón el Conejo"
                >
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-950 text-sky-200 border border-sky-400/60 mb-1 shadow-md">
                    🐰 Pompón
                  </span>
                  <div className="w-24 h-36 sm:w-32 sm:h-48 overflow-hidden rounded-2xl border-2 border-sky-300/40 bg-white/30 backdrop-blur-xs shadow-md">
                    <img
                      src="/images/characters/pompon-main.webp"
                      alt="Pompón"
                      className="w-full h-full object-cover transition-transform group-hover/char:scale-110"
                    />
                  </div>
                </button>

                {/* 2. Curileta (Centro - Protagonista) */}
                <button
                  type="button"
                  onClick={() => setActiveCharacter('curileta')}
                  className={`group/char relative z-20 flex flex-col items-center transition-all duration-500 hover:scale-105 focus:outline-none ${
                    activeCharacter === 'curileta' ? 'scale-105 brightness-105' : 'opacity-90 hover:opacity-100'
                  }`}
                  title="Curileta la Lagartija Exploradora"
                >
                  <span className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 border border-amber-200 mb-1 shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>Curileta #01</span>
                  </span>
                  <div className="w-36 h-52 sm:w-48 sm:h-68 overflow-hidden rounded-3xl border-3 border-amber-400 bg-white/40 backdrop-blur-xs shadow-2xl shadow-amber-900/40">
                    <img
                      src="/images/characters/curileta-main.webp"
                      alt="Curileta"
                      className="w-full h-full object-cover transition-transform group-hover/char:scale-110"
                    />
                  </div>
                </button>

                {/* 3. Quetzal (Derecha) */}
                <button
                  type="button"
                  onClick={() => setActiveCharacter('quetzal')}
                  className={`group/char relative -ml-5 sm:-ml-8 z-10 flex flex-col items-center transition-all duration-300 hover:scale-110 focus:outline-none ${
                    activeCharacter === 'quetzal' ? 'scale-105 z-30 brightness-110' : 'opacity-85 hover:opacity-100'
                  }`}
                  title="Quetzal el Ave Sagrada"
                >
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-950 text-teal-200 border border-teal-400/60 mb-1 shadow-md">
                    🦜 Quetzal
                  </span>
                  <div className="w-24 h-36 sm:w-32 sm:h-48 overflow-hidden rounded-2xl border-2 border-teal-300/40 bg-white/30 backdrop-blur-xs shadow-md">
                    <img
                      src="/images/characters/quetzal-main.webp"
                      alt="Quetzal"
                      className="w-full h-full object-cover transition-transform group-hover/char:scale-110"
                    />
                  </div>
                </button>
              </div>

              {/* Placa con relieve metálico de madera noble */}
              <div className="mt-3 w-full py-2 px-3 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/40 text-center shadow-lg">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-300 block">
                  {isEn
                    ? '✨ The Explorer Squad • Bosque Encantado'
                    : '✨ La Alianza de Exploradores • Bosque Encantado'}
                </span>
                <span className="text-[10px] text-slate-300 block">
                  {isEn ? 'Tap any companion to listen' : 'Toca a cada personaje para interactuar'}
                </span>
              </div>
            </div>

            {/* Accesos Rápidos del Escaparate */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
              <a
                href="#escena-globo"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-center transition-all"
              >
                <Globe2 className="w-4 h-4 mx-auto text-emerald-400 mb-0.5" />
                <span className="text-[10px] font-black text-white block">40+ Travesías</span>
              </a>
              <a
                href="#escena-libros"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-center transition-all"
              >
                <BookOpen className="w-4 h-4 mx-auto text-amber-400 mb-0.5" />
                <span className="text-[10px] font-black text-white block">2 Libros 3D</span>
              </a>
              <a
                href="#escena-cartas"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-center transition-all"
              >
                <Mail className="w-4 h-4 mx-auto text-sky-400 mb-0.5" />
                <span className="text-[10px] font-black text-white block">Buzón Postal</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll de sendero de aventura al final */}
      <a
        href="#escena-mapa"
        className="mt-8 flex flex-col items-center gap-1.5 text-emerald-800 dark:text-emerald-400/80 group hover:scale-105 transition-all cursor-pointer"
        aria-label={isEn ? 'Scroll along the adventure map trail' : 'Avanzar por el sendero del mapa de aventuras'}
      >
        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/80 px-3.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 group-hover:border-amber-400 shadow-sm text-emerald-900 dark:text-emerald-300 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
          <span>🧭</span>
          <span>{isEn ? 'Follow the Adventure Map Trail' : 'Sigue el Sendero del Mapa de Aventuras'}</span>
        </span>
        <ArrowDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-amber-500 animate-bounce transition-colors" />
      </a>
    </section>
  );
};
