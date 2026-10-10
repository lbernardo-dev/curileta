# Fondos oficiales de Curileta

Coloca aquí las ilustraciones completas preparadas como fondos descargables. Los retratos usados en las fichas de personajes pertenecen a `../characters/` y no se publican como fondos.

## Carpetas

- `desktop/`: composición panorámica para ordenador, idealmente **2560 × 1440 px (16:9)**.
- `mobile/`: composición vertical para móvil, idealmente **1440 × 2560 px (9:16)**.

Usa WebP o JPG optimizado y nombres breves en minúsculas, por ejemplo:

```text
desktop/expedicion-mundial-2560x1440.webp
mobile/bosque-encantado-1440x2560.webp
```

La galería solo mostrará archivos dentro de estas dos carpetas cuando estén añadidos al catálogo del CMS. La imagen de miniatura y la descarga deben apuntar a ilustraciones oficiales completas. No uses una ficha aislada de personaje como fondo ni anuncies una resolución que el archivo no tenga.

## Añadir una ilustración

1. Guarda la imagen final en `desktop/` o `mobile/` según su composición.
2. Añade el registro correspondiente en `INITIAL_WALLPAPERS` de `packages/cms/src/localProvider.ts`, con `thumbnail` y `fullImageUrl` apuntando a `/images/wallpapers/<carpeta>/<archivo>`.
3. Completa título, descripción, dispositivo y resolución reales. Si se usa la base de datos, vuelve a sembrar el catálogo después de añadir el registro.
