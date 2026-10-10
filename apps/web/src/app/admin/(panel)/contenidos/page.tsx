import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/admin';

const sanityProjectUrl = 'https://www.sanity.io/manage/project/l71yzb5e';

function Status({ children, tone = 'ready' }: { children: React.ReactNode; tone?: 'ready' | 'pending' }) {
  const color = tone === 'ready'
    ? 'bg-emerald-100 text-emerald-900 dark:bg-[#272727] dark:text-emerald-200'
    : 'bg-amber-100 text-amber-950 dark:bg-[#272727] dark:text-amber-200';
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{children}</span>;
}

function ModuleCard({
  title,
  status,
  description,
  detail,
  href,
  tone,
  actionLabel,
}: {
  title: string;
  status: string;
  description: string;
  detail: string;
  href?: string;
  tone?: 'ready' | 'pending';
  actionLabel?: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <Status tone={tone}>{status}</Status>
      </div>
      <p className="mt-4 text-sm leading-5 text-slate-700 dark:text-slate-200">{description}</p>
      <p className="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">{detail}</p>
      {href && (
        href.startsWith('https://') ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            {actionLabel || 'Abrir enlace'}
          </a>
        ) : (
          <Link href={href} className="mt-6 inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600">
            {actionLabel || 'Abrir sección'}
          </Link>
        )
      )}
    </article>
  );
}

export default async function AdminContentPage() {
  const identity = await requireAdmin(['owner', 'admin', 'editor']);
  const canManageOperations = identity.role === 'owner' || identity.role === 'admin';
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;
  const deployedStudioUrl = studioUrl?.startsWith('https://') ? studioUrl : undefined;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Administración editorial</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Contenidos y herramientas</h1>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">
          Consulta qué puedes gestionar ahora, dónde se edita y qué módulos estamos preparando.
        </p>
      </header>

      <section aria-labelledby="editorial-heading" className="space-y-4">
        <div>
          <h2 id="editorial-heading" className="text-2xl font-bold">Gestión editorial</h2>
          <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">El contenido del sitio se edita en Sanity Studio y se publica en la web.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ModuleCard
            title="Sistema editorial Sanity"
            status={deployedStudioUrl ? 'Studio publicado' : 'Studio pendiente de publicar'}
            tone={deployedStudioUrl ? 'ready' : 'pending'}
            description="El proyecto Sanity tiene 114 documentos en el conjunto de datos production. Puedes crear, editar y retirar personajes, libros, aventuras, vídeos, canciones, lugares, eventos y más."
            detail={deployedStudioUrl
              ? 'Desde Sanity Studio puedes crear, editar y retirar documentos. Al publicar, un aviso firmado actualiza el contenido de la web.'
              : 'El Studio aún no tiene una dirección pública. El enlace de abajo abre la configuración del proyecto, no el editor de documentos. Para editar desde cualquier equipo hay que desplegar el Studio.'}
            href={deployedStudioUrl || sanityProjectUrl}
            actionLabel={deployedStudioUrl ? 'Abrir Sanity Studio' : 'Abrir configuración del proyecto'}
          />
          <ModuleCard
            title="Portada y canal de YouTube"
            status={deployedStudioUrl ? 'Disponible en Sanity' : 'Preparado en Sanity'}
            tone={deployedStudioUrl ? 'ready' : 'pending'}
            description="Sanity permite ordenar y mostrar secciones de la portada, y configurar el título, descripción, dirección, etiquetas, avatar y cabecera del canal."
            detail="Cada vídeo admite tipo, lista de reproducción, etiquetas y votación opcional. Los favoritos quedan en el navegador. No hay sincronización automática desde YouTube."
          />
          <ModuleCard
            title="Eventos y temas"
            status={deployedStudioUrl ? 'Disponible en Sanity' : 'Preparado en Sanity'}
            tone={deployedStudioUrl ? 'ready' : 'pending'}
            description="Los eventos estacionales admiten fechas, tema visual, banner, actividades y estados de publicación."
            detail="La gestión se hace como documentos de evento; todavía no existe una biblioteca separada de temas reutilizables."
          />
        </div>
      </section>

      {canManageOperations && <section aria-labelledby="operations-heading" className="space-y-4">
        <div>
          <h2 id="operations-heading" className="text-2xl font-bold">Operación del sitio</h2>
          <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">Estas herramientas viven en el panel privado y usan Supabase para guardar su información.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ModuleCard title="Formularios" status="Disponible" description="Configura campos, textos, obligatoriedad y destinatarios del formulario de contacto." detail="Los envíos se guardan en Supabase. La entrega de correo requiere configurar Resend." href="/admin/forms" />
          <ModuleCard title="Consultas y oportunidades" status="Disponible" description="Revisa mensajes, estado de atención, fase comercial y notas de seguimiento." detail="Las consultas cerradas sin seguimiento se eliminan tras 30 días." href="/admin/consultas" />
          <ModuleCard title="Estadísticas" status="Disponible" description="Consulta recuentos agregados de visitas y eventos del sitio." detail="No se crean perfiles individuales de visitantes." href="/admin/estadisticas" />
          <ModuleCard title="Boletín y lista de espera" status="Próximamente" tone="pending" description="Estamos preparando la gestión de suscripciones y solicitudes de novedades." detail="Todavía no se recopilan estos datos ni se envían campañas." />
          <ModuleCard title="Encuestas" status="Próximamente" tone="pending" description="El módulo permitirá crear encuestas independientes y revisar sus resultados." detail="La votación agregada por vídeo ya está disponible al activar cada ficha en Sanity; las encuestas independientes aún no tienen almacenamiento ni API." />
        </div>
      </section>}

      {!deployedStudioUrl && (
        <aside className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1f1f1f]" aria-label="Siguiente paso de configuración">
          <h2 className="text-xl font-bold">Siguiente paso</h2>
          <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-600 dark:text-slate-300">
            Publicar Sanity Studio y registrar su URL en <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-[#272727]">NEXT_PUBLIC_SANITY_STUDIO_URL</code>. El CLI de Sanity no puede escribir su configuración de autenticación en este entorno, así que aún no puedo desplegarlo desde aquí.
          </p>
          <Link href="/admin" className="mt-4 inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200 dark:hover:bg-[#272727]">
            Volver al resumen
          </Link>
        </aside>
      )}
    </div>
  );
}
