import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
