import { ContentImage } from '@/components/ContentImage';
import Image from 'next/image';
import { getCharacterAvatarUrl } from '@/lib/character-avatar';

interface CharacterAvatarImageProps {
  slug: string;
  name: string;
  size?: number;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
}

export function CharacterAvatarImage({
  slug,
  name,
  size = 40,
  alt,
  fallbackSrc,
  className = '',
}: CharacterAvatarImageProps) {
  const avatarUrl = getCharacterAvatarUrl(slug, fallbackSrc);
  if (!avatarUrl) return null;
  if (avatarUrl === fallbackSrc) {
    return (
      <ContentImage
        src={avatarUrl}
        alt={alt ?? `Retrato de ${name}`}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={avatarUrl}
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
