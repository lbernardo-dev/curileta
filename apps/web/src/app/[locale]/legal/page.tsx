import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aviso Legal y Términos de Uso — Las Aventuras de Curileta',
  description:
    'Aviso legal, titularidad de marca y condiciones de uso del sitio web oficial de Las Aventuras de Curileta.',
};

export default async function LegalNoticePage({
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
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Aviso Legal
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Información general y propiedad intelectual
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">1. Titularidad del Sitio Web</h2>
            <p>
              El presente sitio web oficial de *Las Aventuras de Curileta* es propiedad y está administrado por el equipo de producción editorial y marca oficial de Curileta con sede en España.
            </p>
            <p>
              Para cualquier consulta legal o comercial, puede dirigirse a través de nuestro canal unificado en la sección de <Link href={`/${locale}/contacto`} className="text-amber-400 underline">contacto</Link> o por correo a <code className="text-emerald-400 bg-slate-950 px-2 py-1 rounded">legal@curileta.com</code>.
            </p>
          </section>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">2. Propiedad Intelectual e Industrial</h2>
            <p>
              Todos los contenidos de este sitio web, incluyendo de forma no limitativa: el nombre comercial *Curileta*, los personajes (Curileta, Pompón, Quetzal, Lulú), textos narrativos, ilustraciones originales, música, logotipos, vídeos y diseños son creaciones protegidas por la legislación española e internacional de propiedad intelectual y derechos de autor.
            </p>
            <p>
              Queda estrictamente prohibida la reproducción, distribución, comunicación pública o transformación de estos elementos con fines comerciales sin la autorización previa y por escrito de los titulares de los derechos.
            </p>
          </section>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">3. Licencias y Uso Educativo</h2>
            <p>
              Colegios, centros educativos y bibliotecas públicas que deseen utilizar material complementario o solicitar visitas de autor pueden hacerlo a través del formulario de <Link href={`/${locale}/colaboraciones`} className="text-amber-400 underline">colaboraciones educativas</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
