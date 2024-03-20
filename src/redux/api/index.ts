import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiUrl, isLocal, xDomain } from '@/constants/index';
import { RootState } from '@/redux/store';
import { isNull } from 'lodash';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    prepareHeaders: async (
      headers,
      { getState, type, endpoint, extra }: RootState
    ) => {
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,Accept,Authentication,Content-Type'
      );
      headers.set(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      );
      headers.set('Cache-Control', 'no-store');
      // headers.set('lang', getState().locale.lang);
      // headers.set('Lang', getState().locale.lang);
      if (isLocal) {
        headers.set('url', xDomain);
      } else if (getState().appSetting.url !== null && getState().appSetting.url.length > 2) {
        headers.set('url', getState().appSetting.url);
      }
      if (!isNull(getState().customer.token)) {
        headers.set('Authorization', `Bearer ${getState().customer.token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Cart', 'Branch', 'Area', 'Product', 'Wishlist'],
  keepUnusedDataFor: 0,
  refetchOnReconnect: true,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({}),
});
