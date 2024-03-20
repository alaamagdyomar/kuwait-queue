
import { Address } from '@/types/queries';


export interface Product {
  id: number;
  amount: number;
  productWishList: boolean;
  limited_qty: boolean;
  never_out_of_stock: number;
  name: string;
  name_ar: string;
  name_en: string;
  desc: string;
  description_ar: string;
  description_en: string;
  price: string;
  amount: number | undefined;
  branch_id?: string;
  price_on_selection?: boolean;
  new_price?: string;
  cover: string;
  img: img[];
  sections?: ProductSection[];
  cover: string;
}

export interface ProductSection {
  id: number;
  title: string;
  title_ar: string;
  title_en: string;
  must_select: string;
  selection_type: string;
  hidden: boolean;
  min_q: number;
  max_q: number;
  choices: SectionChoice[];
}

export interface SectionChoice {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  price: string;
  num: null | number;
  hidden: boolean;
}
export interface img {
  thumbnail: string;
  original: string;
}

export interface Vendor {
  id: string | number | null;
  name: string;
  name_ar: string;
  name_en: string;
  template_type: string;
  delivery_pickup_type: string;
  close_at: string;
  open_at: string;
  theme_color: string;
  status: string;
  delivery: any;
  slider: string[];
  phone: string;
  desc: string;
  cover: string;
  logo: string;
  delivery: {
    delivery_time: string;
    delivery_time_type: string;
    minimum_order_price: string;
  };
  location: string;
  WorkHours: string;
  DeliveryTime: string;
  Preorder_availability: string;
  twitter: string;
  facebook: string;
  instagram: string;
  Payment_Methods: {
    cash_on_delivery: 'yes' | 'no';
    knet: 'yes' | 'no';
    visa: 'yes' | 'no';
  };
}

export interface Locale {
  lang: 'ar' | 'en';
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  label: string;
  otherLang: 'ar' | 'en';
}

export type hor = `left` | `right`;
export type ver = `top` | `bottom`;
export type position = {
  position: Exclude<`${hor}-${ver}`, 'left-left'> | 'center';
};

export type appSetting = {
  // method: `delivery` | `pickup`;
  url: string | null;
  productPreview: `hor` | `ver`;
  showFooterElement: string;
  showHeader: boolean;
  showFooter: boolean;
  showCart: boolean;
  sideMenuOpen: boolean;
  currentModule: string;
  showAreaModal: boolean;
  showPickDateModal: boolean;
  showChangePasswordModal: boolean;
  lastHomeModalShownTime: number | null;
  previousUrl: {
    asPath: string;
    pathName: string;
    prevRouterLocale: string;
  };
  toastMessage: {
    content: string;
    type: string;
    title?: string;
    showToast: boolean;
  };
  HomePromoCodeOpen: boolean;
};

export interface ServerCart {
  UserAgent?: string | null;
  Cart: ProductCart[];
  total_cart_after_tax?: number;
  promo_code_discount?: number;
  minimum_order_price?: string;
  free_delivery_data?: string;
  tax?: number;
  free_delivery?: boolean;
  delivery_fee?: string;
  sub_total?: number;
  subTotal: number;
  total: number;
  delivery_fees: string;
  isEmpty?: boolean;
  promoCode?: any;
}

export interface ClientCart {
  subTotal: number;
  total: number;
  tax: number;
  delivery_fees: string;
  PromoCode: string | null;
  promoEnabled: boolean;
  delivery_fees: string | number | null;
  promoCode: {
    total_cart_before_tax: number;
    total_cart_after_tax: number;
    free_delivery: `true` | `false`;
  };
}
export interface ProductCart {
  ProductID: number;
  ProductName: string;
  ProductNameAr: string;
  ProductNameEn: string;
  ProductImage: string;
  ProductDesc: string;
  ExtraNotes: string;
  Quantity: number;
  Price: number;
  SalePrice?: number;
  totalQty: number;
  totalPrice: number;
  grossTotalPrice: number;
  RadioBtnsAddons: RadioBtns[];
  CheckBoxes: CheckBoxes[];
  QuantityMeters: QuantityMeters[];
  id?: string;
  enabled: boolean;
  image: string;
}

export interface RadioBtns {
  addonID: number;
  uId: string;
  addons: CartAddons;
}

export interface CheckBoxes {
  addonID: number;
  uId: string;
  addons: CartAddons[];
}

export interface QuantityMeters {
  addonID: number; // selectionId
  uId: string; // addonId+AttributeId
  uId2: string; //addonId+AttributeId+value
  addons: CartAddons[]; // choiceId
}

export interface CartAddons {
  attributeID: number;
  name: string;
  name_ar: string;
  name_en: string;
  // nameAr: string;
  // nameEn: string;
  Value?: number; // qty
  price?: number;
}

export interface Order {
  payment_method: string;
  orderId: string | null;
  vendor_name: string;
  vendor_name_ar: string;
  vendor_name_en: string;
  vendor_logo: string;
  vendor_description: string[];
  branch_phone: string;
  branch_address: string;
  orderCode: string | number;
  order_id: string | number;
  orderType: string;
  newOrderType: string;
  customer: CustomerInfo;
  items: [
    {
      quantity: number;
      item: string;
      addon: InvoiceAddon[];
      price: string;
      total: number;
      extra_notes: string;
      item_en: string;
      item_ar: string;
    }
  ];
  delivery_date_time: string;
  estimated_time?: {
    from: string;
    to: string;
  };
}

export interface OrderInvoice {
  order_code: string;
  contact_details: {
    customer: {
      id: number;
      name: string;
      phone: string;
      email: string;
    };
    order_details: {
      order_type: string;
      branch: string;
      branch_address: string;
      order_date: string;
      order_time: string;
      delivery_address: {
        address: {
          type: string;
          block: string;
          street: string;
          additional?: string;
        };
        latitude: string;
        longitude: string;
      };
    };
    payment_type: string;
  };
  order_items: [
    {
      id: number;
      quantity: number;
      item: string;
      item_ar: string;
      item_en: string;
      addon: [
        {
          addon_id: string | number;
          name: string;
          name_en: string;
          name_ar: string;
          quantity: string | number;
          unit_price: string | number;
        }
      ];
      price: string;
      total: number;
      extra_notes: string;
    }
  ];
  payment_summary: {
    sub_total: string;
    total: string;
    delivery_fee: string;
    tax: string;
    promo_code?: string;
    promo_code_value?: string | number;
  };
}

export interface InvoiceAddon {
  addon_id: string | number;
  addon_name: string;
  addon_name_en: string;
  addon_name_ar: string;
  addon_quantity: string | number;
  addon_unit_price: string | number;
}

export interface OrderTrack {
  order_status: 'pending' | 'in-progress' | 'shipped' | 'completed';
  order_code: string;
  estimated_time: string | null;
  order_time: string | null;
  order_type: 'delivery' | 'pickup' | 'delivery_now' | 'pickup_now';
  branch_phone?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      paci: string | null;
      type: string | null;
      block: string | null;
      avenue: string | null;
      street: string | null;
      floor_no: string | null;
      house_no: string | null;
      office_no: string | null;
      additional: string | null;
      building_no: string | null;
    };
  };
  destination: {
    type: 'branch' | 'area';
    name_ar: string;
    name_en: string;
    address: string;
    longitude?: string;
    latitude?: string;
    phone?: string;
  };
  products: [
    {
      quantity: number;
      item: string;
      item_en: string;
      item_ar: string;
      price: string;
      addon?: [any];
      total: string;
      subtotal: string;
      discount: null | string | number;
      delivery_fees: string;
      extra_notes: null | string;
    }
  ];
  total: string;
  subtotal: string;
  discount: string | null;
  delivery_fees: string;
  extra_notes: string | null;
}

export interface OrderUser {
  // user_id?: number;
  order_type: string;
  UserAgent?: string;
  PromoCode?: string;
  Date?: string;
  Time?: string;
  Messg: string;
  address_id?: number;
  PaymentMethod: `cash_on_delivery` | `knet` | `visa`;
}

export interface OrderAddress {
  id: number;
  type: string;
  address: {
    block: string;
    street: string;
  };
  customer_id: number;
}

export interface UserAddressFields {
  id: number | string;
  key: string;
  value: string;
}

export interface CustomerInfo {
  id: number | null;
  userAgent?: null | string;
  name: string;
  email: string;
  phone?: string;
  customerAddressInfo: {
    name: string;
    phone: string;
  };
  address?: Address;
  prefrences?: Prefrences;
  notes?: string;
  countryCode: string | null;
  token?: string | null;
}

export interface Prefrences {
  type: string;
  date?: string | Date;
  time?: string | Date;
}

export interface RadioBtnsAddons {
  addonID: number;
  addons: CartAddons;
}

export interface CheckBoxesAddons {
  addonID: number;
  addons: CartAddons[];
}

export interface Cart {
  enable_promocode: boolean;
  promocode: string;
}

export interface Modals {
  areaBranchIsOpen: boolean;
  closedStoreIsOpen: boolean;
  showHelpModal: boolean;
}

export interface HomePromoCode {
  promo_code_id: number;
  promo_code: string;
  promo_image: string;
}

export interface OrderProduct {
  quantity: number;
  item: string;
  addon: InvoiceAddon[];
  price: string;
  total: number;
  extra_notes: string;
  item_en: string;
  item_ar: string;
}
export interface StaticPage {
  id: number;
  title_en: string;
  title_ar: string;
  key: string;
  content_en: string;
  content_ar: string;
}

export type AddressTypes = 'HOUSE' | 'OFFICE' | 'APARTMENT';

export type HomePromoCodeSlice = {
  closedModals: { closedDate: string; id: number }[];
};
