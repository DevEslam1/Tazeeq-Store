import { I18nManager } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';

export function useRTL() {
  const { isRTL } = useAppTheme();

  return {
    isRTL,
    // If we are in RTL mode (Arabic) but I18nManager hasn't kicked in yet (needs restart),
    // we force row-reverse to fix the layout immediately.
    flexRow: (isRTL && !I18nManager.isRTL) ? 'row-reverse' : 'row' as 'row' | 'row-reverse',
    textAlign: (isRTL ? 'right' : 'left') as 'left' | 'right',
    shouldInvert: I18nManager.isRTL !== isRTL,
  };
}
