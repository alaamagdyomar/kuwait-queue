import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { UserAddressFields, Vendor } from '@/types/index';
import {
  appLinks,
  errorMsgClass,
  imageSizes,
  mainBtnClass,
  setToken,
  suppressText,
} from '@/constants/*';
import PasswordImg from '@/appIcons/password.png';
import CustomImage from '@/components/CustomImage';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import PhoneInput, {
  parsePhoneNumber,
  isValidPhoneNumber,
  getCountries,
} from 'react-phone-number-input';
import SaveAddressIcon from '@/appIcons/save_address.svg';
import SaveContactInfo from '@/appIcons/save_contact_info.svg';
import ReOrderIcon from '@/appIcons/re-order_icon.svg';
import TrackOrderIcon from '@/appIcons/track_order_icon.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import {
  useCheckPhoneMutation,
  useLoginMutation,
  useResetPasswordMutation,
  useSendotpMutation,
} from '@/redux/api/authApi';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  setCustomer,
  setCustomerAddress,
  signIn,
} from '@/redux/slices/customerSlice';
import { checkPhone, loginSchema } from 'src/validations';
import {
  filter,
  first,
  isNull,
  isUndefined,
  map,
  omit,
  upperCase,
  upperFirst,
} from 'lodash';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import * as yup from 'yup';
import ShowPasswordIcon from '@/appIcons/show_password.svg';
import HidePasswordIcon from '@/appIcons/hide_password.svg';
import { useLazyGetCartProductsQuery } from '@/redux/api/cartApi';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
// import { AppQueryResult } from '@/types/queries';
// import { useLazyGetAddressesQuery } from '@/redux/api/addressApi';

type Props = {
  element: Vendor;
  url: string;
};

const UserPassword: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const color = useAppSelector(themeColor);
  const {
    customer,
    locale: { isRTL },
    searchParams: { destination },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);

  const [isResetPassword, setIsResetPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const excludedCountries = ['IL'];
  const [triggerLogin] = useLoginMutation();
  const [triggerResetPassword] = useResetPasswordMutation();
  const [triggerGetCart] = useLazyGetCartProductsQuery();
  const [triggerSendOtp] = useSendotpMutation();

  const togglePasswordVisibility = (id: string) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema(isResetPassword)),
    defaultValues: {
      phone: customer.phone ?? '',
      password: '',
      new_password: '',
      confirmation_password: '',
    },
  });

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    if (router.query && router.query.reset && router.query.reset === '1') {
      setIsResetPassword(true);
    }
  }, []);

  const onSubmit = async (body: any) => {
    if (isResetPassword) {
      await triggerResetPassword({
        body: {
          phone: customer.phone,
          phone_country_code: customer.countryCode,
          new_password: body.new_password,
          confirm_password: body.confirmation_password,
        },
        url,
      }).then(async (r) => {
        if (r && r.data) {
          await triggerLogin({
            body: {
              phone: customer.phone,
              phone_country_code: customer.countryCode,
              UserAgent: customer.userAgent,
              password: body.new_password,
            },
            url,
          }).then((r: any) => {
            if (r.error) {
              dispatch(
                showToastMessage({
                  content: r.error.data.msg,
                  type: `error`,
                })
              );
            } else {
              dispatch(
                showToastMessage({
                  content: `password_changed_successfully`,
                  type: 'success',
                })
              );
              dispatch(setCustomer(omit(r.data.data.user, 'address')));
              dispatch(signIn(r.data.data.token));
              setToken(r.data.data.token);
              if (
                r.data &&
                r.data.data &&
                r.data.data.user &&
                r.data.data.user.address
              ) {
                const address = first(
                  filter(
                    r.data.data.user.address,
                    (a) => a.address?.area_id === destination?.id.toString()
                  )
                );
                if (address) {
                  dispatch(setCustomerAddress(address));
                }
              }
              triggerGetCart(
                {
                  userAgent: customer.userAgent,
                  area_branch: destObj,
                  PromoCode: '',
                  url,
                },
                false
              ).then((r: any) => {
                if (r.data && r.data.data && r.data.data.Cart) {
                  if (r.data.data.Cart.length > 0) {
                    router.push(`${appLinks.cart.path}`);
                  } else {
                    router.push('/');
                  }
                }
              });
            }
          });
        } else {
          dispatch(
            showToastMessage({
              content: r?.message,
              type: 'error',
            })
          );
        }
      });
    } else {
      await triggerLogin({
        body: {
          phone: customer.phone,
          phone_country_code: customer.countryCode,
          UserAgent: customer.userAgent,
          password: body.password,
        },
        url,
      }).then((r: any) => {
        if (r.error) {
          dispatch(
            showToastMessage({
              content: `the_password_you_entered_is_incorrect`,
              type: `error`,
            })
          );
        } else {
          dispatch(setCustomer(omit(r.data.data.user, 'address')));
          dispatch(signIn(r.data.data.token));
          setToken(r.data.data.token);
          if (
            r.data &&
            r.data.data &&
            r.data.data.user &&
            r.data.data.user.address
          ) {
            const address = first(
              filter(
                r.data.data.user.address,
                (a) => a.address?.area_id === destination?.id.toString()
              )
            );
            if (address && !isUndefined(address)) {
              dispatch(setCustomerAddress(address));
            }
          }
          //  check if cart empty go home if not go to checkout
          triggerGetCart(
            {
              userAgent: customer.userAgent,
              area_branch: destObj,
              PromoCode: '',
              url,
            },
            false
          ).then((r: any) => {
            if (r.data && r.data.data && r.data.data.Cart) {
              if (r.data.data.Cart.length > 0) {
                router.push(`${appLinks.cart.path}`);
              } else {
                router.push('/');
              }
            }
          });
        }
      });
    }
  };
  const handleForgetPassword = () => {
    triggerSendOtp({ phone: customer.phone, url }).then((r: any) => {
      // setIsResetPassword(true);
      if (r.data.status) {
        router.push(appLinks.otpVerification('reset'));
      }
    });
  };

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="enter_password"
    >
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center">
        <div className="pt-8">
          <CustomImage
            alt={t('password')}
            src={PasswordImg}
            width={imageSizes.md}
            height={imageSizes.md}
          />
        </div>
        <div className="text-center">
          <h3
            className="font-bold pb-2"
            suppressHydrationWarning={suppressText}
          >
            {t('enter_your_password_to_continue')}
          </h3>
          <span
            className="text-[#877D78] xs-mobile-sm-desktop lowercase"
            suppressHydrationWarning={suppressText}
          >
            {upperFirst(
              `${t('please_enter_your_password_or_forget_password.')}`
            )}
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4">
          {!isResetPassword && (
            <>
              <div className="relative pb-4 mt-5">
                <label className="text-gray-500" htmlFor="password">
                  {t('your_password')}
                </label>
                <input
                  type={passwordVisibility['password'] ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  className="block px-2.5 pb-2.5 pt-3 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer"
                  style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                  onFocus={(e) => (e.target.style.borderBottomColor = color)}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                  placeholder=" "
                />
                <div
                  className={`absolute bottom-7 cursor-pointer ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {passwordVisibility['password'] ? (
                    <ShowPasswordIcon />
                  ) : (
                    <HidePasswordIcon />
                  )}
                </div>
              </div>
              {errors?.password?.message && (
                <div className={`${errorMsgClass} w-full text-start pt-2 ps-2`}>
                  {errors?.password?.message && (
                    <p suppressHydrationWarning={suppressText}>
                      {t('password_is_required')}
                    </p>
                  )}
                </div>
              )}
              <button
                className="capitalize text-gray-500"
                onClick={handleForgetPassword}
              >
                {t('forget_password?')}
              </button>
            </>
          )}
          {isResetPassword && (
            <>
              <div className="relative pb-4 mt-5">
                <label className="text-gray-500" htmlFor="new_password">
                  {t('new_password')}
                </label>
                <input
                  type={
                    passwordVisibility['new_password'] ? 'text' : 'password'
                  }
                  id="new_password"
                  {...register('new_password')}
                  className="block px-2.5 pb-2.5 pt-3 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer"
                  style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                  onFocus={(e) => (e.target.style.borderBottomColor = color)}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                  placeholder=" "
                />
                <div
                  className={`absolute bottom-7 cursor-pointer ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}
                  onClick={() => togglePasswordVisibility('new_password')}
                >
                  {passwordVisibility['new_password'] ? (
                    <ShowPasswordIcon />
                  ) : (
                    <HidePasswordIcon />
                  )}
                </div>
              </div>
              {errors?.new_password?.message && (
                <div className={`${errorMsgClass} w-full text-start pt-2 ps-2`}>
                  <p suppressHydrationWarning={suppressText}>
                    {t('new_password_is_required')}
                  </p>
                </div>
              )}

              <div className="relative pb-4 mt-5">
                <label
                  className="text-gray-500"
                  htmlFor="confirmation_password"
                >
                  {t('confirm_password')}
                </label>
                <input
                  type={
                    passwordVisibility['confirmation_password']
                      ? 'text'
                      : 'password'
                  }
                  id="confirmation_password"
                  {...register('confirmation_password')}
                  className="block px-2.5 pb-2.5 pt-3 w-full text-black bg-gray-50 border-b-[2px] appearance-none focus:outline-none focus:ring-0  peer"
                  style={{ borderBottomColor: '#e5e7eb', caretColor: color }}
                  onFocus={(e) => (e.target.style.borderBottomColor = color)}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                  placeholder=" "
                />
                <div
                  className={`absolute bottom-7 cursor-pointer ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}
                  onClick={() =>
                    togglePasswordVisibility('confirmation_password')
                  }
                >
                  {passwordVisibility['confirmation_password'] ? (
                    <ShowPasswordIcon />
                  ) : (
                    <HidePasswordIcon />
                  )}
                </div>
              </div>
              {errors?.confirmation_password?.message && (
                <div className={`${errorMsgClass} w-full text-start pt-2 ps-2`}>
                  <p suppressHydrationWarning={suppressText}>
                    {errors?.confirmation_password?.message?.includes('Ref')
                      ? t('confirm_password_doesnt_match_new_password')
                      : t('confirm_password_is_required')}
                  </p>
                </div>
              )}
            </>
          )}
          <button
            className={`${mainBtnClass} flex flex-row justify-center items-center my-2`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
            type="submit"
          >
            {isResetPassword ? t('save') : t('continue')}
          </button>
        </form>
        {isResetPassword && (
          <div className="w-full px-4">
            <button
              className={`${mainBtnClass} flex flex-row  justify-center items-center  bg-gray-300`}
              // style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              onClick={() => setIsResetPassword(false)}
            >
              <span className="text-black">{t('cancel')}</span>
            </button>
          </div>
        )}
      </div>
    </MainContentLayout>
  );
};

export default UserPassword;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale, url })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data || !url) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url,
        },
      };
    }
);
