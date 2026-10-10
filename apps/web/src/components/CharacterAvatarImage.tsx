import Image from 'next/image';

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

interface CharacterAvatarImageProps {
  slug: string;
  name: string;
  size?: number;
  alt?: string;
  className?: string;
}

export function CharacterAvatarImage({
  slug,
  name,
  size = 40,
  alt,
  className = '',
}: CharacterAvatarImageProps) {
  const avatar = CHARACTER_AVATARS[slug];
  if (!avatar) return null;

  return (
    <Image
      src={`/images/characters/avatars/${avatar}.webp`}
      alt={alt ?? `Retrato de ${name}`}
      width={size}
      height={size}
      sizes={`${size}px`}
      unoptimized
      className={`shrink-0 rounded-full object-cover ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
