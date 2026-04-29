import { useAppTheme } from '../theme/ThemeProvider';

export function useRTL() {
  const { isRTL } = useAppTheme();

  return {
    isRTL,
    // React Native's I18nManager handles 'row' automatically, so we shouldn't reverse it manually
    flexRow: 'row' as 'row' | 'row-reverse',
    textAlign: (isRTL ? 'right' : 'left') as 'left' | 'right',
  };
}
