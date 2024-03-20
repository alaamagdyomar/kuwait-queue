import NoFoundImage from '@/appImages/not_found.png';
import { filter, isUndefined, map, toString } from 'lodash';
import i18n from './i18n/config';
export const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const appVersion = `0.0.2`;
export const xDomain = `next2-q.testbedbynd.com`;
// export const xDomain = `next-q.testbedbynd.com`;
//https://pages.testbedbynd.com/
//https://pages-dash.testbedbynd.com/
export const apiUrl = `${baseUrl}api/`;
export const appLinks = {
  root: { path: '/home' },
  home: { path: '/home' },
  login: { path: '/login' },
  userLogin: { path: '/verification/password' },
  createAuthAddress: (userId: string, type?: string, params?: string) =>
    `/user/${userId}/address/${type ?? 'house'}/create${params !== undefined ? `?${params}` : ``
    }`,
  editAuthAddress: (
    userId: string,
    addressId: string,
    type: string,
    params?: string
  ) =>
    `/user/${userId}/address/${type}/edit/${addressId}${params !== undefined ? `?${params}` : ``
    }`,
  userAddresses: (userId: string) => `/user/${userId}/address/`,
  selectAddress: (userId: string) => `/user/${userId}/address/select`,
  guestAddress: { path: `/guest/address/create` },
  addressMap: { path: '/address/map' },
  cart: { path: '/cart' },
  checkout: { path: '/order/checkout' },
  privacyPolicy: { path: '/policies/privacy' },
  returnPolicy: { path: '/policies/return' },
  shippingPolicy: { path: '/policies/shipping' },
  productSearch: { path: '/product/search' },
  categoryProducts: (categoryId: number) => `product/${categoryId}`,
  productShow: (id: number, slug?: string) =>
    `/product/show/${id}?slug=${slug}`,
  selectArea: (mode: string) => `/select/area${mode && `/${mode}`}`,
  selectBranch: { path: '/select/branch' },
  branchIndex: { path: '/branch' },
  selectTime: (method: 'pickup | delivery') => `/select/${method}/time`,
  accountInfo: { path: '/user/info' },
  orderHistory: { path: '/orders' },
  wishlist: { path: '/wishlist' },
  vendorDetails: { path: '/vendor/info' },
  mobileVerification: { path: '/verification/mobile' },
  otpVerification: (type: string) => `/verification/${type}/otp`,
  orderReceipt: (orderId: string) => `/receipt/${orderId}`,
  orderTrack: (orderId: string) => `/order/track/${orderId}`,
  orderFailure: (orderId: string) => `/order/${orderId}/status/failure`,
  orderSuccess: (orderId: string) => `/order/${orderId}/status/success`,
};

export const isLocal = process.env.NODE_ENV !== 'production';
// export const isLocal = true;

// fonts
export const alexandriaFont = `font-Alexandria-Regular`;
export const alexandriaFontMeduim = `font-Alexandria-Medium`;
export const alexandriaFontSemiBold = `font-Alexandria-SemiBold`;
export const alexandriaFontLight = `font-Alexandria-Light`;
export const alexandriaFontBold = `font-Alexandria-Bold`;
export const montserratFontRegular = 'Montserrat-Arabic-Regular';
export const tajwalFont = 'font-tajwal-medium';

// classes
export const mainBg = `bg-gradient-to-tl mix-blend-multiply rounded-md xs-mobile-sm-desktop text-white shadow-inner drop-shadow-md`;
export const submitBtnClass = `w-full ${mainBg} rounded-md xs-mobile-sm-desktop text-white py-4 my-2 cursor-pointer shadow-lg capitalize disabled:from-gray-200 disabled:to-gray-400 drop-shadow-md`;
export const addressInputField = `border-0 outline-none border-b-2 border-b-gray-100 w-full py-4 focus:ring-0 ${alexandriaFont}`;
export const footerBtnClass = `p-2 px-6 rounded-lg w-fit disabled:bg-stone-600 disabled:text-stone-200 disabled:bg-opacity-40 disabled:opacity-60  shadow-xl capitalize border border-stone-100/25 hover:shadow-inner hover:border-stone-200/80 `;
export const modalBtnContainer = `w-full border-t-[1px] border-gray-200 px-4 flex items-end space-x-5 pt-4`;
export const mainBtnClass = `text-white w-full sm-mobile-base-desktop rounded-full py-3 mx-auto capitalize`;
export const errorMsgClass = `xs-mobile-sm-desktop text-red-600 py-2 capitalize`;

export const toEn = (s) =>
  s.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (a) => a.charCodeAt(0) & 15);

export const suppressText = true;

export const imageSizes = {
  xs: 100,
  sm: 150,
  md: 250,
  lg: 500,
  xl: 650,
  xxl: 1250,
};

// export const imgUrl = (img: string) => `${baseUrl}${img}`;
export const imgUrl = (img: string) =>
  img.includes('http') ? img : NoFoundImage.src;

export const convertColor = (hex: string, opacity: number) => {
  const tempHex = hex?.replace('#', '');
  if (tempHex) {
    const r = parseInt(tempHex.substring(0, 2), 16);
    const g = parseInt(tempHex.substring(2, 4), 16);
    const b = parseInt(tempHex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${opacity / 100})`;
  }
};

export const shadeColor = (color: string, percent: number) => {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);
  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

export const iconColor = `grayscale`;

export const updateUrlParams = (
  url: string,
  name: string,
  value: string | number
) => {
  return url.replace(/\bpage=[0-9a-zA-Z_@.#+-]{1,50}\b/, `${name}=${value}`);
};

export const scrollClass = `scroll-smooth overflow-scroll scrollbar-hide overflow-y-scroll`;

export const setLang = (lang: any) =>
  fetch(`/api/set/lang`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lang }),
  });

export const setToken = (token: any) =>
  fetch(`/api/set/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

export const deleteToken = () =>
  fetch(`/api/delete/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getToken = () =>
  fetch(`/api/get/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const displayUserAddress = (address: any) => {
  let formattedAddress;

  formattedAddress = filter(
    map(
      address,
      (value, key) =>
        value !== null && !isUndefined(value) && value !== undefined &&
        key !== `id` &&
        key !== `area_id` &&
        key !== `city` &&
        key !== `phone` &&
        key !== `name` &&
        key !== `area_ar` &&
        key !== `area_en` &&
        `${key} : ${value}  `
    ),
    (a) => a
  );

  formattedAddress = toString(formattedAddress).replaceAll(',', ' / ');

  return formattedAddress;
};

export const whatsappUrl = `https://api.whatsapp.com/send?phone=`;
export const googleMapUrl = (lang: string, lat: string) =>
  `http://maps.google.com/maps?z=18&q=${lang},${lat}`;
