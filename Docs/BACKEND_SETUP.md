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
2. En Curileta, las tres migraciones ya se ejecutaron manualmente; la limpieza diaria está activa y la función de analítica acepta compartir y votos. No las vuelvas a ejecutar.
3. Antes de usar `supabase db push`, reconcilia el historial: el panel de migraciones de Supabase no mostró registros de las ejecuciones manuales. En un proyecto nuevo, ejecuta en orden [la migración inicial](../supabase/migrations/20261010010000_backend.sql), [la migración de oportunidades y conservación](../supabase/migrations/20261010020000_lead_management_and_retention.sql) y [la migración de compartir y votos](../supabase/migrations/20261010030000_content_share_analytics.sql).
4. Comprueba que existen `admin_profiles`, `contact_forms`, `contact_submissions` y `analytics_daily`, y que el job `contact-submission-retention` está activo. La primera migración crea el formulario de contacto bilingüe; la segunda habilita el seguimiento comercial y la limpieza programada; la tercera permite contar acciones de compartir y votos agregados.

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
5. El titular ya facilitó el NIF y está incluido en el borrador local. Revisa las confirmaciones pendientes de la sección 11 de la [referencia técnica](./BACKEND_TECHNICAL_REFERENCE.md): uso y base jurídica del formulario, plazo de revisión de oportunidades, primera capa informativa, proveedores y transferencias, almacenamiento local y público menor de edad. No publiques el aviso como versión definitiva ni actives el formulario hasta confirmar esos datos.

Los envíos se guardan en Supabase antes del correo. Si Resend falla, el mensaje queda en el panel como pendiente. Desde Consultas puedes guardar una oportunidad como lead y seguir su fase y notas internas desde Leads. Los leads quedan excluidos de la limpieza automática mientras estén en seguimiento. Al retirarlos, la regla normal vuelve a aplicarse.

La segunda migración registra cuándo se cierra una consulta y programa una tarea diaria a las 03:00 UTC. Esta elimina únicamente consultas en estado `resolved` o `archived`, sin lead asociado y cerradas hace más de 30 días. Las consultas abiertas no se borran. Los leads se conservan hasta que el equipo los retire del seguimiento o los elimine manualmente. Esta duración debe aparecer igual en la política de privacidad publicada. El borrado automático afecta a Supabase; no elimina los avisos de correo que Resend ya haya enviado ni las copias de esos mensajes que existan en el buzón receptor, cuya conservación debe gestionarse allí.

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
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

No subas `SANITY_WRITE_TOKEN` a producción. Solo se usa en la importación local. Configura también `SANITY_STUDIO_PROJECT_ID` y `SANITY_STUDIO_DATASET` en el entorno local del Studio.

## 8. Activación gradual

1. Usa los proyectos existentes de Supabase y Sanity; no los vuelvas a crear.
2. Confirma las cuatro tablas, el perfil `owner`, el job de retención y la función SQL ampliada. Reconcilia el historial de migraciones antes de volver a usar `supabase db push`.
3. Publica Sanity Studio y añade `NEXT_PUBLIC_SANITY_STUDIO_URL` a Vercel para habilitar la edición desde `/admin/contenidos`.
4. Configura Resend y completa la información legal antes de activar formularios públicos. El widget Turnstile y sus claves de Production ya existen.
5. Inicia la web con `npm run dev` y el Studio con `npm run dev:studio` para trabajar localmente.
6. Antes de desplegar, revisa las variables faltantes de Resend, privacidad y Studio. La revisión actual no habilita el formulario de producción porque faltan aprobación legal y `PRIVACY_NOTICE_VERSION`.

Las claves `sb_publishable_...` identifican la parte pública de la aplicación y `sb_secret_...` solo se usan en servidores. La guía oficial de Supabase explica sus permisos y cómo copiarlas desde el panel.
