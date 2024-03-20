import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useEffect, useState } from 'react';
import SuccessScheduled from '@/appImages/Scheduled_Successfully.svg';
import Success from '@/appImages/order_success.svg';
import { useTranslation } from 'react-i18next';
import { appLinks, suppressText } from '@/constants/*';
import OrderDetails from '@/components/checkout/OrderDetails';
import {
  useGetCartProductsQuery,
  useLazyGetCartProductsQuery,
} from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';
import { wrapper } from '@/redux/store';
import CartProduct from '@/components/widgets/product/CartProduct';
import PaymentSummary from '@/components/PaymentSummary';
import CashIcon from '@/appIcons/cash_checkout.svg';
import CreditIcon from '@/appIcons/credit_checkout.svg';
import KnetIcon from '@/appIcons/knet.svg';
import InfoIcon from '@/appIcons/info_scheduled_order.svg';
import { orderApi, useLazyCheckOrderStatusQuery } from '@/redux/api/orderApi';
import { Order } from '@/types/index';
import { apiSlice } from '@/redux/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { isUndefined, map } from 'lodash';
import NeedHelpIcon from '@/appIcons/need_help.svg';
import CancelIcon from '@/appIcons/cancel_order.svg';
import HelpModal from '@/components/modals/HelpModal';
import GuestOrderStatus from '@/components/order/GuestOrderStatus';
import TextTrans from '@/components/TextTrans';
import { setUrl } from '@/redux/slices/appSettingSlice';
import ContentLoader from '@/components/skeletons';
import { NextPage } from 'next';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import HomeIcon from '@/appIcons/home_success.svg';
import Link from 'next/link';
import {
  resetCheckBoxes,
  resetMeters,
  resetRadioBtns,
} from '@/redux/slices/productCartSlice';

type Props = {
  url: string;
  orderId: string;
};

const OrderSuccess: NextPage<Props> = ({
  url,
  orderId,
}): React.ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const {
    customer: { userAgent },
    cart: { promocode },
    vendor: { phone },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const [triggerGetOrderStatus, { data: order, isLoading }] =
    useLazyCheckOrderStatusQuery<{
      data: AppQueryResult<Order>;
      isLoading: boolean;
    }>();
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();

  useEffect(() => {
    triggerGetOrderStatus(
      {
        status: 'success',
        order_id: orderId,
        url,
        area_branch: destObj,
        userAgent,
      },
      false
    ).then(() =>
      triggerGetCartProducts(
        {
          userAgent,
          area_branch: destObj,
          PromoCode: promocode,
          url,
        },
        false
      ).then(() => {
        dispatch(resetRadioBtns());
        dispatch(resetCheckBoxes());
        dispatch(resetMeters());
      })
    );
  }, [orderId]);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <>
      {!isUndefined(order?.data) ? (
        <MainContentLayout
          showBackBtnHeader={true}
          backHome={true}
          currentModule={`${t('order')} #${order.data.order_id}`}
        >
          {isAuth &&
          (order.data.newOrderType === 'delivery_later' ||
            order.data.newOrderType === 'pickup_later') ? (
            <div className="px-5">
              <div className="flex justify-center py-5">
                <SuccessScheduled />
              </div>
              <div className="flex justify-center text-center mb-7">
                <p
                  suppressHydrationWarning={suppressText}
                  className="font-bold lg:w-3/4"
                >
                  {t('your_order_has_been_scheduled_successfully')}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5">
              <div className="flex justify-center py-5">
                <Success />
              </div>
              <div className="flex flex-col items-center justify-center text-center mb-7">
                <p
                  suppressHydrationWarning={suppressText}
                  className="font-semibold"
                >
                  {t('your_order_has_been_scheduled_successfully')}
                </p>
                <p
                  suppressHydrationWarning={suppressText}
                  className="text-[#544A45] lg:w-3/4 xs-mobile-sm-desktop py-1"
                >
                  {t('estimated_time')}{' '}
                  <span className="text-[#1A1615] font-bold">
                    :{' '}
                    {(order.data.newOrderType === 'delivery_later' ||
                      order.data.newOrderType === 'pickup_later') &&
                      new Date(
                        order.data.delivery_date_time
                      ).toLocaleDateString()}
                    {order.data.estimated_time?.from}{' '}
                    {order.data.estimated_time?.to &&
                      `- ${order.data.estimated_time?.to}`}
                  </span>
                </p>
                <p
                  suppressHydrationWarning={suppressText}
                  className="text-[#544A45] lg:w-3/4 xs-mobile-sm-desktop"
                >
                  {t('order_id')}: <span>#{order.data.order_id}</span>
                </p>
              </div>
            </div>
          )}

          {/* orderDetails */}
          <div className="p-5 border-b-4">
            <GuestOrderStatus order={order.data} />
          </div>

          {/* payment method */}
          <div className="p-5 border-b-4">
            <p
              suppressHydrationWarning={suppressText}
              className="font-bold mb-3"
            >
              {t('payment_method')}
            </p>
            {order.data.payment_method === 'C.O.D' && (
              <div className="flex items-center gap-x-2 xs-mobile-sm-desktop">
                <CashIcon />
                <p suppressHydrationWarning={suppressText}>
                  {t('cash_on_delivery')}
                </p>
              </div>
            )}
            {order.data.payment_method === 'knet' && (
              <div className="flex items-center gap-x-2 xs-mobile-sm-desktop">
                <KnetIcon />
                <p suppressHydrationWarning={suppressText}>
                  {t(order.data.payment_method)}
                </p>
              </div>
            )}
            {order.data.payment_method === 'visa' && (
              <div className="flex items-center gap-x-2 xs-mobile-sm-desktop">
                <CreditIcon />
                <p suppressHydrationWarning={suppressText}>
                  {t(order.data.payment_method)}
                </p>
              </div>
            )}
          </div>

          {/* items */}
          <div className="p-5 border-b-4">
            <p
              suppressHydrationWarning={suppressText}
              className="font-bold pb-5"
            >
              {t('order_items')}
            </p>
            {map(order.data.items, (item, index) => (
              <div
                key={index}
                className="flex justify-between items-start border-t-2 border-gray-200 py-5"
              >
                <div className="w-full">
                  <div className="flex pb-2  justify-between">
                    <div className="flex">
                      <TextTrans
                        en={item.item_en}
                        ar={item.item_ar}
                        length={30}
                      />
                      <span className="ms-1 xs-mobile-sm-desktop">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="xs-mobile-sm-desktop">
                      {item.total} {t('kd')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center">
                    {map(item.addon, (a) => (
                      <div key={a.addon_id} className="pe-3 ">
                        <div className="bg-gray-100 text-zinc-400 rounded-2xl text-center h-8 px-3 pt-1 mb-2">
                          <span className="pe-2 xs-mobile-sm-desktop">
                            x{a.addon_quantity}
                          </span>
                          <TextTrans
                            en={a.addon_name_en}
                            ar={a.addon_name_ar}
                            className="xxs-mobile-xs-desktop"
                            length={20}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className={`truncate xs-mobile-sm-desktop p-2`}>
                    {item.extra_notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5">
            <Link
              href={`${appLinks.home.path}`}
              suppressHydrationWarning={suppressText}
              className="flex items-end pb-5"
            >
              <HomeIcon />
              <span className="ps-3">{t('back_to_store')}</span>
            </Link>
            <button
              className="flex items-center pb-5"
              onClick={() => setIsOpen(true)}
            >
              <NeedHelpIcon />
              <span className="ps-3 pe-2 capitalize">{t('need_help?')}</span>
              <span>{t('contact_us')}</span>
            </button>
          </div>
          <HelpModal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            phone={phone}
          />
        </MainContentLayout>
      ) : (
        <MainContentLayout>
          <ContentLoader type="OrderSuccess" sections={1} />
        </MainContentLayout>
      )}
    </>
  );
};
export default OrderSuccess;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      const { orderId }: any = query;
      const url = req.headers.host;
      if (!url || !orderId) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
          orderId,
        },
      };
    }
);
