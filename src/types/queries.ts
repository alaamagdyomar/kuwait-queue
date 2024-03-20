import { OrderProduct, Product, ProductCart } from '.';

export type AppQueryResult<T> = {
  success: boolean;
  status: string | number;
  message: string;
  msg?: string;
  data: T;
  Data?: T;
};

export type ProductPagination<T> = {
  current_page: string;
  next_page: string;
  per_page: string;
  prev_page: string;
  products: T[];
  total: string;
};

export type Category = {
  id: number;
  cat_id: number | string;
  items?: Product[];
  name: string;
  name_ar: string;
  name_en: string;
  img: string;
};

export type Branch = {
  id: number | string | null;
  name: string;
  name_ar: string;
  name_en: string;
  location: string;
  mobile: string;
  long?: number | string;
  longitude?: number | string;
  latitude?: number | string;
  lat?: number | string;
  status: string;
  delivery_type: string;
};

export interface SearchParams {
  method: 'pickup' | 'delivery' | null;
  destination_type: 'branch' | 'area' | null;
  destination: null | Branch | Area;
  category_id: null | number;
}
export interface Area {
  id: string | number | null;
  name: string;
  name_ar: string;
  name_en: string;
  long?: number | string;
  lat?: number | string;
}

export interface Location {
  id: number;
  City: string;
  name_ar: string;
  name_en: string;
  Areas: Area[];
}

export interface Address {
  id: number | string;
  type: number | string;
  longitude?: number | string;
  latitude?: number | string;
  customer_id?: number | string;
  address: {
    area: string;
    area_id: string;
    notes?: string;
    street?: string;
    house_no?: string;
    city?: string;
    office_no?: string;
    building_no?: string;
    [key: string]: any;
  }
  [key: string]: any;
}

export interface Feedback {
  user_name: string;
  rate: number;
  note: string;
  phone: number;
}
export interface DeliveryPickupDetails {
  delivery_time: string;
  estimated_preparation_time: string;
  delivery_fees: string;
  delivery_time_type: string;
  id: number;
}

export interface UpcomingOrders {
  id: number;
  order_code: string;
  order_status: string;
  order_type: string;
  total: string;
  created_at: string;
  estimated_time: string;
  items?: OrderProduct[];
}

export interface PhoneCheck {
  phone: string;
  phone_country_code: string;
}

export interface VerifyCode {
  phone: string;
  phone_country_code: string;
  code: string;
  type: 'register' | 'reset';
}

export interface Register {
  phone: string;
  phone_country_code: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPassword {
  phone: string;
  phone_country_code: string;
  new_password: string;
  confirm_password?: string;
}

export interface UserOrders {
  completed: UpcomingOrders[];
  upcoming: UpcomingOrders[];
}
