const CHARACTER_AVATARS: Readonly<Record<string, string>> = {
  bao: 'bao',
  basset: 'basset',
  'canguro-bebe': 'canguro-bebe',
  'canguro-mama': 'canguro-mama',
  'bebe-canguro': 'canguro-bebe',
  'mama-canguro': 'canguro-mama',
  cobaya: 'cobaya',
  cuy: 'cobaya',
  curileta: 'curileta',
  emi: 'emi',
  emu: 'emu',
  gino: 'gino',
  joey: 'joey',
  'joey-canguro': 'joey',
  'joey-peluche': 'joey',
  kiki: 'kiki',
  lola: 'lola',
  lulu: 'lulu',
  barnaby: 'basset',
  glub: 'pez-volador',
  ornitorrinco: 'ornitorrinco',
  'pez-volador': 'pez-volador',
  picu: 'picu',
  pompon: 'pompon',
  quetzal: 'quetzal',
  'zipi-bot': 'zipi-bot',
};

export function getCharacterAvatarUrl(slug: string, fallbackSrc?: string) {
  const avatar = CHARACTER_AVATARS[slug];
  return avatar ? `/images/characters/avatars/${avatar}.webp` : fallbackSrc || null;
}
