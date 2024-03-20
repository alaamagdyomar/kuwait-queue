import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { SendOutlined } from '@mui/icons-material';
import { useEffect } from 'react';
import { setUrl } from '@/redux/slices/appSettingSlice';

type Props = {
  element: Vendor;
  url: string;
};

const OrderTrack: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="orders"
    >
      <div className="flex flex-1 w-full flex-col justify-center items-start mt-8">
        <div className="flex flex-1 flex-col w-full border-b-8 border-gray-100 pb-6 mb-6 px-3">
          <h1 className="lg-mobile-xl-desktop font-bold">
            {t('order_received_we_have_got_ur_order')}
          </h1>
          <div className="flex flex-1 flex-row mt-2">
            <p className="sm-mobile-base-desktop text-gray-400 mr-2">
              {t('estimated_time')} :
            </p>{' '}
            <span className="font-bold">2:00-2:30 PM</span>
          </div>
          {/* order id  */}
          <div className="flex flex-1 w-full flex-row justify-between items-center h-1 my-6 space-x-2">
            <div className="w-1/3 bg-red-600 h-1"></div>
            <div className="w-1/3 bg-gray-200 h-1 "></div>
            <div className="w-1/3 bg-gray-200 h-1 "></div>
            <div className="w-1/3 bg-gray-200 h-1 "></div>
          </div>
          <div className="flex flex-1 flex-row text-gray-400">
            <p>Order Id :</p>
            <p>#34234324</p>
          </div>
        </div>
        {/*  Branch Name  */}
        <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 pb-6">
          <div className="capitlize lg-mobile-xl-desktop mb-4 font-bold">
            {t('pickup_from')}
          </div>
          <div className="flex w-full flex-row justify-between items-center ">
            <div className={`p-2 bg-gray-100 rounded-full`}>
              <MapPinIcon className="h-6 w-6 text-black" />
            </div>
            <div className="flex flex-1 w-full flex-col mx-3">
              <p className="flex flex-1 text-gray-400">{t('branch_address')}</p>
              <p>ManSource, El Geesh St</p>
            </div>
            <div className="flex ">
              <button className="btn bg-gray-100 p-3 flex justify-center items-center rounded-full xxs-mobile-xs-desktop ">
                <SendOutlined className="h-3 w-3 text-black mx-1" />
                {t('get_direction')}
              </button>
            </div>
          </div>
        </div>
        {/* your order */}
        <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 pb-6">
          <div className="capitlize lg-mobile-xl-desktop my-4 font-bold">
            {t('ur_order')}
          </div>
          {/*  item */}
          <div className="flex w-full flex-row justify-between items-start">
            <div className="flex flex-col  space-y-2">
              <div className="base-mobile-lg-desktop font-bold">Double Big Tasty x1</div>
              <div className="text-gray-400">x1 cole slaw sald</div>
              <div className="text-gray-400">any notes here</div>
            </div>
            <div>15 KD</div>
          </div>
        </div>
        {/* Payment details */}
        <div className="flex flex-1 flex-col w-full px-3 pb-6">
          <div className="capitlize lg-mobile-xl-desktop my-4 font-bold">
            {t('payment_details')}
          </div>
          {/*  item */}
          <div className="flex w-full flex-row justify-between items-start">
            <div className="flex flex-col  w-full space-y-2">
              <div className="flex flex-row justify-start items-center space-x-4">
                <BanknotesIcon className="h-6 w-6" />
                <div className="base-mobile-lg-desktop font-bold">{t('cash_on_delivery')}</div>
              </div>
              {/* subtotal */}
              <div className="flex flex-row justify-between items-center">
                <div className="">{t('sub_total')}</div>
                <div className="">2 {t('kd')}</div>
              </div>

              {/* delivery_fees */}
              <div className="flex flex-row justify-between items-center">
                <div className="">{t('delivery_fees')}</div>
                <div className="">2 {t('kd')}</div>
              </div>
              {/* total */}
              <div className="flex flex-row justify-between items-center">
                <div className="base-mobile-lg-desktop font-bold">{t('total')}</div>
                <div className="base-mobile-lg-desktop font-bold">100 {t('kd')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 absolute bottom-0 w-full border-t border-gray-200 p-4">
        <button
          className={`flex flex-row w-full justify-center items-center space-x-3 rounded-3xl bg-red-600 p-3 py-4 text-white capitlaize`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p className="sm-mobile-base-desktop text-center">{t('add_order')}</p>
        </button>
        <button
          className={`flex flex-row w-full justify-center items-center space-x-3 rounded-3xl bg-white p-3 py-4 text-red-600 border border-red-600 capitalize`}
        >
          <p className="sm-mobile-base-desktop text-center">{t('cancel order')}</p>
        </button>
      </div>
    </MainContentLayout>
  );
};

export default OrderTrack;

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
