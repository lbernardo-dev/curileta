import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@curileta/cms';
import { Sparkles, ArrowLeft, Heart, Compass, BookOpen, MapPin, Smile, Feather } from 'lucide-react';

export async function generateStaticParams() {
  const characters = await cmsProvider.getCharacters('es');
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const char of characters) {
      params.push({ locale, slug: char.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const character = await cmsProvider.getCharacterBySlug(slug, locale);

  if (!character) {
    return { title: 'Personaje no encontrado' };
  }

  const desc = character.shortDescription[locale] || character.shortDescription.es;
  return {
    title: `${character.name} — Las Aventuras de Curileta`,
    description: desc,
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const character = await cmsProvider.getCharacterBySlug(slug, locale);

  if (!character) {
    notFound();
  }

  const bio = character.biography?.[locale] || character.biography?.es;
  const shortDesc = character.shortDescription[locale] || character.shortDescription.es;

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/personajes`}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo de personajes</span>
        </Link>

        {/* Character Card Hero */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Image Portrait */}
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shrink-0 shadow-2xl border-2 border-emerald-500/40 relative group">
              <img
                src={character.mainImage.url}
                alt={character.mainImage.alt[locale] || character.mainImage.alt.es}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Info */}
            <div className="space-y-4 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-900/40">
                {character.species}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                {character.name}
              </h1>
              <p className="text-base sm:text-lg text-emerald-200/90 font-medium leading-relaxed">
                {shortDesc}
              </p>

              {/* Tags */}
              {character.personality && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {character.personality.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      ✨ {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Biography Breakdown */}
        {bio && (
          <div className="mt-10 rounded-3xl bg-slate-900/70 border border-slate-800 p-8 sm:p-10 space-y-4">
            <h2 className="text-2xl font-black text-white">Historia en el Universo</h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Values */}
        {character.values && (
          <div className="mt-8 rounded-3xl bg-slate-900/70 border border-slate-800 p-8 sm:p-10">
            <h2 className="text-xl font-black text-white mb-4">Valores que inspira</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {character.values.map((v) => (
                <div key={v} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-sm font-bold text-amber-400">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/libros`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-950" />
            <span>Descubrir los libros donde aparece {character.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
