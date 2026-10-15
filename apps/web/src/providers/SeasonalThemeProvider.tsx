'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { SeasonalEvent } from '@curileta/cms';
import type { ManagedBaseTheme } from '@/lib/events';
import { EVENT_DECORATIONS, EVENT_PALETTE_PRESETS } from '@/lib/events';
import { removeBrowserStorageValue, setBrowserStorageValue, useBrowserStorageValue, useClientHydrated } from '@/lib/browser-storage';

interface SeasonalThemeContextType {
  activeEvent: SeasonalEvent | null;
  isReady: boolean;
  isSeasonalActive: boolean;
  isUserDismissed: boolean;
  toggleSeasonalTheme: () => void;
  canPlayAmbientAudio: boolean;
  ambientAudioPlaying: boolean;
  toggleAmbientAudio: () => void;
  canPlayScareSound: boolean;
  playScareSound: () => void;
  canToggleDecorations: boolean;
  decorationsVisible: boolean;
  toggleDecorations: () => void;
  canEnableMotion: boolean;
  motionEnabled: boolean;
  toggleMotion: () => void;
  scareEffectsEnabled: boolean;
  toggleScareEffects: () => void;
  reducedMotion: boolean;
  themeKey: string | null;
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType>({
  activeEvent: null,
  isReady: false,
  isSeasonalActive: false,
  isUserDismissed: false,
  toggleSeasonalTheme: () => {},
  canPlayAmbientAudio: false,
  ambientAudioPlaying: false,
  toggleAmbientAudio: () => {},
  canPlayScareSound: false,
  playScareSound: () => {},
  canToggleDecorations: false,
  decorationsVisible: false,
  toggleDecorations: () => {},
  canEnableMotion: false,
  motionEnabled: false,
  toggleMotion: () => {},
  scareEffectsEnabled: false,
  toggleScareEffects: () => {},
  reducedMotion: false,
  themeKey: null,
});

const STORAGE_KEY_PREFIX = 'curileta-seasonal-disabled:';
const LEGACY_STORAGE_KEY = 'curileta-seasonal-disabled';

const getCampaignStorageKey = (event: SeasonalEvent, now = new Date()) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const startMonth = start.getUTCMonth();
  const endMonth = end.getUTCMonth();
  const crossesYear = endMonth < startMonth || (endMonth === startMonth && end.getUTCDate() < start.getUTCDate());
  const currentMonth = now.getUTCMonth();
  const currentDay = now.getUTCDate();
  const isInEndPartOfCrossYearCampaign = crossesYear && (
    currentMonth < endMonth || (currentMonth === endMonth && currentDay <= end.getUTCDate())
  );
  const campaignStartYear = now.getUTCFullYear() - (isInEndPartOfCrossYearCampaign ? 1 : 0);
  return `${STORAGE_KEY_PREFIX}${event.id}:${campaignStartYear}`;
};

export const SeasonalThemeProvider: React.FC<{ activeEvent: SeasonalEvent | null; baseTheme?: ManagedBaseTheme | null; children: React.ReactNode }> = ({ activeEvent, baseTheme = null, children }) => {
  const campaignStorageKey = activeEvent ? getCampaignStorageKey(activeEvent) : null;
  const scopedValue = useBrowserStorageValue('local', campaignStorageKey);
  const legacyValue = useBrowserStorageValue('local', LEGACY_STORAGE_KEY);
  const motionPreferenceKey = campaignStorageKey ? `${campaignStorageKey}:motion` : null;
  const decorationsPreferenceKey = campaignStorageKey ? `${campaignStorageKey}:decorations` : null;
  const scarePreferenceKey = campaignStorageKey ? `${campaignStorageKey}:scares` : null;
  const motionPreference = useBrowserStorageValue('local', motionPreferenceKey);
  const decorationsPreference = useBrowserStorageValue('local', decorationsPreferenceKey);
  const scarePreference = useBrowserStorageValue('local', scarePreferenceKey);
  const mounted = useClientHydrated();
  const reducedMotion = useReducedMotionPreference();
  const audioRef = useRef<HTMLAudioElement>(null);
  const scareSoundRef = useRef<HTMLAudioElement>(null);
  const [playingEventId, setPlayingEventId] = useState('');

  useEffect(() => {
    if (!campaignStorageKey || legacyValue === null) return;
    if (scopedValue === null && legacyValue === 'true') setBrowserStorageValue('local', campaignStorageKey, 'true');
    removeBrowserStorageValue('local', LEGACY_STORAGE_KEY);
  }, [campaignStorageKey, legacyValue, scopedValue]);

  const isUserDismissed = Boolean(campaignStorageKey && (scopedValue === 'true' || (scopedValue === null && legacyValue === 'true')));
  const isSeasonalActive = Boolean(activeEvent && activeEvent.active && !isUserDismissed);
  const themeKey = isSeasonalActive && activeEvent ? activeEvent.themeKey : null;
  const canPlayAmbientAudio = Boolean(isSeasonalActive && activeEvent?.effects?.soundEnabled && activeEvent.ambientAudioUrl);
  const ambientAudioPlaying = Boolean(canPlayAmbientAudio && activeEvent && playingEventId === activeEvent.id);
  const canPlayScareSound = Boolean(isSeasonalActive && activeEvent?.effects?.scareEffectsEnabled && activeEvent.scareSoundUrl);
  const canToggleDecorations = Boolean(isSeasonalActive && activeEvent?.effects?.decorationsEnabled && activeEvent.effects.decorationCount > 0);
  const decorationsVisible = Boolean(canToggleDecorations && decorationsPreference !== 'false');
  const canEnableMotion = Boolean(isSeasonalActive && activeEvent?.effects?.decorationsEnabled && activeEvent.effects.motionEnabled !== false && !reducedMotion);
  const motionEnabled = Boolean(canEnableMotion && motionPreference !== 'false');
  const scareEffectsEnabled = Boolean(canPlayScareSound && scarePreference === 'true');

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const properties = [
      '--color-adventure-gold', '--color-adventure-gold-light', '--seasonal-header-light', '--seasonal-header-dark', '--seasonal-footer-light', '--seasonal-footer-dark',
      '--seasonal-accent', '--seasonal-accent-strong', '--seasonal-canvas-light', '--seasonal-surface-light', '--seasonal-text-light',
      '--seasonal-canvas-dark', '--seasonal-surface-dark', '--seasonal-text-dark', '--seasonal-banner-start', '--seasonal-banner-end',
    ];
    if (isSeasonalActive && themeKey) {
      root.removeAttribute('data-site-base-theme');
      root.setAttribute('data-seasonal-theme', themeKey);
      root.setAttribute('data-seasonal-motion', motionEnabled ? 'on' : 'off');
      const palette = activeEvent?.palette || EVENT_PALETTE_PRESETS[themeKey] || EVENT_PALETTE_PRESETS.custom;
      root.style.setProperty('--seasonal-accent', palette.accent);
      root.style.setProperty('--seasonal-accent-strong', palette.accentStrong);
      root.style.setProperty('--seasonal-canvas-light', palette.canvasLight);
      root.style.setProperty('--seasonal-surface-light', palette.surfaceLight);
      root.style.setProperty('--seasonal-text-light', palette.textLight);
      root.style.setProperty('--seasonal-canvas-dark', palette.canvasDark);
      root.style.setProperty('--seasonal-surface-dark', palette.surfaceDark);
      root.style.setProperty('--seasonal-text-dark', palette.textDark);
      root.style.setProperty('--seasonal-banner-start', palette.accentStrong);
      root.style.setProperty('--seasonal-banner-end', palette.accent);
    } else if (baseTheme) {
      root.removeAttribute('data-seasonal-theme');
      root.removeAttribute('data-seasonal-motion');
      root.setAttribute('data-site-base-theme', 'active');
      root.style.setProperty('--color-adventure-gold', baseTheme.palette.accent);
      root.style.setProperty('--color-adventure-gold-light', baseTheme.palette.accent);
      root.style.setProperty('--seasonal-accent', baseTheme.palette.accent);
      root.style.setProperty('--seasonal-accent-strong', baseTheme.palette.accentStrong);
      root.style.setProperty('--seasonal-canvas-light', baseTheme.palette.canvasLight);
      root.style.setProperty('--seasonal-surface-light', baseTheme.palette.surfaceLight);
      root.style.setProperty('--seasonal-text-light', baseTheme.palette.textLight);
      root.style.setProperty('--seasonal-canvas-dark', baseTheme.palette.canvasDark);
      root.style.setProperty('--seasonal-surface-dark', baseTheme.palette.surfaceDark);
      root.style.setProperty('--seasonal-text-dark', baseTheme.palette.textDark);
      root.style.setProperty('--seasonal-banner-start', baseTheme.palette.accentStrong);
      root.style.setProperty('--seasonal-banner-end', baseTheme.palette.accent);
      root.style.setProperty('--seasonal-header-light', baseTheme.palette.surfaceLight);
      root.style.setProperty('--seasonal-header-dark', baseTheme.palette.surfaceDark);
      root.style.setProperty('--seasonal-footer-light', baseTheme.palette.canvasLight);
      root.style.setProperty('--seasonal-footer-dark', baseTheme.palette.canvasDark);
    } else {
      root.removeAttribute('data-seasonal-theme');
      root.removeAttribute('data-seasonal-motion');
      root.removeAttribute('data-site-base-theme');
    }
    return () => {
      root.removeAttribute('data-seasonal-theme');
      root.removeAttribute('data-site-base-theme');
      root.removeAttribute('data-seasonal-motion');
      for (const property of properties) root.style.removeProperty(property);
    };
  }, [activeEvent, baseTheme, mounted, isSeasonalActive, motionEnabled, themeKey]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!canPlayAmbientAudio && audio && !audio.paused) audio.pause();
  }, [activeEvent?.id, activeEvent?.ambientAudioUrl, canPlayAmbientAudio]);

  const toggleAmbientAudio = () => {
    const audio = audioRef.current;
    if (!audio || !canPlayAmbientAudio) return;
    if (audio.paused) {
      const eventId = activeEvent?.id || '';
      void audio.play().then(() => setPlayingEventId(eventId)).catch(() => setPlayingEventId(''));
    } else {
      audio.pause();
      setPlayingEventId('');
    }
  };

  const playScareSound = () => {
    const audio = scareSoundRef.current;
    if (!audio || !scareEffectsEnabled) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  };

  const toggleMotion = () => {
    if (!motionPreferenceKey || !canEnableMotion) return;
    setBrowserStorageValue('local', motionPreferenceKey, motionEnabled ? 'false' : 'true');
  };

  const toggleDecorations = () => {
    if (!decorationsPreferenceKey || !canToggleDecorations) return;
    setBrowserStorageValue('local', decorationsPreferenceKey, decorationsVisible ? 'false' : 'true');
  };

  const toggleScareEffects = () => {
    if (!scarePreferenceKey || !canPlayScareSound) return;
    setBrowserStorageValue('local', scarePreferenceKey, scareEffectsEnabled ? 'false' : 'true');
  };

  const toggleSeasonalTheme = () => {
    if (!campaignStorageKey) return;
    if (isUserDismissed) removeBrowserStorageValue('local', campaignStorageKey);
    else {
      audioRef.current?.pause();
      setPlayingEventId('');
      setBrowserStorageValue('local', campaignStorageKey, 'true');
    }
  };

  return (
    <SeasonalThemeContext.Provider value={{
      activeEvent,
      isReady: mounted,
      isSeasonalActive,
      isUserDismissed,
      toggleSeasonalTheme,
      canPlayAmbientAudio,
      ambientAudioPlaying,
      toggleAmbientAudio,
      canPlayScareSound,
      playScareSound,
      canToggleDecorations,
      decorationsVisible,
      toggleDecorations,
      canEnableMotion,
      motionEnabled,
      toggleMotion,
      scareEffectsEnabled,
      toggleScareEffects,
      reducedMotion,
      themeKey,
    }}>
      {activeEvent?.ambientAudioUrl && <audio
        ref={audioRef}
        src={activeEvent.ambientAudioUrl}
        loop
        preload="none"
        aria-hidden="true"
        className="hidden"
        onPlay={() => setPlayingEventId(activeEvent.id)}
        onPause={() => setPlayingEventId((current) => current === activeEvent.id ? '' : current)}
      />}
      {canPlayScareSound && <audio ref={scareSoundRef} src={activeEvent?.scareSoundUrl} preload="none" aria-hidden="true" className="hidden" />}
      <SeasonalDecorations event={activeEvent} active={decorationsVisible} motionEnabled={motionEnabled} />
      {children}
    </SeasonalThemeContext.Provider>
  );
};

export const useSeasonalTheme = () => useContext(SeasonalThemeContext);

function SeasonalDecorations({ event, active, motionEnabled }: { event: SeasonalEvent | null; active: boolean; motionEnabled: boolean }) {
  const effects = event?.effects;
  const selected = event?.effects?.decorations || [];
  const decorationItems = selected.flatMap((key) => {
    const item = EVENT_DECORATIONS.find((decoration) => decoration.key === key);
    return item ? [item] : [];
  });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const evaluateScreen = () => setIsMobile(window.innerWidth < 768);
    evaluateScreen();
    window.addEventListener('resize', evaluateScreen);
    return () => window.removeEventListener('resize', evaluateScreen);
  }, []);

  if (!active || !effects?.decorationsEnabled || !decorationItems.length || effects.decorationCount <= 0) return null;
  const maxDecorations = isMobile ? 8 : 24;
  const count = Math.min(effects.decorationCount, maxDecorations);
  const speed = effects.decorationSpeed === 'quick' ? 15 : effects.decorationSpeed === 'slow' ? 34 : 24;
  const has = (key: string) => selected.includes(key);
  return <div aria-hidden="true" className={`seasonal-decoration-layer seasonal-scene seasonal-scene--${event?.themeKey || 'custom'}`}>
    <span className="seasonal-theme-frame" />
    {has('fog') && <span className="seasonal-fog" />}
    {has('cornerWebs') && <><span className="seasonal-corner-web seasonal-corner-web--left">🕸️</span><span className="seasonal-corner-web seasonal-corner-web--right">🕸️</span></>}
    {has('snowbanks') && <><span className="seasonal-snowbank seasonal-snowbank--left" /><span className="seasonal-snowbank seasonal-snowbank--right" /></>}
    {has('snowman') && <span className="seasonal-snowman">⛄</span>}
    {has('fireflies') && <span className="seasonal-firefly seasonal-firefly--one">✦</span>}
    {has('fireflies') && <span className="seasonal-firefly seasonal-firefly--two">✦</span>}
    {Array.from({ length: count }, (_, index) => {
      const item = decorationItems[index % decorationItems.length];
      return <span
        key={`${item.key}-${index}`}
        className={`${motionEnabled ? 'seasonal-decoration' : 'seasonal-decoration-still'} seasonal-decoration--${item.key}`}
        style={{ left: `${(index * 37 + 9) % 100}%`, animationDelay: `${-(index * 3 % speed)}s`, animationDuration: `${speed + (index * 7 % 12)}s`, opacity: effects.decorationOpacity }}
      >{item.glyph}</span>;
    })}
  </div>;
}

function useReducedMotionPreference() {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  const getSnapshot = useCallback(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
