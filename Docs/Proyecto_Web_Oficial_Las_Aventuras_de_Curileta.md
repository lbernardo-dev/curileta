# Proyecto Web Oficial — Las Aventuras de Curileta
## Documento maestro de producto, UX/UI, arquitectura, contenido y evolución

**Estado:** Definición inicial de arquitectura y producto  
**Producto:** Web oficial de *Las Aventuras de Curileta*  
**Tipo:** Plataforma web de marca, contenidos, libros, vídeo, colaboraciones y merchandising  
**Público:** Familias, niños de 3–12 años, lectores, educadores, medios, editoriales, partners y potenciales licenciatarios  
**Mercado inicial:** España, con arquitectura internacional desde el primer día  
**Idioma principal:** Español de España  
**Idiomas previstos:** ES, EN inicialmente; ampliable sin cambios estructurales a FR, PT, DE, IT y otros  
**Principio de diseño:** “Una aventura continua”: la navegación, la animación y el scroll deben sentirse como partes de un mismo viaje.

---

# 1. VISIÓN DEL PRODUCTO

La web oficial de *Las Aventuras de Curileta* no debe funcionar como una página promocional estática ni como un simple catálogo de libros.

Debe convertirse en el **centro digital del universo de Curileta** y servir simultáneamente como:

- presentación oficial del personaje;
- puerta de entrada al universo narrativo;
- catálogo vivo de personajes;
- catálogo de libros publicados y futuros;
- archivo de aventuras, destinos y episodios;
- extensión oficial del canal de YouTube;
- plataforma para descubrir vídeos y canciones;
- punto de contacto para familias;
- punto de contacto profesional;
- espacio para prensa y medios;
- plataforma para colaboraciones y licencias;
- base futura para merchandising y comercio electrónico;
- plataforma multidioma;
- escaparate de eventos;
- centro de novedades;
- futura base de experiencias interactivas.

La web debe transmitir inmediatamente:

> **Curileta no es únicamente un personaje: es un universo de aventuras, amistad, descubrimiento y curiosidad por el mundo.**

---

# 2. PRINCIPIOS FUNDAMENTALES

Toda decisión de producto, diseño o arquitectura debe respetar estos principios.

## 2.1 El personaje es el centro

Curileta debe ser el hilo conductor de prácticamente toda la experiencia.

No se utilizará como una mascota decorativa colocada arbitrariamente en banners.

Debe:

- mirar;
- reaccionar;
- caminar;
- descubrir;
- señalar;
- acompañar al usuario;
- conectar secciones;
- activar mapas;
- abrir libros;
- aparecer en transiciones;
- servir como guía visual.

La interacción con Curileta nunca debe bloquear la navegación ni convertirse en una molestia.

---

## 2.2 El scroll cuenta una historia

La página principal debe tener un nivel de narrativa visual y continuidad similar al de las grandes landing pages de producto de Apple.

Esto significa:

- las secciones no deben sentirse como bloques independientes apilados;
- un elemento visual de una sección debe poder transformarse en el siguiente;
- el scroll controla progresivamente la narración;
- determinadas escenas pueden permanecer fijadas mientras el usuario avanza;
- los fondos, personajes, mapas y objetos evolucionan siguiendo el scroll;
- la cámara virtual puede acercarse, alejarse o desplazarse;
- el movimiento tiene intención narrativa.

El usuario no debe pensar:

> “Ahora estoy viendo otra sección.”

Debe sentir:

> “La aventura continúa.”

---

## 2.3 El contenido debe vivir fuera del código

Personajes, libros, vídeos, noticias, destinos, colaboraciones y productos no deben codificarse manualmente en los componentes.

Todo contenido editorial debe gestionarse desde un **Headless CMS**.

La web debe poder evolucionar sin necesitar una nueva versión del frontend cada vez que:

- se publica un libro;
- aparece un personaje;
- se publica un nuevo vídeo;
- surge una colaboración;
- se crea una campaña;
- aparece una nueva colección de merchandising;
- se añade un idioma;
- cambia el orden de una sección.

---

## 2.4 Mobile first, pero sin sacrificar escritorio

La experiencia móvil debe diseñarse desde el principio.

No se hará primero una landing espectacular de escritorio para después “encogerla”.

Existirán tres perfiles de movimiento:

### Full Motion
Dispositivos de escritorio/tablet potentes.

### Adaptive Motion
Móviles modernos. Mantiene narrativa, reduce WebGL, blur, partículas y escenas simultáneas.

### Reduced Motion
Usuarios con `prefers-reduced-motion`, equipos limitados o modo ahorro de datos.

La historia debe seguir funcionando perfectamente en las tres variantes.

---

## 2.5 La animación nunca puede destruir la usabilidad

Las animaciones deben:

- explicar;
- conectar;
- emocionar;
- dirigir la mirada.

Nunca deben:

- ocultar navegación;
- secuestrar el scroll;
- ralentizar la página;
- impedir lectura;
- provocar mareos;
- desplazar contenido inesperadamente;
- bloquear teclado;
- romper lectores de pantalla.

---

# 3. OBJETIVOS DE NEGOCIO

## Objetivos principales

1. Consolidar una identidad digital oficial de Curileta.
2. Construir reconocimiento de marca.
3. Llevar usuarios hacia los libros.
4. Llevar usuarios hacia YouTube.
5. Incrementar descubrimiento de personajes e historias.
6. Crear un punto oficial para potenciales colaboraciones.
7. Preparar la marca para merchandising.
8. Construir tráfico orgánico a largo plazo.
9. Internacionalizar el universo.
10. Disponer de una plataforma independiente de redes sociales.

## Objetivos secundarios

- captar suscriptores adultos interesados en novedades;
- ofrecer press kit;
- ofrecer material para prensa;
- facilitar contacto editorial;
- facilitar solicitudes de licencia;
- destacar eventos;
- publicar contenido complementario;
- ofrecer fichas descargables futuras;
- crear experiencias interactivas.

---

# 4. PÚBLICOS

## 4.1 Niños

Edad principal: 3–12 años.

Objetivos:

- descubrir Curileta;
- explorar personajes;
- ver vídeos;
- descubrir lugares;
- sentirse dentro de la aventura.

No se solicitarán datos personales directamente a menores.

---

## 4.2 Familias

Objetivos:

- conocer los libros;
- comprobar edades recomendadas;
- encontrar vídeos;
- descubrir valores educativos;
- comprar productos cuando estén disponibles;
- conocer novedades.

---

## 4.3 Educadores

Objetivos futuros:

- descubrir valor educativo;
- acceder a recursos;
- organizar actividades;
- contactar para eventos;
- obtener fichas didácticas.

---

## 4.4 Prensa y creadores

Necesitan:

- información oficial;
- biografías;
- imágenes;
- press kit;
- novedades;
- contacto rápido.

---

## 4.5 Editoriales, distribuidores y partners

Necesitan:

- catálogo;
- derechos disponibles;
- mercados;
- contacto profesional;
- dossier de marca.

---

## 4.6 Licenciatarios y merchandising

Necesitan:

- presentación del universo;
- audiencia;
- personajes;
- oportunidades;
- formulario específico;
- canal profesional.

---

# 5. ARQUITECTURA DE INFORMACIÓN

## Navegación principal

- Inicio
- Curileta
- Personajes
- Aventuras
- Libros
- Vídeos
- Canciones
- Mundo de Curileta
- Novedades
- Colaboraciones
- Tienda
- Contacto

La sección **Tienda** permanecerá desactivable mediante feature flag hasta que exista catálogo comercial.

---

# 6. MAPA DE URLS

```text
/
├── /curileta
├── /personajes
│   └── /personajes/[slug]
├── /aventuras
│   └── /aventuras/[slug]
├── /lugares
│   └── /lugares/[slug]
├── /libros
│   └── /libros/[slug]
├── /videos
│   └── /videos/[slug]
├── /canciones
│   └── /canciones/[slug]
├── /mundo
├── /novedades
│   └── /novedades/[slug]
├── /colaboraciones
├── /prensa
├── /eventos
├── /tienda
│   └── /tienda/[slug]
├── /contacto
├── /privacidad
├── /cookies
├── /legal
└── /accesibilidad
```

Todos los paths deben localizarse por idioma:

```text
/es/...
/en/...
/fr/...
```

El idioma principal puede utilizar `/es` explícitamente para mantener simetría internacional.

---

# 7. CONCEPTO DE LA HOME

## Objetivo

La home debe constituir una experiencia narrativa completa.

La página debe poder entenderse sin texto largo.

Las palabras introducen ideas; el movimiento crea la emoción.

## Hilo visual conductor

Se utilizarán tres elementos recurrentes:

1. **Curileta**
2. **el mapa**
3. **una ruta luminosa**

La ruta sirve como elemento gráfico que atraviesa progresivamente toda la página.

A veces será:

- línea sobre el mapa;
- sendero;
- ola;
- haz de luz;
- línea de vuelo;
- costura de un libro;
- timeline de vídeos;
- línea que conecta productos.

Esto permitirá transformar una sección en otra sin cortes arbitrarios.

---

# 8. HOME — EXPERIENCIA SCROLLYTELLING

## 8.1 Escena 01 — Hero

**Altura narrativa:** aproximadamente 100–140 svh.

### Visual

Bosque Encantado.

Curileta en primer plano.

Mapa parcialmente abierto.

Luz de amanecer.

Animación ambiental mínima:

- hojas;
- partículas;
- profundidad;
- parallax;
- respiración del personaje.

### Copy

Título muy breve.

Ejemplo conceptual:

> Un mundo por descubrir.

CTA:

- Comenzar la aventura
- Conoce a Curileta

### Interacción

Cuando empieza el scroll:

- la cámara se acerca al mapa;
- Curileta dirige su mirada al mismo;
- una ruta se ilumina;
- el Hero se transforma progresivamente en la siguiente sección.

No realizar un corte vertical tradicional.

---

# 8.2 Escena 02 — El mapa cobra vida

**Scroll narrativo:** 250–350 svh.

El viewport puede mantenerse fijado durante parte de la secuencia.

El progreso del scroll controla:

- recorrido de una línea;
- cámara;
- aparición de relieve;
- movimiento del personaje;
- aparición de nubes;
- intensidad de luz.

El mapa empieza plano y termina como un pequeño mundo 3D.

### Destinos visibles

Representaciones simplificadas de:

- México;
- Perú;
- Egipto;
- Islandia;
- Japón;
- Australia;
- Nueva Zelanda;
- China;
- Italia;
- Francia;
- España.

No se intenta reproducir todos a máxima calidad simultáneamente.

Se utiliza LOD —Level of Detail—.

---

# 8.3 Escena 03 — Los lugares se convierten en aventuras

La cámara “entra” en uno de los destinos.

El mapa desaparece gradualmente.

Curileta pasa del mapa al entorno real.

Se muestran microescenas de:

- montañas;
- océanos;
- pirámides;
- ciudades;
- bosques;
- nieve.

Cada cambio utiliza una transición física:

- nube;
- agua;
- arena;
- hoja;
- luz;
- niebla;
- objeto que cruza cámara.

CTA final:

**Explorar las aventuras**

---

# 8.4 Escena 04 — Los amigos

La misma ruta empieza a conectar personajes.

Las tarjetas no deben aparecer simplemente en grid.

Propuesta:

Un carrusel espacial/horizontal controlado parcialmente por scroll.

Curileta permanece visible.

A medida que el usuario avanza:

- aparece Pompón;
- después Quetzal;
- después Lulú;
- después el resto.

Cada personaje:

- realiza una microanimación;
- muestra nombre;
- muestra una frase;
- permite entrar en su ficha.

En móvil:

carrusel táctil estándar mejorado.

Nunca sacrificar usabilidad por animación.

---

# 8.5 Escena 05 — Los libros

Un elemento del mapa se transforma en una página.

La página se dobla.

La página termina siendo un libro físico 3D.

### Interacción por scroll

1. aparece la cubierta;
2. gira ligeramente;
3. se abre;
4. aparecen ilustraciones;
5. se cierra;
6. aparecen los libros publicados.

Cada libro puede mostrar:

- portada;
- título;
- descripción;
- edad;
- idiomas;
- ISBN;
- formatos;
- enlaces de compra;
- personajes;
- destinos.

CTA:

**Descubrir los libros**

---

# 8.6 Escena 06 — YouTube

Una ilustración dentro del libro empieza a moverse.

La página se convierte gradualmente en una pantalla de vídeo.

La pantalla crece.

Aparecen clips seleccionados del canal.

### Elementos

- último episodio;
- Short destacado;
- canción destacada;
- playlist.

Los vídeos no se cargarán mediante iframes pesados al abrir la página.

Se mostrará inicialmente:

- thumbnail;
- duración;
- título;
- botón play.

El reproductor real se carga al interactuar.

---

# 8.7 Escena 07 — Canciones

La onda del reproductor del vídeo se transforma en una línea musical.

Tarjetas de canciones aparecen ligadas al mapa/destinos.

Cada canción dispone de:

- portada;
- título;
- episodio;
- audio/video;
- personajes relacionados.

El usuario puede escuchar previews únicamente después de interacción.

No autoplay con sonido.

---

# 8.8 Escena 08 — El universo sigue creciendo

Mostrar visualmente ramas que salen desde el universo principal:

- nuevos libros;
- canciones;
- YouTube;
- eventos;
- colaboraciones;
- merchandising.

Concepto:

> La aventura sigue creciendo.

Esta sección sirve para introducir oportunidades comerciales sin romper la narrativa infantil.

---

# 8.9 Escena 09 — Colaboraciones

El diseño pasa a un tono ligeramente más profesional.

CTA:

- Editorial
- Licensing
- Merchandising
- Eventos
- Educación
- Prensa

Curileta continúa presente, pero con menos movimiento.

---

# 8.10 Escena 10 — Cierre

Regreso visual al Bosque Encantado.

El sendero luminoso continúa hacia el horizonte.

CTA:

> ¿Seguimos explorando?

Acciones:

- YouTube
- Libros
- Novedades

Footer completo.

---

# 9. ARQUITECTURA DE ANIMACIÓN

## 9.1 Principio

No utilizar una única tecnología de animación para todo.

La solución debe escoger la técnica más económica para cada interacción.

### CSS

Para:

- fades;
- transforms;
- parallax sencillo;
- hover;
- reveal;
- cambios de opacidad;
- microinteracciones.

### CSS Scroll-Driven Animations

Para animaciones simples directamente ligadas al scroll.

### GSAP + ScrollTrigger

Para:

- timelines complejos;
- escenas fijadas;
- scrubbing;
- sincronización de múltiples objetos;
- transformaciones entre secciones;
- secuencias tipo Apple.

### View Transition API

Para:

- navegación entre páginas;
- imagen de libro → detalle;
- personaje → ficha;
- thumbnail → vídeo;
- producto → detalle.

Implementar como progressive enhancement.

### Three.js / React Three Fiber

Solo donde el 3D tenga una función clara:

- mapa tridimensional;
- globo;
- libro;
- objetos hero.

No convertir toda la página en WebGL.

### Rive

Preferido para determinados assets vectoriales interactivos:

- microanimaciones de Curileta;
- brújula;
- iconos;
- estados hover;
- pequeños elementos de interfaz.

---

# 10. MOTOR DE ESCENAS

Crear una capa interna llamada conceptualmente:

```text
MotionSceneEngine
```

Responsabilidad:

- registrar escenas;
- medir viewport;
- recibir progreso de scroll;
- activar/desactivar assets;
- coordinar GSAP;
- respetar reduced motion;
- suspender animaciones fuera de viewport;
- controlar WebGL;
- liberar memoria;
- sincronizar breakpoint.

Ejemplo:

```ts
type MotionProfile = 'full' | 'adaptive' | 'reduced'

interface SceneConfig {
  id: string
  start: number
  end: number
  pin?: boolean
  profile: MotionProfile[]
  preload?: string[]
}
```

No acoplar lógica de scroll directamente a componentes editoriales.

---

# 11. ARQUITECTURA FRONTEND

## Stack recomendado

- **Next.js**
- **React**
- **TypeScript**
- **App Router**
- Server Components por defecto
- Client Components únicamente donde exista interacción real
- Tailwind CSS + design tokens
- GSAP / ScrollTrigger
- CSS Scroll-Driven Animations
- View Transition API
- React Three Fiber / Three.js, limitado a escenas justificadas
- Rive para motion assets compatibles
- next-intl para internacionalización

### Principio

El contenido debe renderizarse principalmente en servidor.

La animación se añade como capa progresiva sobre HTML semántico.

Esto garantiza:

- SEO;
- accesibilidad;
- rapidez;
- resiliencia.

---

# 12. CMS — SANITY

## Elección recomendada

**Sanity** como Headless CMS.

Motivos:

- contenido estructurado;
- referencias entre entidades;
- contenido multidioma;
- preview;
- editorial workflow;
- assets;
- escalabilidad;
- acceso vía API;
- independencia del frontend.

---

# 13. MODELO DE CONTENIDO

## Character

```text
Character
├── name
├── slug
├── shortDescription
├── biography
├── species
├── personality
├── values
├── mainImage
├── gallery[]
├── modelSheets[]
├── animations[]
├── voiceDescription
├── firstAppearance
├── relatedBooks[]
├── relatedEpisodes[]
├── relatedLocations[]
├── relatedCharacters[]
├── seo
└── translations
```

---

## Book

```text
Book
├── title
├── slug
├── subtitle
├── cover
├── gallery[]
├── description
├── publicationDate
├── isbn[]
├── languages[]
├── ageRange
├── pageCount
├── formats[]
├── publisher
├── purchaseLinks[]
├── characters[]
├── locations[]
├── trailer
├── downloadablePreview
├── pressAssets
└── seo
```

---

## Adventure / Episode

```text
Adventure
├── title
├── slug
├── number
├── hero
├── synopsis
├── characters[]
├── countries[]
├── locations[]
├── book
├── videos[]
├── songs[]
├── gallery[]
├── facts[]
├── educationalValues[]
└── seo
```

---

## Location

```text
Location
├── name
├── slug
├── country
├── coordinates
├── hero
├── gallery
├── description
├── curiosities[]
├── characters[]
├── adventures[]
├── mapPosition
└── seo
```

---

## Video

```text
Video
├── title
├── slug
├── youtubeId
├── thumbnail
├── type
├── publishedAt
├── duration
├── characters[]
├── adventure
├── language
├── transcript
└── seo
```

---

## Song

```text
Song
├── title
├── slug
├── cover
├── audio
├── video
├── characters[]
├── adventure
├── lyrics
├── duration
├── releaseDate
└── seo
```

---

## Collaboration

```text
Collaboration
├── brand
├── title
├── slug
├── logo
├── hero
├── description
├── campaignAssets
├── dates
├── externalLinks
└── featured
```

---

## MerchProduct

Separar contenido editorial y datos de comercio.

```text
MerchProduct
├── cmsId
├── commerceProductId
├── editorialTitle
├── story
├── gallery
├── characters[]
├── collection
└── merchandisingMetadata
```

Precio, stock y variantes deben proceder de la plataforma de commerce, no del CMS.

---

# 14. INTERNACIONALIZACIÓN

## Estrategia

Preparar i18n desde el primer commit.

Nunca añadirlo “más adelante”.

## Inicial

- es-ES
- en

## Futuro

- fr
- pt
- de
- it

## Recomendación CMS

Contenido largo:

**localización a nivel de documento.**

Esto permite:

- publicar español antes que inglés;
- mantener traducciones independientes;
- adaptar copy culturalmente;
- SEO independiente.

Campos cortos y globales pueden localizarse a nivel de field.

---

# 15. SELECTOR DE IDIOMA

Debe:

- detectar preferencia del navegador solo la primera vez;
- permitir selección manual;
- recordar selección;
- no redirigir agresivamente;
- conservar página equivalente al cambiar idioma.

Ejemplo:

```text
/es/personajes/curileta
→
/en/characters/curileta
```

No enviar al usuario a `/en` perdiendo contexto.

---

# 16. SEO INTERNACIONAL

Cada página debe incluir:

- canonical;
- hreflang;
- localized metadata;
- Open Graph;
- Twitter/X cards cuando proceda;
- sitemap por locale;
- sitemap de imágenes;
- sitemap de vídeo si el volumen lo justifica.

---

# 17. DATOS ESTRUCTURADOS

Implementar JSON-LD.

## Entidades

### Libros
Schema.org `Book`.

### Vídeos
`VideoObject`.

### Productos
`Product` cuando se active merchandising.

### Navegación
`BreadcrumbList`.

### Sitio
`WebSite`.

### Marca
`Organization`/`Brand`, según contexto.

---

# 18. YOUTUBE

## Integración

Construir una capa:

```text
YouTubeProvider
```

Responsabilidad:

- canal;
- playlists;
- últimos vídeos;
- Shorts;
- thumbnails;
- duración;
- fecha.

Los resultados deben cachearse.

No consultar la API de YouTube en cada pageview.

## Privacidad

El iframe completo del reproductor no se carga inicialmente.

Primero:

- thumbnail;
- play;
- metadata.

Después del click:

- inicializar reproductor.

---

# 19. MERCHANDISING

## Fase inicial

Página teaser / catálogo editorial.

## Fase commerce

Recomendación:

Headless Shopify u otra plataforma commerce desacoplada.

La web conserva:

- diseño;
- navegación;
- contenido;
- narrativa.

El commerce aporta:

- productos;
- variantes;
- precios;
- stock;
- carrito;
- checkout;
- impuestos;
- promociones.

Crear interfaz:

```ts
interface CommerceProvider {
  getProduct()
  getProducts()
  getInventory()
  createCart()
  addToCart()
  updateCart()
  checkout()
}
```

Así se evita acoplar la web permanentemente a un proveedor.

---

# 20. COLABORACIONES Y LICENSING

Crear una página profesional separada del contenido infantil.

## Secciones

- El universo
- Audiencia
- Personajes
- Publicaciones
- YouTube
- Casos de colaboración
- Categorías disponibles
- Licensing
- Editorial
- Merchandising
- Eventos
- Educación
- Media
- Contacto

CTA:

**Hablar sobre una colaboración**

---

# 21. PRESS ROOM

Ruta:

```text
/prensa
```

Debe ofrecer:

- descripción oficial;
- bio de Curileta;
- bio del creador/equipo cuando proceda;
- logos;
- imágenes aprobadas;
- portadas;
- screenshots;
- últimas noticias;
- notas de prensa;
- enlaces;
- contacto de prensa.

Descargas agrupadas en ZIP generadas/gestionadas externamente.

---

# 22. CONTACTO

Debe existir un hub único.

## Categorías

- Consulta general
- Editorial
- Distribución
- Prensa
- Colaboraciones
- Licensing
- Merchandising
- Eventos
- Centros educativos
- YouTube / contenido
- Soporte técnico
- Derechos de autor

## Reglas

Los formularios profesionales deben indicar claramente que están destinados a adultos.

No pedir datos innecesarios.

Campos:

- nombre;
- email;
- empresa opcional;
- país;
- categoría;
- asunto;
- mensaje;
- consentimiento.

Campos adicionales condicionales según categoría.

---

# 23. ROUTING DE CONTACTOS

El backend decide destino según categoría.

```text
editorial → editorial@
press → press@
licensing → licensing@
merch → partnerships@
general → hello@
```

La dirección real no tiene que exponerse en HTML.

Posible integración futura:

- HubSpot;
- Brevo;
- Salesforce;
- CRM propio.

Crear:

```ts
interface ContactProvider {
  submit(request: ContactRequest): Promise<ContactResult>
}
```

---

# 24. PROTECCIÓN DE FORMULARIOS

- validación server-side;
- rate limiting;
- Turnstile/hCaptcha;
- honeypot;
- bloqueo de URLs sospechosas;
- sanitización;
- límites de longitud;
- attachments opcionales mediante signed upload;
- antivirus si se admiten adjuntos;
- logging seguro;
- consentimiento.

---

# 25. PRIVACIDAD INFANTIL

La web está vinculada a contenido para niños.

Principios obligatorios:

- no perfilar menores;
- no crear publicidad comportamental infantil;
- no pedir nombre, correo, teléfono o ubicación a niños;
- no tener chat abierto entre menores;
- no permitir comentarios no moderados;
- no usar dark patterns;
- no activar trackers no esenciales antes del consentimiento aplicable;
- formularios de contacto profesional orientados explícitamente a adultos;
- newsletter dirigida a madres/padres/tutores, educadores o profesionales.

Cualquier futura función de cuenta infantil requerirá una revisión independiente de producto, privacidad y cumplimiento antes de implementarse.

---

# 26. NEWSLETTER

No presentar como:

> “Niños, deja tu email.”

Presentar como:

> “Familias y exploradores adultos: recibe las próximas aventuras.”

Información:

- nuevos libros;
- episodios;
- canciones;
- eventos;
- productos.

Double opt-in recomendado.

---

# 27. ACCESIBILIDAD

Objetivo mínimo:

**WCAG 2.2 AA.**

## Requisitos

- navegación completa con teclado;
- focus visible;
- skip links;
- HTML semántico;
- alt text editorial;
- contraste adecuado;
- targets táctiles suficientes;
- jerarquía correcta de headings;
- formularios accesibles;
- errores descritos textualmente;
- transcripciones de vídeo;
- captions cuando corresponda;
- reduced motion;
- no depender exclusivamente de color;
- no autoplay de audio.

---

# 28. PREFERS-REDUCED-MOTION

Cuando esté activo:

No eliminar contenido.

Sustituir:

- scroll scrub → fade;
- parallax → estático;
- cámara 3D → imagen;
- transformación compleja → crossfade;
- objetos flotantes → estáticos.

El contenido y navegación deben permanecer idénticos.

---

# 29. PERFORMANCE

Una landing “tipo Apple” no justifica una página lenta.

## Objetivos Core Web Vitals

Objetivos de producto:

- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1

Percentil objetivo: 75.

## Estrategias

- Server Components;
- code splitting;
- dynamic imports;
- lazy WebGL;
- lazy vídeo;
- AVIF/WebP;
- responsive images;
- CDN;
- preload únicamente de assets críticos;
- prefetch inteligente;
- fonts subset;
- evitar scripts third-party;
- unload de escenas WebGL;
- pausar animaciones fuera de viewport.

---

# 30. PERFORMANCE BUDGET

## Home

Objetivo inicial:

```text
Critical JS propio:      <= 180 KB gzip
CSS inicial:             <= 60 KB gzip
Hero image:              <= 250 KB aprox. en móvil
WebGL:                    lazy
YouTube iframe:           0 en carga inicial
Third-party marketing:   0 antes de consentimiento
```

Estos valores son presupuestos de ingeniería, no límites rígidos si existe justificación medida.

---

# 31. IMÁGENES

Pipeline:

```text
Original Master
↓
CMS Asset
↓
Responsive transformation
↓
AVIF / WebP
↓
srcset
↓
browser
```

Nunca cargar una imagen desktop 4K en móvil si no es necesario.

---

# 32. VÍDEO

No utilizar vídeo autoplay pesado como fondo permanente en móvil.

Prioridad:

1. poster optimizado;
2. clip ligero bajo condiciones adecuadas;
3. reproducción completa tras interacción.

Respetar:

- ahorro de datos;
- reduced motion;
- conexiones lentas.

---

# 33. 3D

El 3D debe usarse únicamente donde crea valor.

## Aprobado

- mapa;
- globo;
- libro;
- objetos hero;
- transición especial.

## Evitar

- menús 3D;
- cards 3D innecesarias;
- textos renderizados en canvas;
- navegación WebGL completa.

---

# 34. DESIGN SYSTEM

Crear paquete:

```text
packages/design-system
```

## Tokens

### Color

```text
--color-curileta-green
--color-adventure-gold
--color-sky
--color-forest
--color-sand
--color-ocean
--color-surface
--color-text
```

No acoplar componentes a colores concretos.

Usar semantic tokens:

```text
--background-primary
--background-elevated
--text-primary
--text-secondary
--interactive-primary
```

---

# 35. MOTION TOKENS

```text
--motion-fast
--motion-standard
--motion-slow
--ease-standard
--ease-emphasized
--distance-small
--distance-medium
--distance-large
```

Las animaciones del sitio deben compartir ritmo.

---

# 36. COMPONENTES BASE

- Button
- Link
- IconButton
- Card
- CharacterCard
- BookCard
- VideoCard
- SongCard
- ProductCard
- DestinationCard
- Navigation
- LocaleSwitcher
- Breadcrumb
- Modal
- Drawer
- Carousel
- MediaPlayer
- FormField
- ContactForm
- NewsletterForm
- RichText
- Hero
- SectionHeader
- AnimatedRoute
- MapExplorer

---

# 37. TIPOGRAFÍA

Debe transmitir:

- aventura;
- cercanía;
- alegría;
- buena legibilidad.

No utilizar tipografía decorativa para párrafos.

Definir:

```text
Display
Heading XL
Heading L
Heading M
Body L
Body
Small
Caption
```

Fuente variable cuando sea viable para reducir requests.

---

# 38. RESPONSIVE

Breakpoints no basados únicamente en dispositivos comerciales.

Diseñar por comportamiento.

Referencias:

```text
xs  mobile narrow
sm  mobile
md  tablet
lg  laptop
xl  desktop
2xl wide
```

## Reglas

En móvil:

- evitar pinning excesivo;
- reducir profundidad 3D;
- scroll natural;
- cards swipe;
- CTA accesibles al pulgar.

---

# 39. ACCESO A CONTENIDO SIN ANIMACIÓN

La estructura HTML debe contener el contenido en orden lógico aunque JavaScript falle.

Ejemplo:

```html
<section>
  <h2>Descubre el mundo</h2>
  <p>...</p>
  <a>Explorar aventuras</a>
</section>
```

GSAP anima esta estructura.

No generar el contenido únicamente dentro de canvas.

---

# 40. SEO

Cada content type debe permitir editar:

- title;
- description;
- OG title;
- OG description;
- OG image;
- canonical override;
- noindex;
- structured data options.

Generar automáticamente por defecto.

---

# 41. OPEN GRAPH

Generación dinámica de OG images.

Ejemplos:

- personaje + nombre;
- libro + portada;
- aventura + destino;
- vídeo + thumbnail.

No generar en tiempo de request si puede cachearse.

---

# 42. BÚSQUEDA

Fase inicial:

búsqueda local/indexada estáticamente.

Indexar:

- personajes;
- libros;
- aventuras;
- destinos;
- vídeos;
- canciones;
- novedades.

Si el volumen crece:

adaptador para Algolia u otro motor.

---

# 43. ANALYTICS

Medir sin convertir el sitio en un sistema de vigilancia.

Eventos:

```text
book_view
book_purchase_click
video_play
youtube_channel_click
character_view
map_destination_open
song_play
collaboration_form_start
collaboration_form_submit
newsletter_subscribe
merch_product_view
merch_checkout_start
language_change
```

No enviar PII en eventos.

---

# 44. PANEL DE ANALYTICS

KPIs:

- visitantes;
- países;
- idiomas;
- páginas;
- libros consultados;
- CTR compra;
- vídeos reproducidos;
- tráfico hacia YouTube;
- personajes más vistos;
- destinos más vistos;
- contactos profesionales;
- suscripciones;
- conversiones de merch.

---

# 45. SEGURIDAD

Configurar:

- CSP;
- HSTS;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- secure cookies;
- SameSite;
- input validation;
- output encoding;
- sanitización de Rich Text;
- rate limiting;
- webhook signatures;
- secret manager;
- dependency scanning.

---

# 46. CONTENT SECURITY POLICY

Evitar un CSP basado permanentemente en:

```text
'unsafe-inline'
'unsafe-eval'
```

Definir explícitamente orígenes necesarios para:

- CMS;
- vídeo;
- analytics;
- commerce.

---

# 47. ENTORNOS

```text
local
↓
development
↓
preview
↓
staging
↓
production
```

Cada PR genera preview deploy.

Staging usa dataset independiente o perspectiva de staging.

---

# 48. CI/CD

Pipeline:

```text
PR
↓
lint
↓
typecheck
↓
unit tests
↓
component tests
↓
a11y
↓
build
↓
E2E
↓
Lighthouse CI
↓
preview
```

Merge a main:

```text
production build
↓
smoke tests
↓
deploy
↓
post-deploy checks
```

---

# 49. TESTING

## Unit

Vitest.

## Components

Testing Library.

## E2E

Playwright.

## Accessibility

axe + pruebas manuales.

## Visual Regression

Chromatic, Percy o alternativa.

## Performance

Lighthouse CI + Real User Monitoring.

---

# 50. STORYBOOK

Todo componente del design system debe tener historia.

Ejemplos:

```text
CharacterCard
├── default
├── hover
├── darkBackground
├── longName
├── mobile
└── reducedMotion
```

---

# 51. OBSERVABILIDAD

Implementar:

- error monitoring;
- performance traces;
- Web Vitals;
- server logs;
- CMS webhook logs;
- form failures;
- commerce failures.

Herramientas posibles:

- Sentry;
- Vercel Observability;
- proveedor equivalente.

---

# 52. FEATURE FLAGS

Necesarias para:

- tienda;
- newsletter;
- nuevos idiomas;
- nuevos mapas;
- campañas;
- eventos;
- funcionalidades experimentales.

Ejemplo:

```text
FEATURE_STORE
FEATURE_SONGS
FEATURE_EVENTS
FEATURE_INTERACTIVE_MAP_V2
```

---

# 53. MAPA INTERACTIVO

Ruta:

```text
/mundo
```

Funcionalidad clave futura.

## Desktop

Globo/mapa 3D navegable.

Marcadores:

- aventura;
- personaje;
- libro;
- vídeo.

Al seleccionar México:

```text
México
├── Teotihuacán
├── episodio
├── Quetzal
├── libro
├── vídeo
└── canción
```

## Mobile

Mapa 2D/2.5D optimizado.

No forzar WebGL pesado.

---

# 54. FICHA DE PERSONAJE

Ejemplo Curileta.

## Hero

- personaje;
- microanimación;
- nombre;
- frase;
- descripción.

## Secciones

- Quién es
- Personalidad
- Lo que le encanta
- Sus amigos
- Sus aventuras
- Lugares visitados
- Libros
- Vídeos
- Canciones
- Galería

Los datos salen del CMS.

---

# 55. LIBROS

## Listado

Filtros futuros:

- idioma;
- edad;
- colección;
- personaje;
- destino.

## Ficha

- portada;
- descripción;
- galería;
- personajes;
- lugares;
- edad;
- ISBN;
- formato;
- fecha;
- editorial;
- idiomas;
- preview;
- trailer;
- compra;
- libros relacionados.

---

# 56. VÍDEOS

## Listado

Categorías:

- episodios;
- Shorts;
- canciones;
- trailers;
- especiales.

## Detalle

- player;
- descripción;
- episodio;
- personajes;
- lugares;
- relacionados;
- CTA YouTube.

---

# 57. CANCIONES

Cada canción:

- imagen;
- título;
- episodio;
- personajes;
- vídeo;
- audio si existe;
- letra;
- canción anterior/siguiente.

Posibilidad futura:

**Cancionero digital interactivo.**

---

# 58. NOVEDADES

CMS editorial.

Categorías:

- libros;
- vídeos;
- eventos;
- colaboraciones;
- merchandising;
- noticias.

RSS opcional.

---

# 59. EVENTOS

Preparado para:

- presentaciones;
- ferias;
- firmas;
- colegios;
- festivales;
- directos.

Campos:

- fecha;
- timezone;
- lugar;
- mapa;
- entradas;
- disponibilidad;
- idioma;
- imágenes.

---

# 60. ARQUITECTURA DE REPOSITORIO

Monorepo recomendado.

```text
curileta-web/
├── apps/
│   ├── web/
│   └── studio/
├── packages/
│   ├── design-system/
│   ├── motion/
│   ├── cms/
│   ├── i18n/
│   ├── analytics/
│   ├── seo/
│   └── config/
├── public/
├── tooling/
└── docs/
```

---

# 61. ESTRUCTURA FRONTEND

```text
apps/web/src/
├── app/
├── components/
├── features/
│   ├── characters/
│   ├── books/
│   ├── adventures/
│   ├── videos/
│   ├── songs/
│   ├── world/
│   ├── contact/
│   └── commerce/
├── motion/
├── lib/
├── providers/
├── styles/
└── types/
```

---

# 62. ADAPTADORES

Servicios externos siempre detrás de adapters.

```text
CMSProvider
VideoProvider
AnalyticsProvider
CommerceProvider
MailProvider
CRMProvider
SearchProvider
```

Esto permite cambiar proveedores sin reescribir UI.

---

# 63. CACHE

Definir cache por tipo.

### Personajes
larga duración + invalidación al publicar.

### Libros
larga duración + webhook.

### YouTube
5–30 minutos.

### Novedades
ISR/revalidation.

### Producto
precio/stock con cache corta.

---

# 64. WEBHOOKS CMS

Al publicar:

```text
Sanity
↓
signed webhook
↓
Next.js revalidateTag()
↓
solo contenido afectado
```

No invalidar todo el sitio.

Tags:

```text
character:[id]
book:[id]
adventure:[id]
video
homepage
```

---

# 65. PREVIEW EDITORIAL

El editor debe poder:

1. guardar draft;
2. abrir Preview;
3. ver la página exacta;
4. cambiar contenido;
5. ver actualización;
6. publicar.

No necesitar al equipo técnico para previsualizar.

---

# 66. ROLES CMS

- Admin
- Developer
- Editor
- Translator
- Marketing
- Press

Permisos mínimos necesarios.

---

# 67. WORKFLOW DE TRADUCCIÓN

```text
ES draft
↓
ES approved
↓
translation requested
↓
EN draft
↓
linguistic review
↓
EN publish
```

No traducir automáticamente contenido infantil directamente a producción sin revisión humana.

---

# 68. ESTRATEGIA DE ASSETS

Cada personaje debe contar con una biblioteca oficial.

```text
Character Asset Library
├── master
├── front
├── side
├── back
├── expressions
├── poses
├── transparent
├── scenes
├── videos
└── approved
```

El CMS solo debe utilizar assets aprobados.

---

# 69. GOBERNANZA DE MARCA

Cada asset puede contener:

- status;
- owner;
- rights;
- allowedUses;
- attribution;
- validFrom;
- validUntil.

Especialmente importante para colaboraciones futuras.

---

# 70. BACKOFFICE FUTURO

Posibles extensiones:

- gestionar licencias;
- descargar brand kits;
- gestionar partners;
- campaign pages;
- coupon codes;
- retailer links.

No implementarlo en MVP, pero no impedirlo arquitectónicamente.

---

# 71. FASES DEL PROYECTO

## Fase 0 — Discovery

- objetivos;
- contenidos;
- referencias;
- brand;
- arquitectura;
- wireframes;
- motion concepts.

## Fase 1 — Foundation

- repo;
- Next.js;
- CMS;
- i18n;
- design system;
- CI/CD;
- analytics base;
- SEO.

## Fase 2 — Core

- home;
- personajes;
- libros;
- aventuras;
- vídeos;
- contacto.

## Fase 3 — Motion

- Apple-style scrollytelling;
- mapa;
- transitions;
- 3D;
- optimization.

## Fase 4 — Growth

- canciones;
- prensa;
- novedades;
- eventos;
- colaboraciones.

## Fase 5 — Commerce

- merchandising;
- catálogo;
- carrito;
- checkout.

---

# 72. MVP RECOMENDADO

Para salir a producción:

- Home premium;
- Curileta;
- Personajes;
- Aventuras;
- Libros;
- YouTube;
- Contacto;
- Colaboraciones;
- Prensa;
- ES + EN;
- CMS;
- SEO;
- Analytics;
- Accessibility;
- Motion system.

No esperar a tener tienda.

---

# 73. CRITERIOS DE ACEPTACIÓN DE LA HOME

La Home se aprueba únicamente si:

- existe continuidad visual real entre secciones;
- Curileta mantiene fidelidad visual;
- el scroll cuenta una historia;
- mobile conserva identidad;
- reduced motion funciona;
- ninguna animación impide navegar;
- contenido funciona sin JavaScript crítico de motion;
- LCP objetivo se mantiene;
- no hay CLS perceptible;
- no existen bloqueos de scroll;
- navegación por teclado funciona;
- los CTA siguen visibles;
- animaciones se pausan fuera de viewport.

---

# 74. CRITERIOS DE ACEPTACIÓN MULTIDIOMA

- ninguna cadena UI hardcoded;
- URLs localizadas;
- hreflang correcto;
- fallback definido;
- formato de fecha localizado;
- contenido puede publicarse independientemente por idioma;
- cambio de idioma conserva contexto;
- sitemap por locale.

---

# 75. CRITERIOS DE ACEPTACIÓN CMS

Un editor sin acceso al código debe poder:

- crear personaje;
- publicar libro;
- añadir vídeo;
- crear aventura;
- enlazar personajes;
- publicar noticia;
- añadir colaboración;
- traducir contenido;
- cambiar orden de secciones;
- actualizar homepage;
- previsualizar.

---

# 76. DEFINICIÓN DE DONE

Una feature se considera terminada solo cuando:

- funciona;
- es responsive;
- tiene estados loading/error/empty;
- tiene test;
- es accesible;
- está traducida;
- tiene analytics si procede;
- tiene SEO si procede;
- no rompe performance budget;
- tiene documentación;
- ha sido revisada visualmente.

---

# 77. KPIs DE LANZAMIENTO

Primer trimestre:

- tráfico orgánico;
- crecimiento de búsquedas de marca;
- CTR hacia YouTube;
- CTR hacia libros;
- tiempo de interacción con mapa;
- personajes visitados;
- idiomas utilizados;
- contactos;
- repeat visitors.

No usar únicamente “tiempo en página” como medida de calidad.

---

# 78. RIESGOS

## Riesgo: exceso de animación

**Mitigación:** performance budget + motion profiles.

## Riesgo: WebGL pesado

**Mitigación:** cargar bajo demanda y fallback.

## Riesgo: inconsistencia de personajes

**Mitigación:** biblioteca de referencias oficiales y asset governance.

## Riesgo: CMS complejo

**Mitigación:** schemas orientados al editor y vistas personalizadas.

## Riesgo: expansión internacional

**Mitigación:** i18n desde inicio.

## Riesgo: commerce invade arquitectura

**Mitigación:** CommerceProvider desacoplado.

## Riesgo: dependencia de YouTube

**Mitigación:** CMS almacena metadata editorial y YouTube funciona como proveedor audiovisual.

---

# 79. FUTURO

La arquitectura debe soportar sin reconstrucción:

- nuevos libros;
- nuevas temporadas;
- nuevos continentes;
- nuevos personajes;
- juegos ligeros;
- fichas educativas;
- área para colegios;
- eventos;
- ecommerce internacional;
- licencias;
- mapas 3D;
- realidad aumentada;
- experiencias WebXR;
- apps;
- API pública limitada;
- campañas con partners.

---

# 80. DECISIONES TÉCNICAS RECOMENDADAS

## Frontend

**Next.js + React + TypeScript**

## Content

**Sanity**

## Styling

**Tailwind CSS + CSS custom properties**

## Motion

**GSAP ScrollTrigger + CSS Scroll-Driven Animations**

## Navigation transitions

**View Transition API con progressive enhancement**

## 3D

**Three.js / React Three Fiber**

## Lightweight interactive animation

**Rive**

## Deployment

**Vercel** como opción inicial recomendada.

## Testing

**Vitest + Testing Library + Playwright + axe**

## Monitoring

**Sentry + Web Vitals**

## Commerce futuro

Proveedor headless mediante adapter, con Shopify como opción inicial.

---

# 81. POR QUÉ ESTA ARQUITECTURA

La prioridad no es simplemente construir una página muy atractiva.

La prioridad es construir una plataforma donde:

**la creatividad no comprometa la ingeniería.**

El usuario debe ver:

> una aventura fluida, mágica y sorprendente.

El equipo debe tener detrás:

> componentes reutilizables, contenido estructurado, animaciones controladas, traducciones independientes, observabilidad, tests y despliegues seguros.

Esta separación permitirá que la web pueda seguir evolucionando durante años.

---

# 82. VISIÓN FINAL DE LA HOME

La experiencia ideal:

1. Curileta mira el mapa.
2. El usuario hace scroll.
3. El mapa cobra vida.
4. La cámara entra en el mundo.
5. Aparecen lugares.
6. Aparecen amigos.
7. La aventura se convierte en libro.
8. El libro se convierte en vídeo.
9. El vídeo se convierte en canción.
10. La canción abre nuevas ramas: libros, colaboraciones, productos y eventos.
11. Finalmente, el usuario regresa al Bosque Encantado.
12. El sendero continúa.

La página termina donde empezó, pero el usuario ya conoce el universo.

Ese círculo narrativo debe convertirse en la firma visual de la web.

---

# 83. PRINCIPIO DE PRODUCTO FINAL

**No construir una web que hable de Las Aventuras de Curileta.**

**Construir una web que haga sentir al visitante que acaba de entrar en una de ellas.**
