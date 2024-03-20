import { FC, useEffect, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isNull, map, startCase, upperFirst } from 'lodash';
import Link from 'next/link';
import {
  alexandriaFont,
  appLinks,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useRouter } from 'next/router';
import PickupIcon from '@/appIcons/pickup.svg';
import DeliveryIcon from '@/appIcons/delivery.svg';
import NonActiveDeliveryIcon from '@/appIcons/nonactive_delivery.svg';
import ActivePickupIcon from '@/appIcons/active_pickup.svg';
import {
  PlaceOutlined,
  WatchLaterOutlined,
  ArrowForwardIos,
  ArrowBackIos,
} from '@mui/icons-material';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import TextTrans from '../TextTrans';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import {
  destinationHeaderObject,
  resetDestination,
} from '@/redux/slices/searchParamsSlice';
import { wrapper } from '@/redux/store';
import { resetPreferences, setPreferences } from '@/redux/slices/customerSlice';
import moment, { Moment } from 'moment';

type Props = {
  url: string;
};

const ChangeMoodModal = ({ url }: Props): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const {
    searchParams: { destination, destination_type, method },
    modals: { areaBranchIsOpen },
    customer: { prefrences },
    locale: { lang, isRTL, dir },
  } = useAppSelector((state) => state);
  const [activeTabIndex, setActiveTabIndex] = useState<'delivery' | 'pickup'>(
    method === 'delivery' || method === null ? 'delivery' : 'pickup'
  );
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();
  const onRequestClose = () => {
    dispatch(setAreaBranchModalStatus(false));
  };
  const desObject = useAppSelector(destinationHeaderObject);

  const handleClick = (i: 'delivery' | 'pickup') => {
    setActiveTabIndex(i);
  };

  return (
    <>
      <MainModal isOpen={areaBranchIsOpen} closeModal={onRequestClose}>
        <div>
          <div className="flex w-full pb-5 px-4 pt-3">
            <div className="w-[5%]">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={onRequestClose}
              >
                <ExpandMoreIcon className="text-stone-600" />
              </button>
            </div>
            <h5
              className={`font-semibold capitalize text-center mx-auto`}
              suppressHydrationWarning={suppressText}
            >
              {t('where_&_when?')}
            </h5>
          </div>

          <div
            className="border-b-[1px] border-slate-200 flex justify-between"
            dir={dir}
          >
            <ul className="flex justify-between w-full">
              <li
                onClick={() => handleClick('delivery')}
                className={`${
                  activeTabIndex === 'delivery' ? 'active' : ''
                } w-1/2`}
              >
                <button
                  className={`md:ltr:mr-3 md:rtl:ml-3 capitalize xs-mobile-sm-desktop text-center w-full ${
                    activeTabIndex === 'pickup'
                      ? 'text-stone-500'
                      : 'font-semibold'
                  }`}
                  suppressHydrationWarning={suppressText}
                >
                  <span
                    className="flex justify-center items-center px-5 capitalize"
                    dir={dir}
                  >
                    {activeTabIndex === 'delivery' ? (
                      <DeliveryIcon />
                    ) : (
                      <NonActiveDeliveryIcon />
                    )}
                    <span className="px-3 text-base">{t('delivery')}</span>
                  </span>
                  {activeTabIndex === 'delivery' && (
                    <div
                      className="w-full h-1 rounded-tl rounded-tr mt-2"
                      style={{ backgroundColor: color }}
                    ></div>
                  )}
                </button>
              </li>
              <li
                onClick={() => handleClick('pickup')}
                className={`${
                  activeTabIndex === 'pickup' ? 'active' : ''
                } w-1/2`}
              >
                <button
                  className={`md:ltr:mr-3 md:rtl:ml-3 capitalize xs-mobile-sm-desktop text-center w-full ${
                    activeTabIndex === 'pickup'
                      ? 'text-stone-500'
                      : 'font-semibold'
                  }`}
                  suppressHydrationWarning={suppressText}
                >
                  <span className="flex justify-center items-center px-7 capitalize">
                    {activeTabIndex === 'pickup' ? (
                      <ActivePickupIcon />
                    ) : (
                      <PickupIcon />
                    )}
                    <span className="px-3 text-base">{t('pickup')}</span>
                  </span>
                  {activeTabIndex === 'pickup' && (
                    <div
                      className="w-full h-1 rounded-tl rounded-tr mt-2"
                      style={{ backgroundColor: color }}
                    ></div>
                  )}
                </button>
              </li>
            </ul>
          </div>
          <div>
            {activeTabIndex === 'delivery' && (
              <>
                <Link
                  href={appLinks.selectArea(``)}
                  className={`w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 capitalize`}
                  dir={dir}
                >
                  <div className="flex justify-between items-center">
                    <PlaceOutlined style={{ color }} />
                    <div className="px-3">
                      <h6
                        className="xs-mobile-sm-desktop text-stone-500 text-capitalize pb-1"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('delivering_to')}
                      </h6>
                      <p className="text-start capitalize">
                        {method === 'delivery' ? (
                          <TextTrans
                            en={destination.name_en}
                            ar={destination.name_ar}
                            length={30}
                          />
                        ) : (
                          t('select_address')
                        )}
                      </p>
                    </div>
                  </div>
                  {isRTL ? (
                    <ArrowBackIos className="text-zinc-500 mt-2" />
                  ) : (
                    <ArrowForwardIos className="text-zinc-500 mt-2" />
                  )}
                </Link>
              </>
            )}
            {activeTabIndex === 'pickup' && (
              <>
                <Link
                  href={appLinks.selectBranch.path}
                  className={`w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 capitalize ${
                    isRTL && 'flex-row-reverse'
                  }`}
                >
                  <div className="flex justify-between items-center" dir={dir}>
                    <PlaceOutlined style={{ color }} />
                    <div className="px-3">
                      <h6
                        className={`xs-mobile-sm-desktop text-stone-500 pb-1`}
                        suppressHydrationWarning={suppressText}
                      >
                        {upperFirst(`${t('pickup_from')}`)}
                      </h6>
                      <p className="capitalize">
                        {method === 'pickup' ? (
                          <TextTrans
                            en={destination.name_en}
                            ar={destination.name_ar}
                          />
                        ) : (
                          t('select_branch')
                        )}
                      </p>
                    </div>
                  </div>
                  {isRTL ? (
                    <ArrowBackIos className="text-zinc-500 mt-2" />
                  ) : (
                    <ArrowForwardIos className="text-zinc-500 mt-2" />
                  )}
                </Link>
              </>
            )}
            <Link
              href={appLinks.selectTime(method)}
              className={`w-full flex justify-between items-center p-5 border-b-[1px] border-gray-200 ${
                isNull(method) && 'pointer-events-none'
              }`}
              dir={dir}
            >
              <div className="flex justify-between items-center">
                <WatchLaterOutlined style={{ color }} />
                <div className="px-3 xs-mobile-sm-desktop">
                  <h6
                    className="xs-mobile-sm-desktop text-stone-500 pb-1 capitalize"
                    suppressHydrationWarning={suppressText}
                  >
                    {activeTabIndex === 'delivery'
                      ? t('delivery_in')
                      : t('pickup_in')}
                  </h6>
                  <p
                    suppressHydrationWarning={suppressText}
                    className="text-base capitalize"
                  >
                    {prefrences.type === 'delivery_now' ||
                    prefrences.type === 'pickup_now' ? (
                      <>
                        {prefrences.type
                          ? `${prefrences.time} ${t('minutes')}`
                          : t('select_time')}
                      </>
                    ) : prefrences.type === 'delivery_later' ||
                      prefrences.type === 'pickup_later' ? (
                      <div className={`flex flex-1`}>
                        <span className={`pe-2`}>{prefrences?.date}</span>
                        <span>
                          {moment(prefrences?.time, 'hh:mm a')
                            .locale(lang)
                            .format('hh:mm a')}
                        </span>
                      </div>
                    ) : (
                      t('select_time')
                    )}
                  </p>
                </div>
              </div>
              {isRTL ? (
                <ArrowBackIos className="text-zinc-500 mt-2" />
              ) : (
                <ArrowForwardIos className="text-zinc-500 mt-2" />
              )}
            </Link>
          </div>
          <div className="px-5 mt-10">
            <button
              className={`${mainBtnClass}`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
              onClick={onRequestClose}
              disabled={
                prefrences.date === '' ||
                prefrences.time === '' ||
                method !== activeTabIndex
              }
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </MainModal>
    </>
  );
};
export default ChangeMoodModal;

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
