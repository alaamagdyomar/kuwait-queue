import { StaticPage } from '@/types/index';
import { apiSlice } from './index';
import { AppQueryResult } from '@/types/queries';

export const staticPagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorStaticPages: builder.query<
      AppQueryResult<StaticPage[]>,
      {
        url: string | undefined;
      }
    >({
      query: ({ url }) => ({
        url: `staticPages`,
        headers: { url },
        validateStatus: (response, result) =>
          response.status == 200 && result.status
      }),
    }),
  }),
});

export const { useLazyGetVendorStaticPagesQuery } = staticPagesApi;