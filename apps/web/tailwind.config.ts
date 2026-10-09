import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
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
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
