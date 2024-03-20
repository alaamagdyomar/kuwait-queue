import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTempId: builder.query<
      AppQueryResult<{ Id: string }>,
      { url: string }
    >({
      query: ({ url }) => ({
        url: `tempId`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getTimings: builder.query<
      AppQueryResult<[string]>,
      { type: string; date: string; area_branch: any; url: string, lang: string }
    >({
      query: ({ type, date, area_branch, lang, url }) => ({
        url: `getAvailableTime`,
        params: {
          type,
          date,
          lang
        },
        headers: {
          url,
          lang,
          ...area_branch,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    addToCart: builder.mutation<
      AppQueryResult<ServerCart>,
      {
        body: { UserAgent: string; Cart: any };
        process_type: string;
        destination: any;
        url: string;
      }
    >({
      query: ({ body, process_type, destination = {}, url }) => ({
        url: `addToCart`,
        method: `POST`,
        body,
        headers: {
          ...(process_type === 'delivery' && destination),
          ...(process_type === 'pickup' && destination),
          url,
        },
        validateStatus: (response, result) => result.status,
      }),
      invalidatesTags: ['Cart'],
    }),
    GetCartProducts: builder.query<
      AppQueryResult<ServerCart>,
      {
        userAgent: string;
        url: string;
        area_branch: any;
        PromoCode: string;
      }
    >({
      query: ({ userAgent, url, area_branch, PromoCode }) => ({
        url: `cartPromoCode`,
        params: { UserAgent: userAgent, PromoCode },
        headers: {
          url,
          ...area_branch,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      providesTags: ['Cart'],
    }),
    GetPromoCodes: builder.query<
      AppQueryResult<string[]>,
      {
        url: string;
        area_branch: any;
      }
    >({
      query: ({ url, area_branch }) => ({
        url: `available-promo`,
        headers: {
          url,
          ...area_branch,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    checkPromoCode: builder.query<
      AppQueryResult<ServerCart>,
      {
        userAgent: string | undefined;
        PromoCode: string | undefined;
        url: string;
        area_branch: any;
      }
    >({
      query: ({ userAgent, PromoCode, url, area_branch }) => ({
        url: `checkPromoCode`,
        headers: { url, ...area_branch },
        params: { UserAgent: userAgent, PromoCode },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      transformErrorResponse(r) {
        // console.log('in transform', { r });
        return r.data;
      },
    }),
    changeLocation: builder.query<
      AppQueryResult<any>,
      {
        UserAgent: string;
        area_branch: any;
        url: string;
      }
    >({
      query: ({ UserAgent, area_branch, url }) => ({
        url: `changeArea`,
        params: { UserAgent },
        headers: {
          url,
          ...area_branch,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useCreateTempIdQuery,
  useLazyCreateTempIdQuery,
  useGetCartProductsQuery,
  useAddToCartMutation,
  useGetPromoCodesQuery,
  useLazyCheckPromoCodeQuery,
  useLazyGetCartProductsQuery,
  useLazyChangeLocationQuery,
  useLazyGetTimingsQuery,
} = cartApi;
