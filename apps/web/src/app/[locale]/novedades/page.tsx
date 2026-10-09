import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, isValidLocale } from '@curileta/i18n';
import { notFound } from 'next/navigation';
import { Newspaper, Calendar, Sparkles, BookOpen, ArrowRight, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Novedades y Noticias Oficiales — Las Aventuras de Curileta',
  description: 'Últimas noticias sobre lanzamientos de libros, nuevos episodios animados, eventos y proyectos especiales.',
};

const NEWS_ARTICLES = [
  {
    id: 'lanzamiento-volumen-1-mexico',
    title: '¡Ya en librerías! «El Misterio del Quetzal Dorado» llega a toda España',
    category: 'Libros & Publicaciones',
    date: '15 de Mayo, 2026',
    excerpt: 'El primer volumen oficial de Las Aventuras de Curileta ya está disponible en las principales librerías. Una historia ilustrada que transporta a los lectores a las selvas de Teotihuacán.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'estreno-canal-youtube',
    title: 'Nuevo episodio animado: Curileta aprende el baile del Quetzal',
    category: 'YouTube & Animación',
    date: '28 de Mayo, 2026',
    excerpt: 'Estrenamos videoclip en el canal oficial de YouTube con música original para bailar y cantar en familia. ¡No te pierdas los pasos de Pompón!',
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  {
    id: 'feria-del-libro-madrid',
    title: 'Encuentro con lectores en la Feria del Libro',
    category: 'Eventos & Firmas',
    date: '04 de Junio, 2026',
    excerpt: 'Acompáñanos en una sesión especial de cuentacuentos y firma de ejemplares donde pequeños exploradores recibirán su carnet oficial de expedición.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
];

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="py-16 sm:py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Newspaper className="w-3.5 h-3.5 text-amber-400" />
            <span>Actualidad y Comunicados</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Novedades del Universo
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Mantente al día con los próximos lanzamientos, estrenos de canciones, firmas y proyectos educativos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {NEWS_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border backdrop-blur-md bg-slate-950/80 text-amber-400 border-slate-700">
                    {article.category}
                  </div>
                </div>

                <div className="p-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <time>{article.date}</time>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  href={`/${locale}/contacto`}
                  className="inline-flex items-center gap-2 text-xs font-black text-amber-400 hover:text-amber-300 uppercase tracking-wider"
                >
                  <span>Saber más sobre este evento</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
