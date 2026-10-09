'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Sparkles, Book, Music, ShoppingBag, Calendar, Users, Radio } from 'lucide-react';

export const GrowingUniverseScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const branches = [
    {
      title: 'Nuevos Libros',
      desc: 'Nuevas expediciones en imprenta para todas las edades.',
      icon: <Book className="w-6 h-6 text-amber-400" />,
      badge: 'Editorial',
    },
    {
      title: 'Música & Canciones',
      desc: 'Banda sonora original para bailar y cantar el mapa.',
      icon: <Music className="w-6 h-6 text-emerald-400" />,
      badge: 'Audio',
    },
    {
      title: 'Eventos & Lecturas',
      desc: 'Encuentros en colegios, ferias del libro y festivales.',
      icon: <Calendar className="w-6 h-6 text-sky-400" />,
      badge: 'Comunidad',
    },
    {
      title: 'Merchandising Oficial',
      desc: 'Mochilas, peluches y cuadernos de explorador.',
      icon: <ShoppingBag className="w-6 h-6 text-rose-400" />,
      badge: 'Próximamente',
    },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Escena 08 — El Universo Sigue Creciendo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Más que una historia: una expedición viva
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/80">
            El mundo de Curileta se ramifica en nuevas experiencias físicas y digitales para acompañar el crecimiento de los niños.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {branches.map((b) => (
            <div
              key={b.title}
              className="rounded-3xl bg-slate-900/70 border border-emerald-500/20 p-6 flex flex-col justify-between hover:border-emerald-400/50 hover:bg-slate-900 transition-all shadow-xl group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
                  {b.badge}
                </span>
                <h3 className="text-xl font-black text-white mt-3 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
