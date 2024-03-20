import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vendor } from "@/types/index";
import { RootState } from "@/redux/store";

const initialState: Vendor = {
  id: null,
  name: ``,
  name_ar: ``,
  name_en: ``,
  status: ``,
  phone: ``,
  desc: ``,
  cover: ``,
  logo: ``,
  delivery: ``,
  location: ``,
  WorkHours: ``,
  DeliveryTime: ``,
  theme_color: `#021b4a`,
  Preorder_availability: ``,
  Payment_Methods: {
    cash_on_delivery: `no`,
    knet: `no`,
    visa: `no`,
  },
  twitter: "",
  instagram: "",
  facebook: "",
  template_type: "",
  delivery_pickup_type: "",
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendor: (state: typeof initialState, action: PayloadAction<Vendor>) => {
      return {
        ...action.payload,
      };
    },
    setColorTheme: (
      state: typeof initialState,
      action: PayloadAction<string>
    ) => {
      return {
        themeColor: action.payload,
        ...state,
      };
    },
  },
});

export const { setVendor, setColorTheme } = vendorSlice.actions;

export const themeColor = (state: RootState) => state.vendor?.theme_color;
