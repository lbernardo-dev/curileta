export const colors = {
  brand: {
    curiletaGreen: '#1B8A44',
    curiletaGreenLight: '#34D399',
    curiletaGreenDark: '#0D5C2C',
    adventureGold: '#F59E0B',
    adventureGoldLight: '#FCD34D',
    sky: '#38BDF8',
    skyLight: '#BAE6FD',
    forest: '#064E3B',
    sand: '#FEF3C7',
    ocean: '#0284C7',
    sunset: '#F97316',
    berry: '#BE185D',
  },
} as const;

export const motionTokens = {
  duration: {
    fast: '150ms',
    standard: '300ms',
    slow: '600ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  },
  distance: {
    small: '8px',
    medium: '24px',
    large: '64px',
  },
} as const;
