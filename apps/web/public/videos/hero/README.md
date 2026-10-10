# Vídeos del hero de Curileta

Guarda los vídeos en estas carpetas:

```text
base/curileta-base-sin-mapa.mp4
base/curileta-base-mapa-mundo.mp4
events/halloween/curileta-halloween.mp4
```

Los vídeos de `base` alternan al recargar la página y cada 5 minutos mientras permanece abierta. El vídeo de un evento sustituye esa rotación mientras su tema estacional esté activo. El hero no superpone la ruta: el mapa ilustrado del clip no coincide en escala y posición con el póster usado para calcularla. La ruta se muestra en las secciones de mapa de la página. Cada vídeo usa un póster extraído del propio clip para evitar cambios de escena mientras carga. Al añadir un vídeo, registra su `url` y su `poster` en `apps/web/src/features/home/heroVideos.ts`.

- Formato recomendado: MP4 con vídeo H.264, sin pista de audio.
- Composición: horizontal 16:9, idealmente 1920 × 1080, 24 fps y unos 8 segundos.
- Mantén cámara fija y movimientos suaves para que el bucle no distraiga del texto.
- La web conserva el póster `public/images/hero/curileta-world-expedition-clean-v1.jpg` como imagen accesible y respaldo.

Con movimiento reducido, el hero vuelve al póster.
