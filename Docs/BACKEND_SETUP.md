# Configuración del backend de Curileta

El backend se compone de Supabase para usuarios internos, formularios, mensajes y estadísticas; Sanity para el contenido editorial; Resend para los avisos de correo; y Cloudflare Turnstile para proteger el formulario público. El sitio puede ejecutarse sin estos servicios, pero el backend no estará conectado hasta configurar sus proyectos y credenciales.

Para Curileta, los proyectos de Supabase y Sanity ya existen. Supabase tiene la base inicial, el perfil de administración y la tarea de retención. Sanity tiene el proyecto `Curileta CMS`, el conjunto de datos `production`, 114 documentos y el webhook activo. No vuelvas a crearlos; completa los pasos pendientes indicados abajo. Esta guía conserva los pasos de creación para entornos nuevos.

No pegues claves secretas en el chat ni las añadas a archivos versionados. Los archivos `apps/web/.env.local` y `apps/studio/.env.local` están ignorados por Git y contienen la plantilla local.

## 1. Proyecto de Supabase

1. En el proyecto Curileta existente, abre [Supabase](https://supabase.com/dashboard) y revisa su estado. Para un entorno nuevo, crea un proyecto dentro de tu organización.
2. Para visitantes principalmente en España, elige la región específica `West EU (Paris)` (`eu-west-3`). Evita la región general `Europe` si necesitas que los datos principales estén dentro de la Unión Europea: puede asignar el proyecto a Londres o Zúrich. La región queda vinculada al proyecto y cambiarla después exige migrar a otro proyecto.
3. Genera una contraseña segura para Postgres y guárdala en tu gestor de contraseñas.
4. Cuando el proyecto esté disponible, abre `Connect` o `Settings > API Keys` y copia el URL, la clave publicable y una clave secreta.
5. Añade los valores a `apps/web/.env.local`:

```dotenv
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_JWKS_URL=https://tu-proyecto.supabase.co/auth/v1/.well-known/jwks.json
```

La clave publicable se usa en las rutas de servidor para validar sesiones. La clave secreta solo se usa en el servidor y omite RLS; nunca la publiques ni la guardes en Git. La aplicación también acepta los nombres antiguos `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, además de `SUPABASE_SERVICE_ROLE_KEY` para proyectos que aún usen la clave heredada. `SUPABASE_JWKS_URL` queda registrada para integración futura; la app obtiene y valida sesiones mediante Supabase Auth.

## 2. Tablas, formularios y analítica

1. En el panel de Supabase abre `SQL Editor` y crea una consulta.
2. En Curileta, las cinco migraciones originales del repositorio se ejecutaron manualmente en SQL Editor. Las columnas de privacidad y retención están creadas, el identificador del campo remoto sigue siendo `privacyConsent` para que el sitio publicado no se rompa y el job `contact-submission-retention` está activo. No las vuelvas a ejecutar ahora.
3. La migración `20261010060000_image_frame_settings.sql` crea la tabla `image_frame_settings` para guardar los encuadres del panel. Se aplicó manualmente en Production y se verificaron RLS y los permisos de lectura. Antes de usar `supabase db push`, reconcilia el historial: las ejecuciones manuales no aparecen en el historial del panel ni en `supabase_migrations.schema_migrations`. En un proyecto nuevo, ejecuta las seis migraciones en orden: [base](../supabase/migrations/20261010010000_backend.sql), [leads](../supabase/migrations/20261010020000_lead_management_and_retention.sql), [analítica](../supabase/migrations/20261010030000_content_share_analytics.sql), [privacidad y retención](../supabase/migrations/20261010040000_privacy_and_lead_retention.sql), [compatibilidad temporal](../supabase/migrations/20261010050000_contact_privacy_compatibility.sql) y [encuadres visuales](../supabase/migrations/20261010060000_image_frame_settings.sql).
4. Comprueba que existen `admin_profiles`, `contact_forms`, `contact_submissions`, `analytics_daily` e `image_frame_settings`, las columnas nuevas de retención y el job `contact-submission-retention`. La sexta migración activa RLS, reserva la tabla de encuadres al servidor y valida posiciones y ampliación.

La migración activa RLS y reserva los datos privados al servidor. No ejecutes la aplicación antes de terminar este paso: las rutas de formularios y el panel requieren esas tablas.

## 3. Crear el primer usuario del panel

1. En Supabase abre `Authentication > Users` y crea el usuario que administrará el sitio. Usa un correo al que tengas acceso.
2. Copia su UUID desde la lista de usuarios.
3. En `SQL Editor`, ejecuta una consulta como esta y sustituye ambos valores:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('UUID_DEL_USUARIO', 'Nombre del equipo', 'owner')
on conflict (user_id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    updated_at = now();
```

Roles disponibles: `owner`, `admin`, `editor` y `analyst`. Los roles `owner` y `admin` pueden revisar y eliminar consultas. `analyst` solo ve estadísticas agregadas. `editor` no accede a mensajes.

## 4. Proyecto y edición con Sanity

1. Inicia sesión en [Sanity](https://www.sanity.io/manage) y abre el proyecto `Curileta CMS` existente. Solo crea otro para un entorno separado.
2. Selecciona el dataset existente `production`. Como el dataset contiene textos e imágenes públicas del sitio, configúralo como público; así la web no necesita una clave de lectura. En Sanity, los documentos consultables sin token deben tener IDs sin puntos.
3. Copia el ID del proyecto a `SANITY_STUDIO_PROJECT_ID` en `apps/studio/.env.local` y `apps/web/.env.local`. Deja `SANITY_STUDIO_DATASET=production` en ambos.
4. Abre el Studio con `npm run dev:studio` e inicia sesión con tu cuenta de Sanity.
5. Para importar el contenido SQLite existente, crea temporalmente un token de Sanity con permiso de edición y añádelo a `SANITY_WRITE_TOKEN` en `apps/web/.env.local`.
6. Ejecuta primero `npm run sanity:import:dry-run`. Si los recuentos son razonables, ejecuta `npm run sanity:import` para copiar los documentos. El importador usa IDs estables sin puntos y elimina los IDs del formato anterior cuando existen.
7. Si el dataset ya contiene documentos importados con IDs como `contentEntry.character.curileta` o `siteSettings.singleton`, ejecuta `npm run sanity:migrate-public-ids:dry-run` y luego `npm run sanity:migrate-public-ids`. La migración conserva los campos, elimina los documentos antiguos y deja disponibles las versiones publicadas para consultas anónimas.
8. Revoca el token temporal y retira `SANITY_WRITE_TOKEN` de `.env.local` después de importar o migrar. Para un dataset privado, configura además `SANITY_READ_TOKEN` con permiso de lectura y guárdalo solo en el servidor.

El Studio permite editar los documentos y la configuración `siteSettings`, incluida la visibilidad y el orden de las secciones de la portada y la información del canal de YouTube. La web consulta Sanity; si una consulta falla, conserva el respaldo de desarrollo y deja un aviso en el log del servidor. Curileta aún no tiene Studio publicado: el acceso de edición desde cualquier equipo requiere desplegar `apps/studio` y establecer `NEXT_PUBLIC_SANITY_STUDIO_URL` en Vercel. El proyecto y los documentos existen aunque ese acceso no esté publicado.

## 5. Actualizar el sitio al publicar contenido

1. El webhook de Curileta ya está creado y activo. Si lo renuevas o configuras un entorno nuevo, genera un secreto aleatorio y guárdalo como `SANITY_REVALIDATE_SECRET` en `apps/web/.env.local`.
2. Para el entorno actual apunta a `https://curileta-pink.vercel.app/api/revalidate`; para otro dominio, crea un webhook de tipo documento con método `POST`, eventos de creación, actualización y eliminación, y la firma activada con el mismo secreto.
3. Usa este filtro para limitar los avisos a documentos del sitio:

```groq
after()._type in ["contentEntry", "siteSettings"] || before()._type in ["contentEntry", "siteSettings"]
```

4. Usa esta proyección para enviar el tipo de contenido también al borrar documentos:

```groq
{
  "_type": coalesce(after()._type, before()._type),
  "contentType": coalesce(after().contentType, before().contentType)
}
```

El endpoint valida la firma `sanity-webhook-signature`; no acepta secretos en la URL.

## 6. Conectar el envío de formularios

1. En Resend crea una API key y verifica el dominio remitente siguiendo sus instrucciones DNS.
2. Añade `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL` a `apps/web/.env.local`.
3. En [Cloudflare Turnstile](https://dash.cloudflare.com/) crea un widget para `curileta-pink.vercel.app`, añade los dominios de desarrollo que uses y copia sus claves a `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`. Cuando conectes un dominio propio, añádelo también al widget.
4. Define `PRIVACY_NOTICE_VERSION` solo cuando esté aprobada la versión publicada de la política. El backend deja el formulario de producción desactivado si falta la verificación antispam o esta versión.
5. El titular ya facilitó el NIF y está incluido en el borrador local. Revisa las decisiones y pendientes de la sección 11 de la [referencia técnica](./BACKEND_TECHNICAL_REFERENCE.md): confirmar bases jurídicas, condiciones y transferencias de proveedores, almacenamiento local y tratamiento de datos de menores. La primera capa informativa ya está en el formulario. No publiques el aviso como versión definitiva ni actives el formulario hasta la revisión final.

Los envíos se guardan en Supabase antes del correo. Resend recibe un aviso genérico con un enlace al panel, sin datos personales ni contenido del mensaje. Si Resend falla, el mensaje permanece en Supabase y el aviso queda pendiente. Desde Consultas se puede marcar una oportunidad como lead y seguir su fase y notas internas desde Leads.

La tarea SQL diaria a las 03:00 UTC elimina consultas `resolved` o `archived` sin lead que lleven cerradas más de 30 días. Los leads sin actividad durante 12 meses quedan pendientes de revisión; la ruta web programada `/api/cron/lead-retention` debe enviar un aviso genérico al equipo y, después de confirmar el envío, empieza un plazo de 30 días antes de eliminarlos si nadie reanuda la actividad. Si Resend falla o no está configurado, no programa el borrado del lead. Para activar estos avisos hacen falta `CRON_SECRET`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL`, además de desplegar el código. El borrado de Supabase no elimina copias de emails en el buzón receptor.

## 7. Variables de producción

Cuando la conexión local esté lista, configura en Vercel estas variables para `Production` y, si corresponde, `Preview`:

```text
NEXT_PUBLIC_SITE_URL
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
SUPABASE_JWKS_URL
SANITY_STUDIO_PROJECT_ID
SANITY_STUDIO_DATASET
NEXT_PUBLIC_SANITY_STUDIO_URL
SANITY_READ_TOKEN                  # solo si el dataset es privado
SANITY_REVALIDATE_SECRET
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_TO_EMAIL
PRIVACY_NOTICE_VERSION
CRON_SECRET
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

No subas `SANITY_WRITE_TOKEN` a producción. Solo se usa en la importación local. Configura también `SANITY_STUDIO_PROJECT_ID` y `SANITY_STUDIO_DATASET` en el entorno local del Studio.

## 8. Activación gradual

1. Usa los proyectos existentes de Supabase y Sanity; no los vuelvas a crear.
2. Confirma las cuatro tablas originales, `image_frame_settings`, `character_favorites`, `character_favorite_daily`, `home_character_crew_settings`, `youtube_channel_settings` y `book_catalog_settings`, el perfil `owner`, las columnas de retención y el job diario. Las tablas de encuadres y las cinco tablas nuevas están verificadas en Production con RLS activo y acceso de servidor reservado a `service_role`. Reconcilia el historial de migraciones antes de volver a usar `supabase db push`.
3. Publica Sanity Studio y añade `NEXT_PUBLIC_SANITY_STUDIO_URL` a Vercel para habilitar la edición desde `/admin/contenidos`.
4. Configura Resend y completa la información legal antes de activar formularios públicos. El widget Turnstile y sus claves de Production ya existen.
5. Inicia la web con `npm run dev` y el Studio con `npm run dev:studio` para trabajar localmente.
6. Antes de desplegar, revisa las variables faltantes de Resend, `CRON_SECRET`, privacidad y Studio. La revisión actual no habilita el formulario de producción porque faltan aprobación legal y `PRIVACY_NOTICE_VERSION`; tampoco activa avisos de retención de leads hasta configurar el correo y el cron web.

## 9. Opciones de alojamiento y coste

Precios públicos consultados el 10 de octubre de 2026, en USD/EUR antes de impuestos. El coste del alojamiento web no incluye Supabase, Sanity, correo, dominio ni operación.

| Opción | Coste del frontend | Adecuación para Curileta | Riesgo o trabajo |
|---|---:|---|---|
| Netlify Free | $0/mes, 300 créditos | Soporta Next.js App Router, SSR e ISR. Útil para una validación de bajo tráfico. | Al agotar el límite los proyectos se pausan hasta el siguiente ciclo. Las funciones usan Ohio por defecto y elegir región exige Pro o Enterprise; no es mi recomendación para formularios con datos personales de residentes en la UE. |
| Cloudflare Workers Paid | Desde $5/mes por cuenta | Next.js funciona mediante el adaptador OpenNext; incluye cuotas iniciales y no cobra ancho de banda. Es la alternativa gestionada de menor coste que consideraría para producción tras validar el runtime. | Requiere adaptar/desplegar y probar en `workerd`, verificar caché, imágenes, sesiones, rutas API y cron. No se debe dar por hecha la residencia exclusiva en la UE. |
| Hetzner CX23 | €6,53/mes, sin IPv4 ni IVA | VPS en Alemania/Finlandia con coste mensual predecible. | Operación propia: Docker/Node, actualizaciones, TLS, firewall, copias verificadas, supervisión y recuperación. La base Supabase se factura aparte; autogestionar PostgreSQL/Auth para ahorrar exige una migración adicional y más riesgo operativo. |
| Vercel Pro | $20/mes, incluye $20 de crédito de uso | Menor cambio técnico porque el proyecto ya usa Next.js y Vercel. | Suma al coste de Supabase y está sujeto a consumo y condiciones de uso; revisar el uso medido antes de cambiar. |
| Vercel Hobby | $0/mes | Técnicamente mantiene el alojamiento actual. | Vercel lo limita a uso personal y no comercial; no es una opción adecuada para Curileta como producto comercial. |

Supabase está ahora en Free. Ese plan limita cada base a 500 MB, no incluye copias automáticas y puede pausarla tras una semana sin actividad. Supabase Pro cuesta desde $25/mes y evita la pausa e incluye siete días de copias diarias. Por tanto, para conservar leads de forma fiable, presupuestaría al menos la base de datos: alrededor de **$25/mes** con Netlify Free, **$30/mes** con Cloudflare Workers Paid o **$25/mes más €6,53/mes** con Hetzner y Supabase Pro. Son estimaciones antes de impuestos y otros servicios.

**Recomendación:** para validar gastando lo mínimo, mantener Supabase Free mientras se prueba internamente y evaluar Netlify Free solo con datos ficticios, sabiendo que puede pausarse. Para operar con leads reales, primero pasar Supabase a Pro o elegir una base administrada con copias y región aprobada; luego probar Cloudflare Workers Paid en un dominio de prueba antes de mover tráfico. Hetzner puede costar poco en infraestructura, pero no es la opción más barata en tiempo de operación. No cambiaré el hosting ni el plan sin que elijas una ruta.

Fuentes oficiales: [Vercel pricing](https://vercel.com/pricing), [Netlify pricing](https://www.netlify.com/pricing/), [soporte Next.js de Netlify](https://docs.netlify.com/build/frameworks/overview/), [regiones de funciones Netlify](https://docs.netlify.com/build/functions/configuration/), [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Next.js en Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), [Supabase pricing](https://supabase.com/pricing), [Hetzner pricing adjustment](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/).

Las claves `sb_publishable_...` identifican la parte pública de la aplicación y `sb_secret_...` solo se usan en servidores. La guía oficial de Supabase explica sus permisos y cómo copiarlas desde el panel.
