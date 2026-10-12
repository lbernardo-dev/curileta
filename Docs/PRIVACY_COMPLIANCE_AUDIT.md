# Auditoría técnica de privacidad, cookies y datos

Fecha de revisión: 12 de octubre de 2026. Alcance: landing pública en español e inglés, formulario de contacto, avisos de privacidad y cookies, métricas, preferencias de navegador, recursos externos y flujos de consentimiento. El titular confirma que el público es mixto, con familias y menores, y que el sitio tiene alcance mundial.

## Estado de la revisión

Esta auditoría es técnica y cubre una base de buenas prácticas para España/EEE, Reino Unido, Estados Unidos y Brasil. No es una certificación ni una opinión jurídica sobre todos los países. La obligación concreta depende de la audiencia real, los mercados, la configuración de cada proveedor y los contratos vigentes.

Los PR #19 (e3d7831), #20 (3d7d8b5), #21 (2c0688b) y #22 (36032ca) se integraron el 12 de octubre de 2026. El titular también confirmó que las regiones de tratamiento seleccionadas están en la UE y que revisó los contratos de los cuatro proveedores; este dato se recoge como declaración del titular y no como inspección independiente de los contratos. Vercel confirmó Production Ready para la auditoría y el despliegue final de las aclaraciones de retención (66rGkx1pZbiwKQ4PSXTi6jAGVRni, dominio www.curileta.com). Se verificaron visualmente `/es/cookies`, `/es/privacidad`, `/es/contacto` y `/en/privacidad`. Los textos publicados especifican que la revisión y eliminación de consultas cerradas y oportunidades es manual mientras no se confirme la automatización; la versión del aviso del formulario se fija en código como `contact-form-privacy-v2`. El formulario informa de Turnstile antes de la interacción y el código carga el script al enfocar el formulario; no se inspeccionó Network ni se envió el formulario para evitar guardar una consulta real o emitir un correo. La bandera de Google Analytics no aparece en Production y el código requiere que esté en `true`, así que Analytics está desactivado aunque el ID siga declarado. No hay migración de base de datos para estos cambios.

El pack de campañas estacionales sí está desplegado. Su migración de datos está aplicada y verificada, pero la conciliación del historial completo de migraciones de Production sigue pendiente; consulta [BACKEND_TECHNICAL_REFERENCE.md](./BACKEND_TECHNICAL_REFERENCE.md).

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
| Alta | `CRON_SECRET` no está configurada en Production, aunque las rutas Vercel de retención de oportunidades y limpieza de medios la exigen. Además, la migración que programa el borrado de consultas cerradas con pg_cron no aparece entre las versiones verificadas en Production. No se puede afirmar que ninguna de estas tareas automáticas esté activa. | El aviso público exige revisión y eliminación manual para consultas cerradas y oportunidades mientras no se confirme la automatización. | Reconciliar el historial remoto de migraciones sin ejecutar `db push` a ciegas, inspeccionar `cron.job` y las ejecuciones recientes, después configurar `CRON_SECRET` y verificar las rutas Vercel antes de activar borrados programados. Revisar también la retención del buzón de correo. |
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
