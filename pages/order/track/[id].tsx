import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { OrderTrack, Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import CashIcon from '@/appIcons/cash_checkout.svg';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { CottageOutlined, SendOutlined } from '@mui/icons-material';
import { orderApi, useLazyTrackOrderQuery } from '@/redux/api/orderApi';
import { useEffect, useState } from 'react';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  appLinks,
  googleMapUrl,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoAddresses from '@/appImages/no_address.svg';
import Link from 'next/link';
import {
  filter,
  isEmpty,
  isNull,
  kebabCase,
  lowerCase,
  map,
  snakeCase,
  toLower,
} from 'lodash';
import TextTrans from '@/components/TextTrans';
import { toggleShowHelpModal } from '@/redux/slices/modalsSlice';
import HelpModal from '@/components/modals/HelpModal';

type Props = {
  element: Vendor;
  order_code: string;
  url: string;
};

const OrderTrack: NextPage<Props> = ({
  element,
  url,
  order_code,
}): React.ReactElement => {
  const {
    locale: { isRTL },
    modals: { showHelpModal },
    vendor: { phone },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [triggerTrackOrder, { data: order, isSuccess, isLoading }] =
    useLazyTrackOrderQuery();
  const [currentOrder, setCurrentOrder] = useState<null | OrderTrack>(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<
    'pending' | 'in-progress' | 'shipped' | 'completed'
  >('pending');

  useEffect(() => {
    triggerTrackOrder({ order_code, url }).then((r) => {
      if (r.error && r.error.data) {
        dispatch(
          showToastMessage({
            type: 'error',
            content: toLower(snakeCase(r.error.data?.msg)),
          })
        );
      } else if (r && r.data && r.data.data) {
        setCurrentOrder(r.data?.data);
        setCurrentOrderStatus(r.data?.data.order_status);
      }
    });
  }, []);

  const handleDisplayAddress = (address: {}) => {
    const currentAddress = filter(
      map(
        address,
        (value, key) => key !== `type` && value !== null && `${key} : ${value}`
      ),
      (a) => a
    );
    return currentAddress.toString();
  };

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    () => dispatch(toggleShowHelpModal(false));
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="track_order"
      showHelpBtn={true}
    >
      {isNull(currentOrder) ? (
        <div className="flex flex-col space-y-4 absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center mx-4">
            <NoAddresses className="w-auto h-auto object-contain " />
            <p className=" text-extrabold">{t('order_not_found')}</p>
            <Link
              href={`${appLinks.guestAddress.path}`}
              className={`${mainBtnClass} flex flex-row justify-center items-center hidden`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
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
              <p className="w-fit  text-center mx-2">
                {t('add_new_address')}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 w-full flex-col justify-center items-start mt-8">
          <div className="flex flex-1 flex-col w-full border-b-8 border-gray-100 pb-6 px-3">
            <h1 className="lg-mobile-xl-desktop font-bold">
              {currentOrderStatus === 'pending' &&
                t('order_received_we_have_got_ur_order')}
              {currentOrder &&
                currentOrderStatus === 'in-progress' &&
                t('preparing_order_we_r_making_ur_food')}
              {currentOrder &&
                currentOrderStatus === 'completed' &&
                currentOrder.order_type === 'pickup' &&
                t('order_is_ready_for_pickup_we_r_waiting')}
              {currentOrder &&
                currentOrderStatus === 'completed' &&
                currentOrder.order_type === 'delivery' &&
                t('order_is_ready_for_delivery')}
              {currentOrder &&
                currentOrderStatus === 'shipped' &&
                t('order_is_shipped')}
              ...
            </h1>
            {currentOrder.estimated_time && (
              <div className="flex flex-1 flex-row mt-2">
                <p className=" text-gsm-mobile-base-desktop ray-400 mr-2">
                  {t('estimated_time')} :
                </p>{' '}
                <span className="font-bold ms-2">
                  {currentOrder?.estimated_time}
                </span>
              </div>
            )}
            {/* order id  */}
            <div className="flex flex-1 w-full flex-row justify-between items-center h-1 my-6 gap-2">
              {currentOrder && currentOrderStatus === 'pending' && (
                <>
                  <div className="w-1/3 bg-red-600 h-1"></div>
                  <div className="w-1/3 bg-gray-200 h-1 "></div>
                  <div className="w-1/3 bg-gray-200 h-1 "></div>
                </>
              )}
              {currentOrder && currentOrderStatus === 'in-progress' && (
                <>
                  <div className="w-1/3 bg-red-600 h-1"></div>
                  <div className="w-1/3 bg-red-600 h-1 "></div>
                  <div className="w-1/3 bg-gray-200 h-1 "></div>
                </>
              )}
              {currentOrder &&
                (currentOrderStatus === 'completed' ||
                  currentOrderStatus === 'shipped') && (
                  <>
                    <div className="w-1/3 bg-red-600 h-1"></div>
                    <div className="w-1/3 bg-red-600 h-1 "></div>
                    <div className="w-1/3 bg-red-600 h-1 "></div>
                  </>
                )}
            </div>
            <div className="flex flex-1 flex-row text-gray-400">
              <p>{t('order_id')} :</p>
              <p>#{currentOrder?.order_code}</p>
            </div>
          </div>
          {/*  Pick up (Branch)  */}
          {(currentOrder.order_type === 'pickup' ||
            currentOrder.order_type === 'pickup_now') && (
            <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 py-6">
              <div className="capitlize lg-mobile-xl-desktop mb-4 font-bold">
                {t('pickup_from')}
              </div>
              <div className="flex w-full flex-row justify-between items-center ">
                <div className={`p-2 bg-gray-100 rounded-full`}>
                  <MapPinIcon className="h-6 w-6 text-black" />
                </div>
                <div className="flex flex-1 w-full flex-col mx-3">
                  <p className="flex flex-1 text-gray-400">
                    {t('branch_address')}
                  </p>
                  {currentOrder.destination.address && (
                    <p className="flex flex-1 text-black xs-mobile-sm-desktop">
                      {currentOrder.destination.address}
                    </p>
                  )}

                  {/* <p>{handleDisplayAddress(currentOrder.address)}</p> */}
                </div>
                {currentOrder &&
                  currentOrder.destination.latitude &&
                  currentOrder.destination.longitude && (
                    <div className="flex ">
                      <a
                        target="blank"
                        href={googleMapUrl(
                          currentOrder.destination.latitude,
                          currentOrder.destination.longitude
                        )}
                        className="btn bg-gray-100 p-3 flex justify-center items-center rounded-full xxs-mobile-xs-desktop"
                      >
                        <div>{t('get_direction')}</div>
                        <div>
                          <SendOutlined
                            className={`h-3 w-3 text-black ms-2 ${
                              isRTL ? `rotate-180` : null
                            }`}
                          />
                        </div>
                      </a>
                    </div>
                  )}
              </div>
            </div>
          )}
          {/*  Delivery (Address)  */}
          {((currentOrder && currentOrder?.order_type === 'delivery') ||
            currentOrder?.order_type === 'delivery_now') && (
            <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 py-6">
              <p className="capitlize base-mobile-lg-desktop mb-4 font-bold">
                {t('delivery_location')}
              </p>
              <div className="flex w-full flex-row justify-between items-center ">
                <div className={`p-2 bg-gray-100 rounded-full`}>
                  <BuildingOfficeIcon className="h-6 w-6 text-black" />
                </div>
                <div className="flex flex-1 w-full flex-col mx-3">
                  <p className="flex flex-1 text-black">
                    {t(toLower(currentOrder?.customer?.address?.type))}
                  </p>
                  <p>{handleDisplayAddress(currentOrder?.customer.address)}</p>
                </div>
                {currentOrder.destination?.latitude &&
                  currentOrder.destination?.longitude && (
                    <div className="flex ">
                      <a
                        target="blank"
                        href={googleMapUrl(
                          currentOrder.destination.latitude,
                          currentOrder.destination.longitude
                        )}
                        className="btn bg-gray-100 p-3 flex justify-center items-center rounded-full xxs-mobile-xs-desktop hidden"
                      >
                        <div>{t('get_direction')}</div>
                        <div>
                          <SendOutlined
                            className={`h-3 w-3 text-black ms-2 ${
                              isRTL ? `rotate-180` : null
                            }`}
                          />
                        </div>
                      </a>
                    </div>
                  )}
              </div>
            </div>
          )}
          {/* your order */}
          <div className="flex flex-1 flex-col w-full px-3 border-b-8 border-gray-100 pb-6">
            <p className="capitlize base-mobile-lg-desktop my-4 font-bold">{t('ur_order')}</p>
            {/*  item */}
            {currentOrder &&
              currentOrder.products &&
              map(currentOrder.products, (p, i) => (
                <div
                  className="flex w-full flex-row justify-between items-start"
                  key={i}
                >
                  <div className="flex flex-col  space-y-2">
                    <div className="text-base font-bold">
                      <TextTrans
                        ar={`${p.item_ar} x${p.quantity}`}
                        en={`${p.item_en} x${p.quantity}`}
                        length={30}
                      />
                    </div>
                    {!isEmpty(p.addon) &&
                      map(p.addon, (a, i) => (
                        <TextTrans
                          key={i}
                          className={`text-gray-400`}
                          ar={`${a.name_ar} x${a.quantity}`}
                          en={`${a.name_en} x${a.quantity}`}
                          length={25}
                        />
                      ))}
                  </div>
                  <div>
                    {p.price} {t('kd')}
                  </div>
                </div>
              ))}
          </div>
          {/* Payment details */}
          <div className="flex flex-1 flex-col w-full px-3 pb-6">
            <p className="capitlize base-mobile-lg-desktop my-4 font-bold">
              {t('payment_details')}
            </p>
            {/*  item */}
            <div className="flex w-full flex-row justify-between items-start">
              <div className="flex flex-col  w-full space-y-2">
                <div className="flex flex-row justify-start items-center space-x-3">
                  <CashIcon />
                  <p className="text-base font-bold rtl:ps-1">
                    {t('cash_on_delivery')}
                  </p>
                </div>
                {/* subtotal */}
                <div className="flex flex-row justify-between items-center">
                  <div className="">{t('sub_total')}</div>
                  <div className="">
                    {currentOrder?.subtotal} {t('kd')}
                  </div>
                </div>
                {/* delivery_fees */}
                {currentOrder?.delivery_fees && (
                  <div className="flex flex-row justify-between items-center">
                    <div className="">{t('delivery_fees')}</div>
                    <div className="">
                      {currentOrder?.delivery_fees} {t('kd')}
                    </div>
                  </div>
                )}
                {/* discount */}
                {currentOrder?.discount && (
                  <div className="flex flex-row justify-between items-center">
                    <div className="">{t('discount')}</div>
                    <div className="">
                      {currentOrder?.discount} {t('kd')}
                    </div>
                  </div>
                )}

                {/* total */}
                <div className="flex flex-row justify-between items-center">
                  <div className="base-mobile-lg-desktop font-bold">{t('total')}</div>
                  <p className="text-base font-bold">
                    {currentOrder?.total} {t('kd')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <HelpModal
            isOpen={showHelpModal}
            onRequestClose={() => dispatch(toggleShowHelpModal(false))}
            phone={currentOrder.branch_phone ?? phone}
          />
        </div>
      )}
    </MainContentLayout>
  );
};

export default OrderTrack;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale, query }) => {
      const url = req.headers.host;
      if (!query.id) {
        return {
          notFound: true,
        };
      }
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
          order_code: query.id,
          url,
        },
      };
    }
);
