'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@curileta/i18n';
import { Heart, Sparkles, Feather, Compass, Smile, ArrowRight } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  species: string;
  role: string;
  quote: string;
  color: string;
  badgeBg: string;
  description: string;
  icon: React.ReactNode;
}

const FRIENDS: Friend[] = [
  {
    id: 'curileta',
    name: 'Curileta',
    species: 'Aventurera principal',
    role: 'Líder de la expedición y exploradora nata',
    quote: '«¡El mundo es demasiado asombroso para quedarse quieto!»',
    color: 'from-emerald-500 to-green-600',
    badgeBg: 'bg-emerald-600',
    description: 'Valiente, bondadosa y eternamente curiosa. Lleva siempre su mapa y su brújula mágica.',
    icon: <Compass className="w-8 h-8 text-white" />,
  },
  {
    id: 'pompon',
    name: 'Pompón',
    species: 'Conejo del Bosque Encantado',
    role: 'El fiel compañero prudente',
    quote: '«Revisemos la mochila dos veces... ¡por si acaso hay zanahorias!»',
    color: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-amber-500',
    description: 'Tierno, precavido y con un corazón gigantesco. Nunca deja a un amigo atrás.',
    icon: <Smile className="w-8 h-8 text-white" />,
  },
  {
    id: 'quetzal',
    name: 'Quetzal',
    species: 'Ave sagrada de Mesoamérica',
    role: 'El vigía de los vientos',
    quote: '«Desde las alturas, todas las fronteras son sólo ríos y valles.»',
    color: 'from-teal-400 to-emerald-600',
    badgeBg: 'bg-teal-600',
    description: 'Sabio guardián de los cielos y los bosques tropicales. Guía a Curileta en México.',
    icon: <Feather className="w-8 h-8 text-white" />,
  },
  {
    id: 'lulu',
    name: 'Lulú',
    species: 'Nutria marina de las islas',
    role: 'La experta en risas y corrientes',
    quote: '«¡Sigue el ritmo de las olas y siempre llegarás a buen puerto!»',
    color: 'from-sky-400 to-blue-600',
    badgeBg: 'bg-sky-600',
    description: 'Alegre, juguetona y maestra de la natación. Hace amigos en cada costa.',
    icon: <Heart className="w-8 h-8 text-white" />,
  },
];

export const FriendsScene: React.FC<{ locale: Locale }> = ({ locale }) => {
  const [activeFriend, setActiveFriend] = useState<string>('curileta');

  return (
    <section id="escena-amigos" className="py-28 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Escena 04 — Los Amigos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Nadie viaja solo por el mundo
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/80">
            Cada rincón del planeta tiene sus propios guardianes, animales sabios y amigos que se unen al viaje.
          </p>
        </div>

        {/* Spatial Cards Grid / Interactive Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FRIENDS.map((friend) => {
            const isSelected = activeFriend === friend.id;
            return (
              <div
                key={friend.id}
                onMouseEnter={() => setActiveFriend(friend.id)}
                onClick={() => setActiveFriend(friend.id)}
                className={`relative rounded-3xl p-7 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-2 border-amber-400 shadow-2xl shadow-emerald-500/20 -translate-y-2'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Avatar Icon Circle */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${friend.color} p-0.5 shadow-lg mb-6 flex items-center justify-center`}>
                    <div className="w-full h-full rounded-[14px] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
                      {friend.icon}
                    </div>
                  </div>

                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white ${friend.badgeBg} mb-3`}>
                    {friend.species}
                  </span>

                  <h3 className="text-2xl font-black text-white tracking-tight">{friend.name}</h3>
                  <p className="text-xs font-bold text-amber-400 mt-1 mb-4">{friend.role}</p>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {friend.description}
                  </p>
                </div>

                <div>
                  <blockquote className="border-l-2 border-emerald-500 pl-3 py-1 text-xs italic text-emerald-200/90 mb-6">
                    {friend.quote}
                  </blockquote>

                  <Link
                    href={`/${locale}/personajes/${friend.id}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-amber-400 hover:text-amber-300 uppercase tracking-wider group"
                  >
                    <span>Ver ficha completa</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global CTA for Characters */}
        <div className="mt-14 text-center">
          <Link
            href={`/${locale}/personajes`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
          >
            <span>Explorar todos los personajes del universo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
