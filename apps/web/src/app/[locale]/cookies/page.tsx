import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@curileta/i18n';
import { Cookie, ExternalLink, HardDrive } from 'lucide-react';
import { SitePageCard, SitePageLayout } from '@/components/SitePageLayout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === 'en'
    ? { title: 'Cookies and browser storage', description: 'How Curileta uses browser storage and what happens when you open third-party services.' }
    : { title: 'Cookies y almacenamiento local', description: 'Cómo utiliza Curileta el almacenamiento del navegador y qué ocurre al abrir servicios externos.' };
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
            ? 'The site code uses local storage, rather than cookies, to remember your light/dark theme, whether you dismissed the seasonal banner, the Amazon marketplace you selected, favorite videos and a local marker after a video vote. These values stay in this browser until you clear its site data.'
            : 'El código del sitio utiliza el almacenamiento local del navegador, no cookies, para recordar el tema claro u oscuro, si has cerrado el aviso de temporada, la tienda de Amazon que elegiste, tus vídeos favoritos y una marca local después de votar. Estos valores permanecen en este navegador hasta que borres los datos del sitio.'}
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {isEn
            ? 'Aggregate page and content sharing counts are sent to the website backend without a cookie or persistent visitor identifier. Social, email and SMS options record a click; the device share sheet and copy action are recorded only when the browser confirms the action. External message delivery is not confirmed. Analytics events respect the browser’s Do Not Track signal.'
            : 'Los recuentos agregados de visitas y de acciones para compartir se envían al backend sin cookies ni identificadores persistentes de visitante. Las opciones de redes, correo y SMS registran un clic; compartir desde el dispositivo y copiar enlace solo se registran cuando el navegador confirma la acción. La web no confirma el envío de mensajes externos. Los eventos estadísticos respetan la señal Do Not Track del navegador.'}
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
