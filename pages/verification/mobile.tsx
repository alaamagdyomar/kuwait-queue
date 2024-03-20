import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentModule, setUrl } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import React, { Fragment, useEffect, useState } from 'react';
import Mobile from '@/appImages/mobile.png';
import CustomImage from '@/components/CustomImage';
import {
  appLinks,
  imageSizes,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import SaveAddressIcon from '@/appIcons/save_address.svg';
import SaveContactInfo from '@/appIcons/save_contact_info.svg';
import ReOrderIcon from '@/appIcons/re-order_icon.svg';
import TrackOrderIcon from '@/appIcons/track_order_icon.svg';
import { map, upperFirst } from 'lodash';
import GuestOrderModal from '@/components/modals/GuestOrderModal';
import { useRouter } from 'next/router';
import { themeColor } from '@/redux/slices/vendorSlice';
import { NextPage } from 'next';

type Props = {
  url: string;
};

const MobileVerifications: NextPage<Props> = ({ url }): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    locale: {},
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const signInAdvantages = [
    { id: 1, icon: <SaveAddressIcon />, text: 'save_your_addresses' },
    { id: 2, icon: <SaveContactInfo />, text: 'save_your_contact_information' },
    { id: 3, icon: <ReOrderIcon />, text: 'one-tap_re-ordering' },
    { id: 4, icon: <TrackOrderIcon />, text: 'tracking_orders' },
  ];

  const handleSendOtp = () => {
    router.push(`${appLinks.otpVerification.path}`);
  };

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <Fragment>
      <MainHead title={t('mobile')} url={url} description={`${t('mobile')}`} />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="your_number"
      >
        <div className="h-[2px] w-full fixed top-0">
          <div
            className="h-[2px] w-1/3"
            style={{ backgroundColor: color }}
          ></div>
        </div>
        <div className="text-center w-full p-5">
          <div>
            <div className="flex justify-center">
              <CustomImage
                src={Mobile}
                alt="mobile"
                width={imageSizes.md}
                height={imageSizes.md}
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold" suppressHydrationWarning={suppressText}>
                {t('verify_your_mobile_number')}
              </h3>
              <p
                className="text-zinc-500 lowercase"
                suppressHydrationWarning={suppressText}
              >
                {upperFirst(
                  `${t('you_ll_receive_a_one_time_password_shortly.')}`
                )}
              </p>
            </div>
            <div className="py-5 text-start">
              <label
                htmlFor="phone number"
                className="text-zinc-500"
                suppressHydrationWarning={suppressText}
              >
                {t('phone_number')}
              </label>
              <PhoneInput
                defaultCountry="KW"
                value={''}
                onChange={(phone) => console.log({ phone })}
                className="focus:outline-none"
              />
            </div>
            <div className="px-4">
              {map(signInAdvantages, (advantage) => (
                <div className="flex pb-2" key={advantage.id}>
                  {advantage.icon}
                  <p className="px-2" suppressHydrationWarning={suppressText}>
                    {t(advantage.text)}
                  </p>
                </div>
              ))}
            </div>
            <button
              className={`mt-5 ${mainBtnClass}`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              onClick={handleSendOtp}
            >
              {t('send_otp')}
            </button>
            <button
              className="w-full underline text-center pt-5 mb-20"
              suppressHydrationWarning={suppressText}
              onClick={() => setIsOpen(true)}
            >
              {upperFirst(`${t('or_continue_as')}`)}
              <span className={`${'px-1'}`}>{upperFirst(`${t('guest')}`)}</span>
            </button>
            <GuestOrderModal
              url={url}
              isOpen={isOpen}
              closeModal={() => setIsOpen(false)}
            />
          </div>
        </div>
      </MainContentLayout>
    </Fragment>
  );
};
export default MobileVerifications;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
