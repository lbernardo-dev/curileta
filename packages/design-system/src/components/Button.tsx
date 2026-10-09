import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full cursor-pointer';

    const variants = {
      primary:
        'bg-[var(--color-curileta-green)] hover:bg-[var(--color-curileta-green-dark)] text-white shadow-md hover:shadow-lg active:scale-95',
      secondary:
        'bg-white text-[var(--color-forest)] border-2 border-[var(--color-curileta-green)] hover:bg-[var(--background-accent)] active:scale-95',
      accent:
        'bg-[var(--color-adventure-gold)] hover:bg-amber-600 text-slate-950 font-extrabold shadow-md hover:shadow-lg active:scale-95',
      ghost:
        'bg-transparent hover:bg-black/5 text-slate-800 dark:text-slate-100 hover:text-[var(--color-curileta-green)]',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-sm gap-1.5',
      md: 'px-6 py-2.5 text-base gap-2',
      lg: 'px-8 py-3.5 text-lg gap-3',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
