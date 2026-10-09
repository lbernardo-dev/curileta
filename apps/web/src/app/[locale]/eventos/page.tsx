import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Clock, Sparkles, ArrowLeft, ArrowRight, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agenda de Eventos y Firmas — Las Aventuras de Curileta',
  description:
    'Próximas firmas de libros, talleres infantiles de narración, visitas a colegios y presentaciones oficiales de Curileta.',
};

const UPCOMING_EVENTS = [
  {
    id: 'feria-del-libro-madrid-2026',
    title: 'Feria del Libro de Madrid — Encuentro y Firma Oficial',
    category: 'Firma de Libros',
    date: '30 de Mayo, 2026',
    time: '11:30 - 13:30',
    location: 'Parque del Retiro, Madrid (Caseta Curileta Publishing)',
    city: 'Madrid, España',
    description: 'Sesión de firmas de ejemplares de «El Misterio del Quetzal Dorado», entrega de pasaportes de explorador y fotos con el mapa gigante.',
    status: 'Confirmado',
  },
  {
    id: 'taller-narrativa-barcelona',
    title: 'Taller de Cartografía Mágica para Pequeños Exploradores',
    category: 'Taller Infantil & Cuentacuentos',
    date: '14 de Junio, 2026',
    time: '17:00 - 18:30',
    location: 'Biblioteca Jaume Fuster, Barcelona',
    city: 'Barcelona, España',
    description: 'Actividad interactiva para niños de 5 a 10 años donde aprenderán a dibujar mapas imaginarios y crear sus propios animales compañeros.',
    status: 'Inscripción Gratuita',
  },
  {
    id: 'visita-colegios-valencia',
    title: 'Semana de la Lectura Escolar en Centros Educativos',
    category: 'Visita Escolar',
    date: '22 de Junio, 2026',
    time: 'Jornada escolar',
    location: 'Centros escolares adscritos',
    city: 'Valencia, España',
    description: 'Encuentros didácticos en aulas de primaria fomentando la curiosidad geográfica y los valores de respeto medioambiental.',
    status: 'Solo para Centros Concertados',
  },
];

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Agenda Oficial de Encuentros</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Próximos Eventos y Firmas
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Acompáñanos en presentaciones en vivo, ferias del libro y talleres donde la magia de Curileta salta de las páginas a la realidad.
          </p>
        </div>

        {/* Events Grid */}
        <div className="space-y-6">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                    {event.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                    {event.status}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white">{event.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link
                  href={`/${locale}/contacto`}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
                >
                  <span>Solicitar asistencia o charla escolar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
