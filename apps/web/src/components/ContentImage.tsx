import Image, { type ImageProps } from 'next/image';

type ContentImageProps = Omit<ImageProps, 'src'> & {
  src: ImageProps['src'] | undefined;
};

function canOptimizeImageSource(src: ImageProps['src']) {
  if (typeof src !== 'string' || !/^https?:\/\//i.test(src)) return true;
  if (!/^https:\/\//i.test(src)) return false;

  try {
    const url = new URL(src);
    if (['cdn.sanity.io', 'i.ytimg.com', 'images.unsplash.com'].includes(url.hostname)) return true;
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_IMAGE_HOST
      && url.hostname === process.env.NEXT_PUBLIC_SUPABASE_IMAGE_HOST
      && url.pathname.startsWith('/storage/v1/object/public/'),
    );
  } catch {
    return false;
  }
}

export function ContentImage({
  src,
  width = 1200,
  height = 900,
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...props
}: ContentImageProps) {
  if (!src) return null;
  const unoptimized = props.unoptimized ?? !canOptimizeImageSource(src);
  return <Image {...props} src={src} alt={props.alt ?? ''} width={width} height={height} sizes={sizes} unoptimized={unoptimized} />;
}
