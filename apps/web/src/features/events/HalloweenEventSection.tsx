'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import {
  Sparkles,
  Calendar,
  Clock,
  Bell,
  Play,
  Download,
  CheckCircle2,
  Lock,
  Gift,
  ExternalLink,
  Flame,
  Moon,
  ChevronRight,
} from 'lucide-react';

interface HalloweenEventSectionProps {
  locale: Locale;
  event?: SeasonalEvent | null;
}

export const HalloweenEventSection: React.FC<HalloweenEventSectionProps> = ({
  locale,
  event,
}) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 21, hours: 4, minutes: 30, seconds: 15 });

  // Countdown timer simulation for October 31
  useEffect(() => {
    const timer = setInterval(() => {
      const targetDate = new Date('2026-10-31T18:00:00Z').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail.trim()) {
      setNotified(true);
      setTimeout(() => setNotified(false), 5000);
    }
  };

  return (
    <section
      id="evento-halloween"
      className="relative py-28 bg-gradient-to-b from-[#180829] via-[#240e3b] to-[#0c0517] text-white overflow-hidden"
    >
      {/* Luces y ambientación mágica de Halloween estilo Pixar */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(249,115,22,0.22),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(168,85,247,0.18),transparent)] pointer-events-none" />

      {/* Partículas flotantes de Halloween */}
      <div className="absolute top-10 left-10 text-3xl animate-bounce duration-1000 opacity-60 pointer-events-none">
        🎃
      </div>
      <div className="absolute top-20 right-16 text-2xl animate-pulse duration-700 opacity-50 pointer-events-none">
        🦇
      </div>
      <div className="absolute bottom-16 left-1/4 text-2xl animate-bounce duration-1000 opacity-40 pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-20 right-1/4 text-3xl animate-pulse duration-1000 opacity-50 pointer-events-none">
        🕯️
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado del Evento Estacional */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-950/90 border border-orange-500/50 text-orange-300 text-xs font-black uppercase tracking-widest mb-4 shadow-xl shadow-orange-950/40 backdrop-blur-md">
            <span>🎃</span>
            <span>EVENTO TEMPORAL • ESPECIAL DE HALLOWEEN 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            El Huerto de las Calabazas Encantadas.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-purple-400">
              Una noche de magia y linternas doradas.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-purple-200/90 leading-relaxed">
            Cada festividad transforma el Bosque de Curileta. En Halloween las historias no dan miedo: se llenan de secretos amistosos, calabazas cantarinas y recetas de otoño para disfrutar en familia.
          </p>

          {/* Contador regresivo hasta el estreno */}
          <div className="mt-8 inline-flex items-center gap-3 sm:gap-6 bg-black/50 border border-orange-500/40 px-6 py-3.5 rounded-3xl backdrop-blur-md shadow-2xl">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Días</span>
            </div>
            <span className="text-orange-500 font-black text-xl">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Horas</span>
            </div>
            <span className="text-orange-500 font-black text-xl">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Min</span>
            </div>
            <span className="text-orange-500 font-black text-xl">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Seg</span>
            </div>
          </div>
        </div>

        {/* Módulo Principal: Capítulo Especial de Halloween (Con Badge Próximamente) */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-orange-950/80 border-2 border-orange-500/40 p-8 sm:p-12 shadow-2xl shadow-orange-950/30 backdrop-blur-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado izquierdo: Portada del Capítulo Especial */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500/50 group">
                <img
                  src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&auto=format&fit=crop&q=80"
                  alt="Especial de Halloween Curileta y Pompón — Próximamente"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badge Oficial PRÓXIMAMENTE */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-600 text-slate-950 shadow-lg border border-orange-400 flex items-center gap-1.5 animate-pulse">
                    <span>🎃</span>
                    <span>PRÓXIMAMENTE</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 text-amber-300 border border-amber-500/30">
                    Estreno: 31 Octubre
                  </span>
                </div>

                {/* Candado / Botón Bloqueado */}
                <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950/80 border-2 border-orange-500 text-orange-400 flex items-center justify-center shadow-2xl backdrop-blur-md">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="text-[11px] font-mono font-bold text-amber-200 bg-black/80 px-3 py-1 rounded-full backdrop-blur-md">
                    🔒 Contenido bloqueado hasta el estreno
                  </span>
                </div>
              </div>
            </div>

            {/* Lado derecho: Sinopsis & Pre-guardado del evento */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-orange-400">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Capítulo Exclusivo del Evento de Temporada</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Curileta y la Noche de las Calabazas Brillantes
              </h3>

              <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed">
                Una misteriosa estela de hojas doradas guía a Curileta y Pompón a la colina más alta del Bosque Encantado. Allí descubren que las calabazas milenarias no asustan a nadie: ¡hablan con voz dulce, custodian historias ancestrales de los antiguos mayas e iluminan el camino de las luciérnagas viajeras!
              </p>

              {/* Ficha técnica del capítulo */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-900/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Formato</span>
                  <strong className="text-white">Episodio Especial (12 min)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-900/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Edad sugerida</span>
                  <strong className="text-amber-300">Todas las edades (0+ seguro)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-900/60 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] uppercase">Valores</span>
                  <strong className="text-emerald-300">Empatía, sin sustos, fiesta</strong>
                </div>
              </div>

              {/* Notificación de Estreno */}
              <div className="pt-2">
                {notified ? (
                  <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>¡Listo! Te avisaremos por correo el 31 de octubre cuando se publique el capítulo en YouTube y en la web.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Correo para avisarme del estreno..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-orange-500/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-inner"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Bell className="w-4 h-4 text-slate-950" />
                      <span>Avisarme al estrenar</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rejilla de Contenidos y Materiales del Evento (Con Badge Próximamente) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                Materiales y Actividades del Evento
              </h4>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Todo el contenido se habilitará progresivamente conforme nos acerquemos a la noche de Halloween.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-950 border border-orange-500/30 text-orange-300 hidden sm:inline">
              3 Actividades en Producción
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Actividad 1 */}
            <div className="rounded-2xl bg-slate-900/80 border border-orange-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🎭</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>PRÓXIMAMENTE</span>
                  </span>
                </div>
                <h5 className="text-lg font-black text-white">
                  Máscara Imprimible de Curileta Hechicera
                </h5>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Plantilla oficial en PDF de alta resolución en tamaño DIN-A4. Colorea con lápices, recorta con tijeras infantiles y añade una goma para tu disfraz.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">PDF Imprimible</span>
                <span className="font-bold text-orange-400">Desbloqueo 25 Octubre</span>
              </div>
            </div>

            {/* Actividad 2 */}
            <div className="rounded-2xl bg-slate-900/80 border border-orange-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🍪</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>PRÓXIMAMENTE</span>
                  </span>
                </div>
                <h5 className="text-lg font-black text-white">
                  Receta: Galletas de Calabaza de Pompón
                </h5>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Receta ilustrada paso a paso para cocinar en familia con puré de calabaza, avena y canela dulce. Sin azúcares refinados y apta para pequeños cocineros.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Ficha de Cocina</span>
                <span className="font-bold text-orange-400">Desbloqueo 28 Octubre</span>
              </div>
            </div>

            {/* Actividad 3 */}
            <div className="rounded-2xl bg-slate-900/80 border border-orange-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📱</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>PRÓXIMAMENTE</span>
                  </span>
                </div>
                <h5 className="text-lg font-black text-white">
                  Fondos 2K Halloween: Curileta & Calabazas
                </h5>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Ilustración 3D de alta fidelidad con resolución 2K Ultra HD para pantallas de móvil y ordenadores, con Curileta sosteniendo una linterna de bellota dorada.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">WebP 2K QHD</span>
                <span className="font-bold text-orange-400">Desbloqueo 30 Octubre</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
