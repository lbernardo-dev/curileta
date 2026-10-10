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
        ? 'Information about contact enquiries, character favorites, site analytics and data handling.'
        : 'Información sobre consultas de contacto, favoritos de personajes, estadísticas y tratamiento de datos.'}
      icon={<ShieldCheck className="h-4 w-4" />}
    >
      <SitePageCard className="border-l-4 border-l-amber-500">
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Responsible party' : 'Responsable del tratamiento'}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">{isEn ? 'Name' : 'Nombre'}</dt><dd className="mt-1 text-[var(--text-secondary)]">Lester Romero Bernardo</dd></div>
          <div><dt className="font-semibold">{isEn ? 'Tax ID' : 'NIF'}</dt><dd className="mt-1 text-[var(--text-secondary)]">60679024X</dd></div>
          <div className="sm:col-span-2"><dt className="font-semibold">{isEn ? 'Postal address' : 'Dirección postal'}</dt><dd className="mt-1 text-[var(--text-secondary)]">Calle Juana María Condesa Lluch 6, Valencia, España</dd></div>
          <div><dt className="font-semibold">{isEn ? 'Privacy contact' : 'Contacto de privacidad'}</dt><dd className="mt-1"><a href="mailto:lasaventurasdecurileta@gmail.com" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">lasaventurasdecurileta@gmail.com</a></dd></div>
        </dl>
      </SitePageCard>

      <SitePageCard>
        <div className="flex items-start gap-3">
          <UserRound className="mt-1 h-5 w-5 shrink-0 text-[var(--seasonal-accent-strong)]" />
          <div>
            <h2 className="font-display text-xl font-semibold">{isEn ? 'Information sent through the contact form' : 'Información enviada mediante el formulario de contacto'}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {isEn
                ? 'The form is intended for adults. It asks for a name, email address, organisation (if applicable), country, enquiry category and message, together with adult and privacy confirmations. When the production form is active, the website stores the submission and form answers in Supabase so authorised team members can review them in the dashboard. If email delivery is configured, Resend sends a notification to the selected project address. A delivery failure leaves the submission available in the dashboard. Vercel hosts the website, Supabase stores enquiries, Cloudflare Turnstile checks public submissions for spam and Resend sends email notifications when enabled. The processing regions, transfer safeguards and contractual roles of these providers still need confirmation.'
                : 'El formulario está dirigido a personas adultas. Solicita nombre, correo electrónico, organización (si procede), país, categoría de consulta y mensaje, además de las confirmaciones de edad adulta y privacidad. Cuando se active el formulario de producción, la web guardará el envío y sus respuestas en Supabase para que el equipo autorizado pueda revisarlos en el panel. Si se configura el correo, Resend enviará un aviso a la dirección elegida para el proyecto. Si el aviso falla, el mensaje seguirá disponible en el panel. Vercel aloja la web, Supabase guarda las consultas, Cloudflare Turnstile comprueba los envíos públicos para reducir el correo no deseado y Resend envía avisos cuando esté activado. Aún hay que confirmar las regiones de tratamiento, las garantías de transferencias internacionales y el papel contractual de estos proveedores.'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Do not include personal information about children in the message. The technical hosting and email providers may process data as needed to deliver and secure the service; their applicable privacy terms should also be reviewed.'
            : 'No incluyas datos personales de menores en el mensaje. Los proveedores técnicos de alojamiento y correo pueden tratar datos para prestar y proteger el servicio; también deben consultarse sus políticas de privacidad aplicables.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'The backend stores daily aggregate counts by page, language, content and sharing method. Social, email and SMS options record a click to start sharing; the device share sheet and copy action are recorded only when the browser confirms the action. The website cannot confirm whether an external message was sent. Optional video votes are counted only after a visitor chooses to vote and passes Cloudflare Turnstile; a local browser marker discourages repeat votes. If you choose a character as a favorite, a random browser token is stored in local storage and its one way hash is kept on the server so the site can remember your favorites and count them. This token is separate from analytics and is not used to build a visitor profile. Analytics events respect the browser’s Do Not Track signal.'
            : 'El backend guarda recuentos diarios agregados por página, idioma, contenido y método para compartir. Las opciones de redes, correo y SMS registran el clic para iniciar la acción; compartir desde el dispositivo y copiar enlace solo se registran cuando el navegador confirma la acción. La web no puede confirmar el envío de un mensaje externo. Los votos opcionales de vídeos se cuentan solo cuando la persona decide votar y supera Cloudflare Turnstile; una marca local ayuda a evitar votos repetidos por accidente. Si marcas un personaje como favorito, se guarda en el almacenamiento local del navegador un identificador aleatorio y el servidor conserva su hash para recordar tus favoritos y contar los votos. Este identificador se usa solo para esa función y no se utiliza para crear un perfil; es independiente de la analítica. Los eventos estadísticos respetan la señal Do Not Track del navegador.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'If you choose a sharing service, the browser opens it with the content link and, depending on the option, its title or message. WhatsApp, Telegram, Facebook, LinkedIn, X, email and messaging services then process your interaction under their own terms. YouTube loads only after you open a video.'
            : 'Si eliges un servicio para compartir, el navegador lo abre con el enlace al contenido y, según la opción, su título o mensaje. WhatsApp, Telegram, Facebook, LinkedIn, X, el correo y los servicios de mensajería tratan después esa interacción según sus propias condiciones. YouTube solo se carga cuando abres un vídeo.'}
        </p>
      </SitePageCard>

      <SitePageCard>
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Purpose, rights and contact' : 'Finalidad, derechos y contacto'}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Information is used to respond to the enquiry and manage the resulting conversation. Open enquiries are kept while they are being handled. Enquiries closed without lead follow-up are deleted from Supabase 30 days after closure. Leads are reviewed after 12 months without activity; the team receives a notice and the record is scheduled for deletion 30 days after that notice unless follow-up activity resumes. Email notifications already delivered to the recipient mailbox are not removed by this database cleanup and follow that mailbox’s retention settings. To exercise your rights, contact the responsible party at lasaventurasdecurileta@gmail.com. The legal basis for each purpose, provider processing regions and transfer safeguards still need review before this draft becomes the final notice and the production form is activated.'
            : 'La información se utiliza para responder a la consulta y gestionar la conversación que se derive. Las consultas abiertas se conservan mientras se tramitan. Las consultas cerradas sin seguimiento como oportunidad se eliminan de Supabase 30 días después del cierre. Las oportunidades se revisan tras 12 meses sin actividad; se avisa al equipo y el registro se programa para su eliminación 30 días después, salvo que se reanude el seguimiento. Esta limpieza de la base de datos no elimina los avisos de correo ya entregados al buzón receptor, que siguen la configuración de conservación de ese buzón. Para ejercer tus derechos, escribe a la persona responsable en lasaventurasdecurileta@gmail.com. Aún deben revisarse la base jurídica de cada finalidad, las regiones de tratamiento de proveedores y las garantías de transferencias internacionales antes de convertir este borrador en el aviso definitivo y activar el formulario de producción.'}
        </p>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'You may request access, rectification, erasure, restriction or portability where applicable, and object to processing where the law allows. You may withdraw consent where consent is the legal basis. You can also lodge a complaint with the Spanish Data Protection Authority.'
            : 'Puedes solicitar acceso, rectificación, supresión, limitación o portabilidad cuando proceda, y oponerte al tratamiento en los casos previstos por la ley. También puedes retirar el consentimiento cuando esa sea la base jurídica y presentar una reclamación ante la Agencia Española de Protección de Datos.'}{' '}
          <a href="https://www.aepd.es/" target="_blank" rel="noreferrer" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">{isEn ? 'AEPD' : 'AEPD'}</a>
        </p>
        <Link href={`/${locale}/contacto`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c493b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27634e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--seasonal-accent-strong)]">
          <Mail className="h-4 w-4" />{isEn ? 'Contact the team' : 'Contactar con el equipo'}
        </Link>
      </SitePageCard>
    </SitePageLayout>
  );
}
