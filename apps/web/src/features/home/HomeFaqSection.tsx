'use client';

import React, { useState } from 'react';
import type { Locale } from '@curileta/i18n';
import { ChevronDown, HelpCircle, Sparkles, Youtube } from 'lucide-react';
import Link from 'next/link';
import { generateFAQSchema } from '@curileta/seo';

interface HomeFaqSectionProps {
  locale: Locale;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  badge?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export function HomeFaqSection({ locale }: HomeFaqSectionProps) {
  const isEn = locale === 'en';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = isEn
    ? [
        {
          id: 'what-is-curileta',
          question: 'What is Curileta and what is this Spanish animated series about?',
          answer:
            'Curileta is an original Spanish animated series and adventure book collection for curious children and families. It follows the expeditions of a small, green lizard explorer and cartographer named Curileta. Alongside her loyal friend Pompon, the guardian of the enchanted forest, she journeys across continents visiting countries like Spain, Mexico, Peru, Egypt, Japan, Australia, and China while discovering geography, cultural diversity, and wildlife.',
          badge: 'Spanish Series',
        },
        {
          id: 'where-to-watch',
          question: 'Where can I watch episodes of the Curileta animated series?',
          answer:
            'Full episodes, songs, and animated travel shorts can be streamed directly on our official YouTube channel (@AventurasdeCurileta) and in the official Videos section on this website. All content is safe, family-friendly, and accessible for home and classroom viewing.',
          badge: 'Episodes & Streaming',
          actionUrl: `/${locale}/videos`,
          actionLabel: 'Watch episodes',
        },
        {
          id: 'recommended-age',
          question: 'What age group is the Curileta animated series designed for?',
          answer:
            'The animated series and illustrated books are tailored for children aged 3 to 9 years old, as well as curious families and educators. The pacing, visuals, and storytelling are intentionally designed to stimulate curiosity and cultural appreciation without digital overstimulation.',
          badge: 'Audience & Age',
        },
        {
          id: 'main-characters',
          question: 'Who are all the characters in the Curileta series?',
          answer:
            'The central protagonist is Curileta, an observant explorer with sticky gecko paws, a map backpack, and an insatiable appetite for discovery. Her companion is Pompon, a loyal creature who guards the forest. Along their worldwide journey, they meet international friends like Quetzal in Mexico, Lulu the Llama in Peru, Bao the Panda in China, Gino the Chef in Italy, Picu the Puffin in Iceland, and Baby Kangaroo in Australia.',
          badge: 'Characters',
          actionUrl: `/${locale}/personajes`,
          actionLabel: 'Meet the characters',
        },
        {
          id: 'books-and-learning',
          question: 'Are there also adventure books and educational materials?',
          answer:
            'Yes. Curileta features a celebrated collection of illustrated hardcover books (available internationally on Amazon and in select bookshops), printable activity sheets, travel postcards, downloadable wallpapers, and educational guides for families.',
          badge: 'Books & Resources',
          actionUrl: `/${locale}/libros`,
          actionLabel: 'Explore the books',
        },
        {
          id: 'original-production',
          question: 'Is Curileta an original Spanish animated production?',
          answer:
            'Yes. Curileta is an original audiovisual creation produced in Spain, featuring high quality Spanish voice acting alongside English language adaptations for international families.',
          badge: 'Spanish Production',
        },
        {
          id: 'travel-destinations',
          question: 'Which countries and world travel locations appear in the series?',
          answer:
            'The series takes families on a global expedition across Spain, Mexico (Chichen Itza), Peru (Machu Picchu), Egypt (the Pyramids and the Nile), Japan (Mount Fuji), Australia (the Outback and Great Barrier Reef), China (the Great Wall), and many more locations.',
          badge: 'World Travel',
          actionUrl: `/${locale}/destinos`,
          actionLabel: 'Explore destinations',
        },
        {
          id: 'release-schedule',
          question: 'How often are new episodes and songs released?',
          answer:
            'Our creative studio releases animated episodes, country songs, and interactive letters on a regular monthly schedule. You can follow upcoming milestones in our Universe section or subscribe to the official YouTube channel for immediate premiere notifications.',
          badge: 'Premieres',
        },
      ]
    : [
        {
          id: 'que-es-curileta',
          question: '¿Qué es Curileta y de qué trata la serie animada española?',
          answer:
            'Curileta es una serie animada española infantil y una colección de libros de aventuras concebida para familias y niños curiosos. Narra las expediciones de una pequeña lagartija exploradora y cartógrafa de piel verde llamada Curileta. Acompañada por su inseparable amigo Pompón, el guardián del bosque encantado, recorre los cinco continentes descubriendo geografía, diversidad cultural, respeto por la naturaleza y el valor de la amistad.',
          badge: 'Serie Española',
        },
        {
          id: 'donde-ver-episodios',
          question: '¿Dónde puedo ver los episodios y capítulos de la serie animada en español?',
          answer:
            'Todos los episodios oficiales de la serie animada, canciones temáticas y vídeos cortos están disponibles de forma gratuita y segura en nuestro canal oficial de YouTube (@AventurasdeCurileta) y en la sección oficial de vídeos de esta misma web. Es un entorno 100% familiar, educativo y libre de sobreestimulación.',
          badge: 'Episodios y Streaming',
          actionUrl: `/${locale}/videos`,
          actionLabel: 'Ver episodios',
        },
        {
          id: 'edades-recomendadas',
          question: '¿Para qué edades está recomendada la serie infantil de Curileta?',
          answer:
            'La serie animada y sus libros ilustrados están especialmente diseñados para niños y niñas de 3 a 9 años, así como para familias, educadores y colegios que buscan entretenimiento didáctico de alta calidad, estimulante para el aprendizaje y con valores humanos positivos.',
          badge: 'Público y Edad',
        },
        {
          id: 'personajes-principales',
          question: '¿Quiénes son los personajes de la serie animada Curileta?',
          answer:
            'Los protagonistas son Curileta, la exploradora de sombrero y mochila de mapas, y Pompón, el fiel guardián del bosque encantado. En sus viajes por el mundo se unen amigos entrañables de cada país: Quetzal en México, Lulú la llama en Perú, Bao el panda en China, Gino el ratón chef en Italia, Picu el frailecillo en Islandia, Kiki el kiwi en Nueva Zelanda, y Mamá Canguro junto a Canguro Bebé en Australia.',
          badge: 'Personajes',
          actionUrl: `/${locale}/personajes`,
          actionLabel: 'Conoce los personajes',
        },
        {
          id: 'libros-y-materiales',
          question: '¿Curileta cuenta también con libros y material didáctico?',
          answer:
            'Sí. Las Aventuras de Curileta dispone de una colección de libros ilustrados de tapa dura disponibles internacionalmente en Amazon y librerías, además de láminas y recortables para imprimir en casa, cartas interactivas y fondos de pantalla descargables.',
          badge: 'Libros y Recursos',
          actionUrl: `/${locale}/libros`,
          actionLabel: 'Ver libros',
        },
        {
          id: 'produccion-original',
          question: '¿Por qué es una serie animada española y qué valores transmite?',
          answer:
            'Las Aventuras de Curileta es una producción de animación española creada para aportar contenido educativo sereno, sin sobreestimulación digital. Transmite curiosidad científica, geografía universal, amor por los animales y diversidad cultural a través de emocionantes viajes por el mundo.',
          badge: 'Animación Española',
        },
        {
          id: 'destinos-y-viajes',
          question: '¿Qué países y localizaciones del mundo se visitan en la serie?',
          answer:
            'La serie transporta a los niños por paradas reales de todo el planeta: España (Picos de Europa y bosque encantado), México (Chichén Itzá), Perú (Machu Picchu), Egipto (pirámides y río Nilo), Japón (Kioto y Monte Fuji), Australia (Gran Barrera y Outback) y China (la Gran Muralla y bosques de bambú).',
          badge: 'Viajes por el Mundo',
          actionUrl: `/${locale}/destinos`,
          actionLabel: 'Explorar destinos',
        },
        {
          id: 'estrenos-nuevos',
          question: '¿Con qué frecuencia se estrenan nuevas aventuras y canciones?',
          answer:
            'El universo de Curileta se amplía continuamente con estrenos periódicos de episodios animados, canciones temáticas de nuevos países y cartas interactivas. Puedes seguir la hoja de ruta en nuestra web y suscribirte al canal de YouTube para no perderte ningún estreno.',
          badge: 'Estrenos',
        },
      ];

  const faqSchema = generateFAQSchema(
    faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  );

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="faq-section-title"
      className="relative isolate overflow-hidden border-t border-[var(--border-subtle)] bg-[#FAFDF7] px-5 py-24 text-[#20352c] transition-colors duration-500 dark:border-[#272727] dark:bg-[#181818] dark:text-white sm:px-8 sm:py-28 lg:px-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-300">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{isEn ? 'Frequently Asked Questions' : 'Preguntas frecuentes'}</span>
          </div>

          <h2
            id="faq-section-title"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            {isEn
              ? 'Everything you need to know about the Curileta series.'
              : 'Todo sobre la serie animada y el universo de Curileta.'}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#5c6b61] dark:text-slate-300"
            style={{ textWrap: 'pretty' }}
          >
            {isEn
              ? 'Answers about episodes, books, characters, and educational values for curious families and educators.'
              : 'Respuestas sobre episodios, libros infantiles, personajes y valores educativos para familias y colegios.'}
          </p>
        </div>

        <div className="mt-12 divide-y divide-emerald-900/10 rounded-2xl border border-emerald-900/10 bg-white shadow-sm dark:divide-[#313131] dark:border-[#313131] dark:bg-[#1F1F1F]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id} className="transition-colors duration-200">
                <button
                  type="button"
                  id={`faq-btn-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-emerald-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:hover:bg-[#272727]"
                >
                  <div className="flex flex-col gap-1 pr-2 sm:flex-row sm:items-center sm:gap-3">
                    {faq.badge && (
                      <span className="inline-flex w-fit items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        {faq.badge}
                      </span>
                    )}
                    <span className="font-display text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-slate-800 dark:text-emerald-300 ${
                      isOpen ? 'rotate-180 bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className={`grid transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-1">
                      <p
                        className="text-base leading-7 text-[#5c6b61] dark:text-slate-300"
                        style={{ textWrap: 'pretty' }}
                      >
                        {faq.answer}
                      </p>
                      {faq.actionUrl && faq.actionLabel && (
                        <div className="mt-4">
                          <Link
                            href={faq.actionUrl}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <span>{faq.actionLabel}</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-6 dark:border-[#313131] dark:bg-[#1F1F1F] sm:flex-row">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {isEn
                ? 'Looking for more details about the animated series or collaborations?'
                : '¿Buscas más información sobre la serie animada o colaboraciones?'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/videos`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:underline dark:text-emerald-300"
            >
              <Youtube className="h-4 w-4 text-red-600" aria-hidden="true" />
              <span>{isEn ? 'Watch Videos' : 'Ver vídeos'}</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
              •
            </span>
            <Link
              href={`/${locale}/contacto`}
              className="text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:underline dark:text-emerald-300"
            >
              {isEn ? 'Contact us' : 'Contacto'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
