import { apiSlice } from './index';
import { AppQueryResult, DeliveryPickupDetails } from '@/types/queries';
import { HomePromoCode, Locale, Vendor } from '@/types/index';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendor: builder.query<
      AppQueryResult<Vendor>,
      {
        lang: Locale['lang'] | string | undefined;
        url: string | undefined;
        destination?: any;
      }
    >({
      query: ({ lang, url, destination = {} }) => ({
        url: `vendorDetails`,
        headers: {
          lang,
          url,
          ...destination,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
        keepUnusedDataFor: 0,
      }),
    }),

    getHomePromocode: builder.query<
      AppQueryResult<HomePromoCode[]>,
      {
        lang: Locale['lang'] | string | undefined;
        url: string | undefined;
      }
    >({
      query: ({ lang, url }) => ({
        url: `promocodehome`,
        headers: {
          lang,
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
        keepUnusedDataFor: 0,
      }),
    }),

    checkStaticPages: builder.query<
      AppQueryResult<HomePromoCode[]>,
      {
        lang: Locale['lang'] | string | undefined;
        url: string | undefined;
      }
    >({
      query: ({ lang, url }) => ({
        url: `static-page`,
        headers: {
          lang,
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
        keepUnusedDataFor: 0,
      }),
    }),

    getDeliveryPickupDetails: builder.query<
      AppQueryResult<DeliveryPickupDetails>,
      {
        lang: Locale['lang'] | string | undefined;
        url: string | undefined;
        branch_id?: string;
        area_id?: string;
      }
    >({
      query: ({ lang, url, branch_id = ``, area_id = `` }) => ({
        url: `deliveryDetails`,
        headers: {
          lang,
          url,
          ...(area_id && { 'x-area-id': area_id }),
          ...(branch_id && { 'x-branch-id': branch_id }),
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useGetVendorQuery,
  useGetDeliveryPickupDetailsQuery,
  useLazyGetVendorQuery,
  useGetHomePromocodeQuery,
  useCheckStaticPagesQuery
} = vendorApi;
