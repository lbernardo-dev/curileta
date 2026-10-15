'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Locale } from '@curileta/i18n';
import { Compass, Sparkles } from 'lucide-react';

interface TaglineRevealSectionProps {
  locale: Locale;
}

export function TaglineRevealSection({ locale }: TaglineRevealSectionProps) {
  const isEn = locale === 'en';
  const sectionRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState<number>(0);

  const allWords = React.useMemo(() => {
    const textLines = isEn
      ? [
          'The world cannot fit inside a single tree.',
          'Every journey sparks a question and every friend leaves a trail.',
        ]
      : [
          'El mundo no cabe en un solo árbol.',
          'Cada viaje enciende una pregunta y cada amigo deja una huella.',
        ];

    return textLines.flatMap((line) =>
      line.split(' ').map((word, wordIndex) => ({
        word,
        isLastOfLine: wordIndex === line.split(' ').length - 1,
      }))
    );
  }, [isEn]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.top > 0) {
            setRevealedCount(0);
          }
          return;
        }

        const updateReveal = () => {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight || 800;

          // Trigger range: starts when top is at 75% viewport, finishes when top reaches 25% viewport
          const startTrigger = windowHeight * 0.85;
          const endTrigger = windowHeight * 0.25;
          const progress = Math.min(
            1,
            Math.max(0, (startTrigger - rect.top) / (startTrigger - endTrigger))
          );

          const targetCount = Math.round(progress * allWords.length);
          setRevealedCount((prev) => (prev === targetCount ? prev : targetCount));
        };

        const handleScroll = () => {
          if (rafId !== null) return;
          rafId = window.requestAnimationFrame(() => {
            updateReveal();
            rafId = null;
          });
        };

        updateReveal();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleScroll);
          if (rafId !== null) window.cancelAnimationFrame(rafId);
        };
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [allWords.length]);

  return (
    <section
      ref={sectionRef}
      aria-label={isEn ? 'Core philosophy' : 'Filosofía central'}
      className="relative isolate overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--background-canvas,#FAFDF7)] px-5 py-24 transition-colors duration-500 dark:border-[#272727] dark:bg-[#131209] sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-[680px] text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--background-secondary,#f8fafc)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--seasonal-accent-strong,#b45309)] shadow-sm dark:border-[#313131] dark:bg-[#1f1f1f]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-adventure-gold,#f59e0b)]" aria-hidden="true" />
          <span>{isEn ? 'The Spirit of Exploration' : 'El espíritu de la exploración'}</span>
        </div>

        <p
          className="font-display text-3xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-5xl"
          style={{ textWrap: 'balance' }}
        >
          {allWords.map(({ word, isLastOfLine }, index) => {
            const isRevealed = index < revealedCount;
            return (
              <React.Fragment key={`${word}-${index}`}>
                <span
                  className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isRevealed
                      ? 'scale-100 text-slate-950 opacity-100 blur-0 dark:text-white'
                      : 'scale-[0.98] text-slate-400 opacity-25 blur-[0.5px] dark:text-slate-600'
                  }`}
                >
                  {word}
                </span>
                {isLastOfLine ? (
                  <span className="block h-2 sm:h-3" aria-hidden="true" />
                ) : (
                  ' '
                )}
              </React.Fragment>
            );
          })}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 text-xs font-medium text-[var(--text-muted,#64748b)]">
          <Compass className="h-4 w-4 text-[var(--color-adventure-gold,#f59e0b)]" aria-hidden="true" />
          <span>{isEn ? 'Curileta & Pompón' : 'Curileta y Pompón'}</span>
        </div>
      </div>
    </section>
  );
}
