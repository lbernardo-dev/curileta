'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (target: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
      }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface VideoVoteProps {
  slug: string;
  title: string;
  prompt?: string;
  initialVotes: number;
  locale: 'es' | 'en';
  enabled?: boolean;
}

export function VideoVote({ slug, title, prompt, initialVotes, locale, enabled = true }: VideoVoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isEn = locale === 'en';

  useEffect(() => {
    setVoted(window.localStorage.getItem(`curileta:video-voted:${slug}`) === 'true');
  }, [slug]);

  useEffect(() => {
    if (!showChallenge || !siteKey || !containerRef.current) return;
    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => { void submitVote(token); },
        'expired-callback': () => setMessage(isEn ? 'Verification expired. Try again.' : 'La verificación caducó. Inténtalo de nuevo.'),
        'error-callback': () => setMessage(isEn ? 'Verification could not be loaded.' : 'No se pudo completar la verificación.'),
      });
    };

    const existingScript = document.getElementById('curileta-turnstile-script') as HTMLScriptElement | null;
    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener('load', renderWidget, { once: true });
    } else {
      const script = document.createElement('script');
      script.id = 'curileta-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', renderWidget, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      if (widgetRef.current && window.turnstile) window.turnstile.remove(widgetRef.current);
      widgetRef.current = null;
    };
    // The widget is created once when the challenge opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChallenge, siteKey]);

  async function submitVote(token: string) {
    setSending(true);
    setMessage('');
    try {
      const path = window.location.pathname;
      const response = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'video_vote',
          path,
          locale,
          contentType: 'video',
          contentSlug: slug,
          turnstileToken: token,
        }),
      });
      if (!response.ok) throw new Error(isEn ? 'Your vote could not be saved.' : 'No se pudo guardar tu voto. Inténtalo de nuevo.');
      window.localStorage.setItem(`curileta:video-voted:${slug}`, 'true');
      setVoted(true);
      setVotes((current) => current + 1);
      setShowChallenge(false);
      setMessage(isEn ? 'Vote saved.' : 'Voto guardado.');
    } catch (cause) {
      setShowChallenge(false);
      setMessage(cause instanceof Error ? cause.message : (isEn ? 'Your vote could not be saved.' : 'No se pudo guardar tu voto.'));
    } finally {
      setSending(false);
    }
  }

  if (!enabled) return null;

  return (
    <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-[#313131]">
      <p className="text-sm font-semibold">{prompt || (isEn ? `Do you like ${title}?` : `¿Te ha gustado ${title}?`)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={voted || sending || !siteKey}
          onClick={() => {
            setMessage('');
            setShowChallenge(true);
          }}
          className="min-h-10 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          {sending ? (isEn ? 'Saving…' : 'Guardando…') : voted ? (isEn ? 'Vote recorded' : 'Ya has votado aquí') : (isEn ? 'Vote' : 'Votar')}
        </button>
        <span className="text-sm text-slate-600 dark:text-slate-300" aria-label={isEn ? `${votes} votes` : `${votes} votos`}>
          {votes.toLocaleString(isEn ? 'en-US' : 'es-ES')} {isEn ? 'votes' : 'votos'}
        </span>
      </div>
      {showChallenge && siteKey && <div className="mt-3 min-h-16" ref={containerRef} />}
      {!siteKey && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{isEn ? 'Voting is not configured in this environment yet.' : 'La votación aún no está configurada en este entorno.'}</p>}
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300" role="status" aria-live="polite">{message}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{isEn ? 'Votes are counted in aggregate. This browser keeps a local marker to avoid repeat votes.' : 'Los votos se cuentan de forma agregada. Este navegador guarda una marca local para evitar repetir el voto.'}</p>
    </div>
  );
}
