# Auditoría técnica de privacidad, cookies y datos

Fecha de revisión: 13 de octubre de 2026. Alcance: landing pública en español e inglés, formulario de contacto, avisos de privacidad y cookies, métricas, preferencias de navegador, recursos externos y flujos de consentimiento. El titular confirma que el público es mixto, con familias y menores, y que el sitio tiene alcance mundial.

## Estado de la revisión

Esta auditoría es técnica y cubre una base de buenas prácticas para España/EEE, Reino Unido, Estados Unidos y Brasil. No es una certificación ni una opinión jurídica sobre todos los países. La obligación concreta depende de la audiencia real, los mercados, la configuración de cada proveedor y los contratos vigentes.

Los PR #19 (e3d7831), #20 (3d7d8b5), #21 (2c0688b) y #22 (36032ca) se integraron el 12 de octubre de 2026. El titular confirmó que las regiones de tratamiento seleccionadas están en la UE y que revisó los contratos de los cuatro proveedores; esto se registra como declaración del titular, no como inspección independiente. El 13 de octubre se confirmó en Supabase Production que la limpieza diaria de consultas cerradas está activa y que sus tres últimas ejecuciones finalizaron correctamente. Las 25 migraciones de `main` figuran en `supabase_migrations.schema_migrations` de Supabase Production; los efectos de `20261013050000_event_riddle_collections.sql` ya estaban aplicados y su registro se añadió con `statements = NULL`, sin repetir el SQL. El 13 de octubre se comprobó que `CRON_SECRET` existe como Secret en Vercel Production; su valor no se consultó ni se documenta. El redepliegue de `main` (`bb65e31`) terminó Ready y asignó `www.curileta.com`. Vercel muestra `/api/cron/lead-retention` a diario a las 03:30 UTC y `/api/cron/site-media-cleanup` los domingos a las 04:00 UTC. La primera ejecución programada posterior a la configuración todavía está pendiente de verificación: la próxima retención corresponde al 14 de octubre de 2026 y la limpieza multimedia al 18 de octubre. No se ejecutó manualmente la retención porque puede enviar un aviso agregado y programar un borrado 30 días después de la aceptación de Resend. `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` y `CONTACT_TO_EMAIL` también existen en Production; sus valores no se documentan. El texto público distingue la limpieza diaria de consultas cerradas de la revisión de oportunidades. El formulario carga Turnstile al empezar a usarse; no se envió una consulta de prueba para evitar guardar datos o mandar correo real. Google Analytics continúa desactivado en Production. La configuración de `CRON_SECRET` no necesitó una migración de base de datos.

El pack de campañas estacionales está desplegado y su migración de datos está aplicada y verificada. El historial de migraciones de `main` quedó reconciliado: las 25 versiones figuran en Supabase Production y no se reejecutó SQL durante esa reconciliación; consulta [BACKEND_TECHNICAL_REFERENCE.md](./BACKEND_TECHNICAL_REFERENCE.md).

## Datos y tecnologías que utiliza la web

| Uso | Dato o tecnología | Momento |
|---|---|---|
| Preferencias | localStorage para tema, aviso estacional, mercado de Amazon, vídeos favoritos, voto local y, si se habilita analítica, la elección correspondiente | Al guardar cada preferencia |
| Portada | sessionStorage para alternar el vídeo de fondo dentro de la pestaña | Al iniciar la escena de portada |
| Favoritos de personajes | Identificador aleatorio persistente en el navegador y su hash en `character_favorites` | Al consultar o cambiar favoritos |
| Sesión de administración | Cookies de sesión de Supabase Auth | Cuando una persona del equipo inicia sesión |
| Estadística propia | Contadores diarios por ruta, idioma y tipo de contenido, sin identificador persistente de visitante | En interacciones permitidas |
| Google Analytics | No se carga por defecto. Requiere `NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED=true`, un ID, declaración de persona adulta o tutor autorizado y aceptación expresa | Solo si el titular la habilita y una persona adulta o tutora acepta; sigue desactivada en Production |
| Formulario | Nombre, correo, organización opcional, país, categoría, mensaje, confirmación adulta y constancia de lectura del aviso | Al enviar el formulario |
| Protección antispam | Cloudflare Turnstile; Cloudflare enumera IP, huella TLS, agente de usuario, sitekey y origen; actúa como encargado para la detección de bots y como responsable independiente para mejorar Turnstile | Al comenzar a usar el formulario o elegir votar |
| Vídeos | Miniaturas de YouTube entregadas mediante el optimizador de imágenes de la web; reproductor y API de YouTube al abrir un vídeo | Miniaturas al mostrar el catálogo; reproductor por acción |
| Servicios externos | Amazon, redes sociales y mensajería | Solo al elegir un enlace o acción |

## Hallazgos, cambios y verificaciones pendientes

| Prioridad | Hallazgo | Medida técnica | Pendiente |
|---|---|---|---|
| Alta | La página de privacidad decía que el formulario todavía no estaba activo, aunque se mostraba en Production. | El aviso describe ahora el formulario disponible, sus campos, destinos y el funcionamiento de los avisos por correo. | Verificar una prueba de envío controlada con datos ficticios, destino interno confirmado y borrado posterior. No se ejecutó para evitar guardar datos o enviar correo real. |
| Alta | El script de Turnstile se cargaba al abrir contacto, antes de usar el formulario. | Se carga después de que la persona enfoque o empiece a usar el formulario. El aviso explica que Cloudflare recibe señales para la comprobación. | Comprobar en navegador de Production que no hay solicitud a challenges.cloudflare.com antes de la interacción y que la validación sigue funcionando después. |
| Alta | El ID de Google Analytics bastaba para habilitar la etiqueta; parte de la analítica propia solo respetaba DNT y no GPC. | Se añade una bandera de habilitación explícita, desactivada por defecto. El cliente omite métricas con DNT/GPC; la API las descarta con DNT o Sec-GPC. Cuando analítica está desactivada o hay señal de privacidad, se limpia la elección y las cookies `_ga` accesibles. | No volver a habilitar Google Analytics hasta confirmar audiencia, base jurídica, consentimiento, proveedores y mercados. La preferencia se conserva localmente, sin un registro de consentimiento en servidor. |
| Alta | El titular confirma una audiencia mixta mundial de familias y menores. Una casilla del formulario o una declaración de edad no demuestra edad ni consentimiento parental verificable. | Se añadió una declaración de persona adulta o progenitor/tutor autorizado antes de aceptar las cookies opcionales. Google Analytics sigue desactivado por defecto y las aceptaciones anteriores sin esa declaración ya no sirven. | La declaración no verifica edad ni satisface por sí misma la verificación parental que pueda exigir COPPA u otras normas. Mantener Google Analytics desactivado hasta completar la revisión por países y definir controles suficientes para el público infantil. |
| Alta | El identificador de favoritos es seudónimo y persistente; el servidor no tiene caducidad automática para su hash. Los contadores agregados tampoco tienen una política automática de eliminación. | La política revela el identificador y la ausencia de vencimiento. No se borraron datos existentes ni se inventó un plazo sin decisión del responsable. | El titular debe aprobar plazos de conservación y borrado para favoritos y estadísticas; después habrá que implementar y verificar la limpieza correspondiente. |
| Alta | El código no acredita por sí solo la región efectiva, los roles contractuales ni las garantías de transferencia. | El titular confirmó el 12 de octubre de 2026 que las regiones seleccionadas están en la UE y que revisó los contratos aplicables de Vercel, Supabase, Cloudflare y Resend, incluidas las salvaguardas pertinentes. Es una confirmación del titular, no una inspección documental independiente. | Conservar la evidencia de esa revisión y revalidarla si cambian proveedor, región, subencargados o servicios. Las redes globales y el soporte pueden tratar señales desde otras ubicaciones conforme a los contratos. |
| Alta | Cloudflare usa las señales de Turnstile para dos finalidades y con papeles distintos: protección del sitio por cuenta del titular y mejora del servicio como responsable independiente. La base de interés legítimo también requiere una evaluación documentada del responsable. | La política explica ambas funciones de Cloudflare y condiciona la base de interés legítimo a evaluar el equilibrio con los derechos de las personas. | Revisar los términos vigentes de Turnstile, evaluar si su carga al iniciar el formulario o voto es admisible para la audiencia objetivo y completar una evaluación de interés legítimo para consultas generales. Si no se acepta el uso independiente de señales por Cloudflare, elegir/configurar otra protección antes de activar esos flujos. |
| Media | El aviso describía estadísticas propias como compatibles con Do Not Track, pero no todas las rutas lo respetaban y no mencionaba GPC ni sessionStorage. | Se actualizaron los textos en español e inglés; la portada y el formulario describen sus usos de almacenamiento. La versión del resumen se fija en código como `contact-form-privacy-v2`; se ignora el override antiguo de Production. | Confirmar la versión guardada en los próximos envíos. |
| Alta | `CRON_SECRET` está configurada en Vercel Production, pero aún no se ha observado una ejecución programada posterior a ese cambio. | Se verificó el job `contact-submission-retention` activo a las 03:00 UTC y tres ejecuciones recientes correctas. `CRON_SECRET` se añadió como Secret y el redepliegue de `main` terminó Ready. Vercel muestra las rutas de retención diaria y limpieza multimedia semanal en su calendario. | Verificar con datos agregados la siguiente ejecución de `/api/cron/lead-retention` (14 de octubre de 2026, 03:30 UTC) y la siguiente limpieza de `/api/cron/site-media-cleanup` (18 de octubre, 04:00 UTC). No se han invocado manualmente porque la retención puede enviar avisos y programar borrados, y la limpieza puede retirar medios no referenciados. Revisar también la retención del buzón de correo. |
| Alta | La elección de cookies se almacena en el navegador y no genera un recibo en servidor; la nueva declaración adulta no verifica edad o autoridad parental. | El consentimiento v2 guarda la aceptación junto con la declaración adulta, ofrece aceptar y rechazar con igual visibilidad y permite retirarla desde el pie. Las aceptaciones v1 se invalidan. | El titular debe decidir si hace falta conservar evidencia adicional y aplicar controles apropiados antes de habilitar Google Analytics para la audiencia mixta mundial. |

## Reglas y cobertura que se han tenido en cuenta

La implementación toma como referencia el RGPD y la directiva ePrivacy de la UE, la guía de cookies de la AEPD y PECR/UK GDPR del Reino Unido; para Estados Unidos, COPPA y señales de exclusión como GPC; y LGPD y el principio de interés superior de niños y adolescentes en Brasil. Estas fuentes no sustituyen la revisión país por país. La web no debe anunciar “cumplimiento global” hasta que el responsable confirme alcance, audiencia, proveedores y contratos.

## Archivos implicados

- `packages/analytics/src/index.ts`: bandera de Google Analytics, DNT/GPC, retirada de consentimiento y borrado de cookies accesibles.
- `apps/web/src/components/AnalyticsConsentManager.tsx`: preferencias de cookies en lenguaje claro, declaración adulta obligatoria para aceptar y limpieza de cookies sin consentimiento válido.
- `packages/analytics/src/index.ts`: formato de consentimiento v2, exigencia técnica de declaración adulta para aceptar e invalidación de consentimientos anteriores.
- `apps/web/src/app/api/admin/analytics/route.ts` y `apps/web/src/app/api/contact/route.ts`: omisión server side de métricas con señal de privacidad.
- `apps/web/src/app/[locale]/contacto/page.tsx`: carga diferida de Turnstile y aviso por capas.
- `apps/web/src/app/[locale]/cookies/page.tsx` y `apps/web/src/app/[locale]/privacidad/page.tsx`: explicación bilingüe de usos, proveedores, conservación y derechos.
- `apps/web/src/lib/forms/privacy-version.ts`: versión del aviso asociada a nuevos envíos.
- `Docs/BACKEND_TECHNICAL_REFERENCE.md`: operación técnica, configuración y limitaciones comprobadas.

## Fuentes oficiales de referencia

- [Reglamento General de Protección de Datos de la UE](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)
- [Directiva ePrivacy, artículo 5.3](https://eur-lex.europa.eu/eli/dir/2002/58/art_5/par_3/oj/eng)
- [Guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf)
- [Guía ICO sobre tecnologías de almacenamiento y acceso](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/)
- [Preguntas frecuentes de COPPA de la FTC](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [Preguntas frecuentes de la Agencia de Protección de la Privacidad de California](https://cppa.ca.gov/faq.html)
- [Anexo de privacidad de Cloudflare Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/)
- [Guía de representación explícita de Turnstile](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)


## Verificación de publicación de consentimiento de cookies

El PR #26 se integró en `main` con el commit `9657b975b18ab0ce47a063ba1d393deca8a63c5b`. El despliegue Production `DnXBw8GxVZgi1edCEFykxvLTAgtz` alcanzó estado Ready el 12 de octubre de 2026 y quedó asignado a `www.curileta.com`. Se comprobaron visualmente `/es/cookies`, `/en/cookies` y `/es/privacidad`; los textos usan “cookies opcionales” y no “analítica” en el mensaje de elección. No hubo cambio de esquema ni migración de base de datos. CI y la vista previa del PR pasaron; los comandos locales de TypeScript para analítica y web pasaron, y ESLint conservó dos avisos preexistentes fuera de este cambio.

En Production no está configurada `NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED=true`, por lo que Google Analytics permanece desactivado y el diálogo de elección no se muestra en la landing mientras siga apagado. El consentimiento v2 exige la declaración de persona adulta o progenitor/tutor autorizado, pero es una autodeclaración: no verifica edad ni acredita consentimiento parental verificable. La declaración de regiones UE y revisión contractual de Vercel, Supabase, Cloudflare y Resend es información confirmada por el titular y no una inspección contractual independiente.
