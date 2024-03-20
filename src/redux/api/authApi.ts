import { apiSlice } from './index';
import {
  AppQueryResult,
  PhoneCheck,
  Register,
  ResetPassword,
  VerifyCode,
} from '@/types/queries';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkPhone: builder.mutation<
      AppQueryResult<PhoneCheck>,
      {
        body: {
          phone: string;
          phone_country_code: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `phone-check`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    sendotp: builder.mutation<
      AppQueryResult<ResetPassword>,
      {
        
          phone: string;
        url: string;
      }
    >({
      query: ({ phone, url }) => ({
        url: `v2/user/reset/send-otp`,
        method: `POST`,
        headers: { url },
        body:{phone},
        validateStatus: (response, result) => result,
      }),
    }),
    verifyCode: builder.mutation<
      AppQueryResult<VerifyCode>,
      {
        body: {
          phone: string;
          phone_country_code: string;
          code: string;
          type: 'register' | 'reset';
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `verify`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    register: builder.mutation<
      AppQueryResult<Register>,
      {
        body: {
          phone: string;
          phone_country_code: string;
          name: string;
          email: string;
          password: string;
          password_confirmation: string;
          UserAgent: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `register`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    login: builder.mutation<
      AppQueryResult<Register>,
      {
        body: {
          phone: string;
          phone_country_code: string;
          UserAgent: string;
          password: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `login`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result.status,
      }),
    }),
    resetPassword: builder.mutation<
      AppQueryResult<ResetPassword>,
      {
        body: {
          phone: string;
          phone_country_code: string;
          new_password: string;
          confirm_password: string;
        };
        url: string;
      }
    >({
      query: ({ body, url }) => ({
        url: `v2/user/reset/password`,
        method: `POST`,
        headers: { url },
        body,
        validateStatus: (response, result) => result,
      }),
    }),
  }),
});

export const {
  useCheckPhoneMutation,
  useVerifyCodeMutation,
  useSendotpMutation,
  useRegisterMutation,
  useLoginMutation,
  useResetPasswordMutation,
} = authApi;
