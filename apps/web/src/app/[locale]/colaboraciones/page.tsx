import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Briefcase, Building2, Award, Calendar, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alianzas Profesionales y Licensing — Las Aventuras de Curileta',
  description: 'Oportunidades de colaboración para editoriales, licenciatarios, eventos y marcas con valores compartidos.',
};

export default async function CollaborationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const sectors = [
    {
      title: 'Derechos Editoriales & Coedición',
      desc: 'Licencias internacionales de traducción y publicación de los libros de Curileta en Europa y América.',
      icon: <Building2 className="w-8 h-8 text-emerald-400" />,
    },
    {
      title: 'Licensing de Producto & Merchandising',
      desc: 'Desarrollo de líneas de producto oficiales en categorías de papelería, juguetes, moda y juegos de mesa.',
      icon: <Award className="w-8 h-8 text-amber-400" />,
    },
    {
      title: 'Experiencias Educativas & Eventos',
      desc: 'Talleres en bibliotecas, visitas a centros escolares y espectáculos en festivales de literatura infantil.',
      icon: <Calendar className="w-8 h-8 text-sky-400" />,
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal B2B & Licencias</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Alianzas que inspiran al mundo
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Curileta es una marca comprometida con el descubrimiento cultural, el cuidado del planeta y la curiosidad infantil. Buscamos socios alineados con nuestros valores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sectors.map((sector) => (
            <div
              key={sector.title}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 shadow-xl"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                  {sector.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{sector.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{sector.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Trigger Box */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/30 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-white">¿Representas a una editorial o marca?</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Hablemos sobre cómo llevar las aventuras de Curileta a nuevos formatos o mercados geográficos.
          </p>
          <Link
            href={`/${locale}/contacto`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all"
          >
            <span>Iniciar propuesta de colaboración</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
