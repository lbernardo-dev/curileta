'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { setBrowserStorageValue, useBrowserStorageValue } from '@/lib/browser-storage';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'curileta-theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystemTheme(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia(MEDIA_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getSystemThemeSnapshot() {
  return typeof window === 'undefined' || window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSystemThemeSnapshot() {
  return true;
}

function applyThemeToDOM(applied: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', applied === 'dark');
  root.classList.toggle('light', applied === 'light');
  root.setAttribute('data-theme', applied);
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedTheme = useBrowserStorageValue('local', STORAGE_KEY, 'system');
  const theme: Theme = isTheme(storedTheme) ? storedTheme : 'system';
  const prefersDark = useSyncExternalStore(subscribeToSystemTheme, getSystemThemeSnapshot, getServerSystemThemeSnapshot);
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setBrowserStorageValue('local', STORAGE_KEY, newTheme);
    if (newTheme !== 'system') applyThemeToDOM(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
