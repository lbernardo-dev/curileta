import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, Locale } from '@curileta/i18n';
import { Eye, Keyboard, Mail, Monitor } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Accessibility', description: 'Accessibility information and a direct channel for reporting barriers on the Curileta website.' }
    : { title: 'Accesibilidad', description: 'Información de accesibilidad y un canal directo para comunicar barreras en la web de Curileta.' };
}

export default async function AccessibilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';
  const items = isEn
    ? [
        { title: 'Keyboard navigation', body: 'The site includes a skip link and visible focus styles. We continue to review keyboard access as pages evolve.', icon: <Keyboard className="h-5 w-5" /> },
        { title: 'Motion preferences', body: 'Decorative movement is reduced when the device requests reduced motion. Some interactive illustrations may still contain movement.', icon: <Monitor className="h-5 w-5" /> },
        { title: 'Images and structure', body: 'Meaningful illustrations include text alternatives, and pages use headings and landmarks to support assistive technology.', icon: <Eye className="h-5 w-5" /> },
      ]
    : [
        { title: 'Navegación con teclado', body: 'La web incluye un enlace para saltar al contenido y focos visibles. Seguimos revisando la navegación con teclado a medida que evoluciona el sitio.', icon: <Keyboard className="h-5 w-5" /> },
        { title: 'Preferencias de movimiento', body: 'El movimiento decorativo se reduce cuando el dispositivo solicita menos animación. Algunas ilustraciones interactivas pueden conservar movimiento.', icon: <Monitor className="h-5 w-5" /> },
        { title: 'Imágenes y estructura', body: 'Las ilustraciones relevantes incluyen textos alternativos y las páginas usan encabezados y regiones para facilitar el uso de tecnologías de apoyo.', icon: <Eye className="h-5 w-5" /> },
      ];

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'Access for every explorer' : 'Una web para todas las familias'}
      title={isEn ? 'Accessibility statement' : 'Declaración de accesibilidad'}
      description={isEn
        ? 'We want families to be able to explore Curileta in ways that work for them. This statement describes current measures and how to tell us about a barrier.'
        : 'Queremos que cada familia pueda explorar el universo de Curileta a su manera. Aquí describimos las medidas actuales y cómo comunicarnos una barrera.'}
      icon={<Eye className="h-4 w-4" />}
    >
      <SitePageCard>
        <h2 className="font-display text-2xl font-semibold">{isEn ? 'What we support today' : 'Medidas disponibles'}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-2xl bg-[var(--background-secondary)] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--seasonal-accent-strong)] shadow-sm dark:bg-slate-800">{item.icon}</div>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">
          {isEn
            ? 'This is an ongoing effort, not a certification of full WCAG conformance. If a page or interaction creates a barrier, tell us what happened and which device or assistive technology you use.'
            : 'Este trabajo es continuo y no constituye una certificación de conformidad total con WCAG. Si una página o interacción te supone una barrera, cuéntanos qué ocurrió y qué dispositivo o tecnología de apoyo utilizas.'}
        </p>
      </SitePageCard>
      <SitePageCard className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold">{isEn ? 'Report an accessibility barrier' : 'Comunicar una barrera de accesibilidad'}</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{isEn ? 'Our adult contact form is available for accessibility questions and suggestions.' : 'Puedes usar el formulario de contacto para compartir dudas y sugerencias de accesibilidad.'}</p>
        </div>
        <Link href={`/${locale}/contacto`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--seasonal-accent-strong)]">
          <Mail className="h-4 w-4" />{isEn ? 'Contact us' : 'Contactar'}
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
