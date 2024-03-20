import MainContentLayout from '@/layouts/MainContentLayout';
import React, { Suspense, startTransition, useEffect } from 'react';
import FailureIcon from '@/appImages/failed.svg';
import { useTranslation } from 'react-i18next';
import { appLinks, mainBtnClass, submitBtnClass, suppressText } from '@/constants/*';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { Order, ProductCart, ServerCart } from '@/types/index';
import { wrapper } from '@/redux/store';
import PaymentSummary from '@/components/PaymentSummary';
import CartProduct from '@/components/widgets/product/CartProduct';
import CallusIcon from '@/appIcons/call_us_green.svg';
import { NextPage } from 'next';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { useLazyCheckOrderStatusQuery } from '@/redux/api/orderApi';
import { isUndefined, map } from 'lodash';
import TextTrans from '@/components/TextTrans';
import ContentLoader from '@/components/skeletons';
import DownloadIcon from '@/appIcons/download.svg';
import Link from 'next/link';
import Reload from '@/appIcons/reload.svg';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = { url: string; orderId: string };
const OrderFailure: NextPage<Props> = ({
  url,
  orderId,
}): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const color = useAppSelector(themeColor);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const DetailComponent = ({
    title,
    info,
  }: {
    title: string;
    info: string;
  }) => {
    return (
      <div className="flex justify-between items-center py-3 border-b-2 xs-mobile-sm-desktop">
        <p suppressHydrationWarning={suppressText} className="text-[#877D78]">
          {t(title)}
        </p>
        <p suppressHydrationWarning={suppressText} className="">
          {info}
        </p>
      </div>
    );
  };
  const [triggerGetOrderStatus, { data: order, isLoading }] =
    useLazyCheckOrderStatusQuery<{
      data: AppQueryResult<Order>;
      isLoading: boolean;
    }>();
  useEffect(() => {
    startTransition(() => {
      triggerGetOrderStatus(
        {
          status: 'failure',
          order_id: orderId,
          url,
          area_branch: destObj,
          userAgent,
        },
        false
      );
    });
  }, [orderId]);

  return (
    <Suspense>
      {!isUndefined(order?.data) ? (
        <MainContentLayout
          showBackBtnHeader={true}
          currentModule={`${t('order')} #${order?.data.order_id}`}
        >
          <div className="px-5">
            <div className="flex justify-center py-5">
              <FailureIcon />
            </div>
            <div className="flex flex-col items-center justify-center text-center mb-7">
              <p
                suppressHydrationWarning={suppressText}
                className="font-bold lg:w-3/4"
              >
                {t('the_payment_process_has_failed')}
              </p>
              <p
                suppressHydrationWarning={suppressText}
                className="text-[#544A45] lg:w-3/4 py-2 xxs-mobile-xs-desktop"
              >
                {t('failure_msg')}
              </p>
              <p className="text-[#544A45] lg:w-3/4 py-2 xxs-mobile-xs-desktop">{t('we_advise_that_saving_the_receipt')}</p>
            </div>

            <div className="flex justify-between items-center">
              <h4>{t('order_receipt')}</h4>
              <button
                className="bg-stone-100 rounded-full px-4 py-2 xs-mobile-sm-desktop flex items-center"
                onClick={() => window.print()}
              >
                <DownloadIcon />
                <span className="px-1">{t('save_receipt')}</span>
              </button>
            </div>
            <DetailComponent
              title="order_id"
              info={`${t('order')} #${order.data.order_id}`}
            />
            <DetailComponent
              title="date_time"
              info={order.data.delivery_date_time}
            />
            <DetailComponent
              title="order_type"
              info={`${t(order.data.orderType)}`}
            />
            <DetailComponent
              title="contact_info"
              info={`${order.data.customer.name} ${order.data.customer.phone}`}
            />
          </div>
          {/* items */}
          <div className=" p-5">
            <p
              suppressHydrationWarning={suppressText}
              className="mb-2 text-[#877D78]"
            >
              {t('order_items')}
            </p>
            {map(order.data.items, (item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-t-2 border-gray-200 py-5"
              >
                <div className="w-full">
                  <div className="flex pb-2 justify-between">
                    <h5 className="pe-6">
                      <TextTrans en={item.item_en} ar={item.item_ar} />
                    </h5>
                    <span className="xs-mobile-sm-desktop">x{item.quantity}</span>
                  </div>
                  <div className="flex flex-wrap items-center">
                    {map(item.addon, (a) => (
                      <div key={a.addon_id} className="pe-3 pb-4">
                        <div className="bg-gray-100 text-zinc-400 rounded-2xl text-center h-8 px-3 pt-1 mb-2">
                          <span className="pe-2 xs-mobile-sm-desktop">
                            x{a.addon_quantity}
                          </span>
                          <TextTrans
                            en={a.addon_name_en}
                            ar={a.addon_name_ar}
                            className="xs-mobile-sm-desktop"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 pt-0">
            <p
              suppressHydrationWarning={suppressText}
              className="mb-3 text-[#877D78]"
            >
              {t('order_summary')}
            </p>
            <PaymentSummary
              sub_total={order?.data?.subtotal || 0}
              total={order?.data?.total || 0}
              total_cart_after_tax={order?.data?.total_cart_after_tax || 0}
              promo_code_discount={order?.data?.promo_code_discount || 0}
              delivery_fees={order?.data?.delivery_fees || 0}
              free_delivery={order?.data?.free_delivery || false}
              tax={order?.data?.tax || 0}
            />
          </div>

          <div>
            {/* sticky btn */}
            <div className="border-t bg-white text-white  p-5 cursor-pointer">
              <div className="flex items-center gap-x-3 justify-center rounded-full w-full py-2 px-4 bg-[#12B76A]">
                <CallusIcon />
                <a
                  suppressHydrationWarning={suppressText}
                  className="text-white"
                  target="blank"
                  href={`tel:${order.data.branch_phone}`}
                >
                  {t('need_help_call_us')}
                </a>
              </div>
              <Link 
                href={`${appLinks.checkout.path}`}
                className={`font-light ${mainBtnClass} flex justify-center items-center px-5 !py-2 mt-3`}
                style={{ backgroundColor: color }}
              >
                <Reload />
                <span className="px-1">{t('try_again')}</span>
              </Link>
            </div>
          </div>
        </MainContentLayout>
      ) : (
        <MainContentLayout>
          <ContentLoader type="OrderFailure" sections={1} />
        </MainContentLayout>
      )}
    </Suspense>
  );
};

export default OrderFailure;

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
