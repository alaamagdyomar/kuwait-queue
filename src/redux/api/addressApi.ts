import { apiSlice } from './index';
import { Address, AppQueryResult } from '@/types/queries';
import { Prefrences, UserAddressFields } from '@/types/index';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAddress: builder.mutation<
      AppQueryResult<Address>,
      {
        body: {
          address_type: number | string;
          longitude: number | string;
          latitude: number | string;
          customer_id: number | string;
          address: { [key: string]: any };
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `user/address/create`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response: { status: number; }, result: { status: any; }) =>
          response.status === 200 && result.status,
      }),
    }),
    checkTimeAvilability: builder.mutation<
      AppQueryResult<any>,
      {
        params: Prefrences;
        process_type: string;
        area_branch: string;
        url: string;
      }
    >({
      query: ({ params, process_type, area_branch, url }) => ({
        url: `checkAvailableTime`,
        params: { ...params },
        headers: {
          ...(process_type === 'delivery' && { 'x-area-id': area_branch }),
          ...(process_type === 'pickup' && { 'x-branch-id': area_branch }),
          url,
        },
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
    getAddresses: builder.query<
      AppQueryResult<UserAddressFields[]>,
      {
        url: string;
        api_token?: string | undefined;
      }
    >({
      // headers.set('Authorization', `Bearer ${getState().customer.token}`);
      query: ({ url, api_token }) => ({
        url: `user/address`,
        method: 'GET',
        headers: {
          url,
          ...(api_token && { 'Authorization': `Bearer ${api_token}` }),
        },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
    updateAddress: builder.mutation<
      AppQueryResult<Address>,
      {
        body: {
          address_id: string;
          address_type: string;
          address: any;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `user/address/update`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
    deleteAddress: builder.mutation<
      AppQueryResult<Address>,
      {
        params: {
          address_id: number
        };
        url: string;
      }
    >({
      query: ({ params, url }) => ({
        url: `user/address/delete`,
        method: `POST`,
        headers: { url },
        params: { ...params },
        validateStatus: (response, result) =>
          response.status === 200 && result.status,
      }),
    }),
    getAddressesById: builder.query<
      AppQueryResult<UserAddressFields[]>,
      {
        address_id: string;
        url: string;
      }
    >({
      query: ({ address_id , url }) => ({
        url: `user/showUserAddress`,
        headers: { url },
        params : { address_id },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),

    getAddressesByType: builder.query<
      AppQueryResult<Address>,
      {
        type: string;
        url: string;
      }
    >({
      query: ({ type, url }) => ({
        url: `user/address`,
        headers: { url },
        params: { type },
        validateStatus: (response, result) =>
          response.status == 200 && result.status,
      }),
    }),
  }),
});

export const {
  useCreateAddressMutation,
  useCheckTimeAvilabilityMutation,
  useGetAddressesQuery,
  useLazyGetAddressesQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useLazyGetAddressesByIdQuery,
  useGetAddressesByTypeQuery,
} = addressApi;
