import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        curileta: {
          green: 'var(--color-curileta-green)',
          'green-light': 'var(--color-curileta-green-light)',
          'green-dark': 'var(--color-curileta-green-dark)',
          gold: 'var(--color-adventure-gold)',
          'gold-light': 'var(--color-adventure-gold-light)',
          sky: 'var(--color-sky)',
          'sky-light': 'var(--color-sky-light)',
          forest: 'var(--color-forest)',
          sand: 'var(--color-sand)',
          ocean: 'var(--color-ocean)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        fluid: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
