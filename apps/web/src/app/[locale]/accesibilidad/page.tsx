import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye, ArrowLeft, CheckCircle2, Sparkles, Keyboard, Monitor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Declaración de Accesibilidad (WCAG 2.2 AA) — Las Aventuras de Curileta',
  description:
    'Compromiso de accesibilidad universal, navegación adaptada y soporte para tecnologías de asistencia en el universo de Curileta.',
};

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const features = [
    {
      title: 'Navegación Completa por Teclado',
      desc: 'Todas las secciones, botones, enlaces y formularios son accesibles mediante la tecla Tab, con indicadores de foco visibles y de alto contraste.',
      icon: <Keyboard className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: 'Modo de Movimiento Reducido (prefers-reduced-motion)',
      desc: 'Para personas con sensibilidad vestibular o mareo por movimiento, las animaciones complejas de scroll se desactivan automáticamente a favor de transiciones sutiles.',
      icon: <Monitor className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Compatibilidad con Lectores de Pantalla',
      desc: 'Estructura semántica HTML5 estricta (h1 a h6), enlaces de salto de navegación (Skip Links) y textos alternativos descriptivos en todas las ilustraciones.',
      icon: <Eye className="w-6 h-6 text-sky-400" />,
    },
  ];

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
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Declaración de Accesibilidad
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Conformidad con las pautas WCAG 2.2 Nivel AA
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">Compromiso con la Inclusión</h2>
            <p>
              Creemos firmemente que las aventuras y el aprendizaje deben estar al alcance de todos los niños, niñas y familias, independientemente de sus capacidades técnicas, sensoriales o motrices.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-bold text-base text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <section className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-6">
            <h2 className="text-xl font-bold text-white">Canal de Sugerencias y Reporte de Barreras</h2>
            <p>
              Si experimentas cualquier dificultad para acceder al contenido de este sitio web o deseas hacernos llegar una sugerencia de mejora, por favor contacta con nuestro equipo a través de <code className="text-amber-400 bg-slate-950 px-2 py-1 rounded">accesibilidad@curileta.com</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
