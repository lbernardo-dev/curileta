'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, getMessages } from '@curileta/i18n';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SkipLink, Button } from '@curileta/design-system';
import { SeasonalBanner } from './SeasonalBanner';
import { NauticalCompassMark } from './NauticalCompassMark';
import { Menu, X, BookOpen, ArrowRight } from 'lucide-react';

export const Header: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = getMessages(locale);
  const isEn = locale === 'en';

  const navLinks = [
    { href: `/${locale}/curileta`, label: t.navigation.curileta },
    { href: `/${locale}/mundo`, label: t.navigation.world },
    { href: `/${locale}/personajes`, label: t.navigation.characters },
    { href: `/${locale}/libros`, label: t.navigation.books },
    { href: `/${locale}/videos`, label: t.navigation.videos },
  ];

  return (
    <>
      <SkipLink targetId="main-content" label={t.accessibility.skipToContent} />
      <SeasonalBanner locale={locale} />
      <header data-seasonal-surface="header" className="sticky top-0 z-40 w-full border-b border-[#e5e9df] bg-[#fbfcf8]/95 shadow-[0_4px_20px_rgba(28,55,43,0.04)] backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2.5 rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <NauticalCompassMark />
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                Curileta<span className="text-amber-500">.</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-slate-500 dark:text-slate-400">
                {isEn ? 'Adventures' : 'Las Aventuras'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label={isEn ? 'Main navigation' : 'Navegación principal'} className="hidden items-center gap-0.5 md:flex lg:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-all hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 ${pathname === link.href || pathname.startsWith(`${link.href}/`) ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions (Theme, Locale & Book CTA) */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle locale={locale} />
            <LocaleSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/libros/las-aventuras-de-curileta`}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#1c493b] px-4 text-xs font-semibold text-white shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#27634e]"
            >
              <BookOpen className="h-4 w-4 text-amber-300" />
              <span>{isEn ? 'The book' : 'El libro'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle locale={locale} />
            <LocaleSwitcher currentLocale={locale} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label={mobileMenuOpen ? (isEn ? 'Close navigation menu' : 'Cerrar menú de navegación') : (isEn ? 'Open navigation menu' : 'Abrir menú de navegación')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="space-y-2 border-t border-emerald-100 bg-white/95 px-4 pb-6 pt-3 shadow-xl backdrop-blur-xl animate-in slide-in-from-top duration-200 dark:border-emerald-900 dark:bg-slate-950/95 md:hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {locale === 'en' ? 'Appearance Theme:' : 'Tema visual:'}
              </span>
              <ThemeToggle locale={locale} variant="segmented" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? 'page' : undefined}
                className="block rounded-xl px-4 py-2.5 font-medium text-slate-800 transition-colors hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-emerald-950/60"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={`/${locale}/libros/las-aventuras-de-curileta`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c493b] py-3 font-semibold text-white"
              >
                <BookOpen className="h-5 w-5 text-amber-300" />
                <span>{isEn ? 'Discover the book' : 'Descubre el libro'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
