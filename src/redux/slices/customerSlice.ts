import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerInfo } from '@/types/index';
import { searchParamsSlice } from './searchParamsSlice';
import { isNull } from 'lodash';
import { RootState } from '../store';

const initialState: CustomerInfo = {
  id: null,
  userAgent: null, /// ==== tempId for the cart
  name: ``,
  email: ``,
  phone: ``,
  customerAddressInfo: {
    name: '',
    phone: '',
  },
  address: {
    id: 0,
    customer_id: 0,
    type: 'HOUSE',
    address: {
      area: ``,
      area_id: ``,
    },
    longitude: ``,
    latitude: ``,
  },
  prefrences: {
    type: '', // delivery_now or pickup_now
    date: '',
    time: '',
  },
  notes: ``,
  countryCode: null,
  token: null,
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo>
    ) => {
      return {
        ...state,
        ...action.payload,
        customerAddressInfo: {
          name: action.payload.name,
          phone: action.payload.phone,
        },
      };
    },
    removeCustomer: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...initialState,
        address: state.address,
      };
    },

    setUserAgent: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        userAgent: action.payload,
      };
    },
    setNotes: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...state,
        notes: action.payload,
      };
    },
    setCustomerAddress: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo['address']>
    ) => {
      return {
        ...state,
        address: {
          id: action.payload?.id,
          type: action.payload?.type,
          ...action.payload?.address,
        },
        customerAddressInfo: {
          phone: action.payload?.address?.phone,
          name: action.payload?.address?.name,
        },
        customer_id: action.payload?.customer_id,
      };
    },
    setCustomerAddressInfo: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo['customerAddressInfo']>
    ) => {
      return {
        ...state,
        customerAddressInfo: {
          ...state.customerAddressInfo,
          ...action.payload,
        },
      };
    },
    setCustomerAddressArea: (
      state: typeof initialState,
      action: PayloadAction<{ area: string | number; area_id: string | number }>
    ) => {
      return {
        ...state,
        address: {
          ...state.address,
          area: action.payload?.area,
          city: action.payload?.area,
          area_id: action.payload?.area_id,
        },
      };
    },
    setCustomerAddressType: (
      state: typeof initialState,
      action: PayloadAction<string | number>
    ) => {
      return {
        ...state,
        address: {
          ...state.address,
          type: action.payload,
        },
      };
    },
    resetCustomerAddress: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        address: initialState.address,
      };
    },
    setPreferences: (
      state: typeof initialState,
      action: PayloadAction<CustomerInfo['prefrences']>
    ) => {
      return {
        ...state,
        prefrences: action.payload,
      };
    },
    resetPreferences: (
      state: typeof initialState,
      action: PayloadAction<void>
    ) => {
      return {
        ...state,
        prefrences: initialState.prefrences,
      };
    },
    signIn: (state: typeof initialState, action: PayloadAction<string>) => {
      return {
        ...state,
        token: action.payload,
      };
    },
    signOut: (state: typeof initialState, action: PayloadAction<void>) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      searchParamsSlice.actions.setDestination,
      (state, action) => {
        state.prefrences = initialState.prefrences;
      }
    );
  },
});

export const {
  setCustomer,
  removeCustomer,
  setCustomerAddress,
  setCustomerAddressInfo,
  setCustomerAddressArea,
  setCustomerAddressType,
  resetCustomerAddress,
  setPreferences,
  resetPreferences,
  setUserAgent,
  setNotes,
  signIn,
  signOut,

} = customerSlice.actions;

export const isAuthenticated = (state: RootState) =>
  !isNull(state.customer.token) && !isNull(state.customer.id);
