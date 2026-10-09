'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionProfile } from './types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseScrollProgressOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
}

export function useScrollProgress({
  triggerRef,
  start = 'top top',
  end = 'bottom bottom',
  scrub = true,
  pin = false,
}: UseScrollProgressOptions) {
  const [progress, setProgress] = useState(0);
  const triggerInstance = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !triggerRef.current) return;

    // Respetar prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      triggerInstance.current = ScrollTrigger.create({
        trigger: triggerRef.current,
        start,
        end,
        scrub,
        pin,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, triggerRef);

    return () => {
      ctx.revert();
    };
  }, [triggerRef, start, end, scrub, pin]);

  return progress;
}
