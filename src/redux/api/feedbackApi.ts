import { apiSlice } from './index';
import { AppQueryResult, Feedback } from '@/types/queries';

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation<
      AppQueryResult<Feedback>,
      {
        body: {
          user_name: string;
          rate: number;
          note: string;
          phone: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `feedbacks/create`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
  }),
});

export const { useCreateFeedbackMutation } = feedbackApi;
