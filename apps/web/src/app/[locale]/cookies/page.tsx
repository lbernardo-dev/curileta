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
            ? 'The site uses local storage, not cookies, for your light or dark theme, whether you dismissed the seasonal banner, the Amazon marketplace you selected, favorite videos, a local marker after a video vote and a random browser token when you choose a character as a favorite. The character token lets the site remember your selection; its SHA 256 hash is stored on the server. Separately, Supabase Auth uses session cookies when a team member signs in to the admin area. Local storage remains until you clear this site’s data; authentication cookies follow their session expiry.'
            : 'La web utiliza el almacenamiento local del navegador, no cookies, para recordar el tema claro u oscuro, si cerraste el aviso de temporada, el mercado de Amazon que elegiste, tus vídeos favoritos, una marca después de votar y un identificador aleatorio cuando marcas un personaje como favorito. Este identificador permite recordar tu selección; el servidor conserva su hash SHA 256. Por separado, Supabase Auth utiliza cookies de sesión cuando un miembro del equipo inicia sesión en el área de administración. El almacenamiento local permanece hasta que borres los datos del sitio; las cookies de autenticación siguen el vencimiento de la sesión.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Aggregate page and content sharing counts are sent to the website backend without a cookie or persistent visitor identifier. The separate character favorite feature uses the random browser token described above to remember favorites and count votes. Social, email and SMS options record a click; the device share sheet and copy action are recorded only when the browser confirms the action. External message delivery is not confirmed. These first party analytics events respect Do Not Track.'
            : 'Los recuentos agregados de visitas y de acciones para compartir se envían al backend sin cookies ni identificadores persistentes de visitante. La función independiente de favoritos de personajes sí utiliza el identificador aleatorio del navegador descrito arriba para recordar las selecciones y contar los votos. Las opciones de redes, correo y SMS registran un clic; compartir desde el dispositivo y copiar enlace solo se registran cuando el navegador confirma la acción. La web no confirma el envío de mensajes externos. Estos eventos estadísticos propios respetan Do Not Track.'}
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
            ? 'Google Analytics measures page views and broad content interactions only after it is accepted. Until then, after rejection, or when your browser sends Do Not Track or Global Privacy Control, its tag does not load and no data is sent to Google Analytics. If you are under 18, ask an adult in your family to choose.'
            : 'Google Analytics mide las visitas a páginas y las interacciones generales con el contenido solo después de aceptarlo. Hasta entonces, tras rechazarlo o si el navegador envía Do Not Track o Global Privacy Control, la etiqueta no se carga y no se envían datos a Google Analytics. Si eres menor, pide a una persona adulta de tu familia que elija.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'After acceptance, the site sends the page path without its query string, the language, and the names of allowlisted content events. It does not send form fields, names, child identifiers, user IDs or advertising signals. Google Analytics may set first party _ga and _ga property cookies on curileta.com for up to 180 days; their expiry is not extended on each visit. The choice is kept in local storage for up to 180 days so it can be honored across visits.'
            : 'Tras aceptar, la web envía la ruta de la página sin sus parámetros de consulta, el idioma y el nombre de una lista cerrada de eventos de contenido. No envía campos de formularios, nombres, identificadores de menores, User ID ni señales publicitarias. Google Analytics puede guardar cookies propias _ga y _ga de propiedad en curileta.com durante un máximo de 180 días; la duración no se renueva en cada visita. La elección se guarda en el almacenamiento local durante un máximo de 180 días para respetarla en visitas posteriores.'}
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
                ? 'YouTube videos load only after you choose to open one, using YouTube’s privacy-enhanced embed domain. Amazon links open Amazon in a new tab. Those providers may process information under their own policies once you interact with their services.'
                : 'Los vídeos de YouTube solo se cargan cuando eliges abrir uno y utilizan el dominio de privacidad mejorada de YouTube. Los enlaces de Amazon abren Amazon en otra pestaña. A partir de ahí, esos proveedores pueden tratar información según sus propias políticas.'}
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
