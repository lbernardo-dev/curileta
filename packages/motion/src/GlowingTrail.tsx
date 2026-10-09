'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const GlowingTrail: React.FC<{ className?: string }> = ({ className = '' }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathRef.current || !containerRef.current) return;

    // Respetar prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Inicializar trazo oculto
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-20 w-full h-full overflow-hidden opacity-60 sm:opacity-75 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          ref={pathRef}
          d="M 50,0 Q 80,150 50,300 T 20,600 T 70,850 L 50,1000"
          fill="none"
          stroke="url(#curiletaGlow)"
          strokeWidth="1.2"
          strokeLinecap="round"
          filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))"
        />
        <defs>
          <linearGradient id="curiletaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
