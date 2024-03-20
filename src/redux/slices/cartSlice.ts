import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart } from '@/types/index';

const initialState: Cart = {
  enable_promocode: false,
  promocode: '',
};

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setPromocode: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => ({
      ...state,
      promocode: action.payload,
      enable_promocode: true,
    }),
    resetPromo: (state: typeof initialState, action: PayloadAction<void>) => ({
      ...state,
      promocode: '',
      enable_promocode: false,
    }),
  },
});

export const { setPromocode, resetPromo } = CartSlice.actions;
