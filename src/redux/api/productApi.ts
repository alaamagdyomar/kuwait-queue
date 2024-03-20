import { Product, Locale } from '../../types';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      AppQueryResult<Product[] | any>,
      {
        page?: string;
        limit?: string;
        lang: Locale['lang'] | string | undefined;
        url: string;
        category_id: string | number;
        destination?: any;
      }
    >({
      query: ({
        category_id,
        page,
        limit,
        lang,
        url,
        destination = {},
      }: any) => ({
        url: `items`,
        params: { category_id, page, limit },
        headers: {
          url,
          lang,
          ...destination,
          limit,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getSearchProducts: builder.query<
      AppQueryResult<Product[]>,
      {
        lang: Locale['lang'] | string | undefined;
        key?: string;
        destination?: any;
        url: string;
        category_id?: string;
      }
    >({
      query: ({ lang, key = ``, destination = {}, url, category_id }: any) => ({
        url: `search`,
        params: {
          key,
          ...(category_id && { category_id: category_id }),
        },
        headers: {
          url,
          ...destination,
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    getProduct: builder.query<
      AppQueryResult<Product>,
      {
        id: string | number;
        lang: Locale['lang'] | string | undefined;
        destination?: any;
        url: string;
      }
    >({
      query: ({ id, lang, url, destination = {} }) => ({
        url: `itemDetails`,
        params: { product_id: id },
        headers: {
          url,
          lang,
          ...destination,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      providesTags: ['Product'],
    }),
    getTopSearch: builder.query<
      AppQueryResult<{ topSearch: string[]; trendingItems: Product[] }>,
      {
        lang: Locale['lang'] | string | undefined;
        destination?: any;
        url: string;
      }
    >({
      query: ({ lang, destination = {}, url }) => ({
        url: `topSearches`,
        headers: {
          url,
          ...destination,
          lang,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductQuery,
  useGetTopSearchQuery,
  useGetSearchProductsQuery,
  useLazyGetSearchProductsQuery,
} = productApi;
