'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, getMessages } from '@curileta/i18n';
import { LocaleSwitcher } from './LocaleSwitcher';
import { SkipLink, Button } from '@curileta/design-system';
import { Menu, X, Compass, Sparkles, Youtube } from 'lucide-react';

export const Header: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getMessages(locale);

  const navLinks = [
    { href: `/${locale}/curileta`, label: t.navigation.curileta },
    { href: `/${locale}/personajes`, label: t.navigation.characters },
    { href: `/${locale}/libros`, label: t.navigation.books },
    { href: `/${locale}/videos`, label: t.navigation.videos },
    { href: `/${locale}/contacto`, label: t.navigation.contact },
  ];

  return (
    <>
      <SkipLink targetId="main-content" label={t.accessibility.skipToContent} />
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/80 border-b border-emerald-100 dark:border-emerald-950/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-emerald-600 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-emerald-600 transition-colors">
                Curileta<span className="text-amber-500">.</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-emerald-700 dark:text-emerald-400">
                Las Aventuras
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions (Locale & CTA) */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <a
              href="https://www.youtube.com/@curileta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full shadow-sm hover:shadow transition-all"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span>YouTube</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleSwitcher currentLocale={locale} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 dark:border-emerald-900 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href="https://www.youtube.com/@curileta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 font-bold text-slate-950 rounded-xl"
              >
                <Youtube className="w-5 h-5 text-red-600" />
                <span>Canal Oficial de YouTube</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
