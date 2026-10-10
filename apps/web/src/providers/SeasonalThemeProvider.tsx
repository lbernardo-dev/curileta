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

const STORAGE_KEY_PREFIX = 'curileta-seasonal-disabled:';
const LEGACY_STORAGE_KEY = 'curileta-seasonal-disabled';

const getCampaignStorageKey = (event: SeasonalEvent, now = new Date()) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const startMonth = start.getUTCMonth();
  const endMonth = end.getUTCMonth();
  const crossesYear = endMonth < startMonth || (endMonth === startMonth && end.getUTCDate() < start.getUTCDate());
  const currentMonth = now.getUTCMonth();
  const currentDay = now.getUTCDate();
  const isInEndPartOfCrossYearCampaign = crossesYear && (
    currentMonth < endMonth || (currentMonth === endMonth && currentDay <= end.getUTCDate())
  );
  const campaignStartYear = now.getUTCFullYear() - (isInEndPartOfCrossYearCampaign ? 1 : 0);

  return `${STORAGE_KEY_PREFIX}${event.id}:${campaignStartYear}`;
};

export const SeasonalThemeProvider: React.FC<{
  activeEvent: SeasonalEvent | null;
  children: React.ReactNode;
}> = ({ activeEvent, children }) => {
  const [dismissedEvent, setDismissedEvent] = useState<{ id: string | null; dismissed: boolean }>({
    id: null,
    dismissed: false,
  });
  const [mounted, setMounted] = useState(false);
  const campaignStorageKey = activeEvent ? getCampaignStorageKey(activeEvent) : null;

  useEffect(() => {
    setMounted(true);
    if (!activeEvent || !campaignStorageKey) {
      setDismissedEvent({ id: null, dismissed: false });
      return;
    }

    try {
      const scopedValue = localStorage.getItem(campaignStorageKey);
      const legacyValue = localStorage.getItem(LEGACY_STORAGE_KEY);
      const dismissed = scopedValue === 'true' || (scopedValue === null && legacyValue === 'true');

      // Migrate the old global preference once, so it only affects its current campaign.
      if (scopedValue === null && legacyValue === 'true') {
        localStorage.setItem(campaignStorageKey, 'true');
      }
      if (legacyValue !== null) localStorage.removeItem(LEGACY_STORAGE_KEY);

      setDismissedEvent({ id: campaignStorageKey, dismissed });
    } catch {
      // Ignorar errores de localStorage
      setDismissedEvent({ id: campaignStorageKey, dismissed: false });
    }
  }, [campaignStorageKey]);

  const isUserDismissed = dismissedEvent.id === campaignStorageKey && dismissedEvent.dismissed;
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
    if (!campaignStorageKey) return;

    setDismissedEvent((previous) => {
      const currentlyDismissed = previous.id === campaignStorageKey && previous.dismissed;
      const next = !currentlyDismissed;
      try {
        if (next) localStorage.setItem(campaignStorageKey, 'true');
        else localStorage.removeItem(campaignStorageKey);
      } catch {
        // Ignorar errores de almacenamiento
      }
      return { id: campaignStorageKey, dismissed: next };
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
