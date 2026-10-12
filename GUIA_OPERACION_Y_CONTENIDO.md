# 🗺️ Guía Maestra de Operación, Contenido y Despliegue de Curileta

Esta guía describe cómo operar la web de Curileta. La fuente vigente de contenido y configuración es Supabase; el equipo gestiona el sitio desde `/admin`, y Vercel publica la aplicación.

---

## 📑 Tabla de Contenidos
1. [Inventario de Recursos Requeridos y Rutas de Directorio](#1-inventario-de-recursos-requeridos-y-rutas-de-directorio)
2. [Flujo de actualización y despliegue](#2-flujo-de-actualización-y-despliegue)
3. [Administración del Backend y Base de Datos (Supabase + REST API)](#3-administración-del-backend-y-base-de-datos)
4. [Gestión de eventos estacionales](#4-gestión-de-eventos-estacionales)
5. [Endpoints REST API Activos para Integraciones](#5-endpoints-rest-api-activos)

---

## 1. Inventario de Recursos Requeridos y Rutas de Directorio

Los archivos que la web debe servir se guardan en el directorio público de la aplicación web. Los originales de trabajo se conservan fuera de `public` para que no se publiquen ni se descarguen por error:
👉 `apps/web/public/`

A continuación se detalla cada carpeta, qué archivos se necesitan, especificaciones técnicas y formatos recomendados:

```
apps/web/public/
├── images/
│   ├── characters/      <- Retratos principales y avatares optimizados
│   │   └── avatars/     <- Retratos circulares WebP
│   ├── books/           <- Portadas de libros, renders 3D y pliegos interiores
│   ├── locations/       <- Fotografías y postales de monumentos mundiales
│   ├── wallpapers/      <- Fondos de pantalla en alta resolución (PC y móvil)
│   ├── events/          <- Ilustraciones temáticas para eventos (Halloween, Navidad)
│   └── brand/           <- Logotipos oficiales, sellos y distintivos
├── audio/               <- Canciones oficiales, cuentacuentos y efectos sonoros
└── models/              <- Modelos 3D interactivos (.glb / .gltf)
```

---

### A. Ilustraciones de Personajes (`apps/web/public/images/characters/`)
* **Propósito:** Se muestran en el Hero, en la escena de personajes, en el carrusel de tripulación y en las fichas coleccionables.
* **Formato recomendado:** `.webp` con canal alfa (fondo 100% transparente).
* **Resolución:** Entre `800 x 1000 px` y `1200 x 1400 px`.
* **Peso:** Optimizado entre 25 KB y 80 KB por imagen.
* **Nomenclatura requerida:** conserva el nombre canónico de cada personaje para que imágenes, citas y fichas no intercambien identidades:
  * `curileta-main.webp` (Curileta)
  * `pompon-main.webp` (Pompón)
  * `quetzal-main.webp` (Quetzal)
  * `lulu-main.webp` (Lulú la Llama)
  * `emi-main.webp` (Emi el Escarabajo)
  * `picu-main.webp` (Picu el Frailecillo)
  * `zipi-bot-main.webp` (Zipi-Bot)
  * `kiki-main.webp` (Kiki el Kiwi)
  * `bao-main.webp` (Bao el Oso Panda)
  * `gino-main.webp` (Gino el Ratoncito Chef)
  * `lola-main.webp` (Lola la Tortuga Mora)
  * `canguro-mama-main.webp` (Mamá Canguro)
  * `canguro-bebe-main.webp` (Bebé Canguro)
  * `joey-main.webp` (Joey, koala de peluche de Bebé Canguro)
  * `pez-volador-main.webp` (Glub el Pez Volador)
  * `ornitorrinco-main.webp` (El Ornitorrinco Sabio)
  * `emu-main.webp` (El Emú Curioso)
  * `basset-main.webp` (Barnaby el Basset Hound)
  * `cobaya-main.webp` (Cuy Andino / Cobaya)

---

### B. Libros e Ilustraciones Editoriales (`apps/web/public/images/books/`)
* **Propósito:** Utilizados en la estantería 3D, carrusel de lectura y fichas de venta de libros.
* **Formato:** `.webp` o `.png`.
* **Resolución:** `1200 x 1600 px` (proporción estándar libro 3:4).
* **Archivos recomendados:**
  * `vol1-cover.webp` (Portada del Volumen 1: *«El Secreto del Bosque Nublado»*)
  * `vol1-3d.webp` (Render 3D con perspectiva isométrica y lomo visible)
  * `vol1-spread-01.webp`, `vol1-spread-02.webp` (Doble página interior para preview interactivo de lectura)
  * `vol2-cover.webp` (Portada del Volumen 2: *«El Misterio de la Brújula de Jade»*)
  * `vol2-3d.webp` (Render 3D del segundo libro)
  * `vol2-spread-01.webp` (Muestra de arte interior)

---

### C. Fotografías y Postales de Expedición (`apps/web/public/images/locations/`)
* **Propósito:** Ilustrar las 40+ culturas del globo terráqueo y las postales enviadas en las cartas a Pompón.
* **Formato:** `.webp` fotográfico (calidad 82%).
* **Resolución:** `1400 x 900 px` (paisaje / 16:9 o 3:2).
* **Archivos recomendados:**
  * `chichen-itza.webp` (México • Pirámide de Kukulcán)
  * `great-barrier-reef.webp` (Australia • Arrecife de coral)
  * `eiffel-tower.webp` (Francia • París y río Sena)
  * `mount-fuji.webp` (Japón • Volcán Fuji con cerezos)
  * `machu-picchu.webp` (Perú • Santuario incaico)
  * `colosseum.webp` (Italia • Roma clásica)
  * `taj-mahal.webp` (India • Palacio de mármol blanco)
  * `serengeti.webp` (Tanzania • Sabana africana)
  * `pyramids-giza.webp` (Egipto • Gran Pirámide y Esfinge)
  * `aurora-borealis.webp` (Noruega • Cielo nocturno ártico)

---

### D. Fondos de Pantalla y Descargas Gratuitas (`apps/web/public/images/wallpapers/`)
* **Propósito:** Sección de regalos y descargas comunitarias para padres y niños.
* **Estructura recomendada:**
  * `apps/web/public/images/wallpapers/desktop/` -> Resolución `2560 x 1440 px` o `3840 x 2160 px` (4K).
  * `apps/web/public/images/wallpapers/mobile/` -> Resolución `1080 x 1920 px` o `1170 x 2532 px` (iPhone/Android).
* **Archivos de muestra:**
  * `bosque-nublado-desktop.webp` / `bosque-nublado-mobile.webp`
  * `noche-estrellada-desktop.webp` / `noche-estrellada-mobile.webp`
  * `halloween-edicion-desktop.webp` / `halloween-edicion-mobile.webp`

---

### E. Canciones y Archivos Sonoros Originales (`apps/web/public/audio/`)
* **Propósito:** Reproductor musical de la web, narración de cuentos y efectos de sonido en la brújula y el mapa.
* **Formato:** `.mp3` a 192 kbps o `.m4a` / `.aac`.
* **Archivos recomendados:**
  * `cancion-curileta-exploradora.mp3` (Canción lema oficial)
  * `la-marcha-de-pompon.mp3` (Tema alegre para caminar)
  * `el-vuelo-de-quetzal.mp3` (Música instrumental con flautas y percusión)
  * `sfx-compass-click.mp3` (Efecto sutil de clic de brújula al navegar)
  * `sfx-page-turn.mp3` (Paso de página al hojear los libros)

---

### F. Modelos 3D Interactivos (`apps/web/public/models/`) *(Opcional)*
* **Formato:** `.glb` (formato binario de glTF optimizado con compresión Draco).
* **Peso máximo sugerido:** < 2.5 MB para que cargue instantáneamente en smartphones.
* **Archivos:**
  * `globe-earth.glb` (Globo terráqueo estilizado)
  * `curileta-avatar.glb` (Modelo 3D de Curileta con pose de saludo)

---

## 2. Flujo de actualización y despliegue

Los cambios de contenido se guardan desde el módulo correspondiente de `/admin` y quedan disponibles en Supabase sin publicar una nueva versión de código. Las imágenes cargadas desde el panel se guardan en el bucket `curileta-site-media`.

Los cambios de código se integran mediante una rama y un pull request. Antes de integrar, se revisan el diff, la build y las comprobaciones de CI; después se confirma que Vercel haya terminado el despliegue Production. No uses `git add .`, no subas cambios directamente a `main` ni incluyas archivos generados o secretos.

Los cambios de esquema se preparan como archivos SQL en `supabase/migrations`. Production conserva cambios manuales y un historial de migraciones pendiente de reconciliación: revisa el estado de las tablas antes de cada aplicación y no ejecutes `supabase db push` hasta reconciliarlo. El procedimiento operativo y las verificaciones están en [Docs/BACKEND_SETUP.md](./Docs/BACKEND_SETUP.md).

## 3. Administración del backend y base de datos

La aplicación publicada usa Supabase Auth, PostgreSQL y Storage. `/admin` es la interfaz de gestión y Supabase es la fuente de los datos editoriales y de configuración. Sanity Studio, el sembrador SQLite y los archivos locales ya no forman parte del flujo de operación del sitio.

### Secciones de administración

- `/admin/contenidos`: personajes, libros editoriales, lugares narrativos, hitos, curiosidades, fondos, colaboraciones, hoja de ruta y ajustes de portada.
- `/admin/cartas` y `/admin/destinos`: edición, publicación, orden y retirada reversible de cartas y destinos, con sus imágenes.
- `/admin/eventos`: campañas estacionales, fechas, temas y medios.
- `/admin/youtube`: identidad del canal, vídeos, Shorts, videoclips y fichas musicales.
- `/admin/libros`: selección de portada y próximas aventuras con cubierta.
- `/admin/autoras`, `/admin/galeria`, `/admin/encuadres` y `/admin/personajes-destacados`: gestión de los módulos editoriales asociados.
- `/admin/forms`, `/admin/consultas` y `/admin/leads`: formularios, solicitudes y oportunidades.
- `/admin/estadisticas` y `/admin/sistema`: métricas agregadas, estado operativo y últimas acciones registradas.
- `/admin/equipo`: altas de perfiles existentes de Supabase Auth, roles y revocación de acceso; no envía invitaciones.

El acceso se controla con Supabase Auth y los perfiles `owner`, `admin`, `editor` y `analyst`. La API vuelve a comprobar permisos en el servidor. La interfaz oculta opciones según el rol, pero la seguridad no depende de esa ocultación.

### Contenido, recuperación y archivos

El editor editorial permite crear, traducir, editar, ordenar, publicar, ocultar, retirar y recuperar registros. Los borrados del contenido nuevo son marcas reversibles; las imágenes referenciadas se conservan. La tabla `admin_audit_log` registra las modificaciones del editor editorial y del equipo; los módulos con tablas propias no se deben considerar auditados hasta que registren sus acciones en ese log.

Las imágenes se seleccionan desde el ordenador. La aplicación optimiza a WebP y usa JPEG si el navegador no puede codificar WebP. Los archivos se suben al bucket `curileta-site-media` mediante permisos firmados de un solo objeto y se validan en el servidor antes de guardar la referencia. Las imágenes de destinos, eventos, autoras, galería, cartas, canal, libros y contenido editorial usan rutas permitidas por módulo.

Para variables, acceso inicial, migraciones y comprobaciones de Production, sigue [Docs/BACKEND_SETUP.md](./Docs/BACKEND_SETUP.md) y la [referencia técnica](./Docs/BACKEND_TECHNICAL_REFERENCE.md). No edites Production mediante un cliente SQLite ni añadas credenciales al repositorio.

## 4. Gestión de eventos estacionales

Usa `/admin/eventos` para crear o editar una campaña, elegir su tema, definir su zona horaria y programar inicio y fin. Añade los recursos visuales desde el formulario de medios y publica después de revisar la vista pública. No edites eventos en el proveedor local ni en tablas de Production directamente.

## 5. Endpoints REST API Activos

La web ya cuenta con una API REST viva lista para ser consumida por apps móviles, bots o servicios externos. Puedes probarlos directamente en tu navegador o en Postman:

| Endpoint | Método | Descripción |
| :--- | :---: | :--- |
| `GET /api/v1/content/hero` | `GET` | Textos, métricas y destacados del Hero |
| `GET /api/v1/characters` | `GET` | Listado completo de los 19 personajes |
| `GET /api/v1/characters/curileta` | `GET` | Ficha técnica y biografía de Curileta |
| `GET /api/v1/books` | `GET` | Catálogo de libros ilustrados publicados |
| `GET /api/v1/letters` | `GET` | Todas las cartas y postales a Pompón |
| `GET /api/v1/locations` | `GET` | Monumentos y coordenadas del globo terráqueo |
| `GET /api/v1/events/active` | `GET` | Evento estacional vigente con fechas y tema |
| `GET /api/v1/wallpapers` | `GET` | Fondos de pantalla descargables |
| `GET /api/v1/settings` | `GET` | Configuración global y estadísticas del sitio |
| `GET /api/v1/content/all` | `GET` | Paquete consolidado de todo el contenido del sitio |

---

## 6. Comandos de desarrollo

```bash
# Instalar las dependencias
npm install

# Iniciar la aplicación web
npm run dev

# Revisar tipos y lint del workspace web
npm run typecheck --workspace=apps/web
npm run lint --workspace=apps/web

# Compilar la aplicación web
npm run build --workspace=apps/web
```

Para desarrollo y operación del backend, variables y procedimientos de migración, consulta [Docs/BACKEND_SETUP.md](./Docs/BACKEND_SETUP.md). No se usa un sembrador SQLite para publicar contenido.

---
*Guía de operación • Octubre de 2026*
