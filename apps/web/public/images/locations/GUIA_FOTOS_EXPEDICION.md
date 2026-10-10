# Guía de Fotografías de Lugares y Cuaderno de Expedición

Coloca en esta carpeta (`apps/web/public/images/locations/`) las ilustraciones oficiales de cada una de las etapas del viaje de Curileta. La ruta de la landing las presenta en marcos apaisados **4:3**; prepara imágenes de **1600 × 1200 px** como mínimo, en WebP optimizado. Mantén el monumento o punto principal dentro del encuadre central para que la composición también funcione en móvil.

Ahora mismo la página usa fotos genéricas de destino como recurso provisional. Para sustituirlas, copia el archivo con el nombre indicado y actualiza el `heroImage.url` de esa parada en `packages/cms/src/localProvider.ts` a `/images/locations/<archivo>`. No añadas texto ni títulos dentro de la imagen: los presenta la propia tarjeta.

## Nombres de Archivo:

1. `mexico.webp` — Teotihuacán y Pirámides Aztecas
2. `peru.webp` — Machu Picchu y Valle Sagrado
3. `egipto.webp` — Pirámides de Guiza y el Río Nilo
4. `islandia.webp` — Laguna Azul, Géiseres y Auroras Boreales
5. `japon.webp` — Tokio, Shinkansen y Monte Fuji
6. `australia.webp` — Outback rojo, Uluru y Hyams Beach
7. `nueva-zelanda.webp` — Waitomo y Hobbiton
8. `china.webp` — Gran Muralla China y Bosques de Bambú
9. `italia.webp` — Florencia, Torre de Pisa y Venecia
10. `francia.webp` — París, Torre Eiffel y el Museo del Louvre
11. `espana-regreso.webp` — El Bosque Encantado y el Hogar
12. `espana-inicio.webp` — La Despedida en el Árbol del Bosque
