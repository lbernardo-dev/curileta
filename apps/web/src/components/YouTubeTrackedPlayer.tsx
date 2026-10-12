'use client';

import { useEffect, useRef, useState } from 'react';
import { analytics } from '@curileta/analytics';

interface YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerInstance {
  destroy: () => void;
}

interface YouTubeIframeAPI {
  PlayerState: { PLAYING: number };
  Player: new (
    iframe: HTMLIFrameElement,
    options: {
      events: {
        onReady: () => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: (event: YouTubePlayerEvent) => void;
      };
    },
  ) => YouTubePlayerInstance;
}

declare global {
  interface Window {
    YT?: YouTubeIframeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeIframeAPI> | null = null;

function loadYouTubeIframeAPI(): Promise<YouTubeIframeAPI> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  const pending = new Promise<YouTubeIframeAPI>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    const scriptId = 'curileta-youtube-iframe-api';
    let settled = false;
    let script: HTMLScriptElement | null = null;
    let timeout = 0;

    const finish = (api: YouTubeIframeAPI) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      try {
        previousCallback?.();
      } catch {
        // Another page script must not prevent the player from becoming ready.
      }
      resolve(api);
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      script?.remove();
      window.onYouTubeIframeAPIReady = previousCallback;
      reject(new Error('YouTube player API unavailable'));
    };
    timeout = window.setTimeout(fail, 15000);

    window.onYouTubeIframeAPIReady = () => {
      if (window.YT?.Player) finish(window.YT);
      else fail();
    };

    script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('error', fail, { once: true });
  });

  youtubeApiPromise = pending.catch((error: unknown) => {
    youtubeApiPromise = null;
    throw error;
  });
  return youtubeApiPromise;
}

interface YouTubeTrackedPlayerProps {
  videoId: string;
  videoSlug: string;
  title: string;
  locale: 'es' | 'en';
}

export function YouTubeTrackedPlayer({ videoId, videoSlug, title, locale }: YouTubeTrackedPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reportedStartRef = useRef(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [trackingUnavailable, setTrackingUnavailable] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const invalidVideoId = !/^[A-Za-z0-9_-]{11}$/.test(videoId);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || invalidVideoId) return;

    reportedStartRef.current = false;

    let cancelled = false;
    let iframe: HTMLIFrameElement | null = null;
    let player: YouTubePlayerInstance | null = null;
    let playerReadyTimeout = 0;
    let playerReady = false;

    void loadYouTubeIframeAPI()
      .then((api) => {
        if (cancelled || !host.isConnected) return;

        iframe = document.createElement('iframe');
        const origin = encodeURIComponent(window.location.origin);
        iframe.src =
          'https://www.youtube-nocookie.com/embed/' +
          encodeURIComponent(videoId) +
          '?enablejsapi=1&origin=' +
          origin;
        iframe.title = title;
        iframe.className = 'absolute inset-0 h-full w-full border-0';
        iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        host.replaceChildren(iframe);

        player = new api.Player(iframe, {
          events: {
            onReady: () => {
              playerReady = true;
              window.clearTimeout(playerReadyTimeout);
              if (!cancelled) setPlayerReady(true);
            },
            onStateChange: (event) => {
              if (event.data !== api.PlayerState.PLAYING || reportedStartRef.current) return;
              reportedStartRef.current = true;
              analytics.track({
                name: 'video_play',
                properties: { videoId, videoSlug, title },
              });
            },
            onError: () => {
              window.clearTimeout(playerReadyTimeout);
              if (!cancelled) setPlaybackError(true);
            },
          },
        });
        playerReadyTimeout = window.setTimeout(() => {
          if (!cancelled && !playerReady) setPlaybackError(true);
        }, 15000);
      })
      .catch(() => {
        if (!cancelled) setTrackingUnavailable(true);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(playerReadyTimeout);
      player?.destroy();
      iframe?.remove();
    };
  }, [invalidVideoId, videoId, videoSlug, title]);

  return (
    <>
      <div ref={hostRef} className="absolute inset-0 h-full w-full bg-[#181818]" />
      {!playerReady && !trackingUnavailable && !playbackError && !invalidVideoId && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#181818]" role="status" aria-live="polite">
          <span className="text-sm text-slate-300">
            {locale === 'en' ? 'Loading video player' : 'Cargando reproductor de vídeo'}
          </span>
        </div>
      )}
      {(trackingUnavailable || playbackError || invalidVideoId) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#181818] p-6 text-center text-white" role="alert">
          <p className="text-sm">
            {playbackError || invalidVideoId
              ? locale === 'en' ? 'YouTube could not play this video here.' : 'YouTube no pudo reproducir este vídeo aquí.'
              : locale === 'en' ? 'The player could not load.' : 'No se pudo cargar el reproductor.'}
          </p>
          <a
            href={'https://www.youtube.com/watch?v=' + encodeURIComponent(videoId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {locale === 'en' ? 'Open on YouTube' : 'Abrir en YouTube'}
          </a>
        </div>
      )}
    </>
  );
}
