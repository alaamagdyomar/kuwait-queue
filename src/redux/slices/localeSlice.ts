import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Locale } from '../../types';

const initialState: Locale = {
  isRTL: false,
  dir: 'ltr',
  lang: 'en',
  label: 'english',
  otherLang: 'ar',
};

export const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string | any>) => {
      return {
        dir: action.payload === 'ar' ? 'rtl' : 'ltr',
        isRTL: action.payload === 'ar' ? true : false,
        lang: action.payload,
        label: action.payload === 'ar' ? 'arabic' : 'english',
        otherLang: action.payload === 'ar' ? 'en' : 'ar',
      };
    },
  },
});

export const { setLocale } = localeSlice.actions;
