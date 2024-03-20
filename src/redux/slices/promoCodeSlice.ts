import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomePromoCodeSlice } from '@/types/index';
import moment from 'moment';

const initialState: HomePromoCodeSlice = {
  closedModals: [],
};

export const promoCodeSlice = createSlice({
  name: 'PromoCode',
  initialState,
  reducers: {
    addToHiddenModals: (
      state,
      action: PayloadAction<{ closedDate: string; id: number }>
    ) => {
      return {
        ...state,
        closedModals: [...state.closedModals, action.payload],
      };
    },
    removeExpiredPromoCodes: (state, action: PayloadAction<void>) => {
      let remainHiddenModals: HomePromoCodeSlice['closedModals'] = [];
      // remove promos that is one day old
      state.closedModals.forEach((item, idx) => {
        if (moment().diff(moment(item.closedDate), 'days') < 1) {
          remainHiddenModals.push(item);
        }
      });
      return { ...state, closedModals: [...remainHiddenModals] };
    },
  },
});

export const { removeExpiredPromoCodes, addToHiddenModals } =
  promoCodeSlice.actions;
