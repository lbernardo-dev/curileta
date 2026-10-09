import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Newspaper, Download, FileText, Image, Compass, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sala de Prensa y Media Kit — Las Aventuras de Curileta',
  description: 'Recursos gráficos de alta resolución, logos oficiales, biografías aprobadas y notas de prensa oficiales de Curileta.',
};

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const assets = [
    {
      title: 'Kit de Logos Vectoriales (SVG / PNG)',
      desc: 'Versiones principal, monocromática y versiones para fondo claro y oscuro.',
      format: 'ZIP (12 MB)',
      icon: <Image className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: 'Dossier de Marca & Biografía Oficial',
      desc: 'Sinopsis del universo narrativo, valores educativos y ficha de personajes aprobada.',
      format: 'PDF (8 MB)',
      icon: <FileText className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Banco de Ilustraciones en Alta Resolución',
      desc: 'Portadas de libros, renders de personajes con fondo transparente para medios.',
      format: 'ZIP (45 MB)',
      icon: <Download className="w-6 h-6 text-sky-400" />,
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Newspaper className="w-3.5 h-3.5 text-sky-400" />
            <span>Prensa & Comunicación</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Sala de Prensa y Recursos Oficiales
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Materiales aprobados para periodistas, medios culturales, revistas especializadas y creadores de contenido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {assets.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 shadow-xl"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                  {item.format}
                </span>
                <h2 className="text-xl font-bold text-white mt-4 mb-2">{item.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-6">
                <Link
                  href={`/${locale}/contacto`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Solicitar acceso a prensa</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/contacto`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm bg-white text-slate-950 hover:bg-slate-200 transition-all"
          >
            <span>Contactar con el responsable de comunicación</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
