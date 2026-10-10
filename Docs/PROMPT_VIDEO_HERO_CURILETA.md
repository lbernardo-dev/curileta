# Prompt para el vídeo hero de Curileta

## Referencias de entrada

- Usa `apps/web/public/images/hero/curileta-world-expedition-clean-v1.png` como primer fotograma y referencia de composición.
- Adjunta `/Users/romerodev/Downloads/Curileta.webp` y `/Users/romerodev/Downloads/imagen_20261010071659.webp` como referencias prioritarias de identidad: diseño frontal, perfil y espalda.
- Adjunta `/Users/romerodev/Downloads/Create_letter_branding_storyboard_20261010071819.jpg` para conservar el rostro, las gafas y las expresiones de Curileta.
- La imagen `/Users/romerodev/Downloads/Characters_holding_treasure_map_…_20261010071737.jpg` sirve como referencia de luz, ambiente y estilo. **Pompón no aparece en el hero**.
- Si la herramienta permite separar referencias, asigna la escena como *start frame* y las hojas de Curileta como *character references*.

## Prompt (recomendado en inglés)

```text
Create one continuous 8-second image-to-video shot for a cinematic website hero, using the supplied Curileta world-expedition image as the exact first frame and composition reference. Use the attached character turnaround images as strict identity references.

CHARACTER — Curileta is the only character in this shot: a small, friendly lime-green gecko with distinctive darker green spots, a broad gentle face, very large warm brown eyes behind round wire-frame glasses, a tan safari hat with a brown band, a khaki explorer shirt and shorts, a small brown leather backpack, sturdy brown lace-up boots, and a long spotted tail with its familiar curled tip. Preserve her exact face, eye spacing, glasses, skin pattern, outfit, colors, tail, and child-friendly proportions from the references in every frame. Do not redesign or reinterpret her.

SCENE — Curileta sits comfortably on a lush green hill covered with fine grass and a few tiny wildflowers at warm golden-hour sunrise. She holds and studies the illustrated world map from the first frame. Keep the framing, horizon, lighting direction, landscape, and character placement consistent with the supplied hero image. The illustrated map stays clean, legible as an image, and free of generated labels or extra symbols; leave its surface unobstructed for a precise route animation to be composited separately in the website.

ACTION — Keep every movement gentle, natural, and unhurried. Curileta breathes softly; her shoulders and hands move only slightly. The tail makes one small relaxed adjustment in the grass. She studies the map, blinks naturally once, shifts her eyes along it, then slowly lifts her gaze toward the viewer for a brief warm moment of eye contact with a subtle smile. She makes a tiny, natural head tilt, then looks back to the map and settles into almost the same pose as the opening frame. The map edge responds lightly to the breeze. Grass and a few flower heads sway softly. In the distant sky, two or three small birds fly across with believable wing beats and short glides, following natural arcs; they must move through space rather than slide as flat stickers.

CAMERA — Locked tripod, absolutely fixed composition. No pan, tilt, zoom, dolly, orbit, shake, reframing, lens breathing, or parallax. One uninterrupted shot, with no cuts, dissolves, wipes, transitions, freeze-frame changes, or swaps between still images. Animate the character and environment within the fixed frame.

CONTINUITY — Maintain strict character identity and stable anatomy in every frame: two arms, two legs, consistent glasses, hat, spots, hands, boots, and tail. Preserve the same number and appearance of birds throughout their flight. No new characters. No Pompón, rabbit, animals near Curileta, extra limbs, morphing, flicker, texture crawling, face changes, or costume changes. No speech, lip-sync, subtitles, logos, or readable text. Natural ambient motion only.

LOOP — End with Curileta and the scene close to the opening pose and lighting so the 8-second clip can loop smoothly without a visible jump. Keep the animation soft and emotionally warm, like a polished family adventure film.
```

## Negative prompt

```text
camera movement, camera push-in, zoom, pan, tilt, orbit, handheld shake, changing crop, parallax, scene cut, slideshow, frame swap, sudden pose change, fast motion, twitching, sliding birds, sticker birds, artificial wing flapping, character redesign, inconsistent face, changed eye color, changed glasses, changed hat, missing spots, extra spots, extra limbs, fused fingers, broken hands, duplicate tail, short tail, costume change, Pompón, rabbit, additional characters, generated route line, random curved line, inaccurate map labels, landmark icons, floating monuments, text, subtitles, logo, watermark, flicker, jitter, morphing, melting, texture crawl, overacting, speech, lip-sync
```

## Ajustes recomendados

- **Modo:** image-to-video, con primer fotograma y referencias de personaje.
- **Formato:** 16:9 horizontal, 8 segundos, 24 fps si está disponible.
- **Cámara:** fija / locked-off; desactivar movimiento automático de cámara.
- **Intensidad de movimiento:** baja o sutil.
- **Audio:** desactivado; el hero funciona en silencio y en bucle.
- **Salida:** exportar el clip original sin títulos ni overlays. La ruta del libro se dibuja después con los 41 puntos de `apps/web/src/features/home/heroRoute.json`, para que coincida con el itinerario real y no quede inventada por el generador.
