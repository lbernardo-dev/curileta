'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Compass, Mail, Youtube, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Curileta<span className="text-amber-400">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Un universo de aventuras continuas, amistad y curiosidad por el mundo. Libros, canciones y episodios para inspirar a pequeñas y grandes mentes exploradoras.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@curileta"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-slate-300"
                aria-label="YouTube oficial de Curileta"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Explorar
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href={`/${locale}/curileta`} className="hover:text-emerald-400 transition-colors">
                  Conoce a Curileta
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/personajes`} className="hover:text-emerald-400 transition-colors">
                  Personajes y Amigos
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/libros`} className="hover:text-emerald-400 transition-colors">
                  Catálogo de Libros
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/videos`} className="hover:text-emerald-400 transition-colors">
                  Vídeos Oficiales
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/canciones`} className="hover:text-emerald-400 transition-colors">
                  Cancionero & Música
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/fondos`} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Fondos de Pantalla 2K</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">2K</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Profesional & Prensa */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Profesional
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href={`/${locale}/colaboraciones`} className="hover:text-emerald-400 transition-colors">
                  Licencias & Partnerships
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/prensa`} className="hover:text-emerald-400 transition-colors">
                  Sala de Prensa & Media Kit
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/eventos`} className="hover:text-emerald-400 transition-colors">
                  Agenda de Eventos
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contacto`} className="hover:text-emerald-400 transition-colors">
                  Contacto Editorial
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter para adultos */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Familias y Educadores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Recibe avisos de nuevos libros, episodios y eventos (orientado a madres, padres y tutores).
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs font-semibold">
                ¡Gracias por sumarte a la expedición! Te hemos enviado un correo de confirmación.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Suscribirme (Adultos)
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & Privacy Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Espacio digital protegido. Cumplimiento de protección infantil (COPPA / RGPD-K).</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href={`/${locale}/privacidad`} className="hover:text-slate-300 transition-colors">
              Privacidad y Menores
            </Link>
            <Link href={`/${locale}/cookies`} className="hover:text-slate-300 transition-colors">
              Cookies
            </Link>
            <Link href={`/${locale}/legal`} className="hover:text-slate-300 transition-colors">
              Aviso Legal
            </Link>
            <Link href={`/${locale}/accesibilidad`} className="hover:text-slate-300 transition-colors">
              Accesibilidad (WCAG 2.2)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
