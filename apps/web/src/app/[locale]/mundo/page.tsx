import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Globe3DScene } from '@/features/home/Globe3DScene';
import { AdventureRadar } from '@/features/home/AdventureRadar';
import { cmsProvider } from '@/lib/cms';
import { CheckCircle2, Sparkles } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    return {
      title: 'The World of Curileta — Interactive Atlas',
      description: 'Explore the places and story moments in Curileta’s illustrated journey around the world.',
    };
  }
  return {
    title: 'El mundo de Curileta — Atlas interactivo',
    description: 'Explora los lugares y momentos del viaje ilustrado de Curileta por el mundo.',
  };
}

export default async function WorldExplorerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const [locations, milestones, books] = await Promise.all([
    cmsProvider.getLocations(locale as Locale),
    cmsProvider.getNarrativeMilestones(locale as Locale),
    cmsProvider.getBooks(locale as Locale),
  ]);
  const isEn = locale === 'en';
  const storyRoute = books.find((book) => book.slug === 'las-aventuras-de-curileta')?.locations || [];
  const routeIndex = (location: (typeof locations)[number]) => {
    const index = storyRoute.findIndex((id) => id === location.id || id === location.slug);
    return index < 0 ? storyRoute.length : index;
  };
  const orderedLocations = locations.slice().sort((a, b) => routeIndex(a) - routeIndex(b));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Interactive illustrated globe */}
      <Globe3DScene
        locale={locale as Locale}
        locations={orderedLocations}
        milestones={milestones}
      />

      <AdventureRadar
        locale={locale as Locale}
        locations={orderedLocations}
        milestones={milestones}
      />

      {/* Extended Destination Directory & Expedition Log */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'The story itinerary' : 'El itinerario del relato'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {isEn ? 'Places along the journey' : 'Lugares del viaje'}
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              {isEn
                ? `${orderedLocations.length} destinations and ${milestones.length} story moments from the Enchanted Forest and across the map.`
                : `${orderedLocations.length} destinos y ${milestones.length} momentos del relato, desde el Bosque Encantado hasta el reencuentro final.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedLocations.map((loc, idx) => (
              <div
                key={loc.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      {isEn ? `Stop ${idx + 1} of ${orderedLocations.length}` : `Parada ${idx + 1} de ${orderedLocations.length}`}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {loc.passportStamp?.code || `CURI-0${idx + 1}`}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {loc.name[locale as Locale] || loc.name.es}
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {loc.country[locale as Locale] || loc.country.es}
                  </p>

                  <p className="text-sm text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                    {loc.description[locale as Locale] || loc.description.es}
                  </p>

                  {loc.curiosities && loc.curiosities.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        {isEn ? 'A little discovery:' : 'Una pequeña curiosidad:'}
                      </span>
                      <p className="text-xs text-slate-300 italic">
                        «{loc.curiosities[0][locale as Locale] || loc.curiosities[0].es}»
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {loc.coordinates.lat.toFixed(2)}°, {loc.coordinates.lng.toFixed(2)}°
                  </span>
                  <a
                    href="#escena-mapa"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>{isEn ? 'See on the globe' : 'Ver en el globo'}</span>
                    <span>↑</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400">
              {isEn
                ? 'Curileta’s letters keep her friends connected to every place along the journey.'
                : 'Las cartas de Curileta mantienen cerca a sus amigos en cada etapa del viaje.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

