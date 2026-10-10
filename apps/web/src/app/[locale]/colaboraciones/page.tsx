import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cmsProvider } from '@/lib/cms';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { ArrowRight, Award, BookOpen, BriefcaseBusiness, Building2, CalendarDays, Mail, Newspaper } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Partnerships', description: 'Ways publishers, educators, media teams and brands can propose a Curileta collaboration.' }
    : { title: 'Colaboraciones', description: 'Vías para proponer colaboraciones con Curileta desde editoriales, centros educativos, medios y marcas.' };
}

export default async function CollaborationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';
  const opportunities = await cmsProvider.getCollaborations(locale);
  const iconByName = { Building2, Award, Newspaper, BriefcaseBusiness };
  const iconFor = (name: string) => {
    const Icon = iconByName[name as keyof typeof iconByName] || BriefcaseBusiness;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'For organisations and professionals' : 'Para organizaciones y profesionales'}
      title={isEn ? 'Let’s explore a collaboration' : 'Exploremos una colaboración'}
      description={isEn
        ? 'Curileta welcomes thoughtful enquiries from people who want to bring stories, reading and world discovery to more families.'
        : 'Curileta recibe propuestas de personas y organizaciones que quieran acercar las historias, la lectura y el descubrimiento del mundo a más familias.'}
      icon={<BriefcaseBusiness className="h-4 w-4" />}
      width="wide"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {opportunities.map((item) => (
          <SitePageCard key={item.id} className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background-secondary)] text-[var(--seasonal-accent-strong)]">{iconFor(item.iconName)}</div>
            <h2 className="mt-5 font-display text-xl font-semibold">{item.title[locale] || item.title.es}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.desc[locale] || item.desc.es}</p>
          </SitePageCard>
        ))}
      </div>
      <SitePageCard className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-secondary)] text-[var(--seasonal-accent-strong)] sm:flex"><BookOpen className="h-5 w-5" /></div>
          <div>
            <h2 className="font-display text-xl font-semibold">{isEn ? 'A first conversation is all you need' : 'Basta con iniciar una conversación'}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {isEn
                ? 'These are areas of interest, not a promise that every programme or licence is currently available. Tell us who you are, what you have in mind and how to reach you.'
                : 'Estas son áreas de interés, no una promesa de que cada programa o licencia esté disponible ahora. Cuéntanos quién eres, qué propones y cómo podemos responderte.'}
            </p>
          </div>
        </div>
        <Link href={'/' + locale + '/contacto'} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]">
          <Mail className="h-4 w-4" />{isEn ? 'Send a proposal' : 'Enviar una propuesta'}<ArrowRight className="h-4 w-4" />
        </Link>
      </SitePageCard>
      <p className="inline-flex items-center gap-2 text-xs leading-5 text-[var(--text-secondary)]"><CalendarDays className="h-4 w-4 shrink-0" />{isEn ? 'Events, school visits and readings are arranged individually; no dates are confirmed through this page.' : 'Los eventos, visitas escolares y lecturas se acuerdan de forma individual; esta página no confirma fechas.'}</p>
    </SitePageLayout>
  );
}
