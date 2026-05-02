import { createContext, useContext, useMemo, useState, useEffect, type PropsWithChildren } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { darkTheme, lightTheme, type AppTheme } from './themes';

type ThemeMode = 'light' | 'dark';
type Locale = 'ar' | 'en';

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  locale: Locale;
  isRTL: boolean;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load persisted settings
    const loadSettings = async () => {
      try {
        const [savedMode, savedLocale] = await Promise.all([
          AsyncStorage.getItem('theme_mode'),
          AsyncStorage.getItem('app_locale'),
        ]);

        if (savedMode) setMode(savedMode as ThemeMode);
        if (savedLocale) {
          setLocaleState(savedLocale as Locale);
          i18n.changeLanguage(savedLocale);
          
          // Verify RTL alignment
          const shouldBeRTL = savedLocale === 'ar';
          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);
            // In a real app, we might need to force a restart here
            // For now, we'll just update the manager state
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadSettings();
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const theme = mode === 'light' ? lightTheme : darkTheme;

    return {
      theme,
      mode,
      isDark: mode === 'dark',
      locale,
      isRTL: I18nManager.isRTL,
      toggleTheme: async () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        await AsyncStorage.setItem('theme_mode', newMode);
      },
      setLocale: async (newLocale: Locale) => {
        setLocaleState(newLocale);
        i18n.changeLanguage(newLocale);
        await AsyncStorage.setItem('app_locale', newLocale);
        
        const shouldBeRTL = newLocale === 'ar';
        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);
          
          // RTL changes require a full app restart in React Native
          // For Expo, updates are sometimes immediate but often require a reload
          if (Platform.OS !== 'web') {
             // NativeModules.DevSettings.reload(); // Only for dev
          }
        }
      },
    };
  }, [mode, locale]);

  if (!isReady) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }
  return context;
}
