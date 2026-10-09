'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Mail, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: 'Consulta General' },
  { id: 'editorial', label: 'Editorial & Derechos de Publicación' },
  { id: 'licensing', label: 'Licensing & Colaboraciones de Marca' },
  { id: 'press', label: 'Prensa & Comunicación' },
  { id: 'education', label: 'Centros Educativos & Colegios' },
  { id: 'events', label: 'Eventos & Charlas' },
];

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      // Detección de bot por honeypot
      return;
    }

    if (!formData.adultConsent || !formData.privacyConsent) {
      setError('Debes confirmar que eres mayor de edad y aceptar la política de privacidad.');
      return;
    }

    // Éxito en la validación client-side
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Centro Oficial de Contacto</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ponte en contacto
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Canal oficial para editoriales, medios de comunicación, acuerdos de licencia y familias. Todos los mensajes son gestionados por el equipo responsable de Las Aventuras de Curileta.
          </p>
        </div>

        {/* Protection Note */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Aviso de Privacidad Infantil:</strong> Este formulario está dirigido estrictamente a personas adultas (madres, padres, tutores, docentes o profesionales del sector). No recopilamos datos personales de menores de edad.
          </p>
        </div>

        {submitted ? (
          <div className="p-10 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">¡Mensaje recibido con éxito!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Hemos redirigido tu solicitud al departamento correspondiente ({formData.category}). Te responderemos con la mayor brevedad posible.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 space-y-6 shadow-2xl"
          >
            {error && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
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
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Correo Electrónico Profesional o de Contacto *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@entidad.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Organización / Empresa (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Editorial, medio o colegio"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Categoría de la Consulta *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Mensaje o Propuesta *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe tu propuesta, consulta o solicitud con detalle..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                <span className="text-xs text-slate-300">
                  Confirmo expresamente que soy mayor de edad (18 años o más) y realizo esta consulta en calidad de persona adulta o representante legal. *
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
                <span className="text-xs text-slate-300">
                  He leído y acepto la política de privacidad y el tratamiento de datos para responder a mi solicitud. *
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full font-black text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-950" />
              <span>Enviar Mensaje al Equipo Oficial</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
