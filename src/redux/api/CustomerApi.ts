import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';
import { CustomerInfo } from '@/types/index';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveCustomerInfo: builder.mutation<
      AppQueryResult<any>,
      {
        body: CustomerInfo;
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `customer-info`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
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
    getWishListProducts: builder.query<AppQueryResult<any>, { url: string }>({
      query: ({ url }) => ({
        url: `getWishList`,
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      providesTags: ['Wishlist'],
    }),
    deleteFromWishList: builder.mutation<
      AppQueryResult<{ Id: string }>,
      { url: string; product_id: string }
    >({
      query: ({ url, product_id }) => ({
        url: `removeProductWishList`,
        params: { product_id },
        headers: {
          url,
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
      invalidatesTags: ['Product', 'Wishlist'],
    }),
    addToWishList: builder.mutation<
      AppQueryResult<any>,
      {
        body: any;
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `addToWishList`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
      invalidatesTags: ['Product', 'Wishlist'],
    }),
  }),
});

export const {
  useAddToWishListMutation,
  useSaveCustomerInfoMutation,
  useLazyCreateTempIdQuery,
  useGetWishListProductsQuery,
  useDeleteFromWishListMutation,
} = customerApi;
