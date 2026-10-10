'use client';

import React, { use, useState } from 'react';
import { Locale } from '@curileta/i18n';
import { Mail, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'general', es: 'Consulta general', en: 'General enquiry' },
  { id: 'editorial', es: 'Editorial y derechos de publicación', en: 'Publishing and rights' },
  { id: 'licensing', es: 'Licencias y colaboraciones', en: 'Licensing and partnerships' },
  { id: 'press', es: 'Prensa y comunicación', en: 'Press and media' },
  { id: 'education', es: 'Centros educativos', en: 'Education' },
  { id: 'events', es: 'Eventos y charlas', en: 'Events and talks' },
];

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isEn = locale === 'en';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    category: 'general',
    message: '',
    adultConsent: false,
    privacyConsent: false,
    honeypot: '', // Campo oculto antispam
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      // Detección de bot por honeypot
      return;
    }

    if (!formData.adultConsent || !formData.privacyConsent) {
      setError(isEn
        ? 'Please confirm that you are an adult and accept the privacy policy.'
        : 'Debes confirmar que eres mayor de edad y aceptar la política de privacidad.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = res.status === 503
          ? (isEn ? 'The form is not connected to an email service yet.' : 'El formulario todavía no está conectado al servicio de correo.')
          : (isEn ? 'We could not send your message. Please try again later.' : 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.');
        throw new Error(message);
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (isEn ? 'There was a problem processing your message.' : 'Se produjo un problema al procesar el mensaje.'));
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-[#f7f8f3] py-16 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Mail className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{isEn ? 'Contact the team' : 'Contacto'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Let’s talk' : 'Ponte en contacto'}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? 'For publishing, media, partnerships, education and family enquiries. This form is intended for adults.'
              : 'Para consultas editoriales, prensa, colaboraciones, educación y familias. Este formulario está dirigido a personas adultas.'}
          </p>
        </div>

        {/* Protection Note */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900 dark:text-white">{isEn ? 'Privacy for children:' : 'Privacidad infantil:'}</strong>{' '}
            {isEn
              ? 'This form is only for adults such as parents, guardians, educators and professionals. Do not send personal information about a child.'
              : 'Este formulario está reservado a madres, padres, tutores, docentes y profesionales. No envíes datos personales de menores.'}
          </p>
        </div>

        {submitted ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-500/40 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{isEn ? 'Your message has been sent.' : 'Tu mensaje se ha enviado.'}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {isEn ? 'The message reached the Curileta team. We’ll reply as soon as we can.' : 'El mensaje ha llegado al equipo de Curileta. Te responderemos lo antes posible.'}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 space-y-6 shadow-xl dark:shadow-2xl"
          >
            {error && (
              <div className="p-4 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span role="alert">{error}</span>
              </div>
            )}

            {/* Honeypot invisible para bots */}
            <input
              type="text"
              name="curileta_website_hp"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Name *' : 'Nombre y apellidos *'}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isEn ? 'Your full name' : 'Tu nombre completo'}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Contact email *' : 'Correo electrónico de contacto *'}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={isEn ? 'you@example.com' : 'ejemplo@entidad.com'}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-company" className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Organisation (optional)' : 'Organización o empresa (opcional)'}
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={isEn ? 'Publisher, media or school' : 'Editorial, medio o colegio'}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label htmlFor="contact-category" className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Topic *' : 'Motivo de la consulta *'}
                </label>
                <select
                  id="contact-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isEn ? c.en : c.es}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isEn ? 'Message *' : 'Mensaje *'}
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isEn ? 'Tell us how we can help...' : 'Cuéntanos cómo podemos ayudarte...'}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Checkboxes de consentimiento obligatorio */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.adultConsent}
                  onChange={(e) => setFormData({ ...formData, adultConsent: e.target.checked })}
                  className="mt-1 rounded text-emerald-600 focus:ring-emerald-400 w-4 h-4"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {isEn ? 'I confirm that I am 18 or older and am contacting you as an adult or legal guardian. *' : 'Confirmo que tengo 18 años o más y realizo esta consulta como persona adulta o representante legal. *'}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  className="mt-1 rounded text-emerald-600 focus:ring-emerald-400 w-4 h-4"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {isEn ? 'I have read and accept the privacy policy and the use of my data to answer this enquiry. *' : 'He leído y acepto la política de privacidad y el uso de mis datos para responder a esta consulta. *'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full font-black text-sm bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-950" />
              <span>{loading ? (isEn ? 'Sending...' : 'Enviando...') : (isEn ? 'Send message' : 'Enviar mensaje')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
