import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowRight, Compass, Smile, Feather, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Personajes y Amigos — Universo de Curileta',
  description: 'Conoce a todos los entrañables amigos y criaturas que acompañan a Curileta en sus expediciones por el planeta.',
};

const CHARACTERS = [
  {
    id: 'curileta',
    name: 'Curileta',
    species: 'Aventurera Principal',
    description: 'Valiente, bondadosa y eternamente curiosa. Lleva siempre su mapa y su brújula mágica.',
    quote: '«¡El mundo es demasiado asombroso para quedarse quieto!»',
    color: 'from-emerald-500 to-green-600',
    icon: <Compass className="w-8 h-8 text-white" />,
  },
  {
    id: 'pompon',
    name: 'Pompón',
    species: 'Conejo del Bosque Encantado',
    description: 'El fiel compañero prudente. Cuida las provisiones y tiene un corazón gigantesco.',
    quote: '«Revisemos la mochila dos veces... ¡por si acaso hay zanahorias!»',
    color: 'from-amber-400 to-orange-500',
    icon: <Smile className="w-8 h-8 text-white" />,
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    species: 'Ave Sagrada de Mesoamérica',
    description: 'El sabio vigía de los vientos tropicales. Conoce los secretos de las selvas y templos.',
    quote: '«Desde las alturas, todas las fronteras son sólo ríos y valles.»',
    color: 'from-teal-400 to-emerald-600',
    icon: <Feather className="w-8 h-8 text-white" />,
  },
  {
    id: 'lulu',
    name: 'Lulú',
    species: 'Nutria Marina de las Costas',
    description: 'La experta en corrientes marinas, risas y saltos de ola. Siempre dispuesta a jugar.',
    quote: '«¡Sigue el ritmo de las olas y siempre llegarás a buen puerto!»',
    color: 'from-sky-400 to-blue-600',
    icon: <Heart className="w-8 h-8 text-white" />,
  },
];

export default async function CharactersPage({
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Galería Oficial de Personajes</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Amigos de todo el planeta
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Cada viaje trae nuevas amistades y aprendizajes. Descubre a los compañeros inseparables de Curileta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-2xl transition-all group"
            >
              <div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${char.color} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg`}>
                  {char.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-900/40 px-2.5 py-1 rounded-full">
                  {char.species}
                </span>
                <h2 className="text-2xl font-black text-white mt-3 mb-2">{char.name}</h2>
                <p className="text-xs text-slate-400 italic mb-4">«{char.quote}»</p>
                <p className="text-sm text-slate-300 leading-relaxed">{char.description}</p>
              </div>

              <div className="pt-6">
                <Link
                  href={char.id === 'curileta' ? `/${locale}/curileta` : `/${locale}/personajes`}
                  className="inline-flex items-center gap-2 text-xs font-black text-amber-400 group-hover:text-amber-300 uppercase tracking-wider"
                >
                  <span>Conocer su historia</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
