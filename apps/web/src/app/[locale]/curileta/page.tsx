import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Compass, Sparkles, Heart, MapPin, BookOpen, Youtube, ArrowLeft } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Conoce a Curileta — El Alma de la Aventura',
    description:
      'Descubre la historia, personalidad, valores y pasiones de Curileta, la exploradora que viaja por el mundo contagiando curiosidad.',
  };
}

export default async function CuriletaBioPage({
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        {/* Hero Character Card */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Visual Portrait */}
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-emerald-300 p-1 shadow-2xl shrink-0">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <Compass className="w-24 h-24 text-emerald-400 animate-spin" style={{ animationDuration: '20s' }} />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 mt-3">
                  Curileta
                </span>
              </div>
            </div>

            {/* Core Info */}
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exploradora Oficial</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                Curileta
              </h1>
              <p className="text-lg sm:text-xl text-amber-300 font-bold italic">
                «El mundo es un libro abierto esperando ser leído con el corazón.»
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Nacida en el corazón del Bosque Encantado, Curileta no concibe un día sin una pregunta nueva. Su mochila guarda un cuaderno de notas, su mapa que cambia con el viento y una brújula que no apunta al norte, sino a los amigos que necesitan una sonrisa.
              </p>
            </div>
          </div>
        </div>

        {/* Bio Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h2 className="text-lg font-black text-amber-400">Personalidad</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Curiosa, optimista infatigable, empática y valiente ante lo desconocido. Donde otros ven un obstáculo, ella ve el comienzo de un acertijo.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h2 className="text-lg font-black text-emerald-400">Lo que le encanta</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Descubrir palabras en lenguas lejanas, el olor a bosque mojado, probar recetas exóticas y dibujar constelaciones bajo las estrellas.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h2 className="text-lg font-black text-sky-400">Valores Clave</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Respeto por la naturaleza, celebración de la diversidad cultural, bondad activa y escucha atenta.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/libros`}
            className="px-6 py-3 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-2 shadow-lg"
          >
            <BookOpen className="w-4 h-4 text-emerald-950" />
            <span>Leer sus libros</span>
          </Link>
          <Link
            href={`/${locale}/personajes`}
            className="px-6 py-3 rounded-full font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2"
          >
            <span>Conocer a sus compañeros de viaje</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
