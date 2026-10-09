import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Saltar al contenido principal',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-emerald-700 focus:text-white focus:rounded-full focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-sky-300"
    >
      {label}
    </a>
  );
};
