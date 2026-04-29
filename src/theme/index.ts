import { darkColors } from './tokens/colors.dark';
import { lightColors } from './tokens/colors.light';
import { elevation } from './tokens/elevation';
import { glassmorphism } from './tokens/glassmorphism';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { typography } from './tokens/typography';

export const lightTheme = {
  mode: 'light' as const,
  colors: lightColors,
  spacing,
  radius,
  typography,
  elevation,
  glassmorphism,
};

export const darkTheme = {
  mode: 'dark' as const,
  colors: darkColors,
  spacing,
  radius,
  typography,
  elevation,
  glassmorphism,
};

export type AppTheme = typeof lightTheme | typeof darkTheme;
