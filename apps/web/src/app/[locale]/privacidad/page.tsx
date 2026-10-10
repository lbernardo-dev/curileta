import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Privacy policy', description: 'Privacy information for families and adults who contact the Curileta team.' }
    : { title: 'Política de privacidad', description: 'Información de privacidad para familias y personas adultas que contactan con Curileta.' };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'Privacy for families' : 'Privacidad para las familias'}
      title={isEn ? 'Privacy policy' : 'Política de privacidad'}
      description={isEn
        ? 'This page explains what happens to information sent through the adult contact form and where the responsible party details will appear.'
        : 'Aquí explicamos qué ocurre con la información enviada mediante el formulario para personas adultas y dónde aparecerán los datos de la persona responsable.'}
      icon={<ShieldCheck className="h-4 w-4" />}
    >
      <SitePageCard className="border-l-4 border-l-amber-500">
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Responsible party' : 'Responsable del tratamiento'}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">{isEn ? 'Name or legal entity' : 'Nombre o razón social'}</dt><dd className="mt-1 text-[var(--text-secondary)]">{isEn ? 'To be confirmed' : 'Pendiente de confirmar'}</dd></div>
          <div><dt className="font-semibold">{isEn ? 'Tax ID' : 'NIF o identificador fiscal'}</dt><dd className="mt-1 text-[var(--text-secondary)]">{isEn ? 'To be confirmed' : 'Pendiente de confirmar'}</dd></div>
          <div className="sm:col-span-2"><dt className="font-semibold">{isEn ? 'Registered address' : 'Domicilio legal'}</dt><dd className="mt-1 text-[var(--text-secondary)]">{isEn ? 'To be confirmed' : 'Pendiente de confirmar'}</dd></div>
        </dl>
      </SitePageCard>

      <SitePageCard>
        <div className="flex items-start gap-3">
          <UserRound className="mt-1 h-5 w-5 shrink-0 text-[var(--seasonal-accent-strong)]" />
          <div>
            <h2 className="font-display text-xl font-semibold">{isEn ? 'Information sent through the contact form' : 'Información enviada mediante el formulario de contacto'}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {isEn
                ? 'The form is intended for adults. It asks for a name, email address, organisation (if applicable), country, enquiry category and message. The website’s contact endpoint uses the name, email, organisation, category and message to prepare an email. When the email integration is configured, the message is delivered through Resend to the project contact address. The current endpoint does not save submissions in a Curileta website database.'
                : 'El formulario está dirigido a personas adultas. Solicita nombre, correo electrónico, organización (si procede), país, categoría de consulta y mensaje. El servicio de contacto utiliza el nombre, correo, organización, categoría y mensaje para preparar un correo. Cuando la integración está configurada, el mensaje se entrega mediante Resend a la dirección de contacto del proyecto. El servicio actual no guarda los envíos en una base de datos propia de la web de Curileta.'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Do not include personal information about children in the message. The technical hosting and email providers may process data as needed to deliver and secure the service; their applicable privacy terms should also be reviewed.'
            : 'No incluyas datos personales de menores en el mensaje. Los proveedores técnicos de alojamiento y correo pueden tratar datos para prestar y proteger el servicio; también deben consultarse sus políticas de privacidad aplicables.'}
        </p>
      </SitePageCard>

      <SitePageCard>
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Purpose, rights and contact' : 'Finalidad, derechos y contacto'}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Information is used to respond to the enquiry and manage the resulting conversation. You may request access, correction or deletion of information you sent by contacting the project through the form. The responsible party’s direct privacy contact and any applicable retention periods will be added once confirmed.'
            : 'La información se utiliza para responder a la consulta y gestionar la conversación que se derive. Puedes solicitar acceso, rectificación o eliminación de la información enviada contactando con el proyecto mediante el formulario. Añadiremos el contacto directo de privacidad de la persona responsable y los plazos de conservación aplicables cuando se confirmen.'}
        </p>
        <Link href={`/${locale}/contacto`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--seasonal-accent-strong)]">
          <Mail className="h-4 w-4" />{isEn ? 'Contact the team' : 'Contactar con el equipo'}
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
