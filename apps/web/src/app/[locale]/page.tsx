import React from 'react';
import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { HeroScene } from '@/features/home/HeroScene';
import { HalloweenEventSection } from '@/features/events/HalloweenEventSection';
import { Globe3DScene } from '@/features/home/Globe3DScene';
import { AdventureRadar } from '@/features/home/AdventureRadar';
import { LettersScene } from '@/features/home/LettersScene';
import { CharacterHubScene } from '@/features/home/CharacterHubScene';
import { BooksScene } from '@/features/home/BooksScene';
import { YouTubeScene } from '@/features/home/YouTubeScene';
import { WallpapersScene } from '@/features/wallpapers/WallpapersScene';
import { GrowingUniverseScene } from '@/features/home/GrowingUniverseScene';
import { CollaborationsScene } from '@/features/home/CollaborationsScene';
import { ClosingScene } from '@/features/home/ClosingScene';
import { ExpeditionTrail } from '@curileta/motion';
import { cmsProvider } from '@curileta/cms';

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

  // Carga de datos dinámicos gestionables desde Backend / CMS
  const [locations, characters, waypoints, milestones, videos, wallpapers, activeEvent] = await Promise.all([
    cmsProvider.getLocations(locale),
    cmsProvider.getCharacters(locale),
    cmsProvider.getTrailWaypoints(locale),
    cmsProvider.getNarrativeMilestones(locale),
    cmsProvider.getVideos(locale),
    cmsProvider.getWallpapers(locale),
    cmsProvider.getActiveEvent(locale),
  ]);

  return (
    <article className="flex flex-col w-full relative">
      {/* Hilo visual conductor: Trazado de avance de expedición con líneas discontinuas y viñetas */}
      <ExpeditionTrail waypoints={waypoints} locale={locale} />

      {/* Escena 01 — Hero: Bosque Encantado y Curileta */}
      <HeroScene locale={locale as Locale} />

      {/* Evento Estacional Activo: Especial de Halloween (Con cuenta regresiva y badges Próximamente) */}
      <HalloweenEventSection locale={locale as Locale} event={activeEvent} />

      {/* Escena 02 — Globo Terráqueo 3D Interactivo con Three.js */}
      <Globe3DScene locale={locale as Locale} locations={locations} milestones={milestones} />

      {/* Radar de Aventuras: Detección de localización del usuario y recomendaciones de proximidad */}
      <AdventureRadar locale={locale as Locale} locations={locations} milestones={milestones} />

      {/* Escena 02.5 — El Baúl Postal: Cartas a Pompón con Matasellos y Polaroids */}
      <LettersScene locale={locale as Locale} />

      {/* Escena 03 — El Espacio de los Personajes con Efecto 3D Tilt y Fichas de Explorador */}
      <CharacterHubScene locale={locale as Locale} characters={characters} />

      {/* Escena 04 — Los Libros */}
      <BooksScene locale={locale as Locale} />

      {/* Escena 05 — YouTube y Canciones */}
      <YouTubeScene locale={locale as Locale} videos={videos} />

      {/* Escena 05.5 — Galería de Fondos de Pantalla 2K para Móvil y Ordenador */}
      <WallpapersScene locale={locale as Locale} wallpapers={wallpapers} embedded />

      {/* Escena 06 — El Universo sigue creciendo */}
      <GrowingUniverseScene locale={locale as Locale} />

      {/* Escena 07 — Colaboraciones y Licensing B2B */}
      <CollaborationsScene locale={locale as Locale} />

      {/* Escena 08 — Cierre del círculo narrativo */}
      <ClosingScene locale={locale as Locale} />
    </article>
  );
}

