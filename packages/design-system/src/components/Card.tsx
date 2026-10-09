import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'bordered' | 'glass';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-3xl p-6 transition-all duration-300';
    const variants = {
      elevated:
        'bg-white dark:bg-slate-900 shadow-xl shadow-emerald-950/5 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-2xl',
      bordered:
        'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500',
      glass:
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
