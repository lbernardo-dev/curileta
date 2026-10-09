import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Globe3DScene } from '@/features/home/Globe3DScene';
import { cmsProvider } from '@curileta/cms';
import { Globe, MapPin, Compass, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    return {
      title: 'World of Curileta — 3D Pixar Interactive Globe & Atlas',
      description: 'Explore the 3D Pixar animated globe of Curileta: oceans, continents, 3D monuments, and real book expedition milestones.',
    };
  }
  return {
    title: 'El Mundo de Curileta — Globo 3D Pixar & Atlas Interactivo',
    description: 'Explora el globo terráqueo 3D estilo Pixar con océanos ilustrados, continentes vibrantes y monumentos 3D de Las Aventuras de Curileta.',
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

  const [locations, milestones] = await Promise.all([
    cmsProvider.getLocations(locale as Locale),
    cmsProvider.getNarrativeMilestones(locale as Locale),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 3D Pixar Globe Experience */}
      <Globe3DScene
        locale={locale as Locale}
        locations={locations}
        milestones={milestones}
      />

      {/* Extended Destination Directory & Expedition Log */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Itinerario Completo del Libro Original</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Todos los Destinos de la Expedición
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Los 11 hitos cronológicos documentados en las cartas de Curileta, desde el Bosque Encantado en España hasta el reencuentro final.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc, idx) => (
              <div
                key={loc.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Etapa {idx + 1} de {locations.length}
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
                        Dato Curioso del Libro:
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
                    href={`#escena-mapa`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Ver en Globo 3D</span>
                    <span>↑</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400">
              * Nota canónica: Pompón permanece en el Bosque Encantado custodiando el hogar mientras Curileta recorre el mundo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

