'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import { ThemeToggle } from './ThemeToggle';
import { Compass, Youtube, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC<{ locale: Locale }> = ({ locale }) => {
  const isEn = locale === 'en';
  const linkClass = 'text-sm text-slate-600 transition hover:text-emerald-800 dark:text-slate-300 dark:hover:text-emerald-300';

  return (
    <footer data-seasonal-surface="footer" className="mt-auto border-t border-[#e2e7dd] bg-[#fbfcf8] text-slate-700 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 border-b border-[#e2e7dd] pb-10 dark:border-slate-800 md:grid-cols-[1.25fr_0.75fr_0.8fr]">
          <div>
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1c493b] text-amber-300"><Compass className="h-5 w-5" /></span>
              <span className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Curileta<span className="text-amber-500">.</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
              {isEn
                ? 'Books, places and friendships to inspire a little more curiosity about the world.'
                : 'Libros, lugares y amistades para despertar un poco más de curiosidad por el mundo.'}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://www.youtube.com/@curileta" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff2ec] text-slate-700 transition hover:bg-red-600 hover:text-white dark:bg-slate-800 dark:text-slate-200" aria-label={isEn ? 'Curileta on YouTube' : 'Curileta en YouTube'}>
                <Youtube className="h-5 w-5" />
              </a>
              <ThemeToggle locale={locale} variant="segmented" />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 dark:text-white">{isEn ? 'Explore' : 'Explorar'}</h2>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/mundo`} className={linkClass}>{isEn ? 'The world' : 'El mundo'}</Link></li>
              <li><Link href={`/${locale}/personajes`} className={linkClass}>{isEn ? 'Characters and friends' : 'Personajes y amigos'}</Link></li>
              <li><Link href={`/${locale}/libros`} className={linkClass}>{isEn ? 'Books' : 'Libros'}</Link></li>
              <li><Link href={`/${locale}/videos`} className={linkClass}>{isEn ? 'Videos' : 'Vídeos'}</Link></li>
              <li><Link href={`/${locale}/canciones`} className={linkClass}>{isEn ? 'Songs' : 'Canciones'}</Link></li>
              <li><Link href={`/${locale}/fondos`} className={linkClass}>{isEn ? 'Wallpapers' : 'Fondos de pantalla'}</Link></li>
              <li><Link href={`/${locale}/novedades`} className={linkClass}>{isEn ? 'News' : 'Novedades'}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 dark:text-white">{isEn ? 'Families and partners' : 'Familias y profesionales'}</h2>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/contacto`} className={linkClass}>{isEn ? 'Contact the team' : 'Contactar con el equipo'}</Link></li>
              <li><Link href={`/${locale}/colaboraciones`} className={linkClass}>{isEn ? 'Partnerships' : 'Colaboraciones'}</Link></li>
              <li><Link href={`/${locale}/prensa`} className={linkClass}>{isEn ? 'Press and media' : 'Prensa y recursos'}</Link></li>
              <li><Link href={`/${locale}/eventos`} className={linkClass}>{isEn ? 'Events' : 'Eventos'}</Link></li>
            </ul>
            <Link href={`/${locale}/contacto`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200">
              {isEn ? 'Get in touch' : 'Escríbenos'} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7 text-xs text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span>{isEn ? 'Privacy comes first in experiences made for families.' : 'La privacidad es prioritaria en experiencias para familias.'}</span>
          </div>
          <nav aria-label={isEn ? 'Legal information' : 'Información legal'} className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={`/${locale}/privacidad`} className={linkClass}>{isEn ? 'Privacy' : 'Privacidad'}</Link>
            <Link href={`/${locale}/cookies`} className={linkClass}>{isEn ? 'Cookies' : 'Cookies'}</Link>
            <Link href={`/${locale}/legal`} className={linkClass}>{isEn ? 'Legal notice' : 'Aviso legal'}</Link>
            <Link href={`/${locale}/accesibilidad`} className={linkClass}>{isEn ? 'Accessibility' : 'Accesibilidad'}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
