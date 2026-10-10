# Configuración del backend de Curileta

El backend se compone de Supabase para usuarios internos, formularios, mensajes y estadísticas; Sanity para el contenido editorial; Resend para los avisos de correo; y Cloudflare Turnstile para proteger el formulario público. El sitio puede ejecutarse sin estos servicios, pero el backend no estará conectado hasta configurar sus proyectos y credenciales.

No pegues claves secretas en el chat ni las añadas a archivos versionados. Los archivos `apps/web/.env.local` y `apps/studio/.env.local` están ignorados por Git y contienen la plantilla local.

## 1. Crear el proyecto de Supabase

1. Inicia sesión en [Supabase](https://supabase.com/dashboard) y crea un proyecto dentro de tu organización.
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

## 2. Crear las tablas y el formulario inicial

1. En el panel de Supabase abre `SQL Editor` y crea una consulta.
2. Copia y ejecuta [la migración inicial](../supabase/migrations/20261010010000_backend.sql).
3. Comprueba que aparecen `admin_profiles`, `contact_forms`, `contact_submissions` y `analytics_daily` en la base de datos. La migración crea el formulario de contacto en español e inglés.

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

## 4. Crear el proyecto de Sanity

1. Inicia sesión en [Sanity](https://www.sanity.io/manage) y crea el proyecto `Curileta CMS`.
2. Crea o selecciona el dataset `production`. Como el dataset contiene textos e imágenes públicas del sitio, configúralo como público; así la web no necesita una clave de lectura. En Sanity, los documentos consultables sin token deben tener IDs sin puntos.
3. Copia el ID del proyecto a `SANITY_STUDIO_PROJECT_ID` en `apps/studio/.env.local` y `apps/web/.env.local`. Deja `SANITY_STUDIO_DATASET=production` en ambos.
4. Abre el Studio con `npm run dev:studio` e inicia sesión con tu cuenta de Sanity.
5. Para importar el contenido SQLite existente, crea temporalmente un token de Sanity con permiso de edición y añádelo a `SANITY_WRITE_TOKEN` en `apps/web/.env.local`.
6. Ejecuta primero `npm run sanity:import:dry-run`. Si los recuentos son razonables, ejecuta `npm run sanity:import` para copiar los documentos. El importador usa IDs estables sin puntos y elimina los IDs del formato anterior cuando existen.
7. Si el dataset ya contiene documentos importados con IDs como `contentEntry.character.curileta` o `siteSettings.singleton`, ejecuta `npm run sanity:migrate-public-ids:dry-run` y luego `npm run sanity:migrate-public-ids`. La migración conserva los campos, elimina los documentos antiguos y deja disponibles las versiones publicadas para consultas anónimas.
8. Revoca el token temporal y retira `SANITY_WRITE_TOKEN` de `.env.local` después de importar o migrar. Para un dataset privado, configura además `SANITY_READ_TOKEN` con permiso de lectura y guárdalo solo en el servidor.

El Studio permite editar los documentos y la configuración `siteSettings`, incluida la visibilidad y el orden de las secciones de la portada. La web consulta Sanity; si una consulta falla, conserva el respaldo de desarrollo y deja un aviso en el log del servidor.

## 5. Actualizar el sitio al publicar contenido

1. Genera un secreto aleatorio para el webhook y guárdalo como `SANITY_REVALIDATE_SECRET` en `apps/web/.env.local`.
2. En Sanity crea un webhook de tipo documento con método `POST`, URL `https://curileta-pink.vercel.app/api/revalidate`, eventos de creación, actualización y eliminación, y la firma activada con el mismo secreto.
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
5. Completa en la política de privacidad y en el aviso legal la identidad, dirección, contacto y plazo de conservación del responsable. Esos datos siguen pendientes y no deben inventarse.

Los envíos se guardan en Supabase antes del correo. Si Resend falla, el mensaje queda en el panel como pendiente. El panel permite cambiar su estado y borrar un mensaje a petición de la persona interesada.

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

1. Crea y configura Supabase.
2. Aplica la migración y crea el usuario `owner`.
3. Crea Sanity e importa el contenido.
4. Configura el webhook firmado, Resend y Turnstile.
5. Completa y revisa la información legal y de conservación.
6. Inicia la web con `npm run dev` y el Studio con `npm run dev:studio`.
7. Cuando todo funcione en local, copia las variables a Vercel y despliega.

Las claves `sb_publishable_...` identifican la parte pública de la aplicación y `sb_secret_...` solo se usan en servidores. La guía oficial de Supabase explica sus permisos y cómo copiarlas desde el panel.
