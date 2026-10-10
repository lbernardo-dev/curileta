import Image from 'next/image';
import { EyeOff } from 'lucide-react';
import type { Locale } from '@curileta/i18n';

interface BookCoverPanelProps {
  src: string;
  alt: string;
  locale: Locale;
  upcoming: boolean;
  frame?: { positionX: number; positionY: number; zoom: number } | null;
  fillContainer?: boolean;
}

export function BookCoverPanel({ src, alt, locale, upcoming, frame, fillContainer = false }: BookCoverPanelProps) {
  const isEn = locale === 'en';
  return (
    <div className={`relative w-full overflow-hidden bg-[#173e35] ${fillContainer ? 'h-full min-h-0' : 'aspect-[4/5]'}`}>
      <Image
        src={src}
        alt={upcoming ? '' : alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        aria-hidden={upcoming ? true : undefined}
        className={`object-cover ${upcoming ? 'scale-110 blur-sm opacity-50' : ''}`}
        style={frame && !upcoming ? {
          objectPosition: `${frame.positionX}% ${frame.positionY}%`,
          transform: `scale(${frame.zoom})`,
          transformOrigin: `${frame.positionX}% ${frame.positionY}%`,
        } : undefined}
      />
      {upcoming && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#14382f]/70 p-6 text-center">
          <div className="flex max-w-xs flex-col items-center rounded-2xl border border-dashed border-white/60 bg-[#102d27]/75 px-6 py-7 text-white shadow-xl">
            <EyeOff className="h-8 w-8 text-amber-300" aria-hidden="true" />
            <span className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">{isEn ? 'Cover under wraps' : 'Cubierta reservada'}</span>
            <span className="mt-1 text-sm text-white/85">{isEn ? 'A new adventure is taking shape' : 'Una nueva aventura está tomando forma'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
