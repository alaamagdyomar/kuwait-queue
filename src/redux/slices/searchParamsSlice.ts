import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Area, Branch, Category, SearchParams } from '@/types/queries';
import { RootState } from '../store';
import { ModalsSlice } from './modalsSlice';

const initialState: SearchParams = {
  method: null,
  destination: null,
  destination_type: null,
  category_id: null,
};

export const searchParamsSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    setDestination: (
      state: typeof initialState,
      action: PayloadAction<{
        destination: Branch | Area;
        type: 'pickup' | 'delivery';
      }>
    ) => ({
      ...state,
      method: action.payload.type,
      destination_type: action.payload.type === 'pickup' ? 'branch' : 'area',
      destination: action.payload.destination,
    }),
    resetDestination: (
      state: typeof initialState,
      action: PayloadAction<void | undefined>
    ) => ({
      ...state,
      method: null,
      destination_type: null,
      destination: null,
    }),
    setCategory: (
      state: typeof initialState,
      action: PayloadAction<number>
    ) => ({
      ...state,
      category_id: action.payload,
    }),
  },
});

export const { setDestination, setCategory, resetDestination } = searchParamsSlice.actions;
export const destinationId = (state: RootState) =>
  state.searchParams.destination?.id ?? null;
export const destinationHeaderObject = (state: RootState) =>
  state.searchParams.method === 'pickup'
    ? { 'x-branch-id': state.searchParams.destination?.id ?? '' }
    : state.searchParams.method === 'delivery'
      ? {
        'x-area-id': state.searchParams.destination?.id ?? '',
      }
      : {};

export const destinationParamsObject = (state: RootState) =>
  state.searchParams.method === 'pickup'
    ? { 'branch-id': state.searchParams.destination?.id ?? '' }
    : state.searchParams.method === 'delivery'
      ? {
        'area-id': state.searchParams.destination?.id ?? '',
      }
      : {};
