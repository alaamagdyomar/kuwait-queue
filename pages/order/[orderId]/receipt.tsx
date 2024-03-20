import MainContentLayout from '@/layouts/MainContentLayout';
import React, { Fragment, useEffect } from 'react';
import { Suspense } from 'react';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { wrapper } from '@/redux/store';
import Cash from '@/appIcons/cash_checkout.svg';
import {
  suppressText,
  mainBtnClass,
  appLinks,
  alexandriaFontSemiBold,
  alexandriaFont,
  alexandriaFontLight,
  displayUserAddress,
} from '@/constants/*';
import { useRouter } from 'next/router';
import { useGetInvoiceQuery } from '@/redux/api/orderApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { AppQueryResult } from '@/types/queries';
import {
  CheckBoxes,
  OrderInvoice,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import CartProduct from '@/components/widgets/product/CartProduct';
import TextTrans from '@/components/TextTrans';
import { isEmpty, map } from 'lodash';
import PaymentSummary from '@/components/PaymentSummary';
import ContentLoader from '@/components/skeletons';
import Link from 'next/link';
import { NextPage } from 'next';
import { setUrl } from '@/redux/slices/appSettingSlice';

type Props = {
  url: string;
  orderId: string;
};

const orderReceipt: NextPage<Props> = ({
  url,
  orderId,
}): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    searchParams: { destination },
    locale: { lang },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);

  const {
    data: orderReceiptData,
    isSuccess,
    isLoading,
  } = useGetInvoiceQuery<{
    data: AppQueryResult<OrderInvoice>;
    isSuccess: boolean;
    isLoading: boolean;
  }>(
    {
      order_id: orderId,
      area_branch: destObj,
      url,
      lang,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <Suspense>
      <MainHead
        title={t('order_receipt')}
        url={url}
        description={`${t('order_receipt')}`}
      />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="order_receipt"
      >
        {isSuccess ? (
          <div className="py-5">
            <h3
              className={`px-4 py-3 ${alexandriaFontSemiBold}`}
              suppressHydrationWarning={suppressText}
            >
              {t('order_items')}
            </h3>
            <div className="border-b-8 border-gray-100 px-4">
              {orderReceiptData.data?.order_items?.map((product, index) => (
                <div className="flex justify-between gap-x-1 w-full">
                  {/* name and addons and qty meter*/}
                  <div>
                    <Link
                      className="flex gap-x-1"
                      href={`${appLinks.productShow(product.id, product.item)}`}
                    >
                      <TextTrans
                        className={`capitalize ${alexandriaFontSemiBold}`}
                        ar={product.item_ar}
                        en={product.item_en}
                        length={15}
                      />
                      <p
                        className={`capitalize ${alexandriaFontSemiBold}`}
                        suppressHydrationWarning={suppressText}
                      >
                        x{product.quantity}
                      </p>
                    </Link>

                    {/* addons products */}
                    <div
                      className={`flex gap-1 w-auto flex-wrap w-fit mb-2 py-1`}
                    >
                      {product.addon.map((addon, idx) => (
                        <TextTrans
                          key={addon.addon_id}
                          className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                          ar={`${addon.name_ar}`}
                          en={`${addon.name_en}`}
                        />
                      ))}
                    </div>

                    {/* notes */}

                    <p
                      suppressHydrationWarning={suppressText}
                      className="xxs-mobile-xs-desktop"
                    >
                      {product.extra_notes}
                    </p>
                  </div>

                  {/* price */}
                  <div className="font-bold xs-mobile-sm-desktop">
                    <p
                      className=" uppercase"
                      //   style={{ color }}
                      suppressHydrationWarning={suppressText}
                    >
                      {parseFloat(product.price?.toString()).toFixed(3)}{' '}
                      {t('kd')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* contact details */}
            <div className="py-3 border-b-8 border-gray-100 px-4">
              <h2
                className={`py-3 ${alexandriaFontSemiBold}`}
                suppressHydrationWarning={suppressText}
              >
                {t('contact_details')}
              </h2>
              <div className="xs-mobile-sm-desktop space-y-1">
                {orderReceiptData.data?.contact_details.order_details
                  .order_type === 'delivery' ? (
                  <div className="xs-mobile-sm-desktop mb-3">
                    <p
                      className={`${alexandriaFontSemiBold} `}
                      suppressHydrationWarning={suppressText}
                    >
                      {t('delivery')} {t('to')}{' '}
                      {t(
                        orderReceiptData.data?.contact_details.order_details.delivery_address.address.type.toLowerCase()
                      )}
                    </p>
                    <p
                      className={`${alexandriaFontLight} text-[#544A45]`}
                      suppressHydrationWarning={suppressText}
                    >
                      {displayUserAddress(
                        orderReceiptData.data?.contact_details.order_details
                          .delivery_address.address
                      )}
                    </p>
                    {orderReceiptData.data?.contact_details.order_details
                      .delivery_address?.address?.additional && (
                      <p
                        className={`${alexandriaFontSemiBold} mt-1`}
                        suppressHydrationWarning={suppressText}
                      >
                        {
                          orderReceiptData.data?.contact_details.order_details
                            .delivery_address?.address?.additional
                        }
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="xs-mobile-sm-desktop mb-3">
                    <p
                      className={`${alexandriaFontSemiBold} `}
                      suppressHydrationWarning={suppressText}
                    >
                      {t('delivery')} {t('to')}{' '}
                      {t(
                        orderReceiptData.data?.contact_details.order_details.delivery_address.address.type.toLowerCase()
                      )}
                    </p>
                    <p
                      className={`${alexandriaFontLight} text-[#544A45]`}
                      suppressHydrationWarning={suppressText}
                    >
                      {displayUserAddress(
                        orderReceiptData.data?.contact_details.order_details
                          .delivery_address.address
                      )}
                    </p>
                  </div>
                )}

                {/* customer details */}
                <div className={`${alexandriaFont} mt-1`}>
                  <p suppressHydrationWarning={suppressText}>
                    {orderReceiptData.data?.contact_details.customer.name}
                  </p>
                  <p suppressHydrationWarning={suppressText}>
                    {orderReceiptData.data?.contact_details.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* payment summary */}
            <div className="py-3 px-4">
              <h2
                className={`base-mobile-lg-desktop py-3 ${alexandriaFontSemiBold}`}
                suppressHydrationWarning={suppressText}
              >
                {t('payment_details')}
              </h2>

              <div className="flex items-center py-1">
                <Cash />
                <p className="ps-3">
                  {orderReceiptData.data.contact_details.payment_type}
                </p>
              </div>
              <div className="pb-36 space-y-1">
                <PaymentSummary
                  sub_total={
                    orderReceiptData.data.payment_summary?.subTotal ||
                    orderReceiptData.data.payment_summary?.sub_total ||
                    0
                  }
                  total={orderReceiptData.data.payment_summary?.total || 0}
                  total_cart_after_tax={
                    orderReceiptData.data.payment_summary
                      ?.total_cart_after_tax || 0
                  }
                  promo_code_discount={
                    orderReceiptData.data.payment_summary
                      ?.promo_code_discount || 0
                  }
                  delivery_fees={
                    orderReceiptData.data.payment_summary?.delivery_fees ||
                    orderReceiptData.data.payment_summary?.delivery_fee ||
                    0
                  }
                  free_delivery={
                    orderReceiptData.data.payment_summary?.free_delivery ||
                    false
                  }
                  tax={orderReceiptData.data.payment_summary?.tax || 0}
                />
              </div>

              {/* reorder */}
              <div className="border-t-[1px] border-gray-200 py-5">
                <button
                  className={`${mainBtnClass} bg-gray-100`}
                  onClick={() => router.push(`${appLinks.home.path}`)}
                >
                  <span
                    className="text-black"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('re_order')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ContentLoader type="Receipt" sections={1} />
        )}
      </MainContentLayout>
    </Suspense>
  );
};
export default orderReceipt;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      const { orderId }: any = query;
      if (!req.headers.host || !orderId) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          orderId,
          url: req.headers.host,
        },
      };
    }
);
