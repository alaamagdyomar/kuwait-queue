import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CheckBoxes,
  ProductCart,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { filter, multiply, random } from 'lodash';

const initialState: ProductCart = {
  ProductID: 0,
  ProductName: ``,
  ProductImage: ``,
  ProductNameAr: ``,
  ProductNameEn: ``,
  ProductDesc: ``,
  ExtraNotes: '',
  Quantity: 0,
  Price: 0,
  RadioBtnsAddons: [],
  CheckBoxes: [],
  QuantityMeters: [],
  totalQty: 0,
  totalPrice: 0,
  grossTotalPrice: 0,
  enabled: false,
  image: ``,
  id: random(1111111, 999999999).toString(),
  MinQtyValidationID: [],
};

export const productCartSlice = createSlice({
  name: 'productCart',
  initialState,
  reducers: {
    setInitialProductCart: (
      state: typeof initialState,
      action: PayloadAction<
        Omit<ProductCart, 'QuantityMeters' | 'CheckBoxes' | 'RadioBtnsAddons'>
      >
    ) => {
      return {
        ...initialState,
        ...action.payload,
      };
    },
    addMeter: (
      state: typeof initialState,
      action: PayloadAction<QuantityMeters>
    ) => {
      return {
        ...state,
        QuantityMeters:
          action.payload.addons[0].Value === 0
            ? // donot add qm if it's value == 0
            [
              ...filter(
                state.QuantityMeters,
                (m) => m.uId !== action.payload.uId
              ),
            ]
            : [
              action.payload,
              ...filter(
                state.QuantityMeters,
                (m) => m.uId !== action.payload.uId
              ),
            ],
      };
    },
    removeMeter: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        QuantityMeters: filter(
          state.QuantityMeters,
          (c) => c.uId !== action.payload
        ),
      };
    },
    resetMeters: (state: typeof initialState, action: PayloadAction<void>) => {
      return {
        ...state,
        QuantityMeters: initialState.QuantityMeters,
      };
    },
    addToCheckBox: (
      state: typeof initialState,
      action: PayloadAction<CheckBoxes>
    ) => {
      return {
        ...state,
        CheckBoxes: [
          action.payload,
          ...filter(state.CheckBoxes, (c) => c.uId !== action.payload.uId),
        ],
      };
    },
    removeFromCheckBox: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        CheckBoxes: filter(state.CheckBoxes, (c) => c.uId !== action.payload),
      };
    },
    resetCheckBoxes: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        CheckBoxes: initialState.CheckBoxes,
      };
    },
    addRadioBtn: (
      state: typeof initialState,
      action: PayloadAction<RadioBtns>
    ) => {
      const RadioBtnsAddons = [
        ...filter(
          state.RadioBtnsAddons,
          (r) => r.addonID !== action.payload.addonID
        ),
        action.payload,
      ];
      return {
        ...state,
        RadioBtnsAddons,
      };
    },
    resetRadioBtns: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        RadioBtnsAddons: initialState.RadioBtnsAddons,
      };
    },
    setCartProductQty: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => {
      return {
        ...state,
        Quantity: action.payload,
        grossTotalPrice: multiply(state.totalPrice, action.payload),
      };
    },
    updateId: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...state,
        id: action.payload,
      };
    },
    setNotes: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...state,
        ExtraNotes: action.payload,
      };
    },
    updatePrice: (
      state: typeof initialState,
      action: PayloadAction<{
        totalPrice: number;
        totalQty: number;
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
        grossTotalPrice: multiply(
          action.payload.totalPrice,
          action.payload.totalQty
        ),
      };
    },
    enableAddToCart: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        enabled: true,
      };
    },
    disableAddToCart: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        enabled: false,
      };
    },
    resetProductCart: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...initialState,
      };
    },

    setMinQtyValidationID: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        MinQtyValidationID: [
          ...filter(state.MinQtyValidationID, (a) => a !== action.payload),
          action.payload,
        ],
      };
    },

    removeMinQtyValidationID: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        MinQtyValidationID: filter(
          state.MinQtyValidationID,
          (a) => a !== action.payload
        ),
      };
    },

    resetMinQtyValidationID: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        MinQtyValidationID: initialState.MinQtyValidationID,
      };
    },
  },
});

export const {
  resetProductCart,
  addToCheckBox,
  setInitialProductCart,
  removeFromCheckBox,
  resetCheckBoxes,
  setCartProductQty,
  addRadioBtn,
  resetRadioBtns,
  updatePrice,
  addMeter,
  removeMeter,
  resetMeters,
  enableAddToCart,
  disableAddToCart,
  updateId,
  setNotes,
  setMinQtyValidationID,
  removeMinQtyValidationID,
  resetMinQtyValidationID,
} = productCartSlice.actions;
