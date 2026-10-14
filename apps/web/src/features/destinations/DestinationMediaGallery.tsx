'use client';

import { useEffect, useRef, useState } from 'react';
import type { DestinationMedia, Location } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from 'lucide-react';
import { ContentImage } from '@/components/ContentImage';

export function DestinationMediaGallery({ location, locale }: { location: Location; locale: Locale }) {
  const isEn = locale === 'en';
  const managedMedia = location.media?.slice() || [];
  const media: DestinationMedia[] = location.heroImage.url && !managedMedia.some((item) => item.url === location.heroImage.url)
    ? [{ id: 'destination-cover', kind: 'image', url: location.heroImage.url, storagePath: '', alt: location.heroImage.alt, caption: { es: '', en: '' }, isCard: true, sortOrder: -1 }, ...managedMedia]
    : managedMedia.length ? managedMedia : location.heroImage.url
      ? [{ id: 'destination-cover', kind: 'image', url: location.heroImage.url, storagePath: '', alt: location.heroImage.alt, caption: { es: '', en: '' }, isCard: true, sortOrder: 0 }]
      : [];
  media.sort((left, right) => left.sortOrder - right.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const active = media[activeIndex];
  const label = (value: { es: string; en?: string } | undefined) => value?.[locale] || value?.es || '';

  useEffect(() => {
    if (!expanded) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setExpanded(false);
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % media.length);
      if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + media.length) % media.length);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [expanded, media.length]);

  if (!media.length || !active) return null;

  function renderMedia(item: DestinationMedia, large = false) {
    return item.kind === 'video'
      ? <video controls playsInline preload="metadata" poster={location.heroImage.url || undefined} aria-label={label(item.alt)} className={`w-full rounded-xl bg-black ${large ? 'max-h-[82vh]' : 'aspect-video'}`} src={item.url} />
      : <ContentImage src={item.url} alt={label(item.alt) || label(location.name)} className={`w-full rounded-xl bg-[#e7ece5] object-contain ${large ? 'max-h-[82vh]' : 'aspect-video object-cover'}`} />;
  }

  function move(offset: -1 | 1) {
    setActiveIndex((index) => (index + offset + media.length) % media.length);
  }

  return <section className="space-y-4" aria-label={isEn ? 'Destination photos and videos' : 'Fotografías y vídeos del destino'}>
    <div className="relative overflow-hidden rounded-2xl bg-[#e7ece5] p-2 sm:p-3">
      {active.kind === 'image' ? <button type="button" onClick={() => setExpanded(true)} aria-label={isEn ? 'Enlarge photo' : 'Ampliar fotografía'} className="group relative block w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700">{renderMedia(active)}<span className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#20352c]/85 px-3 py-2 text-sm font-semibold text-white"><Maximize2 className="h-4 w-4" />{isEn ? 'Enlarge' : 'Ampliar'}</span></button>
        : <div className="relative">{renderMedia(active)}<button type="button" onClick={() => setExpanded(true)} aria-label={isEn ? 'Open video scene' : 'Ampliar escena de vídeo'} className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#20352c]/85 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"><Maximize2 className="h-4 w-4" />{isEn ? 'Enlarge' : 'Ampliar'}</button></div>}
      {active.caption && label(active.caption) && <p className="px-2 pb-1 pt-3 text-sm leading-6 text-[#4d5f54]">{label(active.caption)}</p>}
    </div>

    {media.length > 1 && <div className="flex items-center justify-between gap-3"><p className="text-sm text-[#5c6b61]">{isEn ? `${activeIndex + 1} of ${media.length} scenes` : `${activeIndex + 1} de ${media.length} escenas`}</p><div className="flex gap-2"><button type="button" onClick={() => move(-1)} aria-label={isEn ? 'Previous media' : 'Medio anterior'} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cbd6c8] bg-white hover:bg-emerald-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={() => move(1)} aria-label={isEn ? 'Next media' : 'Medio siguiente'} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cbd6c8] bg-white hover:bg-emerald-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700"><ChevronRight className="h-5 w-5" /></button></div></div>}

    {media.length > 1 && <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">{media.map((item, index) => <li key={item.id}><button type="button" onClick={() => setActiveIndex(index)} aria-pressed={activeIndex === index} aria-label={`${isEn ? 'Show' : 'Mostrar'} ${item.kind === 'video' ? (isEn ? 'video scene' : 'escena de vídeo') : (isEn ? 'photo' : 'fotografía')} ${index + 1}`} className={`relative block w-full overflow-hidden rounded-xl border-2 bg-white transition-all duration-700 ease-fluid active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 ${activeIndex === index ? 'border-emerald-800' : 'border-transparent hover:border-emerald-600'}`}>{item.kind === 'video' ? <div className="relative">{renderMedia(item)}<span className="absolute inset-0 flex items-center justify-center"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20352c]/80 text-white"><Play className="h-4 w-4 fill-current" /></span></span></div> : renderMedia(item)}<span className="sr-only">{label(item.caption) || label(item.alt)}</span></button></li>)}</ol>}

    {expanded && <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs" onMouseDown={(event) => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <div role="dialog" aria-modal="true" aria-label={label(location.name)} className="relative flex max-h-full w-full max-w-6xl items-center justify-center">
        <button ref={closeRef} type="button" onClick={() => setExpanded(false)} aria-label={isEn ? 'Close media viewer' : 'Cerrar ampliación'} className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#20352c] transition-all duration-700 ease-fluid hover:scale-105 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-300"><X className="h-5 w-5" /></button>
        {media.length > 1 && <button type="button" onClick={() => move(-1)} aria-label={isEn ? 'Previous media' : 'Medio anterior'} className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#20352c] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-300"><ChevronLeft className="h-6 w-6" /></button>}
        <div className="mx-12 w-full">{renderMedia(active, true)}<p className="mt-3 text-center text-sm text-white/90">{label(active.caption) || label(active.alt)}</p></div>
        {media.length > 1 && <button type="button" onClick={() => move(1)} aria-label={isEn ? 'Next media' : 'Medio siguiente'} className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#20352c] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-300"><ChevronRight className="h-6 w-6" /></button>}
      </div>
    </div>}
  </section>;
}
