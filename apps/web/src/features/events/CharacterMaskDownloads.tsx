'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Locale } from '@curileta/i18n';
import type { CharacterMask } from '@/lib/character-masks.server';
import { Download, Printer } from 'lucide-react';

export function CharacterMaskDownloads({ masks, locale }: { masks: CharacterMask[]; locale: Locale }) {
  const isEn = locale === 'en';
  const [selectedSlug, setSelectedSlug] = useState(masks[0]?.slug || '');
  const selected = masks.find((mask) => mask.slug === selectedSlug) || masks[0];

  if (!masks.length) {
    return <p className="mt-5 rounded-lg bg-[var(--background-secondary)] p-4 text-sm text-[var(--text-secondary)]">
      {isEn ? 'Printable masks will appear here when the team publishes them.' : 'Las máscaras aparecerán aquí cuando el equipo las publique.'}
    </p>;
  }

  return <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-secondary)] p-4 sm:p-5">
    <label htmlFor="character-mask-choice" className="block text-sm font-semibold">{isEn ? 'Choose a character' : 'Elige un personaje'}</label>
    <select
      id="character-mask-choice"
      value={selected.slug}
      onChange={(event) => setSelectedSlug(event.target.value)}
      className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background-canvas)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--seasonal-accent)]"
    >
      {masks.map((mask) => <option key={mask.id} value={mask.slug}>{mask.title[locale] || mask.title.es}</option>)}
    </select>

    <div className="mt-4 grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-lg bg-[var(--background-canvas)] p-3">
        <Image
          src={selected.previewImageUrl}
          alt={selected.title[locale] || selected.title.es}
          width={480}
          height={380}
          sizes="(max-width: 640px) 90vw, 400px"
          loading="lazy"
          className="max-h-64 w-full object-contain"
        />
      </div>
      <div className="sm:max-w-56">
        <h5 className="text-base font-semibold">{selected.title[locale] || selected.title.es}</h5>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{selected.description[locale] || selected.description.es}</p>
        <a
          href={`/api/masks/${encodeURIComponent(selected.slug)}/download?locale=${locale}`}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--seasonal-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--seasonal-accent)]"
        >
          <Download className="h-4 w-4" />{isEn ? 'Download mask PDF' : 'Descargar máscara en PDF'}
        </a>
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[var(--text-secondary)]"><Printer className="mt-0.5 h-3.5 w-3.5 shrink-0" />{isEn ? 'Print at actual size, then cut out the shape and eye guides.' : 'Imprime a tamaño real y recorta la silueta y las guías de los ojos.'}</p>
      </div>
    </div>
  </div>;
}
