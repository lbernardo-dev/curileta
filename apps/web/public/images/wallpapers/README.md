# Fondos oficiales de Curileta

Coloca aquí las ilustraciones completas preparadas como fondos descargables. Los retratos usados en las fichas de personajes pertenecen a `../characters/` y no se publican como fondos.

## Carpetas

- `desktop/`: composición panorámica para ordenador, idealmente **2560 × 1440 px (16:9)**. La colección actual mide entre **1440 × 809** y **1440 × 810 px**.
- `mobile/`: composición vertical para móvil, idealmente **1440 × 2560 px (9:16)**. La colección actual mide entre **809 × 1440** y **810 × 1440 px**.

Usa WebP o JPG optimizado y nombres breves en minúsculas, por ejemplo:

```text
desktop/expedicion-mundial-2560x1440.webp
mobile/bosque-encantado-1440x2560.webp
```

El catálogo local de `INITIAL_WALLPAPERS` se sirve como contenido inicial aunque la consulta de Supabase no devuelva registros. Los registros administrados se combinan con ese catálogo y sustituyen una entrada local cuando comparten su `slug`. La imagen de miniatura y la descarga deben apuntar a ilustraciones completas. No uses una ficha aislada de personaje como fondo ni anuncies una resolución que el archivo no tenga.

## Añadir una ilustración

1. Guarda la imagen final en `desktop/` o `mobile/` según su composición.
2. Añade el registro correspondiente en `INITIAL_WALLPAPERS` de `packages/cms/src/localProvider.ts`, con `thumbnail` y `fullImageUrl` apuntando a `/images/wallpapers/<carpeta>/<archivo>`.
3. Completa título, descripción, dispositivo y resolución reales en `packages/cms/src/localProvider.ts`. No hace falta una migración ni sembrar la base de datos para que la web muestre el catálogo local.
