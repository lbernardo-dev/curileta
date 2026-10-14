'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GOOGLE_ANALYTICS_CONSENT_CHANGE_EVENT,
  clearGoogleAnalyticsCookies,
  clearGoogleAnalyticsConsent,
  clearLegacyGoogleAnalyticsConsent,
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
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const mounted = useClientHydrated();
  const consentChoice = useSyncExternalStore(subscribeToConsent, getGoogleAnalyticsConsent, () => null);
  const hasAdultConfirmation = adultConfirmed || consentChoice === 'accepted';
  const isEn = pathname === '/en' || pathname.startsWith('/en/');

  useEffect(() => {
    clearLegacyGoogleAnalyticsConsent();
    if (!isGoogleAnalyticsConfigured() || isAnalyticsDoNotTrackEnabled()) {
      clearGoogleAnalyticsConsent();
      return;
    }
    if (getGoogleAnalyticsConsent() !== 'accepted') clearGoogleAnalyticsCookies();
  }, []);

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
    saveGoogleAnalyticsConsent(choice, hasAdultConfirmation);
    if (choice === 'rejected') setAdultConfirmed(false);
    setPreferencesOpen(false);
  }

  if (!visible || pathname === '/admin' || pathname.startsWith('/admin/')) return null;

  return (
    <aside
      aria-label={isEn ? 'Cookie preferences' : 'Preferencias de cookies'}
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-100 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-[#181818] dark:text-white"
    >
      <h2 className="text-lg font-semibold">
        {isEn ? 'Choose your cookie preferences' : 'Elige tus preferencias de cookies'}
      </h2>
      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {isEn
          ? 'Optional cookies help us understand which parts of the site are useful to families and improve the experience. If you are under the age of adulthood where you live, ask an adult or your parent or guardian to choose. Rejecting them does not affect the site.'
          : 'Las cookies opcionales nos ayudan a conocer qué partes de la web resultan útiles a las familias y a mejorar la experiencia. Si aún no tienes la mayoría de edad en tu lugar de residencia, pide a una persona adulta o a tu madre, padre o tutor legal que elija. Rechazarlas no afecta al sitio.'}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {isEn
          ? 'You can change this choice in the footer. Read the '
          : 'Puedes cambiar tu elección en el pie de página. Lee la '}
        <Link
          href={`/${isEn ? 'en' : 'es'}/cookies`}
          className="rounded-xs font-semibold underline underline-offset-4 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        >
          {isEn ? 'cookie notice' : 'política de cookies'}
        </Link>
        {isEn ? ' for details.' : ' para más información.'}
      </p>
      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={hasAdultConfirmation}
          onChange={(event) => setAdultConfirmed(event.currentTarget.checked)}
          className="mt-1 size-4 shrink-0 accent-emerald-700 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        />
        <span>
          {isEn
            ? 'I confirm that I am an adult or an authorized parent or guardian making this choice.'
            : 'Confirmo que soy una persona adulta o madre, padre o tutor legal autorizado para tomar esta decisión.'}
        </span>
      </label>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => choose('rejected')}
          className="min-h-12 flex-1 rounded-lg bg-[#1c493b] px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-fluid hover:bg-[#27634e] active:scale-[0.98] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        >
          {isEn ? 'Reject optional cookies' : 'Rechazar cookies opcionales'}
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          disabled={!hasAdultConfirmation}
          className="min-h-12 flex-1 rounded-lg bg-[#1c493b] px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-fluid hover:bg-[#27634e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1c493b] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-300"
        >
          {isEn ? 'Accept optional cookies' : 'Aceptar cookies opcionales'}
        </button>
      </div>
    </aside>
  );
}
