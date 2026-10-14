import type { Locale } from '@curileta/i18n';
import type { EventPrintable } from '@/lib/event-printables.server';
import { Download, FileText } from 'lucide-react';

export function EventPrintableDownloads({ resources, locale }: { resources: EventPrintable[]; locale: Locale }) {
  const coloringPages = resources.filter((resource) => resource.resourceType === 'coloring');
  const otherPrintables = resources.filter((resource) => resource.resourceType === 'printable');
  const isEn = locale === 'en';

  return <section aria-labelledby="event-printables-title" className="mt-8 rounded-xl border border-(--border-subtle) bg-(--background-secondary) p-5 sm:p-6">
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--seasonal-surface-light) text-(--seasonal-accent-strong) dark:bg-(--seasonal-surface-dark)" aria-hidden="true"><FileText className="h-5 w-5" /></span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-(--seasonal-accent-strong)">{isEn ? 'Print and play' : 'Imprime y juega'}</p>
        <h3 id="event-printables-title" className="mt-1 text-xl font-semibold">{isEn ? 'Downloads for this season' : 'Descargas de esta temporada'}</h3>
      </div>
    </div>

    {coloringPages.length === 0
      ? <div className="mt-5 rounded-lg border border-dashed border-(--border-subtle) bg-(--background-canvas) p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold">{isEn ? 'Coloring pages' : 'Láminas para colorear'}</h4>
          <span className="rounded-full bg-(--seasonal-surface-light) px-3 py-1 text-xs font-semibold text-(--seasonal-accent-strong) dark:bg-(--seasonal-surface-dark)">{isEn ? 'Coming soon' : 'Próximamente'}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{isEn ? 'We are preparing printable pages to color together.' : 'Estamos preparando láminas imprimibles para colorear en familia.'}</p>
      </div>
      : <PrintableGroup title={isEn ? 'Coloring pages' : 'Láminas para colorear'} resources={coloringPages} locale={locale} />}

    {otherPrintables.length > 0 && <PrintableGroup title={isEn ? 'More printables' : 'Otros materiales imprimibles'} resources={otherPrintables} locale={locale} />}
  </section>;
}

function PrintableGroup({ title, resources, locale }: { title: string; resources: EventPrintable[]; locale: Locale }) {
  return <div className="mt-5">
    <h4 className="font-semibold">{title}</h4>
    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
      {resources.map((resource) => <li key={resource.id} className="flex flex-col rounded-lg border border-(--border-subtle) bg-(--background-canvas) p-4">
        <h5 className="font-semibold">{resource.title[locale] || resource.title.es}</h5>
        {resource.description[locale] && <p className="mt-2 flex-1 text-sm leading-6 text-(--text-secondary)">{resource.description[locale]}</p>}
        <a href={`/api/event-printables/${encodeURIComponent(resource.slug)}/download?locale=${locale}`} className="mt-4 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-(--seasonal-accent-strong) px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-fluid hover:brightness-110 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--seasonal-accent)">
          <Download className="h-4 w-4" />{locale === 'en' ? 'Download PDF' : 'Descargar PDF'}
        </a>
      </li>)}
    </ul>
  </div>;
}
