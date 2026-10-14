'use client';

import { useEffect, useRef, useState } from 'react';
import { analytics } from '@curileta/analytics';
import { ContentImage } from '@/components/ContentImage';

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
      if (script?.id === scriptId && script.dataset.curiletaOwned === 'true') script.remove();
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
      script.dataset.curiletaOwned = 'true';
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
  thumbnail: string;
  youtubeUrl: string;
  locale: 'es' | 'en';
}

export function YouTubeTrackedPlayer({
  videoId,
  videoSlug,
  title,
  thumbnail,
  youtubeUrl,
  locale,
}: YouTubeTrackedPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reportedStartRef = useRef(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [trackingUnavailable, setTrackingUnavailable] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const invalidVideoId = !/^[A-Za-z0-9_-]{11}$/.test(videoId);
  const youtubeThumbnails = invalidVideoId
    ? []
    : [
        'https://i.ytimg.com/vi/' + encodeURIComponent(videoId) + '/hqdefault.jpg',
        'https://i.ytimg.com/vi/' + encodeURIComponent(videoId) + '/mqdefault.jpg',
      ];
  const thumbnailSources = [...new Set([thumbnail.trim(), ...youtubeThumbnails].filter(Boolean))];
  const fallbackThumbnail = thumbnailSources[thumbnailIndex] || '';

  useEffect(() => setThumbnailIndex(0), [thumbnail, videoId]);

  function useNextThumbnail() {
    setThumbnailIndex((current) => Math.min(current + 1, thumbnailSources.length));
  }

  useEffect(() => {
    const host = hostRef.current;
    if (!host || invalidVideoId) return;

    reportedStartRef.current = false;
    let cancelled = false;
    let iframe: HTMLIFrameElement | null = null;
    let player: YouTubePlayerInstance | null = null;
    let playerReadyTimeout = 0;
    let hasPlayerReady = false;

    void loadYouTubeIframeAPI()
      .then((api) => {
        if (cancelled || !host.isConnected) return;

        iframe = document.createElement('iframe');
        const embedUrl = new URL('https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId));
        embedUrl.searchParams.set('enablejsapi', '1');
        embedUrl.searchParams.set('origin', window.location.origin);
        embedUrl.searchParams.set('playsinline', '1');
        iframe.src = embedUrl.toString();
        iframe.title = title;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.className = 'absolute inset-0 h-full w-full border-0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        host.replaceChildren(iframe);

        player = new api.Player(iframe, {
          events: {
            onReady: () => {
              hasPlayerReady = true;
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
          if (!cancelled && !hasPlayerReady) setPlaybackError(true);
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

  const fallbackMessage = trackingUnavailable
    ? locale === 'en' ? 'The player could not load here.' : 'No se pudo cargar el reproductor aquí.'
    : locale === 'en' ? 'This video cannot be played here.' : 'Este vídeo no se puede reproducir aquí.';

  return (
    <>
      <div ref={hostRef} className="absolute inset-0 h-full w-full bg-[#181818]" />
      {!playerReady && !trackingUnavailable && !playbackError && !invalidVideoId && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#181818]" role="status" aria-live="polite">
          {fallbackThumbnail ? (
            <ContentImage src={fallbackThumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" loading="eager" onError={useNextThumbnail} />
          ) : null}
          <span className="relative rounded-full bg-black/75 px-4 py-2 text-sm text-white">
            {locale === 'en' ? 'Loading video player' : 'Cargando reproductor de vídeo'}
          </span>
        </div>
      )}
      {(trackingUnavailable || playbackError || invalidVideoId) && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-[#181818] text-white" role="alert">
          {fallbackThumbnail ? (
            <ContentImage src={fallbackThumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" loading="eager" onError={useNextThumbnail} />
          ) : null}
          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
          <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm">{fallbackMessage}</p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            >
              {locale === 'en' ? 'Watch on YouTube' : 'Ver en YouTube'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
