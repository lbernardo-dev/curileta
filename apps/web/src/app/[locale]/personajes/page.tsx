import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { cmsProvider } from '@curileta/cms';
import { CharacterHubScene } from '@/features/home/CharacterHubScene';
import { Sparkles, ArrowRight, Compass, Download, Shield } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Characters and friends', description: 'Meet Curileta’s friends and explore their individual profiles.' }
    : { title: 'Personajes y amigos', description: 'Conoce a los amigos de Curileta y descubre sus fichas individuales.' };
}

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

  const characters = await cmsProvider.getCharacters(locale);
  const isEn = locale === 'en';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      {/* Cabecera de la sección */}
      <div className="pt-16 sm:pt-24 pb-8 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{isEn ? 'The explorers’ gathering (' + characters.length + ' characters)' : 'La gran alianza de exploradores (' + characters.length + ' personajes)'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {isEn ? 'Meet Curileta’s friends' : 'Conoce a los personajes'}
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          {isEn
            ? 'Every journey brings new friends and things to learn. Explore their profiles, discover what they carry and open their story pages.'
            : 'Cada travesía suma nuevas amistades y cosas que aprender. Explora sus fichas, descubre qué llevan en sus mochilas y abre sus historias.'}
        </p>

        {/* Acceso a los fondos de pantalla */}
        <div className="mt-6 flex justify-center">
          <Link
            href={`/${locale}/fondos`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors shadow-md"
          >
            <Download className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{isEn ? 'Explore wallpapers' : 'Ver fondos de pantalla'}</span>
          </Link>
        </div>
      </div>

      {/* Hub Interactivo 3D con filtrado y pasaporte */}
      <CharacterHubScene locale={locale as Locale} characters={characters} hideHeader={true} />

      {/* Directorio de enlaces directos a cada ficha individual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-12 border-t border-slate-200 dark:border-slate-900">
        <div className="flex items-center gap-2 mb-6">
          <Compass className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{isEn ? 'Character directory' : 'Directorio de personajes'}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/personajes/${c.slug}`}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block uppercase">
                  {c.id}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-amber-300 transition-colors block mt-0.5 leading-snug">
                  {c.name}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                <span>{isEn ? 'View profile' : 'Ver ficha'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
