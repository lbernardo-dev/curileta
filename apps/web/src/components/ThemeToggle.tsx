'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useTheme, Theme } from '@/providers/ThemeProvider';
import { Locale } from '@curileta/i18n';

interface ThemeToggleProps {
  locale?: Locale;
  variant?: 'dropdown' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  locale = 'es',
  variant = 'dropdown',
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const themeOptions: Array<{
    id: Theme;
    label: { es: string; en: string };
    desc: { es: string; en: string };
    icon: React.ReactNode;
  }> = [
    {
      id: 'light',
      label: { es: 'Claro', en: 'Light' },
      desc: { es: 'Modo día radiante', en: 'Radiant day mode' },
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'dark',
      label: { es: 'Oscuro', en: 'Dark' },
      desc: { es: 'Noche estrellada', en: 'Starry night mode' },
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'system',
      label: { es: 'Sistema', en: 'System' },
      desc: { es: 'Sigue tu dispositivo', en: 'Matches your device' },
      icon: <Monitor className="w-4 h-4 text-emerald-400" />,
    },
  ];

  // Active icon based on current choice
  const getActiveIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-180 duration-300" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400 animate-in spin-in-180 duration-300" />;
    return <Monitor className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-300" />;
  };

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 backdrop-blur-md shadow-sm ${className}`}
        role="group"
        aria-label={locale === 'en' ? 'Appearance theme selector' : 'Selector de tema visual'}
      >
        {themeOptions.map((opt) => {
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md scale-102 ring-1 ring-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
              title={opt.desc[locale] || opt.desc.es}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.label[locale] || opt.label.es}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={locale === 'en' ? `Switch theme. Current theme: ${theme}` : `Cambiar tema. Tema actual: ${theme}`}
        title={locale === 'en' ? 'Switch theme (Light / Dark / System)' : 'Cambiar tema (Claro / Oscuro / Sistema)'}
      >
        {getActiveIcon()}
        <span className="hidden lg:inline capitalize">
          {theme === 'system'
            ? (locale === 'en' ? 'Auto' : 'Auto')
            : (themeOptions.find((o) => o.id === theme)?.label[locale] || theme)}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 sm:w-52 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {locale === 'en' ? 'Appearance Theme' : 'Tema de Pantalla'}
            </span>
          </div>

          <div className="space-y-0.5">
            {themeOptions.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/50 dark:border-emerald-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {opt.icon}
                    </div>
                    <div>
                      <div className="leading-tight">{opt.label[locale] || opt.label.es}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {opt.desc[locale] || opt.desc.es}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 px-2 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {locale === 'en' ? 'Active: ' : 'Activo: '}
              <strong className="text-slate-700 dark:text-slate-300 capitalize">{resolvedTheme}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
