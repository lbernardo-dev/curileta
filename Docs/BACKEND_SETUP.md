# Configuración y operación del backend de Curileta

Fecha de revisión: 12 de octubre de 2026. Esta guía describe el backend basado en Supabase y el panel de administración. La referencia complementaria está en [BACKEND_TECHNICAL_REFERENCE.md](./BACKEND_TECHNICAL_REFERENCE.md).

## Arquitectura

- Supabase Auth identifica al equipo y Supabase PostgreSQL guarda el contenido administrado, la configuración de módulos, formularios y métricas.
- La web Next.js sirve la lectura pública y procesa las escrituras administrativas desde rutas de servidor protegidas.
- Supabase Storage conserva imágenes públicas. Resend envía avisos de formularios; Cloudflare Turnstile protege el formulario público.
- Sanity Studio no es una dependencia del runtime editorial actual. El contenido administrado por este panel se guarda en Supabase.

## Entorno local

Requisitos: Node.js 22 o posterior y npm 10 o posterior.

    npm install
    npm run dev

La web se ejecuta en localhost:3000. El monorepo puede incluir herramientas históricas que no son necesarias para arrancar el panel.

## Variables de configuración

Define solo las variables necesarias para las funciones que vayas a habilitar. Los nombres siguientes no incluyen valores.

### Web, analítica y Supabase

- NEXT_PUBLIC_SITE_URL: URL pública canónica usada por metadatos y sitemap.
- NEXT_PUBLIC_GA_MEASUREMENT_ID: medición de Google Analytics, si se utiliza.
- SUPABASE_URL: URL del proyecto Supabase.
- SUPABASE_PUBLISHABLE_KEY: clave publicable para validar las sesiones de usuario.
- SUPABASE_SECRET_KEY: credencial privada de servidor. Nunca debe llevar el prefijo NEXT_PUBLIC ni llegar al navegador.
- SUPABASE_SERVICE_ROLE_KEY: compatibilidad con entornos que todavía usen la clave privada heredada; mantenla solo en servidor.
- NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: alias heredados aceptados por el código.
- SUPABASE_JWKS_URL: declarada como configuración compatible, pero no es necesaria para el flujo actual de sesión de Supabase Auth.

### Funciones opcionales

- YOUTUBE_API_KEY: completa metadatos al importar vídeos desde el panel.
- RESEND_API_KEY, CONTACT_FROM_EMAIL y CONTACT_TO_EMAIL: notificaciones de formularios y avisos operativos.
- PRIVACY_NOTICE_VERSION: versión opcional del aviso de privacidad del formulario.
- CRON_SECRET: protege la ruta programada de retención.
- NEXT_PUBLIC_TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY: validación del formulario público con Turnstile.

Configura las credenciales privadas en el gestor de secretos de cada entorno de servidor. No las añadas al repositorio ni a variables públicas del cliente. Los valores se guardan únicamente en el proveedor correspondiente y no en esta guía.

## Base de datos y permisos

La definición de tablas, funciones y datos iniciales se mantiene en supabase/migrations. Revisa cada migración y su estado remoto antes de aplicarla. Si las migraciones se aplicaron manualmente en el pasado, reconcilia primero el historial con el esquema remoto. No ejecutes una sincronización general hasta haber comprobado individualmente los cambios pendientes.

La tabla managed_content_entries y el registro admin_audit_log tienen RLS activa y conceden acceso de base de datos al rol de servidor. Las rutas públicas leen desde servidor y devuelven solo el contenido publicado; las operaciones de escritura deben pasar por la autenticación y comprobación de rol del panel.

Para el flujo de equipo:

1. Crea o verifica la cuenta en Supabase Auth.
2. Una persona con rol owner añade esa cuenta desde la sección Equipo de /admin y asigna el rol.
3. La operación no envía invitaciones de correo. El usuario debe existir antes de añadirlo al panel.
4. Conserva al menos una cuenta owner activa.

Roles reconocidos por el panel: owner, admin, editor y analyst. Las personas editoras administran contenido; analyst accede a estadísticas; owner controla el equipo y el resto de módulos conforme a las comprobaciones de cada ruta. La API comprueba rol en servidor, aunque use una clave privada de Supabase.

## Contenido e imágenes

La sección Contenidos administra registros editoriales bilingües almacenados en managed_content_entries. Cada registro incluye tipo, identificador, ruta pública opcional, payload JSON, orden, publicación, borrado lógico y marcas de autoría. La edición y publicación invalidan las cachés de páginas afectadas. El contenido retirado se puede recuperar desde el panel cuando el módulo ofrece esa acción. El capítulo y el Short que ya estaban publicados en YouTube se inicializan mediante supabase/migrations/20261012030000_seed_public_youtube_videos.sql; ambas fichas se verificaron en Production y quedan editables desde /admin.

Las secciones especializadas pueden conservar tablas propias, por ejemplo analítica, consultas, encuadres o ajustes del catálogo. Consulta la referencia técnica antes de cambiar su esquema.

La API de carga requiere una sesión de owner, admin o editor. Emite una URL de subida firmada para un objeto del bucket público curileta-site-media. Acepta WebP y JPEG de hasta 8 MB y restringe cada carga a carpetas autorizadas. El navegador intenta convertir imágenes a WebP y dispone de alternativa JPEG. El archivo no debe contener datos personales que no deban hacerse públicos.

## Analítica y vídeo

La ruta de analítica registra interacciones válidas en analytics_daily. El reproductor registra un inicio interno cuando la API de YouTube confirma el estado PLAYING. La ficha se identifica por su ruta pública; /admin/estadisticas agrupa estos inicios por vídeo. La semilla de las fichas editoriales se aplica por separado y no cambia la tabla de métricas.

Ese contador es una métrica propia del sitio y no confirma ni modifica las visualizaciones oficiales de YouTube. Si la inserción falla, el reproductor muestra una miniatura disponible y ofrece un enlace directo al vídeo en YouTube.

## Migraciones, publicación y verificación

Antes de publicar un cambio de backend:

1. Revisa el SQL, permisos, políticas RLS, copias de seguridad y compatibilidad con el código activo.
2. Comprueba el historial local y remoto de migraciones. Aplica únicamente migraciones revisadas y registra el resultado.
3. Configura en el entorno correspondiente las variables privadas necesarias, sin exponerlas al cliente.
4. Espera a CI para el commit exacto y comprueba la vista previa.
5. Verifica rutas públicas y del panel con roles autorizados, carga de imágenes, cachés y errores de permisos.
6. Publica la migración antes del código que dependa de ella, si todavía no está aplicada; después despliega la web y comprueba las rutas públicas y /admin en Production.

El pack de eventos `20261012040000_event_theme_pack_and_artwork.sql` amplía `site_events`, elimina la restricción de solapamiento y siembra recursos de temporada. Las campañas coincidentes se resuelven por prioridad. Antes de desplegarlo, confirma que las migraciones anteriores y los controles `site_theme_control` están presentes, aplica solo ese archivo revisado, verifica las 16 campañas y el arte local, y despliega después el commit que contiene el cambio. La migración es idempotente y preserva los estados y fechas existentes; el seed Halloween enlaza el video local solo si el registro todavía no tiene video. El estado de Production debe anotarse después de la comprobación.

Estado comprobado al 12 de octubre de 2026: las migraciones de contenido editorial administrado y de fichas de vídeo se aplicaron y verificaron en Supabase Production; las dos fichas aparecen en managed_content_entries. También se verificaron las tablas site_events, site_theme_settings y site_theme_control y el bucket público curileta-site-media. El PR #15 (reproductor y analítica) y el PR #16 (deduplicación por youtubeId) están integrados y desplegados en Production; Vercel confirmó Ready para be6bd94. En www.curileta.com/es/videos se verificó un capítulo y un Short sin duplicados. Al abrirlos, YouTube rechaza ambos embeds y el modal ofrece el enlace directo correcto a YouTube. La analítica propia registra el estado PLAYING y no modifica las visualizaciones oficiales. La deduplicación no requiere migración de datos; las métricas reutilizan analytics_daily.

Comprobaciones habituales del repositorio:

    npm run lint --workspace=web
    npm run typecheck --workspace=web
    npm run build --workspace=web

Estas comprobaciones deben corresponder al commit que se vaya a desplegar. Comprueba el resultado de CI y el despliegue en el proveedor; una build local o una migración remota no demuestran por sí solas que la web ya esté publicada.

## Limitaciones conocidas

- El contador de reproducción del sitio mide inicios confirmados por el reproductor, no las vistas oficiales de YouTube.
- Algunas áreas operativas conservan tablas especializadas además del CMS administrado.
- La gestión del contenido de la web no implica que todos los textos de interfaz, documentos legales, traducciones de navegación o valores predeterminados de la aplicación sean editables desde /admin. Confirma esa cobertura antes de describirla como completa.
- No guardes aquí identificadores de proyectos, URLs privadas, tokens, contraseñas, datos del titular ni estados operativos detallados.
