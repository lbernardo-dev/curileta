import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { HeroScene } from '@/features/home/HeroScene';
import { MapScene } from '@/features/home/MapScene';
import { FriendsScene } from '@/features/home/FriendsScene';
import { BooksScene } from '@/features/home/BooksScene';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { GrowingUniverseScene } from '@/features/home/GrowingUniverseScene';
import { CollaborationsScene } from '@/features/home/CollaborationsScene';
import { ClosingScene } from '@/features/home/ClosingScene';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (locale === 'en') {
    return {
      title: 'Curileta Official Website — A Continuous Adventure',
      description:
        'Explore the world of Curileta: books, animated episodes, songs, and friendly companions on an educational and inspiring journey.',
      alternates: {
        canonical: 'https://curileta.com/en',
        languages: {
          'es-ES': 'https://curileta.com/es',
          'en-US': 'https://curileta.com/en',
        },
      },
    };
  }

  return {
    title: 'Las Aventuras de Curileta — Web Oficial',
    description:
      'Descubre el universo de Curileta: libros, episodios animados, canciones y amigos en un viaje educativo e inspirador por el mundo.',
    alternates: {
      canonical: 'https://curileta.com/es',
      languages: {
        'es-ES': 'https://curileta.com/es',
        'en-US': 'https://curileta.com/en',
      },
    },
  };
}

export default async function HomePage({
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
    <article className="flex flex-col w-full relative">
      {/* Escena 01 — Hero: Bosque Encantado y Curileta */}
      <HeroScene locale={locale as Locale} />

      {/* Escena 02 y 03 — El Mapa cobra vida y los Lugares se convierten en aventuras */}
      <MapScene locale={locale as Locale} />

      {/* Escena 04 — Los Amigos: Pompón, Quetzal, Lulú */}
      <FriendsScene locale={locale as Locale} />

      {/* Escena 05 — Los Libros */}
      <BooksScene locale={locale as Locale} />

      {/* Escena 06 y 07 — YouTube y Canciones */}
      <YouTubeScene locale={locale as Locale} />

      {/* Escena 08 — El Universo sigue creciendo */}
      <GrowingUniverseScene locale={locale as Locale} />

      {/* Escena 09 — Colaboraciones y Licensing B2B */}
      <CollaborationsScene locale={locale as Locale} />

      {/* Escena 10 — Cierre del círculo narrativo */}
      <ClosingScene locale={locale as Locale} />
    </article>
  );
}
