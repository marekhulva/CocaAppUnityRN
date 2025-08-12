export const colors = {
  // Base
  black: '#000000',
  white: '#FFFFFF',

  // Silver spectrum (iOS "steel")
  silver50:  '#F7F7F8',
  silver100: '#ECEDEF',
  silver200: '#DADBE0',
  silver300: '#BFC3CC',
  silver400: '#A3A8B2',
  silver500: '#8A8F99',
  silver600: '#6E737D',
  silver700: '#565A63',
  silver800: '#3C3F46',
  silver900: '#27292E',

  // Accents (shining white glow)
  shine: 'rgba(255,255,255,0.86)',
  shineDim: 'rgba(255,255,255,0.22)',

  // Status
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
};

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
};

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 28, xxl: 36 };

export const typography = {
  fontFamily: 'System',
  sizes: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32 },
  weights: { regular: '400', medium: '600', bold: '700' } as const,
};