import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { ArrowRight, Image, Mail, Newspaper, Quote, UserRound } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Press and media', description: 'Press enquiries and requests for approved Curileta information and images.' }
    : { title: 'Prensa y medios', description: 'Consultas de prensa y solicitudes de información e imágenes aprobadas de Curileta.' };
}

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';
  const requests = isEn
    ? [
        { icon: <Newspaper className="h-5 w-5" />, title: 'Editorial information', text: 'Ask for a verified synopsis, publication details or book information.' },
        { icon: <Image className="h-5 w-5" />, title: 'Image permissions', text: 'Request approved artwork for a specific article, programme or publication.' },
        { icon: <Quote className="h-5 w-5" />, title: 'Interview or comment', text: 'Send the outlet, subject, deadline and format for your request.' },
      ]
    : [
        { icon: <Newspaper className="h-5 w-5" />, title: 'Información editorial', text: 'Solicita una sinopsis verificada, datos de publicación o información del libro.' },
        { icon: <Image className="h-5 w-5" />, title: 'Permisos de imagen', text: 'Solicita ilustraciones aprobadas para un artículo, programa o publicación concretos.' },
        { icon: <Quote className="h-5 w-5" />, title: 'Entrevistas y declaraciones', text: 'Indica el medio, el tema, el plazo y el formato de tu solicitud.' },
      ];

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'For journalists and media' : 'Para periodistas y medios'}
      title={isEn ? 'Press room' : 'Sala de prensa'}
      description={isEn
        ? 'We can review requests for information and approved assets. There are no public downloadable media-kit files at this time.'
        : 'Podemos revisar solicitudes de información y materiales aprobados. Actualmente no hay archivos descargables de prensa.'}
      icon={<Newspaper className="h-4 w-4" />}
      width="wide"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {requests.map((item) => (
          <SitePageCard key={item.title}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--background-secondary)] text-[var(--seasonal-accent-strong)]">{item.icon}</div>
            <h2 className="mt-5 font-display text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.text}</p>
          </SitePageCard>
        ))}
      </div>
      <SitePageCard className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <UserRound className="mt-1 h-5 w-5 shrink-0 text-[var(--seasonal-accent-strong)]" />
          <div>
            <h2 className="font-display text-xl font-semibold">{isEn ? 'Tell us about your request' : 'Cuéntanos qué necesitas'}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {isEn
                ? 'Please include your name, outlet, intended use and deadline. Requests are reviewed individually and do not guarantee that a specific asset or interview is available.'
                : 'Incluye tu nombre, medio, uso previsto y plazo. Revisamos cada solicitud de forma individual; no podemos garantizar la disponibilidad de un material o entrevista concretos.'}
            </p>
          </div>
        </div>
        <Link href={'/' + locale + '/contacto'} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]">
          <Mail className="h-4 w-4" />{isEn ? 'Contact the team' : 'Contactar'}<ArrowRight className="h-4 w-4" />
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
