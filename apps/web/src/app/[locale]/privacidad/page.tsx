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
                ? 'The contact form is available to adults. It asks for a name, email address, organisation (if applicable), country, enquiry category and message, together with adult and privacy confirmations. A valid submission is stored in Supabase so authorised team members can review it in the dashboard. When configured, Resend sends a notification to the project inbox without the message or personal details. Vercel hosts the site, Supabase stores enquiries, Cloudflare Turnstile checks for spam after you start using the form, and Resend delivers optional alerts. The selected service regions for Vercel, Supabase, Cloudflare and Resend are in the EU, and the applicable processing agreements have been reviewed, including transfer safeguards where required. Some global network or support functions may involve other locations under those agreements.'
                : 'El formulario de contacto está disponible para personas adultas. Solicita nombre, correo electrónico, organización (si procede), país, categoría de consulta y mensaje, además de las confirmaciones de edad adulta y privacidad. Los envíos válidos se guardan en Supabase para que el equipo autorizado pueda revisarlos en el panel. Si está configurado, Resend avisa al buzón del proyecto sin incluir el mensaje ni datos personales. Vercel aloja la web, Supabase guarda las consultas, Cloudflare Turnstile comprueba el correo no deseado cuando empiezas a usar el formulario y Resend envía avisos opcionales. Las regiones de servicio seleccionadas para Vercel, Supabase, Cloudflare y Resend están en la UE, y se han revisado los acuerdos de tratamiento aplicables, incluidas las garantías de transferencia cuando proceden. Algunas funciones de red global o soporte pueden implicar otras ubicaciones conforme a esos acuerdos.'}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Cloudflare may receive the visitor IP address, TLS fingerprint, browser user agent, site key and origin for Turnstile. Cloudflare says it acts as our processor for bot checks and as an independent controller when using these signals to improve Turnstile detection. Some of Cloudflare’s global network or support operations may involve locations outside the selected service region under the applicable provider agreements.'
            : 'Cloudflare puede recibir la dirección IP, la huella TLS, el agente de usuario del navegador, la clave del sitio y el origen para Turnstile. Cloudflare indica que actúa como encargado para las comprobaciones de bots y como responsable independiente cuando utiliza estas señales para mejorar la detección de Turnstile. Algunas operaciones de red global o soporte de Cloudflare pueden implicar ubicaciones fuera de la región de servicio seleccionada conforme a los acuerdos aplicables.'}{' '}
          <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noreferrer" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">
            {isEn ? 'Cloudflare Turnstile privacy addendum' : 'Anexo de privacidad de Cloudflare Turnstile'}
          </a>
          {isEn ? '. Provider notices: ' : '. Avisos de los proveedores: '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">Vercel</a>,{' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">Supabase</a>{' '}
          {isEn ? 'and' : 'y'}{' '}
          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">Resend</a>.
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Do not include personal information about children in the message. The technical hosting and email providers may process data as needed to deliver and secure the service; their applicable privacy terms should also be reviewed.'
            : 'No incluyas datos personales de menores en el mensaje. Los proveedores técnicos de alojamiento y correo pueden tratar datos para prestar y proteger el servicio; también deben consultarse sus políticas de privacidad aplicables.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'The backend stores daily aggregate counts by page, language, content and sharing method; these counters do not contain a visitor identifier. Social, email and SMS options record a click to start sharing; the device share sheet and copy action are recorded only when the browser confirms the action. The website cannot confirm whether an external message was sent. Optional video votes are counted only after a visitor chooses to vote and passes Cloudflare Turnstile; a local browser marker discourages repeat votes. If you choose a character as a favorite, a random browser token is stored in local storage and its one way hash is kept on the server to remember favorites and count them. This token is pseudonymous and separate from analytics. No automatic expiry for this token or its server hash is currently configured. Aggregate analytics events are skipped when the browser signals Do Not Track or Global Privacy Control.'

            : 'El backend guarda recuentos diarios agregados por página, idioma, contenido y método para compartir; estos contadores no contienen un identificador de visitante. Las opciones de redes, correo y SMS registran el clic para iniciar la acción; compartir desde el dispositivo y copiar enlace solo se registran cuando el navegador confirma la acción. La web no puede confirmar el envío de un mensaje externo. Los votos opcionales de vídeos se cuentan solo cuando la persona decide votar y supera Cloudflare Turnstile; una marca local ayuda a evitar votos repetidos por accidente. Si marcas un personaje como favorito, se guarda en el almacenamiento local un identificador aleatorio y el servidor conserva su hash para recordar favoritos y contarlos. Este identificador seudónimo es independiente de la analítica y no se usa para crear un perfil. Actualmente no hay una caducidad automática configurada para el identificador ni para su hash en el servidor. Los eventos estadísticos agregados se omiten cuando el navegador indica Do Not Track o Global Privacy Control.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Google Analytics is disabled by default. If the site owner enables it after legal review, it loads only after an adult or an authorized parent or guardian confirms their authority and accepts. This is a self declaration, not age or parental verification. It does not run when no valid choice was made, cookies were rejected, or the browser signals Do Not Track or Global Privacy Control. If enabled, it receives the page path without query parameters, language and allowlisted content event names. Form values, names, child identifiers, user IDs and advertising signals are excluded. Its first party cookies and the choice record can last up to 180 days; the choice can be withdrawn from the footer. It must remain disabled until the mixed audience and applicable country rules have been reviewed.'
            : 'Google Analytics está desactivado por defecto. Si el titular lo habilita tras una revisión legal, solo se carga cuando una persona adulta o madre, padre o tutor legal autorizado confirma su autoridad y acepta. Es una declaración propia, no una verificación de edad ni de representación parental. No funciona si no hay una elección válida, se rechazan las cookies o el navegador indica Do Not Track o Global Privacy Control. Si se habilita, recibe la ruta sin parámetros de consulta, el idioma y nombres de una lista cerrada de eventos de contenido. No recibe respuestas de formularios, nombres, identificadores de menores, User ID ni señales publicitarias. Sus cookies propias y el registro de la elección pueden durar hasta 180 días; puedes retirar la elección desde el pie de página. Debe seguir desactivado hasta revisar el público mixto y las normas de los países correspondientes.'}{' '}
          <Link href={`/${locale}/cookies`} className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">
            {isEn ? 'Read the cookie notice.' : 'Lee el aviso de cookies.'}
          </Link>
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'If you choose a sharing service, the browser opens it with the content link and, depending on the option, its title or message. WhatsApp, Telegram, Facebook, LinkedIn, X, email and messaging services then process your interaction under their own terms. The video catalogue obtains thumbnails from YouTube through the site image service; the YouTube player and API load only when you open a video.'
            : 'Si eliges un servicio para compartir, el navegador lo abre con el enlace al contenido y, según la opción, su título o mensaje. WhatsApp, Telegram, Facebook, LinkedIn, X, el correo y los servicios de mensajería tratan después esa interacción según sus propias condiciones. El catálogo de vídeos obtiene miniaturas de YouTube a través del servicio de imágenes de la web; el reproductor y la API de YouTube se cargan solo cuando abres un vídeo.'}
        </p>
      </SitePageCard>

      <SitePageCard>
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Purpose, rights and contact' : 'Finalidad, derechos y contacto'}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'General enquiries are handled on the basis of the controller’s legitimate interests in responding and managing the conversation, subject to the controller’s assessment of those interests and your rights; requested proposals are handled to take pre-contractual steps. Open enquiries are kept while they are being handled. Enquiries closed without lead follow-up are automatically deleted from Supabase after 30 days through the daily database cleanup. Leads are reviewed after 12 months without activity. Automated reminder emails and the follow up deletion schedule for leads are not active yet, so the team must review them manually and remove records when they are no longer needed. Once that process is configured, it will notify the team and schedule deletion 30 days after notice unless follow up resumes. Email notifications already delivered to the recipient mailbox are not removed by database cleanup and follow that mailbox’s retention settings. To exercise your rights, contact the controller at the published privacy email.'

            : 'Las consultas generales se atienden sobre la base del interés legítimo del responsable en responder y gestionar la conversación, sujeto a que evalúe ese interés y tus derechos; las propuestas solicitadas se tramitan para adoptar medidas precontractuales. Las consultas abiertas se conservan mientras se tramitan. Las consultas cerradas sin seguimiento como oportunidad se eliminan automáticamente de Supabase después de 30 días mediante la limpieza diaria de la base de datos. Las oportunidades se revisan tras 12 meses sin actividad. Los avisos por correo y la programación del borrado de oportunidades todavía no están activos, por lo que el equipo debe revisarlas manualmente y eliminar los registros cuando ya no sean necesarios. Cuando se configure ese proceso, avisará al equipo y programará el borrado 30 días después del aviso, salvo que se reanude el seguimiento. La limpieza de la base de datos no elimina los avisos de correo ya entregados al buzón y que siguen su configuración de conservación. Para ejercer tus derechos, escribe a la dirección de privacidad publicada.'}
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
