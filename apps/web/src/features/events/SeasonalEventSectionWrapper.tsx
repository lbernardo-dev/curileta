'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { ManagedSeasonalEventSection } from './ManagedSeasonalEventSection';
import type { CharacterMask } from '@/lib/character-masks.server';
import type { EventPrintable } from '@/lib/event-printables.server';

export const SeasonalEventSectionWrapper: React.FC<{
  locale: Locale;
  event: SeasonalEvent | null;
  masks: CharacterMask[];
  printables: EventPrintable[];
}> = ({ locale, event, masks, printables }) => {
  const { isSeasonalActive } = useSeasonalTheme();

  // Si el evento está inactivo o el visitante desactivó el tema estacional, no renderizar
  if (!event || !event.active || !isSeasonalActive) {
    return null;
  }

  return <ManagedSeasonalEventSection locale={locale} event={event} masks={masks} printables={printables} />;
};
