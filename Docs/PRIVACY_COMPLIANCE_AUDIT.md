# Auditoría técnica de privacidad, cookies y datos

Fecha de revisión: 12 de octubre de 2026. Alcance: landing pública en español e inglés, formulario de contacto, avisos de privacidad y cookies, métricas, preferencias de navegador, recursos externos y flujos de consentimiento.

## Estado de la revisión

Esta auditoría es técnica y cubre una base de buenas prácticas para España/EEE, Reino Unido, Estados Unidos y Brasil. No es una certificación ni una opinión jurídica sobre todos los países. La obligación concreta depende de la audiencia real, los mercados, la configuración de cada proveedor y los contratos vigentes.

El código de esta rama aplica controles de minimización, respeta DNT/GPC para métricas, desactiva Google Analytics por defecto y retrasa Turnstile hasta que se inicia una acción que lo necesita. El despliegue de estos cambios debe verificarse en Production después de integrar el PR. No se ha enviado el formulario de contacto en Production porque esa prueba guardaría una consulta real y podría emitir un aviso operativo.

El pack de campañas estacionales sí está desplegado. Su migración de datos está aplicada y verificada, pero la conciliación del historial completo de migraciones de Production sigue pendiente; consulta [BACKEND_TECHNICAL_REFERENCE.md](./BACKEND_TECHNICAL_REFERENCE.md).

## Datos y tecnologías que utiliza la web

| Uso | Dato o tecnología | Momento |
|---|---|---|
| Preferencias | localStorage para tema, aviso estacional, mercado de Amazon, vídeos favoritos, voto local y, si se habilita analítica, la elección correspondiente | Al guardar cada preferencia |
| Portada | sessionStorage para alternar el vídeo de fondo dentro de la pestaña | Al iniciar la escena de portada |
| Favoritos de personajes | Identificador aleatorio persistente en el navegador y su hash en `character_favorites` | Al consultar o cambiar favoritos |
| Sesión de administración | Cookies de sesión de Supabase Auth | Cuando una persona del equipo inicia sesión |
| Estadística propia | Contadores diarios por ruta, idioma y tipo de contenido, sin identificador persistente de visitante | En interacciones permitidas |
| Google Analytics | No se carga por defecto. Requiere `NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED=true`, un ID y aceptación expresa | Solo si el titular la habilita y la visita la acepta |
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
| Alta | El formulario solicita confirmación adulta, pero una casilla no demuestra edad ni consentimiento verificable de un progenitor. La web utiliza personajes, animación y contenido familiar, factores relevantes al determinar si un servicio se dirige a menores. | El formulario sigue limitado a personas adultas y recomienda no incluir datos de menores. La analítica opcional queda desactivada por defecto. | El titular debe clasificar el servicio por mercado y audiencia y determinar las medidas exigidas para niños, público mixto, consentimiento parental y protección de datos. |
| Alta | El identificador de favoritos es seudónimo y persistente; el servidor no tiene caducidad automática para su hash. Los contadores agregados tampoco tienen una política automática de eliminación. | La política revela el identificador y la ausencia de vencimiento. No se borraron datos existentes ni se inventó un plazo sin decisión del responsable. | El titular debe aprobar plazos de conservación y borrado para favoritos y estadísticas; después habrá que implementar y verificar la limpieza correspondiente. |
| Alta | El código identifica proveedores, pero no demuestra la región efectiva del servicio, el papel contractual ni las garantías de transferencia. | Se retiró la afirmación no verificada de que todas las transferencias tienen garantías aplicables y se enlazaron los avisos de Vercel, Supabase, Cloudflare Turnstile y Resend. | Confirmar región del proyecto Supabase, funciones contratadas, DPA y subencargados, regiones de Vercel y Resend y mecanismo de transferencia aplicable. Las páginas de privacidad no reemplazan los contratos. |
| Alta | Cloudflare usa las señales de Turnstile para dos finalidades y con papeles distintos: protección del sitio por cuenta del titular y mejora del servicio como responsable independiente. La base de interés legítimo también requiere una evaluación documentada del responsable. | La política explica ambas funciones de Cloudflare y condiciona la base de interés legítimo a evaluar el equilibrio con los derechos de las personas. | Revisar los términos vigentes de Turnstile, evaluar si su carga al iniciar el formulario o voto es admisible para la audiencia objetivo y completar una evaluación de interés legítimo para consultas generales. Si no se acepta el uso independiente de señales por Cloudflare, elegir/configurar otra protección antes de activar esos flujos. |
| Media | El aviso describía estadísticas propias como compatibles con Do Not Track, pero no todas las rutas lo respetaban y no mencionaba GPC ni sessionStorage. | Se actualizó el texto en español e inglés; la portada y el formulario describen sus usos de almacenamiento. La versión del aviso del formulario pasa a `contact-form-privacy-v2`. | Tras desplegar, comparar los avisos publicados con la configuración real de Production y verificar la versión guardada en los próximos envíos. |
| Media | La política de eliminación de consultas y oportunidades depende de tareas programadas y configuración del entorno. | El repositorio define pg_cron para consultas cerradas y una tarea de Vercel diaria para avisos y eliminación de oportunidades. | Verificar en Production que la tarea diaria está activa, que `CRON_SECRET` existe sin revelar su valor y que los avisos y borrados se completan. Las copias de correo ya entregadas siguen la retención del buzón. |
| Media | El consentimiento de analítica guarda una elección en localStorage por hasta 180 días, pero no ofrece una prueba server side. | Analítica permanece apagada por defecto; cuando se habilite, aceptar y rechazar tienen igual visibilidad y se puede retirar la elección desde el pie. | La persona responsable debe decidir si esa evidencia es suficiente antes de habilitarla. |

## Reglas y cobertura que se han tenido en cuenta

La implementación toma como referencia el RGPD y la directiva ePrivacy de la UE, la guía de cookies de la AEPD y PECR/UK GDPR del Reino Unido; para Estados Unidos, COPPA y señales de exclusión como GPC; y LGPD y el principio de interés superior de niños y adolescentes en Brasil. Estas fuentes no sustituyen la revisión país por país. La web no debe anunciar “cumplimiento global” hasta que el responsable confirme alcance, audiencia, proveedores y contratos.

## Archivos implicados

- `packages/analytics/src/index.ts`: bandera de Google Analytics, DNT/GPC, retirada de consentimiento y borrado de cookies accesibles.
- `apps/web/src/components/AnalyticsConsentManager.tsx`: consentimiento y limpieza de preferencias inactivas.
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
