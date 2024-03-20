import { Modals } from '@/types/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchParamsSlice } from './searchParamsSlice';

const initialState: Modals = {
  areaBranchIsOpen: false,
  closedStoreIsOpen: false,
  showHelpModal: false,
};

export const ModalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setAreaBranchModalStatus: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => ({
      ...state,
      areaBranchIsOpen: action.payload,
    }),
    setClosedStoreModalStatus: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => ({
      ...state,
      closedStoreIsOpen: action.payload,
    }),
    toggleShowHelpModal: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => ({
      ...state,
      showHelpModal: action.payload,
    })
  },
  extraReducers: (builder) => {
    builder.addCase(searchParamsSlice.actions.setDestination, (state, action) => {
      state.areaBranchIsOpen = false;
    });
  },
});

export const { setAreaBranchModalStatus, setClosedStoreModalStatus, toggleShowHelpModal } = ModalsSlice.actions;
