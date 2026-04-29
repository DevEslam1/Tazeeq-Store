import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { I18nManager } from 'react-native';

interface LocaleState {
  locale: 'ar' | 'en';
  isRTL: boolean;
}

const initialState: LocaleState = {
  locale: I18nManager.isRTL ? 'ar' : 'en',
  isRTL: I18nManager.isRTL,
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.locale = action.payload;
      state.isRTL = action.payload === 'ar';
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
