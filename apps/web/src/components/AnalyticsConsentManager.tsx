'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT,
  getGoogleAnalyticsConsent,
  isAnalyticsDoNotTrackEnabled,
  isGoogleAnalyticsConfigured,
  saveGoogleAnalyticsConsent,
  type GoogleAnalyticsConsentChoice,
} from '@curileta/analytics';
import { useClientHydrated } from '@/lib/browser-storage';

const OPEN_PREFERENCES_EVENT = 'curileta:open-analytics-preferences';

export function openAnalyticsPreferences(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

function subscribeToConsent(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onChange);
  window.addEventListener(GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT, onChange);
  };
}

export function AnalyticsConsentManager() {
  const pathname = usePathname();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const mounted = useClientHydrated();
  const consentChoice = useSyncExternalStore(subscribeToConsent, getGoogleAnalyticsConsent, () => null);
  const isEn = pathname === '/en' || pathname.startsWith('/en/');

  useEffect(() => {
    const openPreferences = () => {
      setPreferencesOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
  }, []);

  const visible = isGoogleAnalyticsConfigured()
    && !isAnalyticsDoNotTrackEnabled()
    && (preferencesOpen || (mounted && !consentChoice));

  function choose(choice: GoogleAnalyticsConsentChoice) {
    saveGoogleAnalyticsConsent(choice);
    setPreferencesOpen(false);
  }

  if (!visible || pathname === '/admin' || pathname.startsWith('/admin/')) return null;

  return (
    <aside
      aria-label={isEn ? 'Optional analytics preferences' : 'Preferencias de analítica opcional'}
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-[#181818] dark:text-white"
    >
      <h2 className="text-lg font-semibold">
        {isEn ? 'Choose whether to allow analytics' : 'Elige si permites la analítica'}
      </h2>
      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {isEn
          ? 'Optional Google Analytics helps us understand which pages families use. It starts only after it is accepted. If you are under 18, please ask an adult in your family to choose. Rejecting it does not affect the site.'
          : 'Google Analytics nos ayuda a conocer qué páginas interesan a las familias. Solo se activa después de aceptarlo. Si eres menor, pide a una persona adulta de tu familia que elija. Rechazarlo no afecta al sitio.'}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {isEn
          ? 'You can change this choice in the footer. Read the '
          : 'Puedes cambiar tu elección en el pie de página. Lee la '}
        <Link
          href={`/${isEn ? 'en' : 'es'}/cookies`}
          className="rounded-sm font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        >
          {isEn ? 'cookie notice' : 'política de cookies'}
        </Link>
        {isEn ? ' for details.' : ' para más información.'}
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => choose('rejected')}
          className="min-h-12 flex-1 rounded-lg bg-[#1c493b] px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#27634e] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        >
          {isEn ? 'Reject analytics' : 'Rechazar analítica'}
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="min-h-12 flex-1 rounded-lg bg-[#1c493b] px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#27634e] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        >
          {isEn ? 'Accept analytics' : 'Aceptar analítica'}
        </button>
      </div>
    </aside>
  );
}
