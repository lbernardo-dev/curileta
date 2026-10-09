import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Menores',
  description:
    'Nuestro compromiso inquebrantable con la protección de datos personales de menores de edad (RGPD-K / COPPA) y familias.',
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Privacidad y Protección Infantil
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Conformidad estricta con RGPD-K (Unión Europea) y COPPA (EE. UU.)
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">1. Nuestro Principio Fundamental</h2>
            <p>
              *Las Aventuras de Curileta* es un espacio lúdico y educativo. Creemos firmemente que la infancia debe navegar en un entorno seguro, libre de rastreo comercial invasivo, perfiles algorítmicos o publicidad dirigida.
            </p>
          </section>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">2. Compromisos Operativos con Menores</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cero recopilación de PII a menores:</strong> No solicitamos nombres, correos electrónicos, teléfonos ni direcciones postales a niños y niñas en ninguna sección de la plataforma.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Ausencia de chat o comunicación abierta entre usuarios:</strong> La plataforma no dispone de foros, mensajería instantánea ni cajas de comentarios no moderados.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Formularios restringidos a adultos:</strong> Tanto el formulario de contacto como la suscripción al boletín de noticias están explícitamente orientados a madres, padres, educadores y representantes profesionales.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Vídeos sin rastreo previo:</strong> Los reproductores de vídeo en la plataforma utilizan dominios de privacidad mejorada de YouTube (`youtube-nocookie.com`) y no se cargan automáticamente sin la interacción deliberada del visitante.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">3. Derechos del Usuario (ARCO)</h2>
            <p>
              Cualquier usuario o tutor legal puede solicitar la consulta, rectificación o eliminación inmediata de cualquier dato facilitado a través de nuestros canales de contacto dirigiéndose a <code className="text-amber-400 bg-slate-950 px-2 py-1 rounded">privacidad@curileta.com</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
