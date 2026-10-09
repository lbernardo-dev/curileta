import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cookie, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies — Las Aventuras de Curileta',
  description:
    'Información clara sobre el uso responsable y mínimo de cookies en la web oficial de Las Aventuras de Curileta.',
};

export default async function CookiesPage({
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
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Política de Cookies
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Uso responsable, ético y sin rastreo comercial
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">1. ¿Qué son las cookies?</h2>
            <p>
              Una cookie es un pequeño archivo de texto que los sitios web almacenan en su navegador para recordar preferencias técnicas (como el idioma seleccionado o la sesión activa).
            </p>
          </section>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">2. Nuestro compromiso con la privacidad</h2>
            <p>
              En *Las Aventuras de Curileta* aplicamos el principio de **mínima recopilación**:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cero cookies de publicidad comportamental:</strong> No utilizamos redes publicitarias de terceros para rastrear hábitos de navegación de familias ni de menores.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cookies técnicas estrictamente necesarias:</strong> Solo empleamos cookies técnicas imprescindibles para la navegación, como recordar si has seleccionado la versión en español o en inglés.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Vídeos sin rastreo previo:</strong> Al reproducir vídeos en la plataforma, utilizamos el modo de privacidad mejorada de YouTube (`youtube-nocookie.com`), que no almacena información de perfiles de usuario a menos que el visitante interactúe con el reproductor.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">3. Cómo gestionar o desactivar cookies</h2>
            <p>
              Puedes configurar tu navegador web en cualquier momento para bloquear o eliminar las cookies instaladas. Consulta la sección de ayuda de tu navegador habitual (Safari, Chrome, Firefox o Edge).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
