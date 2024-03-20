import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  alexandriaFont,
  alexandriaFontMeduim,
  appLinks,
  convertColor,
  shadeColor,
  suppressText,
} from '../constants';
import ScheduelStatusIcon from '@/appIcons/status_home_scheduel.svg';
import PrepareStatusIcon from '@/appIcons/status_home_prepare.svg';
import DeliveryStatusIcon from '@/appIcons/status_home_delivery.svg';
import ArrowUpStatusIcon from '@/appIcons/status_home_up_arrow.svg';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '../types';
import { useRouter } from 'next/router';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';

type Props = {
  url: string;
  cart?: boolean;
  handelContinueInCart?: () => void;
  cartLessThanMin?: boolean;
};

export default function CheckoutFixedBtn({
  url,
  cart = false,
  cartLessThanMin = false,
  handelContinueInCart = () => {},
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    customer: { userAgent },
    searchParams: { method },
    cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const color = useAppSelector(themeColor);

  // get cart
  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>(
    {
      userAgent,
      area_branch: destObj,
      PromoCode: promocode,
      url,
    },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div>
      {isSuccess &&
        cartItems &&
        cartItems.data &&
        cartItems?.data?.Cart &&
        cartItems?.data?.Cart.length > 0 && (
          <>
            <div className="h-28"></div>
            {/* sticky fooer */}
            <div className="fixed bottom-0 z-50 w-full lg:w-2/4 xl:w-1/3  border-t bg-white text-white  p-5">
              {/* min cart msg */}
              {cartLessThanMin && (
                <p
                  suppressHydrationWarning={suppressText}
                  className={`w-full xxs-mobile-xs-desktop text-[#877D78] text-center py-2 ${alexandriaFont}`}
                >{`${t('add_a_minimum_of')} ${(
                  parseFloat(
                    cartItems?.data?.minimum_order_price?.toString() || ''
                  ) -
                  (cartItems?.data?.subTotal
                    ? parseFloat(cartItems?.data?.subTotal.toString())
                    : parseFloat(cartItems?.data?.sub_total?.toString() || ''))
                ).toFixed(3)}  ${t('kd')} ${t('to_place_your_order')}`}</p>
              )}

              {/* checkout btn */}
              <div
                onClick={() => {
                  if (cart) {
                    if (!cartLessThanMin) handelContinueInCart();
                  } else {
                    router.push(appLinks.cart.path);
                  }
                }}
                className={`flex items-center gap-x-2 justify-between rounded-full w-full py-2 px-4 cursor-pointer ${alexandriaFontMeduim}`}
                style={{
                  backgroundColor: cartLessThanMin ? '#B7B1AE' : color,
                }}
              >
                <div className="flex items-center gap-x-3">
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`flex items-center justify-center rounded-full w-8 h-8 `}
                    style={{
                      backgroundColor: cartLessThanMin
                        ? '#00000026'
                        : shadeColor(color, -50),
                    }}
                  >
                    {cartItems?.data?.Cart.length}
                  </p>
                  <p suppressHydrationWarning={suppressText}>
                    {cart ? t('go_to_checkout') : t('review_order')}
                  </p>
                </div>

                <p suppressHydrationWarning={suppressText}>
                  {cartItems?.data?.total
                    ? cartItems?.data?.total
                    : cartItems?.data?.total_cart_after_tax}{' '}
                  {t('kd')}
                </p>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
