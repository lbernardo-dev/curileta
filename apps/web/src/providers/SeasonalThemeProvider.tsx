'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SeasonalEvent } from '@curileta/cms';

interface SeasonalThemeContextType {
  activeEvent: SeasonalEvent | null;
  isSeasonalActive: boolean;
  isUserDismissed: boolean;
  toggleSeasonalTheme: () => void;
  themeKey: string | null;
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType>({
  activeEvent: null,
  isSeasonalActive: false,
  isUserDismissed: false,
  toggleSeasonalTheme: () => {},
  themeKey: null,
});

const STORAGE_KEY = 'curileta-seasonal-disabled';

export const SeasonalThemeProvider: React.FC<{
  activeEvent: SeasonalEvent | null;
  children: React.ReactNode;
}> = ({ activeEvent, children }) => {
  const [isUserDismissed, setIsUserDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setIsUserDismissed(true);
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, []);

  const isSeasonalActive = Boolean(activeEvent && activeEvent.active && !isUserDismissed);
  const themeKey = isSeasonalActive && activeEvent ? activeEvent.themeKey : null;

  // Sincronizar atributo data-seasonal-theme en <html>
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (isSeasonalActive && themeKey) {
      root.setAttribute('data-seasonal-theme', themeKey);
    } else {
      root.removeAttribute('data-seasonal-theme');
    }

    return () => {
      root.removeAttribute('data-seasonal-theme');
    };
  }, [mounted, isSeasonalActive, themeKey]);

  const toggleSeasonalTheme = () => {
    setIsUserDismissed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'true' : 'false');
      } catch {
        // Ignorar errores de almacenamiento
      }
      return next;
    });
  };

  return (
    <SeasonalThemeContext.Provider
      value={{
        activeEvent,
        isSeasonalActive,
        isUserDismissed,
        toggleSeasonalTheme,
        themeKey,
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  );
};

export const useSeasonalTheme = () => useContext(SeasonalThemeContext);
