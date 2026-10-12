'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { HalloweenEventSection } from './HalloweenEventSection';
import { ManagedSeasonalEventSection } from './ManagedSeasonalEventSection';

export const SeasonalEventSectionWrapper: React.FC<{
  locale: Locale;
  event: SeasonalEvent | null;
}> = ({ locale, event }) => {
  const { isSeasonalActive } = useSeasonalTheme();

  // Si el evento está inactivo o el visitante desactivó el tema estacional, no renderizar
  if (!event || !event.active || !isSeasonalActive) {
    return null;
  }

  if (event.themeKey === 'halloween' && event.specialChapter) return <HalloweenEventSection locale={locale} event={event} />;
  return <ManagedSeasonalEventSection locale={locale} event={event} />;
};
