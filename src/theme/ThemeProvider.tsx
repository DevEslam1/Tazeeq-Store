import { createContext, useContext, useMemo, useState, useEffect, type PropsWithChildren } from 'react';
import { I18nManager } from 'react-native';
import { darkTheme, lightTheme, type AppTheme } from './index';

type ThemeMode = 'light' | 'dark';
type Locale = 'ar' | 'en';

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  locale: Locale;
  isRTL: boolean;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    const isRTL = I18nManager.isRTL;
    if (!isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      // In Expo Go or development, you might need to reload to see the change
    }
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const theme = mode === 'light' ? lightTheme : darkTheme;

    return {
      theme,
      mode,
      locale,
      isRTL: true, // Forcing RTL for Arabic app
      toggleTheme: () => setMode((current) => (current === 'light' ? 'dark' : 'light')),
      setLocale: (newLocale: Locale) => {
        setLocaleState(newLocale);
        const shouldBeRTL = newLocale === 'ar';
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      },
    };
  }, [mode, locale]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }
  return context;
}
