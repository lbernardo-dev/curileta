import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cmsProvider } from '@/lib/cms';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { ArrowRight, Disc3, Music2, Youtube } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';
import { ShareActions } from '@/components/ShareActions';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Songs', description: 'Songs and music releases from the Curileta universe.' }
    : { title: 'Canciones', description: 'Canciones y publicaciones musicales del universo Curileta.' };
}

export default async function SongsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';
  const songs = await cmsProvider.getSongs(locale);
  const availableSongs = songs.filter((song) => song.audioUrl || song.youtubeId);

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'Music from the journey' : 'Música para el camino'}
      title={isEn ? 'Songs and soundtracks' : 'Canciones y banda sonora'}
      description={isEn
        ? 'Published music will appear here with a real listening link.'
        : 'Aquí aparecerá la música publicada con un enlace real para escucharla.'}
      icon={<Music2 className="h-4 w-4" />}
      width="wide"
    >
      {availableSongs.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {availableSongs.map((song) => (
            <SitePageCard key={song.id} className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-secondary)] text-[var(--seasonal-accent-strong)]"><Disc3 className="h-8 w-8" /></div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-semibold">{song.title[locale] || song.title.es}</h2>
                {song.duration && <p className="mt-1 text-sm text-[var(--text-secondary)]">{song.duration}</p>}
                <div className="mt-3 flex flex-wrap gap-3">
                  {song.audioUrl && <a href={song.audioUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--seasonal-accent-strong)]">{isEn ? 'Listen' : 'Escuchar'}<ArrowRight className="h-4 w-4" /></a>}
                  {song.youtubeId && <a href={'https://www.youtube.com/watch?v=' + song.youtubeId} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--seasonal-accent-strong)]"><Youtube className="h-4 w-4" />YouTube</a>}
                </div>
                <ShareActions
                  contentType="song"
                  contentSlug={song.slug}
                  title={song.title[locale] || song.title.es}
                  description={song.lyrics?.[locale] || song.lyrics?.es}
                  url={song.youtubeId ? `https://www.youtube.com/watch?v=${song.youtubeId}` : song.audioUrl}
                  locale={locale}
                />
              </div>
            </SitePageCard>
          ))}
        </div>
      ) : (
        <SitePageCard className="py-12 text-center sm:py-16">
          <Music2 className="mx-auto h-10 w-10 text-[var(--seasonal-accent-strong)]" />
          <h2 className="mt-4 font-display text-2xl font-semibold">{isEn ? 'No songs released yet' : 'Aún no hay canciones publicadas'}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            {isEn ? 'We’ll add each song here when there is a real audio or video release to listen to.' : 'Añadiremos cada canción cuando exista una publicación real de audio o vídeo para escuchar.'}
          </p>
        </SitePageCard>
      )}
      <SitePageCard className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold">{isEn ? 'Explore the video channel' : 'Explora el canal de vídeos'}</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{isEn ? 'See videos that are actually published.' : 'Descubre los vídeos que sí están publicados.'}</p>
        </div>
        <Link href={'/' + locale + '/videos'} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]">
          <Youtube className="h-4 w-4" />{isEn ? 'Videos' : 'Ver vídeos'}
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
