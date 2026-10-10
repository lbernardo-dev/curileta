'use client';

import { FormEvent, use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ContactFormConfig, ContactFormField } from '@/lib/forms/types';
import { localized } from '@/lib/forms/types';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
      }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

function inputClasses() {
  return 'min-h-12 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-slate-500 hover:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818] dark:text-white';
}

function fieldInitialValue(field: ContactFormField) {
  return field.type === 'checkbox' ? false : field.type === 'select' ? field.options?.[0]?.value || '' : '';
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = use(params);
  const isEn = locale === 'en';
  const [config, setConfig] = useState<ContactFormConfig | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notificationPending, setNotificationPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState('');
  const captchaContainer = useRef<HTMLDivElement>(null);
  const captchaWidget = useRef<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingConfig(true);
    fetch(`/api/forms/contact?locale=${locale}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo cargar el formulario.');
        const nextConfig = result.data as ContactFormConfig;
        setConfig(nextConfig);
        setAnswers(Object.fromEntries(nextConfig.fields.map((field) => [field.key, fieldInitialValue(field)])));
        setError('');
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        setError(isEn ? 'The contact form is not connected yet. Please try again later.' : 'El formulario de contacto todavía no está conectado. Inténtalo más tarde.');
      })
      .finally(() => setLoadingConfig(false));

    return () => controller.abort();
  }, [locale, isEn]);

  useEffect(() => {
    if (!config || !turnstileSiteKey || !captchaContainer.current) return;
    let disposed = false;
    let timeoutId: number | undefined;
    let attempts = 0;

    const renderWidget = () => {
      if (disposed) return;
      if (window.turnstile && captchaContainer.current) {
        captchaWidget.current = window.turnstile.render(captchaContainer.current, {
          sitekey: turnstileSiteKey,
          callback: (token) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => {
            setTurnstileToken('');
            setError(isEn ? 'Spam verification failed. Please try again.' : 'Falló la verificación antispam. Inténtalo de nuevo.');
          },
        });
        return;
      }
      attempts += 1;
      if (attempts > 80) {
        setError(isEn ? 'Spam verification could not load.' : 'No se pudo cargar la verificación antispam.');
        return;
      }
      timeoutId = window.setTimeout(renderWidget, 100);
    };

    if (!document.getElementById('curileta-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'curileta-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    renderWidget();

    return () => {
      disposed = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (captchaWidget.current && window.turnstile) {
        window.turnstile.remove(captchaWidget.current);
        captchaWidget.current = null;
      }
      setTurnstileToken('');
    };
  }, [config, isEn]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config) return;
    if (honeypot) return;
    if (turnstileSiteKey && !turnstileToken) {
      setError(isEn ? 'Complete spam verification before sending.' : 'Completa la verificación antispam antes de enviar.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formSlug: config.slug, locale, answers, honeypot, turnstileToken }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (captchaWidget.current && window.turnstile) {
          window.turnstile.reset(captchaWidget.current);
          setTurnstileToken('');
        }
        throw new Error(isEn ? 'We could not save your message. Check the form and try again.' : result.error || 'No se pudo guardar el mensaje. Revisa el formulario e inténtalo de nuevo.');
      }
      setNotificationPending(Boolean(result.notificationPending));
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (isEn ? 'We could not save your message. Please try again.' : 'No se pudo guardar el mensaje. Inténtalo de nuevo.'));
    } finally {
      setLoading(false);
    }
  }

  function updateAnswer(field: ContactFormField, value: string | boolean) {
    setAnswers((current) => ({ ...current, [field.key]: value }));
  }

  function renderField(field: ContactFormField) {
    const id = `contact-${field.key}`;
    const label = localized(field.label, locale);
    const value = answers[field.key];
    const requiredMark = field.required ? ' *' : '';

    if (field.type === 'checkbox') {
      return (
        <label key={field.key} htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 focus-within:ring-2 focus-within:ring-emerald-600 dark:text-slate-200 dark:hover:bg-[#272727]">
          <input
            id={id}
            name={field.key}
            type="checkbox"
            required={field.required}
            checked={value === true}
            onChange={(event) => updateAnswer(field, event.target.checked)}
            className="mt-1 size-4 accent-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600"
          />
          <span>
            {label}{requiredMark}
            {field.system === 'privacyConsent' && (
              <Link href={`/${locale}/privacidad`} className="ml-2 inline-block font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300">
                {isEn ? 'Read the privacy policy' : 'Leer la política de privacidad'}
              </Link>
            )}
          </span>
        </label>
      );
    }

    return (
      <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          {label}{requiredMark}
        </label>
        {field.type === 'select' ? (
          <select
            id={id}
            name={field.key}
            required={field.required}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => updateAnswer(field, event.target.value)}
            className={`${inputClasses()} cursor-pointer`}
          >
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>{localized(option.label, locale)}</option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={id}
            name={field.key}
            required={field.required}
            maxLength={field.maxLength || 10000}
            rows={5}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => updateAnswer(field, event.target.value)}
            placeholder={localized(field.placeholder, locale)}
            className={`${inputClasses()} min-h-24 resize-y`}
          />
        ) : (
          <input
            id={id}
            name={field.key}
            type={field.type}
            required={field.required}
            maxLength={field.maxLength || 1000}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => updateAnswer(field, event.target.value)}
            placeholder={localized(field.placeholder, locale)}
            autoComplete={field.system === 'email' ? 'email' : field.system === 'name' ? 'name' : 'off'}
            className={inputClasses()}
          />
        )}
      </div>
    );
  }

  const title = config ? localized(config.title, locale) : (isEn ? 'Contact the team' : 'Contacto');
  const description = config ? localized(config.description, locale) : (isEn ? 'For publishing, press, partnership, education and family enquiries.' : 'Para consultas editoriales, prensa, colaboraciones, educación y familias.');
  const consentFields = config?.fields.filter((field) => field.type === 'checkbox') || [];
  const regularFields = config?.fields.filter((field) => field.type !== 'checkbox') || [];

  return (
    <div className="min-h-screen bg-[#f7f8f3] px-4 py-16 text-slate-900 dark:bg-[#181818] dark:text-white sm:py-24">
      <main className="mx-auto w-full max-w-4xl">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-900 dark:border-[#313131] dark:bg-[#272727] dark:text-emerald-200">
            {isEn ? 'Contact the team' : 'Contacto'}
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="text-pretty mt-4 text-base leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </header>

        <section className="mb-8 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm leading-5 text-emerald-950 dark:border-[#313131] dark:bg-[#1f1f1f] dark:text-emerald-100">
          <strong>{isEn ? 'Privacy for children:' : 'Privacidad infantil:'}</strong>{' '}
          {isEn
            ? 'This form is for adults. Do not send personal information about a child.'
            : 'Este formulario está reservado a personas adultas. No envíes datos personales de menores.'}
        </section>

        {submitted ? (
          <section className="rounded-2xl border border-emerald-300 bg-white p-8 text-center dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-10" aria-live="polite">
            <h2 className="text-balance text-2xl font-bold">{isEn ? 'We received your message.' : 'Hemos recibido tu mensaje.'}</h2>
            <p className="text-pretty mx-auto mt-3 max-w-md text-base leading-6 text-slate-600 dark:text-slate-300">
              {notificationPending
                ? (isEn ? 'Your message is saved. The team will review it in the contact dashboard.' : 'Tu mensaje quedó guardado. El equipo lo revisará en el panel de consultas.')
                : (isEn ? 'The Curileta team will reply as soon as possible.' : 'El equipo de Curileta te responderá lo antes posible.')}
            </p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-8">
            {error && (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">
                {error}
              </p>
            )}

            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {loadingConfig ? (
              <div className="space-y-4" aria-label={isEn ? 'Loading form' : 'Cargando formulario'}>
                <div className="h-11 animate-pulse rounded-lg bg-slate-100 dark:bg-[#272727]" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100 dark:bg-[#272727]" />
                <div className="h-32 animate-pulse rounded-lg bg-slate-100 dark:bg-[#272727]" />
              </div>
            ) : config ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{regularFields.map(renderField)}</div>
                {consentFields.length > 0 && (
                  <fieldset className="space-y-2">
                    <legend className="mb-2 text-sm font-semibold">{isEn ? 'Confirmations' : 'Confirmaciones'}</legend>
                    {consentFields.map(renderField)}
                  </fieldset>
                )}
                {turnstileSiteKey && (
                  <div className="space-y-2">
                    <div ref={captchaContainer} aria-label={isEn ? 'Spam verification' : 'Verificación antispam'} />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || loadingConfig || Boolean(turnstileSiteKey && !turnstileToken)}
                  className="min-h-12 w-full rounded-lg bg-emerald-800 px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1f1f1f]"
                >
                  {loading ? (isEn ? 'Sending…' : 'Enviando…') : (isEn ? 'Send message' : 'Enviar mensaje')}
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {isEn ? 'The form is unavailable right now. Please try again later.' : 'El formulario no está disponible ahora. Inténtalo más tarde.'}
              </p>
            )}
          </form>
        )}
      </main>
    </div>
  );
}
