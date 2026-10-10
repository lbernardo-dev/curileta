# Imágenes de personajes

## Retratos principales

Los retratos oficiales que aparecen en fichas, tarjetas y fondos están en `apps/web/public/images/characters/`. Conserva los nombres `*-main.webp`: el CMS y varias páginas los usan directamente.

## Avatares

Las fotos circulares optimizadas están en `apps/web/public/images/characters/avatars/`. Se sirven como WebP de 512 por 512 píxeles y la web las carga mediante `CharacterAvatarImage`, que ajusta el tamaño al espacio donde aparece cada personaje.

| Personaje | Archivo |
|---|---|
| Bao | `bao.webp` |
| Bebé Canguro | `canguro-bebe.webp` |
| Cobaya | `cobaya.webp` |
| Curileta | `curileta.webp` |
| Emi | `emi.webp` |
| Emú | `emu.webp` |
| Gino | `gino.webp` |
| Joey | `joey.webp` |
| Kiki | `kiki.webp` |
| Lola | `lola.webp` |
| Lulú | `lulu.webp` |
| Mamá Canguro | `canguro-mama.webp` |
| Ornitorrinco | `ornitorrinco.webp` |
| Pez volador | `pez-volador.webp` |
| Picu | `picu.webp` |
| Pompón | `pompon.webp` |
| Quetzal | `quetzal.webp` |
| Barnaby | `basset.webp` |
| Zipi-Bot | `zipi-bot.webp` |

Los JPG originales se conservan en `apps/web/assets/source/characters/avatars/`, fuera de `public`, para que no se publiquen ni se descarguen por error. Al añadir una foto, crea su WebP optimizado en `public/images/characters/avatars/` y registra el slug en `apps/web/src/components/CharacterAvatarImage.tsx`.
