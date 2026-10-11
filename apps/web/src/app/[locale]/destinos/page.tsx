import type { Metadata } from 'next';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { DestinationDirectory } from '@/features/destinations/DestinationDirectory';
import { getPublicDestinations } from '@/lib/destinations.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Places in Curileta’s Journey', description: 'Browse every stop on Curileta’s journey and open destination photos and video scenes.' }
    : { title: 'Destinos del viaje de Curileta', description: 'Explora todas las paradas de Curileta y abre las fotografías y escenas de vídeo de cada destino.' };
}

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const locations = await getPublicDestinations(locale as Locale);
  return <DestinationDirectory locale={locale as Locale} locations={locations} />;
}
