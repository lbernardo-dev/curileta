import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { Cookie, ExternalLink, HardDrive } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Cookies and browser storage', description: 'How Curileta uses browser storage and optional Google Analytics.' }
    : { title: 'Cookies y almacenamiento local', description: 'Cómo utiliza Curileta el almacenamiento del navegador y la analítica opcional de Google.' };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const isEn = locale === 'en';

  return (
    <SitePageLayout
      locale={locale as Locale}
      eyebrow={isEn ? 'A clear note about your browser' : 'Una nota clara sobre tu navegador'}
      title={isEn ? 'Cookies and local storage' : 'Cookies y almacenamiento local'}
      description={isEn
        ? 'The site currently stores a few preferences in your browser so the experience can remember your choices.'
        : 'La web guarda algunas preferencias en tu navegador para recordar tus elecciones y mantener la experiencia como la prefieres.'}
      icon={<Cookie className="h-4 w-4" />}
    >
      <SitePageCard>
        <h2 className="font-display text-2xl font-semibold">{isEn ? 'What this website stores' : 'Qué guarda esta web'}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'The site uses local storage for your light or dark theme, whether you dismissed the seasonal banner, your Amazon marketplace, favorite videos, a local marker after a video vote, the optional analytics choice and a random browser token if you choose a character as a favorite. The character token lets the site remember your selection; its SHA 256 hash is stored on the server and has no automatic expiry at present. The home page also uses session storage to rotate its background video within the current tab; it is cleared when the tab session ends. Supabase Auth uses session cookies when a team member signs in to the admin area. You can clear browser storage in your device settings.'

            : 'La web usa almacenamiento local para recordar el tema claro u oscuro, si cerraste el aviso de temporada, tu mercado de Amazon, los vídeos favoritos, una marca local después de votar, la elección opcional de analítica y un identificador aleatorio si marcas un personaje como favorito. El identificador permite recordar esa selección; el servidor conserva su hash y actualmente no tiene caducidad automática. La portada también usa almacenamiento de sesión para rotar el vídeo de fondo en la pestaña actual; se borra al terminar la sesión de la pestaña. Supabase Auth usa cookies de sesión cuando un miembro del equipo inicia sesión en administración. Puedes borrar estos datos desde los ajustes del dispositivo.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Page views, content interactions, downloads and sharing clicks may be stored as daily aggregate counts without a visitor identifier. The website skips those analytics events when the browser sends Do Not Track or Global Privacy Control. The separate character favorite feature uses the random browser token described above. Social, email and SMS options record a click; the device share sheet and copy action are recorded only when the browser confirms the action. External message delivery is not confirmed. A video vote is counted only after you choose to vote and pass the anti spam check.'
            : 'Las visitas a páginas, interacciones con contenido, descargas y clics para compartir pueden guardarse como recuentos diarios agregados sin identificar a cada visitante. La web omite esos eventos cuando el navegador indica Do Not Track o Global Privacy Control. La función de favoritos de personajes usa el identificador aleatorio descrito arriba. Las opciones de redes, correo y SMS registran un clic; compartir desde el dispositivo y copiar enlace solo se registran cuando el navegador confirma la acción. La web no confirma el envío de mensajes externos. Un voto de vídeo se cuenta únicamente cuando decides votar y superas la comprobación antispam.'}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: <HardDrive className="h-5 w-5" />, title: isEn ? 'Theme' : 'Tema', body: isEn ? 'Your appearance preference.' : 'Tu preferencia de apariencia.' },
            { icon: <HardDrive className="h-5 w-5" />, title: isEn ? 'Seasonal notice' : 'Aviso de temporada', body: isEn ? 'Whether you dismissed the current campaign banner.' : 'Si cerraste el aviso de la campaña actual.' },
            { icon: <HardDrive className="h-5 w-5" />, title: isEn ? 'Amazon store' : 'Tienda de Amazon', body: isEn ? 'The marketplace you chose for book links.' : 'El mercado que elegiste para los enlaces del libro.' },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl bg-[var(--background-secondary)] p-5">
              <div className="text-[var(--seasonal-accent-strong)]">{item.icon}</div>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{item.body}</p>
            </article>
          ))}
        </div>
      </SitePageCard>

      <SitePageCard>
        <h2 className="font-display text-2xl font-semibold">{isEn ? 'Optional Google Analytics' : 'Google Analytics opcional'}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Google Analytics is disabled by default. If the site owner enables it after a legal review, its optional cookie tag loads only after a person confirms they are an adult or an authorized parent or guardian and accepts. This is a self declaration; the site does not verify age or parental authority. If no choice is made, cookies are rejected, or the browser signals Do Not Track or Global Privacy Control, the tag does not load and no data is sent to Google Analytics. The site owner should keep it disabled until the rules for the mixed audience and relevant countries have been reviewed. If enabled, the footer provides a way to withdraw an existing choice.'
            : 'Google Analytics está desactivado por defecto. Si el titular lo habilita tras una revisión legal, su etiqueta de cookies opcionales solo se carga cuando una persona confirma que es adulta o madre, padre o tutor legal autorizado y acepta. Es una declaración propia: la web no verifica la edad ni la representación parental. Si no se elige, se rechazan las cookies o el navegador indica Do Not Track o Global Privacy Control, la etiqueta no se carga ni se envían datos a Google Analytics. El titular debe mantenerlo desactivado hasta revisar las normas aplicables al público mixto y a los países correspondientes. Si se habilita, puedes retirar una elección previa desde el pie de página.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'If enabled and accepted by an adult or an authorized parent or guardian, the site sends the page path without its query string, language and allowlisted content event names. It excludes form fields, names, child identifiers, user IDs and advertising signals. Google Analytics may set first party _ga cookies on curileta.com for up to 180 days. The choice is stored locally for up to 180 days. If Google Analytics is disabled, there is no valid adult confirmation, or the browser signals Do Not Track or Global Privacy Control, the saved choice and accessible Google Analytics cookies are cleared.'
            : 'Si se habilita y lo acepta una persona adulta o madre, padre o tutor legal autorizado, la web envía la ruta sin parámetros de consulta, el idioma y los nombres de eventos de contenido permitidos. Excluye campos de formularios, nombres, identificadores de menores, User ID y señales publicitarias. Google Analytics puede guardar cookies propias _ga en curileta.com hasta 180 días. La elección se guarda localmente hasta 180 días. Si Google Analytics está desactivado, no existe una confirmación adulta válida o el navegador indica Do Not Track o Global Privacy Control, se borran la elección guardada y las cookies de Google Analytics accesibles.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'You can change or withdraw this choice from the footer. Withdrawing it stops future analytics events and clears accessible Google Analytics cookies. Read how Google uses information from sites that use its services in its '
            : 'Puedes cambiar o retirar esta elección desde el pie de página. Al retirarla, se detienen los próximos eventos estadísticos y se borran las cookies de Google Analytics accesibles. Consulta cómo Google usa la información de sitios que utilizan sus servicios en su '}
          <a href="https://policies.google.com/technologies/partner-sites?hl=es" target="_blank" rel="noreferrer" className="text-[var(--seasonal-accent-strong)] underline underline-offset-4">
            {isEn ? 'privacy information' : 'información de privacidad'}
          </a>
          .
        </p>
      </SitePageCard>

      <SitePageCard>
        <div className="flex items-start gap-3">
          <ExternalLink className="mt-1 h-5 w-5 shrink-0 text-[var(--seasonal-accent-strong)]" />
          <div>
            <h2 className="font-display text-xl font-semibold">{isEn ? 'When you open an external service' : 'Cuando abres un servicio externo'}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              {isEn
                ? 'The video catalogue displays thumbnails obtained from YouTube through the site image service. The YouTube player and its API load only after you choose to open a video. Amazon links open Amazon in a new tab. Cloudflare Turnstile loads only when you start using a contact form or choose a video vote. These services may receive network and browser information under their own policies. Read the provider details in the privacy policy.'
                : 'El catálogo muestra miniaturas de YouTube a través del servicio de imágenes de la web. El reproductor y la API de YouTube solo se cargan cuando eliges abrir un vídeo. Los enlaces de Amazon abren Amazon en otra pestaña. Cloudflare Turnstile solo se carga cuando empiezas a usar el formulario de contacto o eliges votar un vídeo. Estos servicios pueden recibir información de red y del navegador conforme a sus propias políticas. Consulta los detalles en la política de privacidad.'}
            </p>
          </div>
        </div>
      </SitePageCard>

      <SitePageCard>
        <h2 className="font-display text-xl font-semibold">{isEn ? 'Manage or clear browser data' : 'Gestionar o borrar estos datos'}</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'You can clear this site’s stored data from your browser settings. The site will then use its default appearance and marketplace until you make new choices.'
            : 'Puedes borrar los datos almacenados para este sitio desde los ajustes del navegador. Después, la web utilizará la apariencia y la tienda predeterminadas hasta que vuelvas a elegir tus preferencias.'}
        </p>
      </SitePageCard>
    </SitePageLayout>
  );
}
