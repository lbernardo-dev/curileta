'use client';

import { useEffect, useRef, useState } from 'react';
import type { SeasonalEvent } from '@curileta/cms';
import type { Locale } from '@curileta/i18n';

const EVENT_SYMBOL: Record<string, string> = {
  halloween: '🎃',
  christmas: '🎄',
  spring: '🌸',
  easter: '🐣',
  summer: '☀️',
  valentines: '💗',
};

type Props = {
  locale: Locale;
  event: SeasonalEvent;
  active: boolean;
  dismissed: boolean;
  canEnableSound: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  canEnableMotion: boolean;
  motionEnabled: boolean;
  onToggleMotion: () => void;
  canEnableScares: boolean;
  scaresEnabled: boolean;
  onToggleScares: () => void;
  onPlayScareSound: () => void;
  onToggleTheme: () => void;
  reducedMotion: boolean;
};

export function EventExperienceControls(props: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isEn = props.locale === 'en';
  const eventName = props.event.name[props.locale] || props.event.name.es;
  const symbol = EVENT_SYMBOL[props.event.themeKey] || '✨';
  const palette = props.event.palette;
  const eventStyle = {
    '--event-control-accent': palette?.accent || 'var(--seasonal-accent)',
    '--event-control-strong': palette?.accentStrong || 'var(--seasonal-accent-strong)',
    '--event-control-surface': palette?.surfaceLight || 'var(--background-primary)',
    '--event-control-text': palette?.textLight || 'var(--text-primary)',
  } as React.CSSProperties;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePress);
    };
  }, [open]);

  const labels = isEn ? {
    open: `Open ${eventName} experience settings`,
    title: `${eventName} experience`,
    intro: 'Choose how much of the seasonal atmosphere you want to experience.',
    sound: 'Event sound',
    motion: 'Ambient motion',
    reduced: 'Your device reduces motion, so event animation is off.',
    off: 'Turn off event atmosphere',
    on: 'Restore event atmosphere',
    enabled: 'On',
    disabled: 'Off',
    soundHint: 'Sound starts only after you turn it on.',
    surpriseHint: 'You choose when to play this effect. It never starts automatically.',
    playEffect: 'Listen now',
    surprise: 'Surprise sound',
  } : {
    open: `Abrir los ajustes de la experiencia ${eventName}`,
    title: `Experiencia ${eventName}`,
    intro: 'Elige cuánta ambientación de temporada quieres ver.',
    sound: 'Sonido del evento',
    motion: 'Movimiento ambiental',
    reduced: 'Tu dispositivo reduce el movimiento; las animaciones están desactivadas.',
    off: 'Desactivar la ambientación',
    on: 'Activar la ambientación',
    enabled: 'Activado',
    disabled: 'Desactivado',
    soundHint: 'El sonido solo empieza cuando tú lo activas.',
    surpriseHint: 'Tú decides cuándo escuchar el efecto. Nunca se inicia automáticamente.',
    playEffect: 'Escuchar ahora',
    surprise: 'Sonido sorpresa',
  };

  const switchClass = 'inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[var(--event-control-accent)] px-3 py-2 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--event-control-accent)] disabled:cursor-not-allowed disabled:opacity-60';
  const actionClass = 'inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--event-control-strong)] px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--event-control-accent)]';

  return <div ref={rootRef} className="relative" style={eventStyle}>
    {open && <section id="event-experience-settings" role="region" aria-label={labels.title} className="absolute right-0 top-[calc(100%+0.75rem)] z-[70] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-[var(--event-control-surface-light)] p-4 text-[var(--event-control-text-light)] shadow-xl dark:border-[#313131] dark:bg-[var(--event-control-surface-dark)] dark:text-[var(--event-control-text-dark)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--event-control-accent)]/10 text-xl" aria-hidden="true">{symbol}</span>
        <div>
          <h2 className="text-base font-bold">{labels.title}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.intro}</p>
        </div>
      </div>

      {props.canEnableSound && <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-[#313131]">
        <div><span className="block text-sm font-semibold">{labels.sound}</span><small className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{labels.soundHint}</small></div>
        <button type="button" className={switchClass} role="switch" aria-checked={props.soundEnabled} onClick={props.onToggleSound}>
          {props.soundEnabled ? labels.enabled : labels.disabled}
        </button>
      </div>}

      {props.event.effects?.decorationsEnabled && <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-[#313131]">
        <div><span className="block text-sm font-semibold">{labels.motion}</span>{props.reducedMotion && <small className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{labels.reduced}</small>}</div>
        <button type="button" className={switchClass} role="switch" aria-checked={props.motionEnabled} disabled={!props.canEnableMotion} onClick={props.onToggleMotion}>
          {props.motionEnabled ? labels.enabled : labels.disabled}
        </button>
      </div>}

      {props.canEnableScares && <div className="mt-4 border-t border-slate-200 pt-4 dark:border-[#313131]">
        <div className="flex items-center justify-between gap-3">
          <div><span className="block text-sm font-semibold">{labels.surprise}</span><small className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{labels.surpriseHint}</small></div>
          <button type="button" className={switchClass} role="switch" aria-checked={props.scaresEnabled} onClick={props.onToggleScares}>
            {props.scaresEnabled ? labels.enabled : labels.disabled}
          </button>
        </div>
        {props.scaresEnabled && <button type="button" className={`${actionClass} mt-3 w-full`} onClick={props.onPlayScareSound}>{labels.playEffect}</button>}
      </div>}

      <button type="button" className={`${actionClass} mt-4 w-full`} onClick={props.onToggleTheme}>
        {props.dismissed ? labels.on : labels.off}
      </button>
    </section>}

    <button
      ref={triggerRef}
      type="button"
      className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 px-2 text-base text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white${props.active ? '' : ' opacity-70'}`}
      aria-label={labels.open}
      aria-expanded={open}
      aria-controls="event-experience-settings"
      title={labels.open}
      onClick={() => setOpen((value) => !value)}
    >
      <span aria-hidden="true">{symbol}</span>
      {!props.active && <span className="sr-only">{isEn ? 'Theme currently hidden' : 'Tema oculto temporalmente'}</span>}
    </button>
  </div>;
}
