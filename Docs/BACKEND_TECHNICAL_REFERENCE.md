# Referencia funcional y técnica del backend

**Proyecto:** Las Aventuras de Curileta
**Actualizado:** 10 de octubre de 2026
**Alcance:** arquitectura, funciones, almacenamiento, seguridad, configuración y operación del backend que existe en el repositorio.

> Esta es la referencia viva del backend. Distingue el código local, el estado remoto comprobado y lo que aún falta publicar. No se guardan valores de secretos en este documento. La web desplegada no incorpora automáticamente los cambios que siguen pendientes en el repositorio.

## 1. Resumen ejecutivo

La plataforma tiene dos aplicaciones principales: la web pública en Next.js y el CMS editorial Sanity Studio. Supabase proporciona autenticación para el equipo, la base de datos de formularios y consultas, el seguimiento de leads y los contadores estadísticos agregados. Sanity proporciona contenido editorial. Resend envía avisos de los formularios y Cloudflare Turnstile ayuda a filtrar automatizaciones.

El backend ya está implementado en el código para:

- iniciar sesión en el panel mediante Supabase Auth y perfiles con roles;
- obtener y editar formularios de contacto desde Supabase;
- validar, guardar y administrar mensajes enviados por visitantes;
- enviar notificaciones por correo y dejar el envío guardado si falla el correo;
- convertir manualmente mensajes en oportunidades y registrar su fase y notas;
- eliminar de forma programada consultas cerradas no convertidas en leads, pasados 30 días;
- agregar estadísticas por fecha, ruta, idioma y evento, sin crear perfiles de visitantes;
- compartir o recomendar libros, personajes, canciones, vídeos, eventos, lugares y fondos por el menú del dispositivo, WhatsApp, Telegram, Facebook, LinkedIn, X, correo, SMS o copiando el enlace;
- contar inicios de acciones de compartir por canal y contenido, y votos agregados en vídeos;
- leer contenido editorial de Sanity, invalidar su caché con un webhook firmado y exponer datos mediante rutas de contenido.

El código local incluye además la configuración editorial del canal, favoritos guardados solo en el navegador y votaciones agregadas protegidas por Turnstile. El panel incluye una entrada de contenidos y accesos directos a las herramientas existentes. El 10 de octubre se aplicó manualmente en Supabase Production la ampliación de analítica para acciones de compartir y votos. El código web que envía esos eventos sigue pendiente de desplegarse.

El 10 de octubre de 2026 se comprobó el estado remoto: Supabase está saludable, contiene las cuatro tablas previstas y un perfil `owner`; la migración de oportunidades y la ampliación de analítica se aplicaron manualmente, y la tarea de retención está activa. Sanity tiene 114 documentos y el webhook de revalidación está habilitado, pero no tiene Studio público desplegado. Vercel Production contiene las variables de Supabase, Sanity, Turnstile y revalidación; faltan las variables de Resend, `PRIVACY_NOTICE_VERSION` y la URL pública de Studio. Cloudflare tiene un widget para el dominio de producción. El detalle y sus límites figuran en la sección 13.

## 2. Arquitectura y responsabilidades

| Componente | Responsabilidad | Código y configuración |
|---|---|---|
| Web pública y API | Páginas, formularios, panel y rutas HTTP | `apps/web`, Next.js App Router |
| CMS editorial | Edición de documentos, imágenes, traducciones y ajustes | `apps/studio`, Sanity Studio |
| Contratos de contenido | Tipos y proveedor de contenido local | `packages/cms` |
| Base de datos y autenticación | Perfiles internos, formularios, consultas, analítica y sesiones | Supabase PostgreSQL y Supabase Auth |
| Correo transaccional | Avisos de nuevos envíos | Resend, llamado por `/api/contact` |
| Protección del formulario | Verificación antispam en servidor | Cloudflare Turnstile |
| Publicación web | Variables y despliegue del sitio | Vercel; variables de Production revisadas, estos cambios locales aún no desplegados |

```mermaid
flowchart LR
  Visitor[Visitante adulto] --> Web[Web Next.js]
  Web -->|lectura editorial| Sanity[Sanity Content Lake]
  Studio[Sanity Studio] --> Sanity
  Sanity -->|webhook firmado| Revalidate[API revalidate]
  Revalidate --> Web
  Web -->|validación de formulario| Turnstile[Cloudflare Turnstile]
  Web -->|guardar formularios, consultas y métricas| Supabase[(Supabase PostgreSQL)]
  Web -->|autenticación del equipo| Auth[Supabase Auth]
  Web -->|aviso por correo| Resend[Resend]
  Admin[Panel privado] --> Web
```

## 3. Contenido editorial dinámico

### 3.1 Selección del proveedor

`apps/web/src/lib/cms/index.ts` selecciona `SanityCMSProvider` si `SANITY_STUDIO_PROJECT_ID` existe y no es el valor de demostración `curileta-demo`. Si no se configura un proyecto real, usa `DatabaseCMSProvider`, el contenido local de respaldo. El Studio, en cambio, se niega a iniciar si falta el identificador real del proyecto.

El proveedor Sanity consulta documentos publicados de tipo `contentEntry` y el documento `siteSettings`. Las consultas se almacenan en caché durante cinco minutos con `unstable_cache`; el webhook firmado invalida etiquetas de contenido y revalida la página raíz.

**Comportamiento que conviene conocer:** si una consulta a Sanity falla, el proveedor registra el error y vuelve a los datos locales. Si Sanity responde correctamente con una lista vacía, devuelve esa lista vacía; en ese caso no usa el contenido local como sustituto. Esto evita ocultar un dataset vacío, pero puede dejar una sección sin contenido hasta que se publiquen documentos.

### 3.2 Tipos de contenido disponibles

El esquema unificado `apps/studio/schemas/documents/contentEntry.ts` permite crear:

1. Personajes (`character`)
2. Libros (`book`)
3. Aventuras (`adventure`)
4. Vídeos (`video`)
5. Canciones (`song`)
6. Lugares (`location`)
7. Puntos de ruta (`trailWaypoint`)
8. Hitos narrativos (`narrativeMilestone`)
9. Curiosidades (`mentionedCuriosity`)
10. Fondos de pantalla (`wallpaper`)
11. Eventos estacionales (`seasonalEvent`)
12. Cartas (`letter`)
13. Próximo contenido (`universeRoadmapItem`)
14. Oportunidades de colaboración (`collaboration`)

`siteSettings` contiene ajustes del sitio, incluidos datos que controlan si las secciones de portada se muestran y en qué orden. Los objetos `localizedString` y `localizedText` guardan traducciones en español e inglés. El español es obligatorio y actúa como idioma de respaldo en varios campos.

`siteSettings` también define título, descripción, URL, etiquetas, avatar y cabecera del canal de YouTube. La web muestra esos datos en la sección de vídeos y actualiza el enlace de suscripción del pie de página. Sanity almacena las imágenes; el proveedor CMS resuelve sus direcciones públicas.

Cada vídeo puede guardar tipo (episodio, Short, canción o tráiler), fecha, miniatura, duración, número de episodio, descripción, etiqueta destacada, etiquetas y nombre e identificador de lista de YouTube. También admite activar una pregunta y votación para ese vídeo. El equipo crea y actualiza las fichas manualmente; no hay sincronización automática desde YouTube.

### 3.3 Qué partes de la web son dinámicas hoy

La portada y páginas de libros, personajes, canciones, colaboraciones, Curileta, eventos, fondos, mundo, novedades y vídeos consumen el proveedor CMS en el código. El contenido editorial y la visibilidad y orden de secciones de portada pueden venir de Sanity. El formulario, las consultas, los leads y las estadísticas dependen de Supabase.

`/admin/contenidos` resume los módulos editoriales y enlaza al proyecto Sanity. Si `NEXT_PUBLIC_SANITY_STUDIO_URL` apunta a un Studio desplegado, muestra el acceso directo al editor. Mientras falte, avisa de que el enlace al proyecto no edita documentos. El acceso corresponde a `owner`, `admin` y `editor`.

No todo el sitio es editable desde un panel. En esta revisión, las páginas de accesibilidad, cookies, aviso legal, privacidad y prensa contienen textos y metadatos definidos en código. También hay elementos de navegación, interfaz y estructura que son parte de la aplicación, no documentos editables. Por ello, "backend conectado" no significa que cada texto, página, estilo o función se pueda modificar desde el CMS.

Para ampliar la cobertura dinámica hay que diseñar esquemas de edición para los contenidos estáticos que de verdad deban administrar editores y migrar esos textos de forma gradual. Los textos legales requieren que el responsable complete y apruebe la información antes de que el equipo los publique desde el CMS. No conviene convertir estructura o lógica de interfaz en campos CMS sin una necesidad editorial concreta.

### 3.4 Publicación, identificadores y webhook

- La web lee documentos publicados; los documentos de borrador se excluyen de las consultas públicas.
- El dataset `production` debe ser legible por la web si no se proporciona `SANITY_READ_TOKEN`. Para el contenido público del sitio, la guía de instalación recomienda un dataset público.
- Los identificadores públicos importados no deben contener puntos, según la configuración y guía de importación del proyecto.
- El webhook llama `POST /api/revalidate` con la cabecera de firma de Sanity y `SANITY_REVALIDATE_SECRET`. El endpoint limita el cuerpo a 32 KB, valida la firma y solo acepta `contentEntry` con `contentType` o `siteSettings`.
- La caché normal tiene una ventana de hasta cinco minutos. Un webhook válido busca reducir esa demora al publicar.
- `SANITY_WRITE_TOKEN` solo se utiliza temporalmente en importaciones locales. No se debe desplegar. `SANITY_READ_TOKEN` se necesita solo si el dataset requiere autenticación.

### 3.5 Importación del contenido existente

Los scripts del monorepo son:

```sh
npm run sanity:import:dry-run
npm run sanity:import
npm run sanity:migrate-public-ids:dry-run
npm run sanity:migrate-public-ids
```

El orden y las condiciones previas están en [BACKEND_SETUP.md](./BACKEND_SETUP.md). Ejecuta primero el modo de simulación, revisa los recuentos y confirma que el proyecto y dataset seleccionados son los esperados. Después de importar, revoca y elimina el token temporal de escritura.

## 4. Formularios de contacto configurables

### 4.1 Configuración

La tabla `contact_forms` almacena título y descripción localizados, activación, definición de campos y preferencias de notificación. El formulario público solicita `GET /api/forms/{slug}?locale=es|en` y la web usa esa respuesta para construir los campos.

Los tipos de campo aceptados por el panel son `text`, `email`, `textarea`, `select` y `checkbox`. Cada campo puede tener clave, etiqueta localizada, obligatoriedad, longitud máxima, opciones para listas y una función de sistema. El servidor exige que cada formulario mantenga exactamente un campo de sistema `name`, uno `email` y uno `message`. Las opciones de listas tienen valores únicos y límites de cantidad y longitud.

La interfaz administrativa vive en `/admin/forms`. Solo `owner` y `admin` pueden consultarla o editarla. Desde ahí se modifican textos, campos, estado activo y configuración de destinatarios por defecto o por categoría. La notificación finalmente usa `CONTACT_TO_EMAIL` como destino de reserva.

### 4.2 Envío y validación

`POST /api/contact` aplica este flujo:

1. Limita el cuerpo a 24 KB y exige JSON válido.
2. Responde con éxito genérico a un honeypot rellenado, sin guardar el envío.
3. En producción falla de forma cerrada con HTTP 503 si falta Turnstile del servidor, la site key pública o `PRIVACY_NOTICE_VERSION`.
4. Si Turnstile tiene secreto configurado, valida el token mediante el endpoint `siteverify` de Cloudflare con un límite de espera de cinco segundos.
5. Comprueba el `formSlug`, idioma, campos, formato de correo, opciones permitidas, obligatoriedad y longitud.
6. Exige nombre, correo y mensaje; si el esquema configura confirmación de persona adulta o de privacidad, también exige ambas confirmaciones.
7. Guarda los datos y respuestas en `contact_submissions` antes de solicitar el correo.
8. Registra el evento agregado `contact_submit`.
9. Envía un aviso por Resend. Si no hay configuración de correo o el envío falla, conserva la consulta en Supabase, marca el estado de correo como fallido y responde HTTP 202 con `notificationPending: true`.

Los textos del mensaje y las respuestas se escapan antes de incluirse en HTML para el correo. Si el correo llega a enviarse, el panel marca `email_status` como `sent`.

### 4.3 Dependencias operativas

- La migración inicial y el registro `contact` deben existir en Supabase.
- Para producción, Turnstile y `PRIVACY_NOTICE_VERSION` son obligatorios para mostrar y enviar el formulario.
- Para recibir el aviso por correo, hacen falta `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` con dominio validado y `CONTACT_TO_EMAIL` o un destinatario configurado en el formulario.
- La entrega de correo es una notificación, no el almacenamiento principal. La fila de Supabase queda como registro del mensaje incluso si Resend falla.

## 5. Consultas y gestión de leads

### 5.1 Bandeja de consultas

`/admin/consultas` muestra mensajes almacenados en Supabase. Los roles `owner` y `admin` pueden cambiar su estado y eliminar registros. Los estados de consulta son `new`, `in_progress`, `resolved` y `archived`. La tabla también registra `email_status` (`pending`, `sent`, `failed`) y un error técnico de entrega, sin incluirlo en la respuesta al visitante.

### 5.2 Seguimiento de leads

La conversión a lead es manual desde la bandeja, para que el equipo decida qué consultas requieren seguimiento comercial. `/admin/leads` permite buscar, cambiar fase y guardar notas internas de hasta 4.000 caracteres. Las fases son `new`, `contacted`, `qualified`, `won` y `lost`.

Quitar un lead de la lista pone `lead_stage` a `null`; no elimina el mensaje ni las notas. Esto devuelve el registro a la política normal de retención. `owner` y `admin` tienen acceso a la lista y a su actualización.

### 5.3 Conservación automática

La migración `20261010020000_lead_management_and_retention.sql` añade `resolved_at`, `lead_stage` y `lead_notes`, índices parciales, restricciones de validación, un disparador y una función de limpieza.

- Al cerrar una consulta (`resolved` o `archived`), el disparador registra la fecha de cierre. Si se vuelve a abrir, borra `resolved_at`; un cierre posterior inicia un nuevo plazo.
- La limpieza solo borra registros cuyo estado sea cerrado, cuyo `lead_stage` sea nulo y cuya fecha de cierre tenga más de 30 días.
- Las consultas abiertas no entran en esa regla.
- Los leads quedan fuera de la limpieza mientras tengan una fase asignada. No tienen vencimiento automático: el equipo debe retirarlos o eliminarlos manualmente cuando ya no necesite conservarlos.
- Las filas cerradas que ya existían cuando se instala la migración reciben `resolved_at = now()`, por lo que empiezan su plazo de 30 días desde la aplicación de esa migración.
- `pg_cron` ejecuta `public.purge_expired_contact_submissions()` todos los días a las 03:00 UTC.
- La limpieza solo afecta a Supabase. No borra avisos ya entregados al buzón de Resend ni copias guardadas allí.

La retención aplicada debe coincidir con el aviso de privacidad y con la política de conservación del buzón receptor.

## 6. Panel, autenticación y permisos

El panel usa Supabase Auth para validar identidad y cookies de sesión. Después busca un perfil en `admin_profiles`; sin perfil válido, el usuario no entra al panel. `getAdminIdentity()` consulta `auth.getUser()` mediante el cliente de sesión y lee el perfil con el cliente de servidor.

| Rol | Resumen | Acceso implementado |
|---|---|---|
| `owner` | Control total del panel | Resumen, formularios, consultas, leads y estadísticas |
| `admin` | Administración operativa | Resumen, formularios, consultas, leads y estadísticas |
| `editor` | Acceso interno limitado | Resumen e indicadores; no consulta mensajes personales |
| `analyst` | Análisis | Resumen y estadísticas agregadas; no ve mensajes personales ni formularios |

El panel oculta navegación según el rol y las rutas de API vuelven a exigir autorización en servidor. No se debe confiar solo en que una sección esté oculta en el navegador. `owner` y `admin` son los únicos roles que pueden revisar y eliminar consultas. `analyst` puede ver estadísticas agregadas. El primer usuario necesita un registro en `admin_profiles`; el SQL de ejemplo está en [BACKEND_SETUP.md](./BACKEND_SETUP.md).

### Vistas del panel

- **Resumen:** consultas de los últimos siete días, consultas nuevas, formularios activos y vistas de página de hoy. Solo administración ve las cinco consultas más recientes con datos de contacto.
- **Formularios:** configuración bilingüe y de destinatarios para roles `owner` y `admin`.
- **Consultas:** bandeja con estado de tratamiento y estado de aviso por correo.
- **Oportunidades:** consultas seleccionadas, notas y fase. La URL interna sigue siendo `/admin/leads`; la interfaz se muestra en español.
- **Contenidos:** acceso editorial a Sanity y estado de módulos operativos o pendientes. El editor de documentos requiere publicar Sanity Studio.
- **Estadísticas:** recuentos de páginas, formularios, acciones para compartir, canales y votos en rangos de 7 a 90 días para administración y analistas.

## 7. Estadísticas y minimización de datos

`packages/analytics/src/index.ts` envía un subconjunto permitido de eventos cuando existe `window` y el navegador no activa `Do Not Track`. El cliente no manda propiedades del evento al endpoint; deriva la ruta y el idioma de la URL. Para compartir, envía el canal, tipo y slug del contenido. El servidor valida el cuerpo, idioma, evento y que el slug exista en el CMS publicado; después usa una ruta canónica de la forma `/{idioma}/contenido/{tipo}/{slug}`. Para eventos normales valida las rutas públicas admitidas. Al final llama a `record_public_analytics`.

La base conserva agregados en `analytics_daily`, con clave por fecha, evento, ruta e idioma. No se crea una fila individual por visitante ni una tabla de comparticiones. La función de base de datos admite los eventos de navegación y contenido (`page_view`, `contact_submit`, `book_view`, `book_purchase_click`, `video_play`, `character_view`, `map_destination_open`, `song_play`, `wallpaper_download`), las acciones `content_share_{native,copy,whatsapp,telegram,email,sms,facebook,linkedin,x}` y `video_vote`.

El componente `ShareActions` ofrece compartir del dispositivo, WhatsApp, Telegram, Facebook, LinkedIn, X, correo, SMS y copiar el enlace. Está integrado en vídeos, canciones, libros, personajes, eventos estacionales, lugares y fondos de pantalla. En la hoja nativa registra cuando la API del dispositivo resuelve la acción sin cancelación. En opciones externas registra el clic que inicia la acción; Curileta no recibe confirmación de que la aplicación se haya abierto ni de que la persona haya terminado el envío. La copia se cuenta solo cuando el navegador confirma que copió el enlace. En navegadores sin permisos de portapapeles se muestra una dirección seleccionable para copiar manualmente, sin contabilizar una copia confirmada. El panel separa los canales y el contenido, y no presenta estos datos como envíos externos confirmados.

Los controles aparecen en vídeos, canciones, libros, personajes, eventos estacionales, lugares y fondos de pantalla. En vídeos y canciones el enlace puede dirigir a YouTube; en otras fichas se comparte la URL de la página actual. La hoja nativa puede mostrar otras aplicaciones instaladas en el dispositivo. Los recuentos respetan `Do Not Track`; al no crear identificadores, no ofrecen usuarios únicos, atribución de campaña ni confirmación de conversión.

El CMS puede activar la votación por vídeo y editar su pregunta. `VideoVote` exige que Turnstile valide el reto antes de registrar `video_vote`. La base conserva solo el contador agregado diario. Después de un voto válido, el endpoint revalida la portada y la página de vídeos para actualizar el total mostrado. `localStorage` marca el voto en ese navegador para evitar repetir por accidente; no es una identidad ni impide que alguien borre el almacenamiento o vote desde otro navegador. Las estadísticas muestran el total y los vídeos con más votos durante el periodo seleccionado.

No se crean identificadores persistentes ni perfiles de visitantes en esta implementación. Los agregados no equivalen a una solución de analítica avanzada ni incluyen sesiones, embudos individuales o atribución de campañas.

## 8. Base de datos

Las migraciones del repositorio son `supabase/migrations/20261010010000_backend.sql`, `20261010020000_lead_management_and_retention.sql` y `20261010030000_content_share_analytics.sql`. La tercera amplía la lista permitida de la función de analítica para acciones de compartir y votos; no añade tabla nueva.

| Tabla | Uso | Campos relevantes |
|---|---|---|
| `admin_profiles` | Asociación de usuario Auth a rol interno | `user_id`, `display_name`, `role`, marcas de tiempo |
| `contact_forms` | Definición de formularios configurables | `slug`, título y descripción JSON por idioma, `enabled`, `fields`, `notification_settings` |
| `contact_submissions` | Mensajes personales recibidos | `form_id`, `form_slug`, idioma, nombre, email, compañía, categoría, mensaje, respuestas JSON, consentimientos, versión de aviso, estado y resultado de email; la migración de leads añade fase, notas y cierre |
| `analytics_daily` | Contadores diarios agregados | fecha, evento, ruta, idioma y `event_count` |

La migración inicial crea el formulario `contact` bilingüe con campos de nombre, correo, organización, país, categoría, mensaje y confirmaciones de persona adulta y privacidad.

### Row Level Security

Las cuatro tablas tienen RLS activado. La migración revoca permisos directos de `anon` y `authenticated` en formularios, consultas y analítica y concede al cliente `service_role` los permisos de servidor. Un usuario autenticado solo puede leer su propio perfil mediante la política de `admin_profiles`. La función de analítica limita la lista de eventos, valida rutas e idiomas, y su ejecución directa queda revocada para los roles públicos y autenticados.

La clave secreta de Supabase omite RLS. Por eso el cliente que la utiliza está marcado `server-only` y solo debe vivir en handlers o código de servidor. Cada endpoint administrativo debe autorizar el rol antes de usar ese cliente.

## 9. Inventario de API

| Ruta | Método | Función y acceso |
|---|---|---|
| `/api/forms/[slug]` | `GET` | Devuelve configuración activa y pública del formulario; sin datos de consultas; falla en producción si faltan Turnstile o versión de aviso |
| `/api/contact` | `POST` | Valida Turnstile y campos, persiste mensaje, cuenta evento y manda aviso por correo |
| `/api/revalidate` | `POST` | Verifica firma de webhook Sanity e invalida caché de tipos admitidos |
| `/api/admin/auth/login` | `POST` | Valida credenciales de Supabase Auth y que haya perfil administrativo |
| `/api/admin/auth/logout` | `POST` | Cierra sesión de Supabase Auth |
| `/api/admin/overview` | `GET` | Indicadores del panel; datos personales recientes solo para `owner` y `admin` |
| `/api/admin/analytics` | `GET` | Estadísticas para `owner`, `admin` y `analyst`, rango entre 7 y 90 días |
| `/api/admin/analytics` | `POST` | Ingesta pública validada de vistas, compartir y votos; los votos verifican Turnstile y las acciones de contenido validan el slug publicado |
| `/api/admin/forms` | `GET` | Lista formularios para `owner` y `admin` |
| `/api/admin/forms/[id]` | `PATCH` | Valida y actualiza configuración de formulario para `owner` y `admin` |
| `/api/admin/submissions` | `GET` | Lista hasta 100 consultas para `owner` y `admin` |
| `/api/admin/submissions/[id]` | `PATCH` | Cambia estado, fase de lead o notas para `owner` y `admin` |
| `/api/admin/submissions/[id]` | `DELETE` | Elimina un mensaje de Supabase para `owner` y `admin` |
| `/api/admin/leads` | `GET` | Lista hasta 500 leads para `owner` y `admin` |
| `/api/v1/books`, `/api/v1/books/[slug]` | `GET` | Libros y detalle desde el proveedor CMS |
| `/api/v1/characters`, `/api/v1/characters/[slug]` | `GET` | Personajes y detalle desde el proveedor CMS |
| `/api/v1/content/[section]` | `GET` | Secciones agregadas, ajustes, contenido editorial y datos de universo |
| `/api/v1/events/active` | `GET` | Evento estacional activo |
| `/api/v1/letters`, `/api/v1/letters/[id]` | `GET` | Cartas y detalle |
| `/api/v1/locations` | `GET` | Lugares, hitos y puntos de ruta |
| `/api/v1/settings` | `GET` | Ajustes del sitio |
| `/api/v1/wallpapers` | `GET` | Fondos de pantalla |

Las rutas administrativas que consultan datos personales son privadas y responden con `Cache-Control: private, no-store` cuando devuelven datos sensibles.

## 10. Variables de entorno

Los archivos de plantilla son `apps/web/.env.example` y `apps/studio/.env.example`. El archivo local `apps/web/.env.local` está excluido de Git. Los nombres siguientes describen la configuración, nunca se deben copiar valores secretos a documentación o commits.

| Variable | Dónde | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Web | URL canónica para metadatos y sitemap |
| `SUPABASE_URL` | Servidor web | URL primaria del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | Compatibilidad | Alias antiguo aceptado si falta `SUPABASE_URL` |
| `SUPABASE_PUBLISHABLE_KEY` | Servidor web | Cliente con cookie de sesión para Auth |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Compatibilidad | Alias antiguo aceptado si falta la clave publicable actual |
| `SUPABASE_SECRET_KEY` | Solo servidor | Operaciones administrativas con privilegios elevados |
| `SUPABASE_SERVICE_ROLE_KEY` | Compatibilidad | Clave heredada aceptada como alternativa a la clave secreta |
| `SUPABASE_JWKS_URL` | Configuración | URL JWKS del proyecto, documentada para integración futura; la sesión actual se valida con `auth.getUser()` |
| `SANITY_STUDIO_PROJECT_ID` | Web y Studio | ID del proyecto Sanity real |
| `SANITY_STUDIO_DATASET` | Web y Studio | Dataset, normalmente `production` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Web | Dirección HTTPS del Studio publicado que enlaza `/admin/contenidos` |
| `SANITY_READ_TOKEN` | Solo servidor web, opcional | Lectura si el dataset es privado |
| `SANITY_WRITE_TOKEN` | Solo importación local, temporal | Escritura para importar o migrar documentos; revocar y retirar al terminar |
| `SANITY_REVALIDATE_SECRET` | Web y webhook Sanity | Firma compartida para invalidar caché |
| `RESEND_API_KEY` | Solo servidor web | Autenticación de la API de correo |
| `CONTACT_FROM_EMAIL` | Web | Remitente verificado en Resend |
| `CONTACT_TO_EMAIL` | Web | Destino de reserva del formulario |
| `PRIVACY_NOTICE_VERSION` | Web | Versión del aviso aceptado y condición para activar formulario en producción |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cliente y servidor web | Identificador público del widget de Cloudflare |
| `TURNSTILE_SECRET_KEY` | Solo servidor web | Verificación del token con Cloudflare |
| `NODE_ENV` | Plataforma | Distingue las condiciones de producción y desarrollo |

`CURILETA_DB_PATH` pertenece al almacenamiento SQLite local de respaldo. No configura la base de datos Supabase.

### Estado local revisado

En `apps/web/.env.local` se comprobó presencia no vacía de `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SANITY_STUDIO_PROJECT_ID` y `SANITY_STUDIO_DATASET`. En esa inspección estaban vacías o ausentes `PRIVACY_NOTICE_VERSION`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`.

El 10 de octubre de 2026 también se revisó el estado remoto: Vercel Production contiene las variables de Supabase, Sanity, Turnstile y revalidación; faltan `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `PRIVACY_NOTICE_VERSION` y `NEXT_PUBLIC_SANITY_STUDIO_URL`. El proyecto Sanity `Curileta CMS` usa el dataset `production`, tiene 114 documentos y su webhook de revalidación está activo. Aún no tiene Studio publicado. En Cloudflare existe el widget de producción para `curileta-pink.vercel.app`. Las claves no se imprimen ni se copian aquí.

Supabase responde y tiene las cuatro tablas y un perfil `owner`; también se comprobó activa la tarea de retención diaria a las 03:00 UTC. El ajuste del proyecto muestra región West EU (Irlanda), código `eu-west-1`. Las migraciones de oportunidades y analítica se ejecutaron manualmente en SQL Editor. La ampliación de analítica devolvió “Success. No rows returned”, resultado esperado para una sentencia de definición de función. El panel de historial de migraciones no mostró registros, por lo que las ejecuciones no quedaron reconciliadas con el historial de Supabase. Antes de usar `supabase db push`, se debe reconciliar ese historial para evitar que intente aplicar de nuevo el esquema inicial o las migraciones manuales.

## 11. Avisos legales y activación de formularios

Las páginas localizadas viven en `apps/web/src/app/[locale]/legal/page.tsx` y `privacidad/page.tsx`. El código local incluye la identidad, el domicilio, el correo y el NIF facilitados por el titular. La política enumera los proveedores que intervienen y distingue estadísticas agregadas, almacenamiento local y servicios externos. Aún falta confirmar la base jurídica por finalidad, el plazo de revisión de oportunidades, la primera capa informativa del formulario y las regiones, garantías de transferencia y papeles contractuales de los proveedores. El texto local continúa siendo un borrador; no constituye aprobación legal ni verificación de cumplimiento.

### Confirmaciones del titular pendientes

La normativa de servicios de la sociedad de la información incluye la identificación y el NIF entre la información general del prestador; ese dato ya está incorporado al borrador local ([LSSI, artículo 10](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758)). El RGPD y la guía de información de la AEPD cubren finalidades, bases jurídicas, conservación, destinatarios, transferencias y derechos ([RGPD, artículo 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng/), [AEPD, derecho de información](https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion)). Antes de publicar, confirmar:

1. **Uso del formulario:** que se utilizará para responder a consultas adultas y gestionar oportunidades, sin boletín ni mensajes promocionales por ahora. El formulario actual exige una casilla “Acepto la política de privacidad” y la registra como `privacy_consent`; hay que decidir si es consentimiento real o un acuse de haber leído la información, en coherencia con la base jurídica elegida.
2. **Conservación de oportunidades:** las consultas cerradas sin seguimiento se borran a los 30 días. Las oportunidades (`lead_stage` no nulo) quedan fuera del borrado hasta que alguien las quite manualmente; aún no existe vencimiento automático ni fecha de última actividad. Definir un plazo y una revisión periódica para oportunidades inactivas, para que no se conserven indefinidamente por olvido.
3. **Aviso corto junto al formulario:** antes de recoger el mensaje, mostrar responsable, finalidad, base jurídica, destinatarios o transferencias previstas y enlace a la información completa. La casilla actual no sustituye por sí sola esa primera capa recomendada por la AEPD.
4. **Proveedores y transferencias:** la base de datos Supabase está en Irlanda (`eu-west-1`), pero su documentación prevé categorías limitadas de tratamiento fuera de la región. Resend aún no está configurado; su documentación indica que la operación primaria se realiza en Estados Unidos y regula transferencias mediante su DPA/SCC. Sanity puede tratar datos en los países donde opera; Vercel publica las ubicaciones de sus subencargados. Confirmar las condiciones vigentes de las cuentas, el ámbito exacto de los datos y si se aceptan estos flujos ([Supabase](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [Resend](https://resend.com/security/gdpr), [Sanity DPA](https://www.sanity.io/legal/dpa), [Vercel DPA](https://vercel.com/legal/dpa)).
5. **Cookies y almacenamiento en el navegador:** el sitio usa `localStorage` para tema, cierre del aviso estacional, mercado de Amazon, favoritos y marca local de voto. El inicio de sesión del equipo usa cookies de sesión de Supabase Auth al acceder al área `/admin`. No hay una plataforma de preferencias de cookies. Revisar si el almacenamiento local queda dentro de las excepciones aplicables y si hace falta gestión de consentimiento según la guía vigente de la AEPD ([Guía de cookies, mayo de 2024](https://www.aepd.es/guias/guia-cookies.pdf)). Turnstile se carga al activar el formulario y YouTube al abrir un vídeo. La analítica del backend no crea un identificador persistente y respeta Do Not Track, pero su base jurídica y cualquier registro técnico del alojamiento deben describirse correctamente.
6. **Público menor de edad:** el formulario está restringido a personas adultas y pide no incluir datos de menores. Confirmar que no habrá cuentas, boletines ni formularios para menores y que esa limitación y el lenguaje de la política son adecuados para una web familiar.

Estos puntos son una revisión de hechos y decisiones del responsable, no una validación jurídica. `PRIVACY_NOTICE_VERSION` seguirá sin configurarse y el formulario de producción seguirá cerrado hasta aprobar la versión final.

El endpoint del formulario en producción requiere `PRIVACY_NOTICE_VERSION` y las dos claves de Turnstile. Mientras falte alguna, el formulario se desactiva con HTTP 503. La versión se debe actualizar cuando cambie el aviso que acepta el visitante y guardar el texto correspondiente de forma identificable.

## 12. Configuración y despliegue

El procedimiento detallado para crear servicios y configurar variables está en [BACKEND_SETUP.md](./BACKEND_SETUP.md). Este es el orden funcional recomendado:

1. Crear Supabase en la región adecuada y guardar credenciales en un gestor de contraseñas.
2. Para el proyecto actual, reconciliar el historial de migraciones de Supabase: las tres migraciones del repositorio ya se aplicaron manualmente y el historial aparece vacío. No usar `supabase db push` hasta completar esa reconciliación. En un proyecto nuevo, ejecutar las tres migraciones en orden.
3. Confirmar que existen las tablas, políticas RLS, extensión `pg_cron` y el job `contact-submission-retention`.
4. Crear el usuario Auth del equipo e insertar su perfil `owner` en `admin_profiles`.
5. El proyecto actual `Curileta CMS` y su dataset `production` ya existen; configurar sus identificadores en web y Studio. Solo crear otro proyecto si se prepara un entorno separado.
6. Importar contenido con modo dry run, validar los recuentos y migrar identificadores cuando corresponda.
7. Crear el webhook firmado de Sanity a `https://<dominio>/api/revalidate` y revisar su filtro y proyección según la guía.
8. Verificar el dominio de Resend y configurar remitente y destino.
9. Configurar el widget Turnstile con los dominios reales y añadir sus variables al entorno de cada despliegue.
10. Completar y revisar los avisos legales y `PRIVACY_NOTICE_VERSION` antes de activar formularios públicos.
11. Añadir variables al entorno correcto de Vercel, desplegar y comprobar formulario, panel, CMS, correo, webhook y tarea de retención.

### Instalación local

Requisitos declarados en el README: Node.js 22.18 o posterior y npm 10 o posterior. Comandos del monorepo:

```sh
npm install
npm run dev
npm run dev:studio
npm run dev:all
npm run build
npm run lint
npm run typecheck
npm test
```

La referencia de configuración y despliegue es la guía enlazada arriba. Los comandos de lint, build, typecheck y tests aparecen aquí como operaciones disponibles; su presencia no significa que se hayan ejecutado ni que hayan pasado en esta revisión.

## 13. Riesgos conocidos y trabajo pendiente

1. **Cambios todavía no desplegados:** el código web de compartir, votos, vistas del panel y esquemas del canal sigue en este árbol local. La ampliación SQL está aplicada, pero Vercel aún sirve la versión publicada anterior.
2. **Aviso legal pendiente de revisión:** el identificador fiscal ya está incluido localmente; falta confirmar la base jurídica por finalidad, la revisión periódica de oportunidades y los datos contractuales, las regiones y las garantías de transferencia de los proveedores.
3. **Resend y copias de correo:** el borrado de la base de datos no borra emails recibidos ni copias del proveedor o del buzón.
4. **Leads sin vencimiento:** se conservan hasta que el equipo los quite del pipeline o elimine. Definir una política y rutina de revisión del pipeline.
5. **Reintento de correo:** el fallo queda registrado para gestión manual. No se ha identificado una cola automática de reintentos en esta implementación.
6. **Dataset sin contenido:** una respuesta válida de Sanity vacía no activa el respaldo local; confirmar contenido publicado después de conectar el proyecto.
7. **Cobertura CMS parcial:** varios textos institucionales y páginas informativas continúan en el código; es necesario decidir qué contenidos debe editar el equipo sin desplegar una nueva versión.
8. **Código de analítica pendiente de publicar:** la función SQL acepta ya los nuevos eventos, pero el código web que los envía sigue sin desplegarse.
9. **Studio no publicado:** el intento de usar Sanity CLI desde este entorno no pudo escribir su archivo de autenticación. El acceso remoto al CMS requiere desplegar `apps/studio` y guardar `NEXT_PUBLIC_SANITY_STUDIO_URL` en Vercel.
10. **Analítica externa:** redes sociales, SMS y correo cuentan el clic para iniciar la opción; la web no confirma el envío. El compartir nativo y la copia se cuentan solo cuando el navegador confirma la acción. El endpoint de analítica es público y valida eventos y fichas publicadas, pero no deduplica por persona ni aplica una cuota durable; tráfico automatizado podría inflar los agregados. Los votos se pueden repetir desde otro navegador o después de borrar los datos locales.
11. **Falta de verificación de extremo a extremo:** esta revisión de código no prueba el flujo en navegador desde la acción hasta la base desplegada.

## 14. Registro de cambios documentados

| Fecha | Cambio reflejado | Referencias |
|---|---|---|
| 10 oct 2026 | Añadido seguimiento manual de leads, fases y notas; retención programada de consultas cerradas no marcadas como lead durante 30 días; documentado el estado local y las dependencias operativas | `supabase/migrations/20261010020000_lead_management_and_retention.sql`, `apps/web/src/app/admin/(panel)/leads`, APIs administrativas, `Docs/BACKEND_SETUP.md` |
| 10 oct 2026 | Establecida obligación de mantener esta referencia en cada cambio funcional o técnico | `AGENTS.md`, `README.md` |
| 10 oct 2026 | Auditada la cobertura CMS: contenido editorial y secciones de portada dinámicos; páginas legales, privacidad, cookies, accesibilidad y prensa siguen con texto mantenido en código | `apps/web/src/app/[locale]`, `apps/studio/schemas` |
| 10 oct 2026 | Añadidas opciones para recomendar y compartir por redes, correo, SMS, hoja nativa o enlace; registro agregado por canal y ficha; estadísticas de acciones y votos; administración del canal de YouTube y avisos de módulos pendientes; interfaz del panel traducida a español. Aplicada manualmente la ampliación de analítica en Supabase Production; el código web sigue pendiente de despliegue | `apps/web/src/components/ShareActions.tsx`, `VideoVote.tsx`, `api/admin/analytics`, `estadisticas`, esquemas Sanity y `supabase/migrations/20261010030000_content_share_analytics.sql` |

## 15. Regla de mantenimiento para cambios futuros

`AGENTS.md` obliga a actualizar este documento en el mismo cambio de código cuando haya modificaciones funcionales o técnicas. La actualización debe explicar el propósito, comportamiento, configuración, datos, permisos, impacto operativo y estado verificado; registrar limitaciones relevantes y mantener las instrucciones de `README.md` y `BACKEND_SETUP.md` coherentes. Los valores secretos nunca se documentan. Los despliegues y cambios remotos se marcan como no verificados hasta confirmarlos expresamente en el proveedor correspondiente.
