import React from 'react';
import Link from 'next/link';
import type { Locale } from '@curileta/i18n';
import { ArrowLeft } from 'lucide-react';

interface SitePageLayoutProps {
  locale: Locale;
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  width?: 'narrow' | 'wide';
}

export const SitePageLayout: React.FC<SitePageLayoutProps> = ({
  locale,
  eyebrow,
  title,
  description,
  icon,
  children,
  width = 'narrow',
}) => (
  <div className="min-h-[calc(100vh-5rem)] bg-(--background-canvas) py-12 text-(--text-primary) transition-colors sm:py-20">
    <div className={`mx-auto px-5 sm:px-8 lg:px-12 ${width === 'wide' ? 'max-w-7xl' : 'max-w-5xl'}`}>
      <Link
        href={`/${locale}`}
        className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-(--text-secondary) transition hover:text-(--seasonal-accent-strong) focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--seasonal-accent-strong)"
      >
        <ArrowLeft className="h-4 w-4" />
        {locale === 'en' ? 'Back to home' : 'Volver al inicio'}
      </Link>

      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-(--background-secondary) px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--seasonal-accent-strong) ring-1 ring-(--border-subtle)">
          {icon}
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-(--text-primary) text-balance sm:text-5xl">{title}</h1>
        {description && <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-(--text-secondary) text-pretty">{description}</p>}
      </header>

      <div className="space-y-6">{children}</div>
    </div>
  </div>
);

export const SitePageCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <section className={`rounded-3xl bg-(--background-primary) p-6 shadow-xs ring-1 ring-(--border-subtle) sm:p-9 ${className}`}>
    {children}
  </section>
);
