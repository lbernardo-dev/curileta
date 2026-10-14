'use client';

import { useState } from 'react';
import type { Locale } from '@curileta/i18n';
import type { NarrativeMilestone } from '@curileta/cms';
import { ArrowLeft, ArrowRight, Backpack, Download, FileText, LockKeyholeOpen, MapPin } from 'lucide-react';

function localized(value: { es: string; en?: string }, locale: Locale) {
  return value[locale] || value.es;
}

export function CuriletaFieldJournal({
  locale,
  milestones,
  backpackItems,
  maskHref,
}: {
  locale: Locale;
  milestones: NarrativeMilestone[];
  backpackItems: Array<{ es: string; en?: string }>;
  maskHref: string;
}) {
  const isEn = locale === 'en';
  const [activeMoment, setActiveMoment] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [packedItems, setPackedItems] = useState<number[]>([]);
  const moment = milestones[activeMoment];
  const visibleItems = backpackItems.slice(0, 5);
  const packTarget = Math.min(3, visibleItems.length);

  function moveMoment(direction: -1 | 1) {
    setActiveMoment((current) => Math.min(Math.max(current + direction, 0), milestones.length - 1));
    setIsRevealed(false);
  }

  function togglePackedItem(index: number) {
    setPackedItems((current) => {
      if (current.includes(index)) return current.filter((item) => item !== index);
      if (current.length >= packTarget) return current;
      return [...current, index];
    });
  }

  return (
    <section id="cuaderno" className="scroll-mt-28 rounded-3xl border border-emerald-900/30 bg-[#f2ead6] p-5 text-slate-950 shadow-xl dark:border-emerald-900 dark:bg-[#181818] dark:text-white sm:p-8" aria-labelledby="field-journal-title">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:border-emerald-700 dark:bg-[#1f1f1f] dark:text-emerald-200">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {isEn ? 'A little field work' : 'Un poco de trabajo de campo'}
        </span>
        <h2 id="field-journal-title" className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {isEn ? 'Open the explorer’s notebook' : 'Abre el cuaderno de exploradora'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
          {isEn
            ? 'Reveal a moment from the journey, choose what Curileta should pack and print a mask for an afternoon of make believe.'
            : 'Descubre un momento del viaje, elige qué llevaría Curileta y prepara su máscara para jugar a imaginar.'}
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {moment && (
          <article className="flex min-h-full flex-col rounded-2xl border border-[#c6b78f] bg-[#fffaf0] p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="sealed-moment-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                  {isEn ? `Sealed note ${String(activeMoment + 1).padStart(2, '0')}` : `Nota sellada ${String(activeMoment + 1).padStart(2, '0')}`}
                  {milestones.length > 0 && ` / ${String(milestones.length).padStart(2, '0')}`}
                </p>
                <h3 id="sealed-moment-title" className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                  {localized(moment.place, locale)}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                  {localized(moment.country, locale)}
                </p>
              </div>
              <span className="rounded-full border border-amber-800/30 px-3 py-1 font-mono text-xs font-semibold text-amber-900 dark:border-amber-300/30 dark:text-amber-200">
                CUR · {String(moment.order).padStart(2, '0')}
              </span>
            </div>

            <div id="sealed-moment-content" className="my-5 min-h-32 flex-1 rounded-xl border border-dashed border-[#c6b78f] bg-white/70 p-4 dark:border-[#444] dark:bg-[#181818]">
              {isRevealed ? (
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{localized(moment.whatHappens, locale)}</p>
              ) : (
                <div className="flex h-full min-h-24 flex-col items-center justify-center text-center">
                  <span className="text-3xl" aria-hidden="true">✉️</span>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {isEn ? 'What happened at this stop? Open the note and read Curileta’s travel log.' : '¿Qué ocurrió en esta parada? Abre la nota y lee la bitácora de Curileta.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => moveMoment(-1)} disabled={activeMoment === 0} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:border-[#444] dark:text-white dark:hover:bg-[#272727]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />{isEn ? 'Previous note' : 'Nota anterior'}
              </button>
              <button type="button" onClick={() => setIsRevealed((value) => !value)} aria-expanded={isRevealed} aria-controls="sealed-moment-content" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                <LockKeyholeOpen className="h-4 w-4" aria-hidden="true" />
                {isEn ? (isRevealed ? 'Seal the note' : 'Declassify the note') : (isRevealed ? 'Volver a sellar' : 'Desclasificar nota')}
              </button>
              <button type="button" onClick={() => moveMoment(1)} disabled={activeMoment >= milestones.length - 1} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:border-[#444] dark:text-white dark:hover:bg-[#272727]">
                {isEn ? 'Next note' : 'Nota siguiente'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        )}

        <article className="flex min-h-full flex-col rounded-2xl border border-emerald-900/20 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6" aria-labelledby="backpack-activity-title">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"><Backpack className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <h3 id="backpack-activity-title" className="text-xl font-bold text-slate-950 dark:text-white">{isEn ? 'Pack for the next stop' : 'Prepara la mochila'}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {isEn ? `Choose ${packTarget} things from Curileta’s real travel kit.` : `Elige ${packTarget} objetos de la mochila de viaje de Curileta.`}
              </p>
            </div>
          </div>

          <div className="mt-5 grid flex-1 content-start gap-2">
            {visibleItems.map((item, index) => {
              const selected = packedItems.includes(index);
              const atLimit = packedItems.length === packTarget && !selected;
              return (
                <button key={`${index}-${item.es}`} type="button" onClick={() => togglePackedItem(index)} disabled={atLimit} aria-pressed={selected} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${selected ? 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white dark:border-[#313131] dark:bg-[#181818] dark:text-slate-200 dark:hover:bg-[#272727]'}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${selected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-400 dark:border-slate-500'}`} aria-hidden="true">{selected ? '✓' : ''}</span>
                  <span>{localized(item, locale)}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 min-h-10 text-sm font-semibold text-emerald-900 dark:text-emerald-200" aria-live="polite" role="status">
            {packTarget > 0 && packedItems.length === packTarget
              ? (isEn ? 'Ready to go. The next stop is waiting.' : 'Mochila lista. La próxima parada espera.')
              : (isEn ? `${packedItems.length} of ${packTarget} items chosen` : `${packedItems.length} de ${packTarget} objetos elegidos`)}
          </p>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            {isEn ? 'Your choices stay in this page and are not saved.' : 'Tu selección solo vive en esta página y no se guarda.'}
          </p>
        </article>
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-amber-800/20 bg-amber-50 p-5 dark:border-amber-700/30 dark:bg-[#272727] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-950 dark:bg-amber-950 dark:text-amber-200"><span aria-hidden="true">🎨</span></span>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white">{isEn ? 'Make a Curileta mask' : 'Crea una máscara de Curileta'}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{isEn ? 'Print the approved design, cut it out and invent another expedition.' : 'Imprime el diseño aprobado, recórtalo e inventa otra expedición.'}</p>
          </div>
        </div>
        <a href={maskHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-amber-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">
          <Download className="h-4 w-4" aria-hidden="true" />{isEn ? 'Download printable mask' : 'Descargar máscara imprimible'}
        </a>
      </div>
    </section>
  );
}
