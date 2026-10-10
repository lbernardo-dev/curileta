# 🗺️ Guía Maestra de Operación, Contenido y Despliegue de Curileta

Esta guía contiene toda la información necesaria para alimentar la web con recursos multimedia de alta fidelidad, administrar la base de datos y el backend dinámico, y sincronizar los cambios en la versión publicada en producción en **Vercel** (`https://curileta-pink.vercel.app`).

---

## 📑 Tabla de Contenidos
1. [Inventario de Recursos Requeridos y Rutas de Directorio](#1-inventario-de-recursos-requeridos-y-rutas-de-directorio)
2. [Flujo de Actualización y Despliegue en Vercel](#2-flujo-de-actualización-y-despliegue-en-vercel)
3. [Administración del Backend y Base de Datos (SQLite + REST API)](#3-administración-del-backend-y-base-de-datos)
4. [Gestión de Eventos Estacionales (Halloween y Próximos Eventos)](#4-gestión-de-eventos-estacionales)
5. [Endpoints REST API Activos para Integraciones](#5-endpoints-rest-api-activos)

---

## 1. Inventario de Recursos Requeridos y Rutas de Directorio

Todos los archivos estáticos se sirven desde el directorio público de la aplicación web:  
👉 `apps/web/public/`

A continuación se detalla cada carpeta, qué archivos se necesitan, especificaciones técnicas y formatos recomendados:

```
apps/web/public/
├── images/
│   ├── characters/      <- Ilustraciones de personajes con fondo transparente
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
* **Nomenclatura requerida:**
  * `curileta-main.webp` (Curileta de cuerpo entero con mochila y brújula)
  * `pompon-main.webp` (Pompón el conejo cartero)
  * `quetzal-main.webp` (Quetzal el ave sagrada con plumaje)
  * `bao-main.webp` (Bao el Panda)
  * `lola-main.webp` (Lola la Koala)
  * `kiki-main.webp` (Kiki la Nutria)
  * `gino-main.webp` (Gino el Pingüino)
  * `basset-main.webp` o `barnaby-main.webp` (Barnaby el Basset Hound)
  * `zipi-bot-main.webp` (Zipi-Bot el robot explorador)
  * *(y las demás 10 figuras de la tripulación)*

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

## 2. Flujo de Actualización y Despliegue en Vercel

Tu proyecto está configurado con **Integración Continua (CI/CD)** automática en Vercel. Cada vez que confirmas cambios en Git y los envías a la rama `main` en GitHub, Vercel compila y publica una nueva versión en cuestión de 60 a 90 segundos.

### Paso a Paso para Publicar Mejoras:

1. **Abrir la terminal en la raíz del proyecto:**
   ```bash
   cd "/Volumes/SSD Externo/DESARROLLO/WEB/curileta"
   ```

2. **Verificar los archivos modificados o agregados:**
   ```bash
   git status
   ```

3. **Verificar que el código compila y pasa las pruebas antes de subirlo:**
   ```bash
   npm run typecheck
   npm test
   ```

4. **Añadir los archivos a Git:**
   ```bash
   git add .
   ```

5. **Crear el commit descriptivo del cambio:**
   ```bash
   git commit -m "feat: nuevo hero cinematografico y recursos de alta fidelidad"
   ```

6. **Enviar a GitHub (esto dispara el despliegue automático en Vercel):**
   ```bash
   git push origin main
   ```

7. **Monitorear la publicación:**
   * Abre tu panel en [vercel.com](https://vercel.com).
   * Verás un despliegue en curso con una esfera azul girando.
   * Cuando cambie a verde (en ~1 minuto), tu web en `https://curileta-pink.vercel.app/es` estará actualizada con los últimos cambios.

> 💡 **Nota sobre Caché:** Next.js optimiza las imágenes y páginas estáticas. Si subes una imagen con el mismo nombre y no ves el cambio inmediatamente en el navegador, recarga con `Cmd + Shift + R` (Mac) o `Ctrl + Shift + R` (Windows) para vaciar la memoria caché del navegador.

---

## 3. Administración del Backend y Base de Datos

La aplicación cuenta con una **base de datos relacional SQLite persistente y de alto rendimiento** ubicada en:
👉 `packages/cms/data/curileta.db`

Esta base de datos almacena toda la información del sitio: personajes, libros, cartas a Pompón, puntos de expedición, eventos y configuración general.

### Estructura de Tablas en la Base de Datos:
* `characters`: Biografía, citas, insignias, paleta de colores y atributos de los 19 personajes.
* `books`: Libros físicos, sinopsis, ISBN, fecha de edición y enlaces.
* `letters`: Cartas y postales enviadas a la casita del árbol de Pompón.
* `locations`: Países, monumentos y coordenadas para el globo y el mapa de expedición.
* `trail_waypoints`: Puntos del sendero narrativo que une todas las escenas.
* `seasonal_events`: Configuración de eventos temporales como Halloween y Navidad.
* `universe_roadmap`: Hitos pasados, presentes y futuros del universo Curileta.
* `collaborations`: Categorías para editoriales, colegios y marcas afines.
* `site_settings`: Estadísticas globales, lema principal y configuración general.

---

### ¿Cómo Administrar o Modificar los Datos?

Tienes **3 opciones** para modificar la información:

#### Opción 1: Modificar el Script Maestro de Datos y Ejecutar el Sembrador (Recomendado)
1. Edita el archivo `packages/cms/src/db/seed.ts` con los nuevos textos, personajes o libros.
2. Ejecuta el comando de sembrado forzado en la terminal:
   ```bash
   npm run seed:db -- --force
   ```
3. Esto actualizará `curileta.db` con toda la nueva información en milisegundos.
4. Haz `git add .`, `git commit -m "data: actualizar catálogo"` y `git push origin main` para que Vercel lo aplique en la web.

#### Opción 2: Usar un Visualizador Visual de Base de Datos (GUI)
Puedes abrir directamente el archivo `packages/cms/data/curileta.db` con cualquiera de estos programas gratuitos:
* **TablePlus** (Mac / Windows): Interfaz moderna y rápida.
* **DB Browser for SQLite** (Gratis y de código abierto): Muy fácil de usar para editar filas como una hoja de Excel.
* **Extensión SQLite Viewer en VS Code / Cursor**: Te permite editar tablas directamente desde el editor de código.

#### Opción 3: Conectar Sanity Studio (Para Edición Visual Web)
El proyecto incluye un paquete listo de **Sanity Studio** en `apps/studio`.  
Si deseas que redactores o ilustradores agreguen contenido desde una interfaz web sin tocar Git ni bases de datos locales:
1. Regístrate gratuitamente en [sanity.io](https://sanity.io).
2. Obtén tu `projectId` y colócalo en `apps/studio/sanity.config.ts`.
3. Inicia el panel con `npm run dev --workspace=studio`.

---

## 4. Gestión de Eventos Estacionales (Halloween y Próximos Eventos)

El evento de Halloween está programado en la base de datos con un mecanismo de **reversión temporal automática**:
* **Ventana activa:** Del `1 de octubre` al `5 de noviembre`.
* **Comportamiento automático:**
  * Mientras la fecha actual esté dentro de ese rango, la web muestra la ambientación del Bosque Encantado, los acentos calabaza y las actividades especiales.
  * En cuanto llega el **6 de noviembre a las 00:00**, la web detecta el fin de temporada y **regresa automáticamente al tema original de Curileta** (verde esmeralda y oro aventurero) sin que tengas que cambiar una sola línea de código.

### ¿Cómo Cambiar las Fechas o Crear un Nuevo Evento (ej. Especial de Navidad)?
En `packages/cms/src/db/seed.ts` (tabla `seasonal_events`):
```typescript
{
  id: 'event-navidad',
  slug: 'navidad-bosque-nevado',
  name_es: 'Navidad en el Bosque Nevado',
  name_en: 'Winter Wonderland Expedition',
  theme_key: 'winter', // Aplica paleta blanco escarcha y azul hielo
  start_date: '2026-12-01T00:00:00Z',
  end_date: '2027-01-06T23:59:59Z',
  is_active: 1
}
```

---

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

## 6. Resumen de Comandos Frecuentes

```bash
# Iniciar servidor de desarrollo local
npm run dev

# Ejecutar verificación de tipos TypeScript
npm run typecheck

# Ejecutar suite de pruebas unitarias
npm test

# Actualizar y re-sembrar la base de datos SQLite
npm run seed:db -- --force

# Compilar para producción localmente
npm run build
```

---
*Documento preparado para el equipo de desarrollo de Curileta • Versión 1.2 • Octubre 2026*
