import { apiSlice } from './index';
import { AppQueryResult, Location } from '@/types/queries';
import { Locale } from '@/types/index';

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<
      AppQueryResult<Location[]>,
      { lang: Locale['lang'] | string | undefined; url: string; type: string }
    >({
      query: ({ lang, url, type }) => ({
        url: `locations`,
        headers: {
          lang,
          url,
        },
        params: { type },
      }),
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
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
  useLazyChangeLocationQuery,
} = locationApi;
