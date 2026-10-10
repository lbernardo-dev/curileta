'use client';

import React, { useEffect, useState } from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import {
  Clock,
  Lock,
  Flame,
} from 'lucide-react';

import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';

interface HalloweenEventSectionProps {
  locale: Locale;
  event?: SeasonalEvent | null;
}

export const HalloweenEventSection: React.FC<HalloweenEventSectionProps> = ({
  locale,
  event,
}) => {
  const { isSeasonalActive } = useSeasonalTheme();
  const [timeLeft, setTimeLeft] = useState({ days: 21, hours: 4, minutes: 30, seconds: 15 });

  // Derive the premiere date from CMS content so the campaign can be reused next year.
  useEffect(() => {
    const releaseDate = event?.specialChapter.releaseDate || '2026-10-31';
    const targetDate = new Date(`${releaseDate}T18:00:00Z`).getTime();

    const updateCountdown = () => {
      const difference = Math.max(0, targetDate - Date.now());
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [event?.specialChapter.releaseDate]);

  // Si el tema estacional está desactivado o el evento no está activo, no renderizar
  if (!event || !event.active || !isSeasonalActive || event.themeKey !== 'halloween') {
    return null;
  }

  const isEn = locale === 'en';
  const copy = (es: string, en: string) => isEn ? en : es;

  return (
    <section
      id="evento-halloween"
      className="relative z-10 py-24 sm:py-28 bg-gradient-to-b from-[#0c211a] via-[#153d30] to-[#0b2019] text-white overflow-hidden"
    >
      {/* Luces y ambientación mágica de Halloween estilo Pixar */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(249,115,22,0.22),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(16,185,129,0.13),transparent)] pointer-events-none" />

      {/* Partículas flotantes de Halloween */}
      <div className="absolute top-10 left-10 text-3xl animate-float-gentle opacity-45 pointer-events-none">
        🎃
      </div>
      <div className="absolute top-20 right-16 text-2xl animate-float-slow opacity-40 pointer-events-none">
        🦇
      </div>
      <div className="absolute bottom-16 left-1/4 text-2xl animate-float-slow opacity-35 pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-20 right-1/4 text-3xl animate-float-gentle opacity-40 pointer-events-none">
        🕯️
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado del Evento Estacional */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-950/90 border border-orange-500/50 text-orange-300 text-xs font-black uppercase tracking-widest mb-4 shadow-xl shadow-orange-950/40 backdrop-blur-md">
            <span>🎃</span>
            <span>
              {isEn
                ? 'LIMITED SEASONAL THEME • ACTIVE UNTIL NOVEMBER 5'
                : 'EVENTO TEMPORAL • ACTIVO HASTA EL 5 DE NOVIEMBRE'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            {isEn ? 'The Enchanted Pumpkin Patch.' : 'El Huerto de las Calabazas Encantadas.'}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-200">
              {isEn ? 'A night of gentle magic and golden lanterns.' : 'Una noche de magia y linternas doradas.'}
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-emerald-50/90 leading-relaxed">
            {isEn
              ? 'Each holiday season transforms Curileta’s Forest. During Halloween, stories are not scary: they are filled with friendly secrets, singing pumpkins, and autumn family recipes.'
              : 'Cada festividad transforma el Bosque de Curileta. En Halloween las historias no dan miedo: se llenan de secretos amistosos, calabazas cantarinas y recetas de otoño para disfrutar en familia.'}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-amber-300/80 font-semibold inline-flex items-center gap-1.5">
            <span>✨</span>
            <span>
              {isEn
                ? 'Temporary seasonal theme: when the event concludes on Nov 5, the website automatically reverts to its original forest theme.'
                : 'Tema estacional temporal: al concluir la festividad el 5 de noviembre, la web vuelve automáticamente a su tema original.'}
            </span>
          </p>

          {/* Contador regresivo hasta el estreno */}
          <div className="mt-8 inline-flex items-center gap-3 sm:gap-6 bg-black/50 border border-orange-500/40 px-6 py-3.5 rounded-3xl backdrop-blur-md shadow-2xl">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{copy('Días', 'Days')}</span>
            </div>
            <span className="text-orange-500 font-black text-xl">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{copy('Horas', 'Hours')}</span>
            </div>
            <span className="text-orange-500 font-black text-xl">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{copy('Min', 'Min')}</span>
            </div>
            <span className="text-orange-500 font-black text-xl">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{copy('Seg', 'Sec')}</span>
            </div>
          </div>
        </div>

        {/* Módulo Principal: Capítulo Especial de Halloween (Con Badge Próximamente) */}
        <div className="rounded-3xl bg-gradient-to-br from-[#143d30]/90 via-[#10261e] to-[#382718]/80 border border-amber-400/35 p-6 sm:p-10 lg:p-12 shadow-[0_24px_70px_rgba(4,24,16,0.28)] backdrop-blur-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado izquierdo: Portada del Capítulo Especial */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500/50 group">
                <img
                  src="/images/events/halloween-curileta-pompon-wide.webp"
                  alt={locale === 'en'
                    ? 'Curileta and Pompón explore a glowing pumpkin clearing in the Enchanted Forest'
                    : 'Curileta y Pompón exploran un claro de calabazas luminosas en el Bosque Encantado'}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091e18] via-[#09241f]/30 to-transparent" />

                {/* Badge Oficial PRÓXIMAMENTE */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-300 text-[#183a2e] shadow-md border border-amber-100/80 flex items-center gap-1.5">
                    <span>🎃</span>
                    <span>{copy('PRÓXIMAMENTE', 'COMING SOON')}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-500/30">
                    {copy('Estreno: 31 de octubre', 'Premiere: October 31')}
                  </span>
                </div>

                {/* Candado / Botón Bloqueado */}
                <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950/80 border-2 border-orange-500 text-orange-400 flex items-center justify-center shadow-2xl backdrop-blur-md">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="text-[11px] font-mono font-bold text-amber-200 bg-black/80 px-3 py-1 rounded-full backdrop-blur-md">
                    {copy('🔒 Contenido bloqueado hasta el estreno', '🔒 Unlocks on premiere day')}
                  </span>
                </div>
              </div>
            </div>

            {/* Lado derecho: Sinopsis & Pre-guardado del evento */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-orange-400">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{copy('Capítulo exclusivo del evento de temporada', 'Seasonal special episode')}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {copy('Curileta y la Noche de las Calabazas Brillantes', 'Curileta and the Night of the Shining Pumpkins')}
              </h3>

              <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed">
                {copy(
                  'Una misteriosa estela de hojas doradas guía a Curileta y Pompón a la colina más alta del Bosque Encantado. Allí descubren que las calabazas milenarias no asustan a nadie: ¡hablan con voz dulce, custodian historias ancestrales de los antiguos mayas e iluminan el camino de las luciérnagas viajeras!',
                  'A trail of golden leaves leads Curileta and Pompón to the highest hill in the Enchanted Forest. There, friendly ancient pumpkins share Maya stories and light the way for traveling fireflies.'
                )}
              </p>

              {/* Ficha técnica del capítulo */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 text-xs">
                <div className="p-3 rounded-xl bg-[#0b211a]/65 border border-emerald-900/70">
                  <span className="text-slate-400 block text-[10px] uppercase">{copy('Formato', 'Format')}</span>
                  <strong className="text-white">{copy('Episodio especial (12 min)', 'Special episode (12 min)')}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#0b211a]/65 border border-emerald-900/70">
                  <span className="text-slate-400 block text-[10px] uppercase">{copy('Edad sugerida', 'Suggested age')}</span>
                  <strong className="text-amber-300">{copy('Todas las edades (0+ seguro)', 'All ages (safe for 0+)')}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#0b211a]/65 border border-emerald-900/70 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] uppercase">{copy('Valores', 'Values')}</span>
                  <strong className="text-emerald-300">{copy('Empatía, sin sustos y celebración', 'Empathy, gentle fun and celebration')}</strong>
                </div>
              </div>

              {/* Notificación de Estreno */}
              <div className="pt-2">
              <p role="status" className="rounded-2xl border border-orange-500/30 bg-[#091e18]/70 px-4 py-3 text-xs leading-5 text-amber-100/90">
                  {copy(
                    'El aviso por correo estará disponible cuando publiquemos el calendario oficial del estreno.',
                    'Email reminders will be available once the official release schedule is published.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rejilla de Contenidos y Materiales del Evento (Con Badge Próximamente) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {copy('Materiales y actividades del evento', 'Event activities and materials')}
              </h4>
              <p className="text-xs text-emerald-100/75 mt-0.5">
                {copy(
                  'El contenido se publicará poco a poco a medida que se acerque Halloween.',
                  'New activities will be revealed as Halloween approaches.'
                )}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-950 border border-orange-500/30 text-orange-300 hidden sm:inline">
              {copy('3 actividades en producción', '3 activities in production')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Actividad 1 */}
            <div className="rounded-2xl bg-[#123328]/90 border border-orange-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🎭</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{copy('PRÓXIMAMENTE', 'COMING SOON')}</span>
                  </span>
                </div>
                <h5 className="text-lg font-black text-white">
                  {copy('Máscara imprimible de Curileta hechicera', 'Printable Curileta explorer mask')}
                </h5>
                <p className="text-xs text-emerald-50/85 mt-2 leading-relaxed">
                  {copy(
                    'Plantilla oficial en PDF tamaño DIN A4. Coloréala, recórtala con ayuda de una persona adulta y úsala para tu disfraz.',
                    'Official high-resolution A4 PDF template. Color it, cut it out with an adult, and wear it as part of your costume.'
                  )}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-950/80 flex items-center justify-between text-xs text-emerald-100/70">
                <span className="font-mono">{copy('PDF imprimible', 'Printable PDF')}</span>
                <span className="font-bold text-orange-400">{copy('Disponible el 25 de octubre', 'Available October 25')}</span>
              </div>
            </div>

            {/* Actividad 2 */}
            <div className="rounded-2xl bg-[#123328]/90 border border-orange-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🍪</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{copy('PRÓXIMAMENTE', 'COMING SOON')}</span>
                  </span>
                </div>
                <h5 className="text-lg font-black text-white">
                  {copy('Receta: galletas de calabaza de Pompón', 'Recipe: Pompón’s pumpkin cookies')}
                </h5>
                <p className="text-xs text-emerald-50/85 mt-2 leading-relaxed">
                  {copy(
                    'Receta ilustrada para cocinar en familia con calabaza, avena y canela. Sin azúcares refinados y apta para pequeños cocineros.',
                    'A family-friendly illustrated recipe with pumpkin, oats and cinnamon. No refined sugar, and made for little cooks.'
                  )}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-950/80 flex items-center justify-between text-xs text-emerald-100/70">
                <span className="font-mono">{copy('Ficha de cocina', 'Recipe card')}</span>
                <span className="font-bold text-orange-400">{copy('Disponible el 28 de octubre', 'Available October 28')}</span>
              </div>
            </div>

            {/* Actividad 3 */}
            <div className="rounded-2xl bg-[#123328]/90 border border-orange-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📱</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{copy('PRÓXIMAMENTE', 'COMING SOON')}</span>
                  </span>
                </div>
                <h5 className="text-lg font-black text-white">
                  {copy('Fondos 2K de Halloween: Curileta y calabazas', 'Halloween 2K wallpapers: Curileta and pumpkins')}
                </h5>
                <p className="text-xs text-emerald-50/85 mt-2 leading-relaxed">
                  {copy(
                    'Ilustraciones 3D en resolución 2K para móvil y ordenador, con Curileta en el bosque encantado.',
                    'High-resolution 2K illustrations for phones and desktops, featuring Curileta in the Enchanted Forest.'
                  )}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-950/80 flex items-center justify-between text-xs text-emerald-100/70">
                <span className="font-mono">WebP · 2K QHD</span>
                <span className="font-bold text-orange-400">{copy('Disponible el 30 de octubre', 'Available October 30')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
