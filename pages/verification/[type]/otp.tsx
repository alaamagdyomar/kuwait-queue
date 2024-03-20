import CustomImage from '@/components/CustomImage';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OtpVerify from '@/appImages/otp_verify.png';
import {
  appLinks,
  imageSizes,
  mainBtnClass,
  setToken,
  suppressText,
  toEn,
} from '@/constants/*';
import { upperCase, upperFirst } from 'lodash';
import OtpInput from 'react18-input-otp';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  useCheckPhoneMutation,
  useLoginMutation,
  useVerifyCodeMutation,
} from '@/redux/api/authApi';
import { setCustomer, signIn } from '@/redux/slices/customerSlice';
import { NextPage } from 'next';

type Props = {
  url: string;
  type: 'register' | 'reset';
};

const OtpVerifications: NextPage<Props> = ({
  url,
  type,
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const [otp, setOtp] = useState<string>(``);
  const color = useAppSelector(themeColor);
  const {
    customer: { phone, countryCode, userAgent },
  } = useAppSelector((state) => state);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [codeVerification] = useVerifyCodeMutation();
  const [triggerCheckPhone] = useCheckPhoneMutation();
  const [triggerLogin] = useLoginMutation();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const verifyCode = async () => {
    await codeVerification({
      body: {
        phone,
        phone_country_code: countryCode,
        code: otp,
        type,
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data.status) {
        if (type === 'register') {
          router.push(`${appLinks.accountInfo.path}`);
        } else if (type === 'reset') {
          // console.log('r', r, type);
          router.push(`${appLinks.userLogin.path}?reset=1`);
        }
      } else {
        dispatch(
          showToastMessage({
            content: 'invalid_otp',
            type: 'error',
          })
        );
      }
    });
  };

  const resendOtp = async () => {
    setMinutes(0);
    setSeconds(59);
    await triggerCheckPhone({
      body: {
        phone,
        phone_country_code: countryCode,
      },
      url,
    }).then(async (r: any) => {
      if (r.error) {
        router.push(appLinks.otpVerification.path);
      } else {
        await triggerLogin({
          body: {
            phone,
            phone_country_code: countryCode,
            UserAgent: userAgent,
          },
          url,
        }).then((r: any) => {
          dispatch(setCustomer(r.data.data.user));
          dispatch(signIn(r.data.data.token));
          setToken(r.data.data.token);
        });
      }
    });
  };

  const handleChangeOtp = (enteredOtp: string) => {
    setOtp(toEn(enteredOtp));
  };

  console.log('countryCode', countryCode);
  return (
    <Fragment>
      <MainHead
        title={t('otp_verification')}
        url={url}
        description={`${t('otp_verification')}`}
      />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="otp_verification"
      >
        <div className="flex justify-center p-5">
          <div className="w-full">
            <div className="flex justify-center">
              <CustomImage
                src={OtpVerify}
                alt="otp verification"
                width={imageSizes.sm}
                height={imageSizes.sm}
              />
            </div>
            <div className="text-center">
              <h3
                className="font-bold base-mobile-lg-desktop pb-2"
                suppressHydrationWarning={suppressText}
              >
                {t('confirmation_your_number')}
              </h3>
              <div className="text-[#877D78] lowercase ">
                <p
                  className="text-center pb-1"
                  suppressHydrationWarning={suppressText}
                >
                  {upperFirst(
                    `${t('please_enter_the_4-digit_code_that_was_sent')}`
                  )}
                </p>
                <p>
                  <span>{t('to_the_number')}</span>
                  <span className="text-black px-2">
                    {countryCode} {phone}
                  </span>
                </p>
              </div>
            </div>
            <div className="w-[90%] mx-auto flex justify-between text-center pt-3 pb-5 lowercase">
              <span
                className="text-[#877D78]"
                suppressHydrationWarning={suppressText}
              >
                {t('you_ll_receive_code_in')}
                {seconds > 0 || minutes > 0 ? (
                  <span className="px-1">
                    {minutes < 10 ? `0${minutes}` : `0${seconds}`}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                  </span>
                ) : (
                  <span className="px-1">1:00</span>
                )}
              </span>
              <button
                disabled={seconds > 0 || minutes > 0}
                className="underline capitalize disabled:!bg-transparent disabled:!text-black"
                suppressHydrationWarning={suppressText}
                onClick={resendOtp}
              >
                {t('resend')}
              </button>
            </div>
            <div className="d-flex justify-content-center">
              <OtpInput
                value={otp}
                onChange={handleChangeOtp}
                numInputs={4}
                successStyle="success"
                inputStyle={{
                  backgroundColor: '#F5F5F5',
                  width: '70px',
                  height: '70px',
                  margin: '10px',
                  borderRadius: '10px',
                  caretColor: '#DC2626',
                  fontSize: '30px',
                  outline: 'none',
                  borderColor: 'transparent',
                }}
                containerStyle={{
                  justifyContent: 'center',
                }}
              />
            </div>
            <div className="flex flex-1">
              <button
                className={`mt-5 mb-20 ${mainBtnClass}`}
                style={{ backgroundColor: color }}
                suppressHydrationWarning={suppressText}
                onClick={verifyCode}
              >
                {t('verify')}
              </button>
            </div>
          </div>
        </div>
      </MainContentLayout>
    </Fragment>
  );
};
export default OtpVerifications;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      if (!req.headers.host || !query.type) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
          type: query.type,
        },
      };
    }
);
