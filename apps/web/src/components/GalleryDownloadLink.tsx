'use client';

import { Download } from 'lucide-react';

export function GalleryDownloadLink({ slug, locale }: { slug: string; locale: string }) {
  const downloadUrl = `/api/gallery/${encodeURIComponent(slug)}/download`;
  const safeLocale = locale === 'en' ? 'en' : 'es';

  function trackDownload() {
    if (navigator.doNotTrack === '1') return;
    void fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'gallery_download',
        path: window.location.pathname,
        locale: safeLocale,
        contentType: 'gallery',
        contentSlug: slug,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return <a href={downloadUrl} onClick={trackDownload} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><Download className="h-4 w-4" />{safeLocale === 'en' ? 'Download image' : 'Descargar imagen'}</a>;
}
