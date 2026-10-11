'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { SeasonalEvent } from '@curileta/cms';
import { removeBrowserStorageValue, setBrowserStorageValue, useBrowserStorageValue, useClientHydrated } from '@/lib/browser-storage';

interface SeasonalThemeContextType {
  activeEvent: SeasonalEvent | null;
  isReady: boolean;
  isSeasonalActive: boolean;
  isUserDismissed: boolean;
  toggleSeasonalTheme: () => void;
  themeKey: string | null;
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType>({
  activeEvent: null,
  isReady: false,
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
  const campaignStorageKey = activeEvent ? getCampaignStorageKey(activeEvent) : null;
  const scopedValue = useBrowserStorageValue('local', campaignStorageKey);
  const legacyValue = useBrowserStorageValue('local', LEGACY_STORAGE_KEY);
  const mounted = useClientHydrated();

  useEffect(() => {
    if (!campaignStorageKey || legacyValue === null) return;

    // Migrate the old global preference once, so it only affects its current campaign.
    if (scopedValue === null && legacyValue === 'true') {
      setBrowserStorageValue('local', campaignStorageKey, 'true');
    }
    removeBrowserStorageValue('local', LEGACY_STORAGE_KEY);
  }, [campaignStorageKey, legacyValue, scopedValue]);

  const isUserDismissed = Boolean(campaignStorageKey && (scopedValue === 'true' || (scopedValue === null && legacyValue === 'true')));
  const isSeasonalActive = Boolean(activeEvent && activeEvent.active && !isUserDismissed);
  const themeKey = isSeasonalActive && activeEvent ? activeEvent.themeKey : null;
  const isReady = mounted;

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

    if (isUserDismissed) removeBrowserStorageValue('local', campaignStorageKey);
    else setBrowserStorageValue('local', campaignStorageKey, 'true');
  };

  return (
    <SeasonalThemeContext.Provider
      value={{
        activeEvent,
        isReady,
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
