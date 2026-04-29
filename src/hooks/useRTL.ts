import { useAppTheme } from '../theme/ThemeProvider';

export function useRTL() {
  const { isRTL } = useAppTheme();

  return {
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    flexRow: isRTL ? 'row-reverse' : 'row',
    textAlign: isRTL ? 'right' : 'left',
  };
}
