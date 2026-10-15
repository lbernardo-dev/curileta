# Vídeos del hero de Curileta

Guarda los vídeos en estas carpetas:

```text
base/curileta-base-sin-mapa.mp4
base/curileta-base-sin-mapa.webm
base/curileta-base-mapa-mundo.mp4
base/curileta-base-mapa-mundo.webm
events/halloween/curileta-halloween.mp4
events/halloween/curileta-halloween.webm
```

Los vídeos de `base` alternan al recargar la página y cada 5 minutos mientras permanece abierta. El vídeo de un evento sustituye esa rotación mientras su tema estacional esté activo. El hero no superpone la ruta: el mapa ilustrado del clip no coincide en escala y posición con el póster usado para calcularla. La ruta se muestra en las secciones de mapa de la página. Cada vídeo usa un póster extraído del propio clip para evitar cambios de escena mientras carga. Al añadir un vídeo, registra su `url`, `webmUrl` y su `poster` en `apps/web/src/features/home/heroVideos.ts`.

- Formato recomendado: MP4 (H.264) y WebM (VP9 o AV1) complementario para navegadores modernos, sin pista de audio (`-an`).
- Composición: horizontal 16:9, idealmente 1920 × 1080, 24 fps y unos 8 segundos.
- Mantén cámara fija y movimientos suaves para que el bucle no distraiga del texto.
- Para que el bucle no dé un salto cada 8 segundos, procura que el último fotograma encaje con el primero en encuadre y pose.
- La imagen `public/images/hero/curileta-world-expedition-clean-v1.jpg` se conserva para la sección de ruta y la imagen social del sitio.

Con movimiento reducido, el hero muestra el fotograma de respaldo del vídeo correspondiente.
