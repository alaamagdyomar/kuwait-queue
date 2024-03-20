import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import {
  appLinks,
  deleteToken,
  errorMsgClass,
  imageSizes,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import MobileImg from '@/appImages/mobile.png';
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
import { useCheckPhoneMutation, useLoginMutation } from '@/redux/api/authApi';
import { themeColor } from '@/redux/slices/vendorSlice';
import { setCustomer, signIn, signOut } from '@/redux/slices/customerSlice';
import { checkPhone } from 'src/validations';
import { map, upperCase, upperFirst } from 'lodash';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  element: Vendor;
  url: string;
};

const GuestMobile: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const color = useAppSelector(themeColor);
  const { customer, locale } = useAppSelector((state) => state);
  const signInAdvantages = [
    { id: 1, icon: <SaveAddressIcon />, text: 'save_your_addresses' },
    { id: 2, icon: <SaveContactInfo />, text: 'save_your_contact_information' },
    { id: 3, icon: <ReOrderIcon />, text: 'one-tap_re-ordering' },
    { id: 4, icon: <TrackOrderIcon />, text: 'tracking_orders' },
  ];
  // const excludedCountries = ['IL'];
  const [triggerCheckPhone] = useCheckPhoneMutation();
  const [triggerLogin] = useLoginMutation();
  const filteredCountries = getCountries().filter(
    (country) => country === 'KW'
    // !excludedCountries.includes(country)
  );
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkPhone),
    defaultValues: {
      phone: customer.phone ?? ``,
      fullPhoneNo: ``,
    },
  });

  console.log('errors', errors);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const handleGuest = async () => {
    setIsOpen(true);
  };

  const onSubmit = async (body: any) => {
    const parsedPhoneNumber: any = parsePhoneNumber(`${body.fullPhoneNo}`);
    const userPhone = parsedPhoneNumber
      ? parsedPhoneNumber?.nationalNumber
      : ``;
    const userCountryCode = `+${parsedPhoneNumber?.countryCallingCode}`;
    if (parsedPhoneNumber && parsedPhoneNumber.countryCallingCode) {
      await triggerCheckPhone({
        body: {
          phone: parsedPhoneNumber.nationalNumber,
          phone_country_code: `+${parsedPhoneNumber.countryCallingCode}`,
        },
        url,
      }).then(async (r: any) => {
        if (r.error) {
          router.push(appLinks.otpVerification('register'));
        } else {
          router.push(appLinks.userLogin.path);
        }
        dispatch(
          setCustomer({
            countryCode: `+${parsedPhoneNumber.countryCallingCode}`,
            phone: parsedPhoneNumber.nationalNumber,
          })
        );
      });
    } else {
      dispatch(showToastMessage({ content: 'invalid_phone', type: 'error' }));
    }
  };

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="your_number">
      {/*  no address case */}
      <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center">
        <div className="pt-8">
          <CustomImage
            alt={t('mobile')}
            src={MobileImg}
            width={imageSizes.md}
            height={imageSizes.md}
          />
        </div>
        <div className="text-center">
          <h3
            className="font-bold pb-2"
            suppressHydrationWarning={suppressText}
          >
            {t('verify_your_mobile_number')}
          </h3>
          <span
            className="text-[#877D78] xs-mobile-sm-desktop lowercase"
            suppressHydrationWarning={suppressText}
          >
            {upperFirst(`${t('you_ll_receive_a_one_time_password_shortly.')}`)}
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4">
          <div className="pt-3 pb-5">
            <label
              htmlFor="phone"
              className="text-zinc-500 xs-mobile-sm-desktop"
              suppressHydrationWarning={suppressText}
            >
              {t('phone_number')}
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                validate: (value) => isValidPhoneNumber(value),
              }}
              render={({ field: { onChange } }) => (
                <PhoneInput
                  // onChange={onChange}
                  onChange={(e: string) => {
                    setValue('phone', e?.slice(4));
                    setValue('fullPhoneNo', e);
                  }}
                  defaultCountry="KW"
                  // countries={['KW']}
                  placeholder={t('phone_placeholder')}
                  id="phone"
                  dir={locale.dir}
                  className="focus:outline-none mt-2 border-b border-gray-100 pb-3"
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = '#3f3f46')
                  }
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                  countries={filteredCountries}
                />
              )}
            />
            {errors?.phone?.message && (
              <div className={`${errorMsgClass}`}>
                {errors?.phone?.message && (
                  <p suppressHydrationWarning={suppressText}>
                    {t('phone_number_must_be_between_9_and_15_number')}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="px-4">
            {map(signInAdvantages, (advantage) => (
              <div className="flex pb-3" key={advantage.id}>
                {advantage.icon}
                <span
                  className="px-3 xs-mobile-sm-desktop text-zinc-800"
                  suppressHydrationWarning={suppressText}
                >
                  {t(advantage.text)}
                </span>
              </div>
            ))}
          </div>
          <button
            className={`${mainBtnClass} flex flex-row justify-center items-center my-4`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
            type="submit"
          >
            {t('sign_in_up')}
          </button>
        </form>
        <button
          className="w-full underline text-center pb-10"
          suppressHydrationWarning={suppressText}
          onClick={handleGuest}
        >
          {upperFirst(`${t('or_continue_as_guest')}`)}
        </button>
        <GuestOrderModal
          url={url}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </div>
    </MainContentLayout>
  );
};

export default GuestMobile;

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
