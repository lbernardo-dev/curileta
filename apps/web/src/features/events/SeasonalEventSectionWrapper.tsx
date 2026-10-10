'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import { HalloweenEventSection } from './HalloweenEventSection';

export const SeasonalEventSectionWrapper: React.FC<{
  locale: Locale;
  event: SeasonalEvent | null;
}> = ({ locale, event }) => {
  // El contenido editorial es específico de Halloween. Las demás campañas usan
  // su propio tema global cuando se publiquen, sin heredar esta sección por error.
  if (!event || !event.active || event.themeKey !== 'halloween') {
    return null;
  }

  return <HalloweenEventSection locale={locale} event={event} />;
};
