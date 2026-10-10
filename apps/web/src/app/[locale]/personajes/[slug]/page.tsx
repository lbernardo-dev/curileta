import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, Locale, isValidLocale } from '@curileta/i18n';
import { cmsProvider } from '@curileta/cms';
import { getCharacterImageAspectRatio } from '@/lib/character-image';
import { CharacterAvatarImage } from '@/components/CharacterAvatarImage';
import {
  Sparkles,
  ArrowLeft,
  Compass,
  BookOpen,
  Briefcase,
  Lightbulb,
  Shield,
  Zap,
  MapPin,
  Share2,
  ChevronRight,
  Award,
  Download,
} from 'lucide-react';

export async function generateStaticParams() {
  const characters = await cmsProvider.getCharacters('es');
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const char of characters) {
      params.push({ locale, slug: char.slug });
    }
    params.push({ locale, slug: 'joey-canguro' });
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
    title: `${character.name} — Pasaporte Oficial de Explorador`,
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
  const roleText = character.passportRole
    ? character.passportRole[locale] || character.passportRole.es
    : character.species;

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen relative overflow-hidden">
      {/* Resplandor ambiental */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/${locale}/personajes`}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Galería de Personajes</span>
          </Link>

        </div>

        {/* Ficha Principal de Pasaporte de Explorador */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-emerald-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Marca de agua */}
          <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none font-black text-9xl text-amber-400 select-none">
            {character.id.toUpperCase()}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12">
            {/* Retrato 3D con halo */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-56 sm:w-64 rounded-3xl overflow-hidden shadow-2xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-sky-400 relative group" style={{ aspectRatio: getCharacterImageAspectRatio(character.mainImage.url, character.mainImage.aspectRatio) }}>
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950">
                  <img
                    src={character.mainImage.url}
                    alt={character.mainImage.alt[locale] || character.mainImage.alt.es}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <a
                href={character.mainImage.url}
                download={`Curileta_Personaje_${character.slug}_3D.webp`}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Descargar Render 3D</span>
              </a>
            </div>

            {/* Datos del Pasaporte */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 shadow-md">
                  ★ PASAPORTE OFICIAL
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  {character.species}
                </span>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  {character.name}
                </h1>
                <p className="text-sm sm:text-base font-extrabold text-emerald-400 mt-1 uppercase tracking-wide">
                  {roleText}
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                {shortDesc}
              </p>

              {/* Nota canónica si es Pompón o Joey */}
              {character.id === 'pompon' && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                  <strong>Nota Canónica:</strong> Pompón permanece siempre en el Bosque Encantado custodiando el árbol más alto y el buzón postal. No viaja físicamente con Curileta, pero la acompaña en cada carta y recuerdo.
                </div>
              )}

              {character.id === 'joey' && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed">
                  <strong>Familia del Outback:</strong> Mamá Canguro y Bebé Canguro son dos personajes distintos. Joey es el koala de peluche de Bebé Canguro, rescatado por Curileta en Uluru.
                </div>
              )}

              {/* Rasgos de Personalidad */}
              {character.personality && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2">
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

        {/* Cita Célebre de Expedición */}
        {character.voiceQuote && (
          <div className="mt-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 sm:p-8 flex items-start gap-4 text-amber-200">
            <CharacterAvatarImage
              slug={character.slug}
              name={character.name}
              size={56}
              alt={locale === 'en' ? `${character.name} portrait` : `Retrato de ${character.name}`}
            />
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400 block mb-1">
                Voz & Lema de Expedición:
              </span>
              <p className="text-lg sm:text-xl font-bold leading-snug">
                {character.voiceQuote[locale] || character.voiceQuote.es}
              </p>
            </div>
          </div>
        )}

        {/* Estadísticas de Explorador en 4 Dimensiones */}
        {character.explorerStats && (
          <div className="mt-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-xl">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Habilidades de Expedición</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Curiosidad */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-amber-400 uppercase">Curiosidad</span>
                  <span className="text-white font-mono">{character.explorerStats.curiosity}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.curiosity}%` }}
                  />
                </div>
              </div>

              {/* Valentía */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-emerald-400 uppercase">Valentía</span>
                  <span className="text-white font-mono">{character.explorerStats.courage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.courage}%` }}
                  />
                </div>
              </div>

              {/* Agilidad */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-sky-400 uppercase">Agilidad</span>
                  <span className="text-white font-mono">{character.explorerStats.agility}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.agility}%` }}
                  />
                </div>
              </div>

              {/* Sabiduría */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-purple-400 uppercase">Sabiduría</span>
                  <span className="text-white font-mono">{character.explorerStats.wisdom}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${character.explorerStats.wisdom}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Biografía & Mochila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Historia Completa */}
          {bio && (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Historia en la Expedición</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Mochila de Expedición */}
          {character.backpackItems && character.backpackItems.length > 0 && (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>Mochila & Objetos Clave</span>
              </h2>
              <ul className="space-y-3">
                {character.backpackItems.map((item, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{item[locale] || item.es}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Secretos & Curiosidades */}
        {character.curiosityFacts && character.curiosityFacts.length > 0 && (
          <div className="mt-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-8">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Secretos & Datos Curiosos</span>
            </h2>
            <div className="space-y-3">
              {character.curiosityFacts.map((fact, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                  <span className="text-amber-400 font-bold text-base mt-0.5">✦</span>
                  <p>{fact[locale] || fact.es}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Valores */}
        {character.values && character.values.length > 0 && (
          <div className="mt-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-8">
            <h2 className="text-xl font-black text-white mb-4">Valores que transmite</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {character.values.map((v) => (
                <div key={v} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-emerald-400">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA relacionado con la historia */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <Link
            href={`/${locale}/libros`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-950" />
            <span>Descubrir libros con {character.name}</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
