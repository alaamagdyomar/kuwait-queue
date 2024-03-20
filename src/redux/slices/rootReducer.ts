import { combineReducers } from '@reduxjs/toolkit';
import { localeSlice } from './localeSlice';

import { appLoadingSlice } from './appLoadingSlice';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { vendorSlice } from '@/redux/slices/vendorSlice';
import { apiSlice } from '../api';
import { searchParamsSlice } from '@/redux/slices/searchParamsSlice';
import { customerSlice } from '@/redux/slices/customerSlice';
import { productCartSlice } from '@/redux/slices/productCartSlice';
import { CartSlice } from '@/redux/slices/cartSlice';
import { ModalsSlice } from '@/redux/slices/modalsSlice';
import { promoCodeSlice } from '@/redux/slices/promoCodeSlice';


export const rootReducer = combineReducers({
  [appLoadingSlice.name]: appLoadingSlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [vendorSlice.name]: vendorSlice.reducer,
  [appSettingSlice.name]: appSettingSlice.reducer,
  [searchParamsSlice.name]: searchParamsSlice.reducer,
  [customerSlice.name]: customerSlice.reducer,
  [productCartSlice.name]: productCartSlice.reducer,
  [CartSlice.name]: CartSlice.reducer,
  [ModalsSlice.name]: ModalsSlice.reducer,
  [promoCodeSlice.name]: promoCodeSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});
