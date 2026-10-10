'use client';

import { useRef, useState } from 'react';
import { recordContentShare, type ShareableContentType } from '@curileta/analytics';

interface ShareActionsProps {
  contentType: ShareableContentType;
  contentSlug: string;
  title: string;
  description?: string;
  url?: string;
  locale: 'es' | 'en';
}

export function ShareActions({ contentType, contentSlug, title, description, url, locale }: ShareActionsProps) {
  const [status, setStatus] = useState('');
  const [showManualCopy, setShowManualCopy] = useState(false);
  const manualCopyRef = useRef<HTMLInputElement>(null);
  const isEn = locale === 'en';
  const text = description || (isEn ? 'Discover this Curileta story.' : 'Descubre esta historia de Curileta.');

  function shareUrl() {
    if (!url) return window.location.href;
    return url.startsWith('/') ? new URL(url, window.location.origin).toString() : url;
  }

  function shareMessage() {
    return `${title}\n${text}`;
  }

  function track(channel: Parameters<typeof recordContentShare>[0]) {
    void recordContentShare(channel, contentType, contentSlug);
  }

  async function shareFromDevice() {
    const link = shareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: link });
        track('native');
      } catch (cause) {
        if (cause instanceof Error && cause.name !== 'AbortError') {
          setShowManualCopy(true);
          setStatus(isEn ? 'Sharing is unavailable. Copy the link instead.' : 'No se pudo abrir la opción de compartir. Copia el enlace.');
          requestAnimationFrame(() => {
            manualCopyRef.current?.focus();
            manualCopyRef.current?.select();
          });
        }
      }
      return;
    }
    await copyLink();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      track('copy');
      setStatus(isEn ? 'Link copied.' : 'Enlace copiado.');
    } catch {
      setShowManualCopy(true);
      setStatus(isEn ? 'The link could not be copied in this browser. Select it below.' : 'Este navegador no permite copiar el enlace. Selecciónalo abajo.');
      requestAnimationFrame(() => {
        manualCopyRef.current?.focus();
        manualCopyRef.current?.select();
      });
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl());
  const encodedText = encodeURIComponent(shareMessage());
  const encodedMessage = encodeURIComponent(`${shareMessage()}\n${shareUrl()}`);

  return (
    <details className="mt-4 rounded-lg border border-slate-200 bg-white dark:border-[#313131] dark:bg-[#181818]">
      <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200">
        {isEn ? 'Share or recommend' : 'Compartir o recomendar'}
      </summary>
      <div className="flex flex-wrap gap-2 px-3 pb-3">
        <button type="button" onClick={shareFromDevice} className="min-h-10 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
          {isEn ? 'Share from device' : 'Compartir desde el dispositivo'}
        </button>
        <a onClick={() => track('whatsapp')} href={`https://wa.me/?text=${encodedMessage}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">WhatsApp</a>
        <a onClick={() => track('telegram')} href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">Telegram</a>
        <a onClick={() => track('facebook')} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">Facebook</a>
        <a onClick={() => track('linkedin')} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">LinkedIn</a>
        <a onClick={() => track('x')} href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">X</a>
        <a onClick={() => track('email')} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedMessage}`} className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">
          {isEn ? 'Email' : 'Correo'}
        </a>
        <button type="button" onClick={copyLink} className="min-h-10 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">
          {isEn ? 'Copy link' : 'Copiar enlace'}
        </button>
        <a href={`sms:?body=${encodedMessage}`} onClick={() => track('sms')} className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]">
          {isEn ? 'Messages' : 'Mensajes'}
        </a>
        {showManualCopy && (
          <label className="grid w-full gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{isEn ? 'Select and copy this link' : 'Selecciona y copia este enlace'}</span>
            <input ref={manualCopyRef} readOnly value={shareUrl()} onFocus={(event) => event.currentTarget.select()} className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818] dark:text-white" />
          </label>
        )}
      </div>
      <p className="px-3 pb-3 text-xs text-slate-600 dark:text-slate-300" role="status" aria-live="polite">{status}</p>
    </details>
  );
}
