'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { HalloweenEventSection } from './HalloweenEventSection';

export const SeasonalEventSectionWrapper: React.FC<{
  locale: Locale;
  event: SeasonalEvent | null;
}> = ({ locale, event }) => {
  const { isSeasonalActive } = useSeasonalTheme();

  // Si el evento está inactivo o el visitante desactivó el tema estacional, no renderizar
  if (!event || !event.active || !isSeasonalActive || event.themeKey !== 'halloween') {
    return null;
  }

  return <HalloweenEventSection locale={locale} event={event} />;
};
