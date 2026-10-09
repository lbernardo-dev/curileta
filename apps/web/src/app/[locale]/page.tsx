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
import {
  ExpeditionTrail,
  AdventureTrailConnector,
  TreasureDestinationMark,
} from '@curileta/motion';
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

  // Carga de datos dinámicos gestionables desde Backend / CMS (Base de datos SQLite persistente)
  const [
    locations,
    characters,
    books,
    letters,
    waypoints,
    milestones,
    videos,
    wallpapers,
    activeEvent,
    universeRoadmap,
    collaborations,
    siteSettings,
  ] = await Promise.all([
    cmsProvider.getLocations(locale),
    cmsProvider.getCharacters(locale),
    cmsProvider.getBooks(locale),
    cmsProvider.getLetters(locale),
    cmsProvider.getTrailWaypoints(locale),
    cmsProvider.getNarrativeMilestones(locale),
    cmsProvider.getVideos(locale),
    cmsProvider.getWallpapers(locale),
    cmsProvider.getActiveEvent(locale),
    cmsProvider.getUniverseRoadmap(locale),
    cmsProvider.getCollaborations(locale),
    cmsProvider.getSiteSettings(locale),
  ]);

  return (
    <article className="flex flex-col w-full relative">
      {/* Ambientación cartográfica de fondo y Brújula HUD interactiva de expedición */}
      <ExpeditionTrail waypoints={waypoints} locale={locale} />

      {/* Escena 01 — Hero: Bosque Encantado y Curileta */}
      <HeroScene locale={locale as Locale} settings={siteSettings} />

      {/* Evento Estacional Activo: Especial de Halloween (Con conector dedicado si está activo) */}
      {activeEvent && (
        <>
          <AdventureTrailConnector
            stepNumber={1}
            destinationTitle={{
              es: 'Desvío Estacional: El Huerto Encantado 🎃',
              en: 'Seasonal Detour: The Enchanted Orchard 🎃',
            }}
            coordinatesText="Bosque de Calabazas • Tiempo Limitado"
            distanceText={{ es: '+3 Leguas Mágicas', en: '+3 Magical Leagues' }}
            targetId="#evento-halloween"
            curveVariant="zigzag"
            isHalloweenSpecial={true}
            locale={locale}
          />
          <HalloweenEventSection locale={locale as Locale} event={activeEvent} />
        </>
      )}

      {/* Conector Cartográfico 02: Rumbo al Globo Aerostático 3D */}
      <AdventureTrailConnector
        stepNumber={2}
        destinationTitle={{
          es: 'Rumbo al Globo Aerostático 3D',
          en: 'Towards 3D Hot Air Balloon',
        }}
        coordinatesText="Alt. 3.200m • Cartografía de 40 Culturas"
        distanceText={{ es: '+12 Leguas Aéreas', en: '+12 Aerial Leagues' }}
        targetId="#escena-mapa"
        curveVariant="left-to-center"
        locale={locale}
      />

      {/* Escena 02 — Globo Terráqueo 3D Interactivo con Three.js */}
      <Globe3DScene locale={locale as Locale} locations={locations} milestones={milestones} />

      {/* Conector Cartográfico 03: Rumbo al Radar GPS de Aventuras */}
      <AdventureTrailConnector
        stepNumber={3}
        destinationTitle={{
          es: 'Sintonizando el Radar GPS de Aventuras',
          en: 'Tuning GPS Adventure Radar',
        }}
        coordinatesText="Sonda Atmosférica • Detección Local"
        distanceText={{ es: '+8 Leguas Náuticas', en: '+8 Nautical Leagues' }}
        targetId="#radar-curileta"
        curveVariant="right-to-left"
        locale={locale}
      />

      {/* Radar de Aventuras: Detección de localización del usuario */}
      <AdventureRadar locale={locale as Locale} locations={locations} milestones={milestones} />

      {/* Conector Cartográfico 04: Rumbo al Baúl Postal de Pompón */}
      <AdventureTrailConnector
        stepNumber={4}
        destinationTitle={{
          es: 'Rumbo al Baúl Postal de Pompón',
          en: "Towards Pompón's Mail Chest",
        }}
        coordinatesText="Buzón del Bosque • Matasellos & Polaroids"
        distanceText={{ es: '+15 Leguas Terrestres', en: '+15 Overland Leagues' }}
        targetId="#escena-cartas"
        curveVariant="left-to-center"
        locale={locale}
      />

      {/* Escena 02.5 — El Baúl Postal: Cartas a Pompón con Matasellos y Polaroids */}
      <LettersScene locale={locale as Locale} letters={letters} />

      {/* Conector Cartográfico 05: Rumbo al Campamento de los 19 Personajes */}
      <AdventureTrailConnector
        stepNumber={5}
        destinationTitle={{
          es: 'Encuentro con la Tripulación de 19 Amigos',
          en: 'Meeting the Crew of 19 Friends',
        }}
        coordinatesText="Valle de la Buena Amistad • Alianza"
        distanceText={{ es: '+22 Leguas de Alianza', en: '+22 Alliance Leagues' }}
        targetId="#escena-personajes"
        curveVariant="center-to-right"
        locale={locale}
      />

      {/* Escena 03 — El Espacio de los Personajes con Efecto 3D Tilt */}
      <CharacterHubScene locale={locale as Locale} characters={characters} />

      {/* Conector Cartográfico 06: Rumbo a los Libros Ilustrados */}
      <AdventureTrailConnector
        stepNumber={6}
        destinationTitle={{
          es: 'Bóveda de Libros Ilustrados & Secretos',
          en: 'Vault of Illustrated Books & Secrets',
        }}
        coordinatesText="Gran Biblioteca Secreta • Tapa Dura"
        distanceText={{ es: '+18 Leguas Literarias', en: '+18 Literary Leagues' }}
        targetId="#escena-libros"
        curveVariant="right-to-left"
        locale={locale}
      />

      {/* Escena 04 — Los Libros */}
      <BooksScene locale={locale as Locale} books={books} />

      {/* Conector Cartográfico 07: Rumbo a YouTube y Canciones */}
      <AdventureTrailConnector
        stepNumber={7}
        destinationTitle={{
          es: 'Estación de Transmisión • Cine & Música',
          en: 'Broadcast Station • Cinema & Music',
        }}
        coordinatesText="Onda Corta 104.7 MHz • YouTube"
        distanceText={{ es: '+30 Leguas Sonoras', en: '+30 Sound Leagues' }}
        targetId="#escena-youtube"
        curveVariant="left-to-center"
        locale={locale}
      />

      {/* Escena 05 — YouTube y Canciones */}
      <YouTubeScene locale={locale as Locale} videos={videos} />

      {/* Conector Cartográfico 08: Rumbo al Mirador de Fondos de Pantalla */}
      <AdventureTrailConnector
        stepNumber={8}
        destinationTitle={{
          es: 'Mirador de Recuerdos 2K • Fondos de Pantalla',
          en: '2K Memory Viewpoint • Wallpapers',
        }}
        coordinatesText="Cumbre de las Postales 2K"
        distanceText={{ es: '+10 Leguas Panorámicas', en: '+10 Panoramic Leagues' }}
        targetId="#galeria-fondos"
        curveVariant="center-to-right"
        locale={locale}
      />

      {/* Escena 05.5 — Galería de Fondos de Pantalla 2K para Móvil y Ordenador */}
      <WallpapersScene locale={locale as Locale} wallpapers={wallpapers} embedded />

      {/* Escena 06 — El Universo sigue creciendo */}
      <GrowingUniverseScene locale={locale as Locale} items={universeRoadmap} />

      {/* Escena 07 — Colaboraciones y Licensing B2B */}
      <CollaborationsScene locale={locale as Locale} collaborations={collaborations} />

      {/* LA GRAN X DEL TESORO: Meta oficial de la expedición («X Marks the Spot») */}
      <TreasureDestinationMark locale={locale} targetId="#cierre-expedicion" />

      {/* Escena 08 — Cierre del círculo narrativo */}
      <ClosingScene locale={locale as Locale} />
    </article>
  );
}

