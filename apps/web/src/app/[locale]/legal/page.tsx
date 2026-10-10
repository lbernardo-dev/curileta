import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { FileText, Mail, Scale } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Legal notice', description: 'Website ownership, intellectual property and terms of use for Curileta Adventures.' }
    : { title: 'Aviso legal', description: 'Titularidad, propiedad intelectual y condiciones de uso de la web de Las Aventuras de Curileta.' };
}

export default async function LegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'Website information' : 'Información de la web'}
      title={isEn ? 'Legal notice' : 'Aviso legal'}
      description={isEn
        ? 'General information about this website and the creative material published here.'
        : 'Información general sobre este sitio web y los contenidos creativos publicados en él.'}
      icon={<Scale className="h-4 w-4" />}
    >
      <SitePageCard className="border-l-4 border-l-amber-500">
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Website owner' : 'Titular del sitio web'}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">{isEn ? 'Name' : 'Nombre'}</dt><dd className="mt-1 text-[var(--text-secondary)]">Lester Romero Bernardo</dd></div>
          <div><dt className="font-semibold">{isEn ? 'Tax ID' : 'NIF o identificador fiscal'}</dt><dd className="mt-1 text-[var(--text-secondary)]">{isEn ? 'Pending' : 'Pendiente'}</dd></div>
          <div className="sm:col-span-2"><dt className="font-semibold">{isEn ? 'Postal address' : 'Dirección postal'}</dt><dd className="mt-1 text-[var(--text-secondary)]">Calle Juana María Condesa Lluch 6, Valencia, España</dd></div>
          <div><dt className="font-semibold">{isEn ? 'Email' : 'Correo electrónico'}</dt><dd className="mt-1"><a href="mailto:lasaventurasdecurileta@gmail.com" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">lasaventurasdecurileta@gmail.com</a></dd></div>
          <div><dt className="font-semibold">{isEn ? 'Contact form' : 'Formulario de contacto'}</dt><dd className="mt-1"><Link href={`/${locale}/contacto`} className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">{isEn ? 'Open the form' : 'Abrir el formulario'}</Link></dd></div>
        </dl>
      </SitePageCard>

      <SitePageCard>
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 shrink-0 text-[var(--seasonal-accent-strong)]" />
          <div>
            <h2 className="font-display text-xl font-semibold">{isEn ? 'Intellectual property' : 'Propiedad intelectual'}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {isEn
                ? 'The Curileta name, characters, stories, illustrations, logos, audiovisual works and page design may be protected by intellectual-property rights. Rights belong to their respective owners. Do not reproduce or use protected material commercially without prior authorisation from the rights holder.'
                : 'El nombre Curileta, sus personajes, historias, ilustraciones, logotipos, obras audiovisuales y diseño de la web pueden estar protegidos por derechos de propiedad intelectual. Los derechos corresponden a sus respectivos titulares. No reproduzcas ni utilices comercialmente material protegido sin autorización previa de quien tenga los derechos.'}
            </p>
          </div>
        </div>
      </SitePageCard>

      <SitePageCard>
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Use of the website' : 'Uso del sitio web'}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Please use this website lawfully and avoid actions that could disrupt its availability or security. External links lead to services operated by third parties, which are responsible for their own content and policies.'
            : 'Utiliza esta web de forma lícita y evita acciones que puedan afectar a su disponibilidad o seguridad. Los enlaces externos dirigen a servicios de terceros, responsables de sus propios contenidos y políticas.'}
        </p>
        <Link href={`/${locale}/contacto`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e]">
          <Mail className="h-4 w-4" />{isEn ? 'Contact the team' : 'Contactar con el equipo'}
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
