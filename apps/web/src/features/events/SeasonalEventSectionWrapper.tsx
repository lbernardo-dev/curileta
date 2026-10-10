'use client';

import React from 'react';
import { Locale } from '@curileta/i18n';
import { SeasonalEvent } from '@curileta/cms';
import { useSeasonalTheme } from '@/providers/SeasonalThemeProvider';
import { HalloweenEventSection } from './HalloweenEventSection';
import { AdventureTrailConnector } from '@curileta/motion';

export const SeasonalEventSectionWrapper: React.FC<{
  locale: Locale;
  event: SeasonalEvent | null;
}> = ({ locale, event }) => {
  const { isSeasonalActive } = useSeasonalTheme();

  // Si el evento estacional no existe o el usuario desactivó el tema, no renderiza nada
  if (!event || !event.active || !isSeasonalActive) {
    return null;
  }

  return (
    <>
      <AdventureTrailConnector
        stepNumber={1}
        destinationTitle={{
          es: 'Desvío Estacional: El Huerto Encantado 🎃',
          en: 'Seasonal Detour: The Enchanted Orchard 🎃',
        }}
        coordinatesText="Bosque de Calabazas • Tiempo Limitado"
        distanceText={{ es: '+3 Leguas Mágicas', en: '+3 Magical Leagues' }}
        targetId="#evento-halloween"
        curveVariant="zigzag"
        isHalloweenSpecial={true}
        locale={locale}
      />
      <HalloweenEventSection locale={locale} event={event} />
    </>
  );
};

export const GlobeTrailConnector: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { isSeasonalActive } = useSeasonalTheme();
  // Si Halloween está activo es el paso 2, si está desactivado es el paso 1 directo
  const stepNumber = isSeasonalActive ? 2 : 1;

  return (
    <AdventureTrailConnector
      stepNumber={stepNumber}
      destinationTitle={{
        es: 'Rumbo al Globo Aerostático 3D',
        en: 'Towards 3D Hot Air Balloon',
      }}
      coordinatesText="Alt. 3.200m • Cartografía de 40 Culturas"
      distanceText={{ es: '+12 Leguas Aéreas', en: '+12 Aerial Leagues' }}
      targetId="#escena-mapa"
      curveVariant="left-to-center"
      locale={locale}
    />
  );
};
