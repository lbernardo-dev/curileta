'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Location, NarrativeMilestone } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';

const Globe3DScene = dynamic(
  () => import('@/features/home/Globe3DScene').then((mod) => mod.Globe3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[500px] w-full items-center justify-center bg-[#102925] text-white/50">
        <p className="animate-pulse text-sm font-medium tracking-wide">Cargando atlas interactivo...</p>
      </div>
    ),
  }
);

export function Globe3DSceneDynamic(props: {
  locale: Locale;
  locations?: Location[];
  milestones?: NarrativeMilestone[];
}) {
  return <Globe3DScene {...props} />;
}
