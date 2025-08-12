import { colors, radii, spacing, typography } from './tokens';

export const theme = {
  colors: {
    bg: colors.black,
    fg: colors.silver50,
    muted: colors.silver500,
    line: colors.silver800,
    glassBorder: 'rgba(255,255,255,0.08)',
    glassFill: 'rgba(255,255,255,0.04)',
    glassTint: 'rgba(255,255,255,0.08)',
    glow: colors.shine,
    success: colors.green, warn: colors.yellow, danger: colors.red,
  },
  radii, spacing, typography,
};
export type Theme = typeof theme;