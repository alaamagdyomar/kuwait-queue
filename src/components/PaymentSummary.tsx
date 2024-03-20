import { jsx } from '@emotion/react';
import { FC } from 'react';
import {
  alexandriaFont,
  alexandriaFontSemiBold,
  suppressText,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { ServerCart } from '../types';
import { useAppSelector } from '@/redux/hooks';
import { isNull } from 'lodash';

type Props = {
  sub_total: string | number;
  promo_code_discount?: string | number;
  tax: string | number;
  free_delivery: boolean;
  delivery_fees: string | number;
  total_cart_after_tax?: string | number;
  total: string | number;
};

const PaymentSummary: FC<Props> = ({
  sub_total = '',
  promo_code_discount = '',
  tax = '',
  free_delivery = false,
  delivery_fees = '',
  total_cart_after_tax = '',
  total = '',
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    searchParams: { method },
    cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);

  return (
    <div className={`py-2 capitalize xs-mobile-sm-desktop ${alexandriaFont}`}>
      <>
        <div className="flex justify-between mb-2">
          <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
          <div className={`flex flex-row`}>
            <p
              suppressHydrationWarning={suppressText}
              className={`px-2`}
              data-cy="sub-total"
            >
              {sub_total}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kd')}
            </p>
          </div>
        </div>

        {/* {enable_promocode && ( */}
        {promo_code_discount ? (
          <>
            <div className="flex justify-between mb-2 text-[#E30015]">
              <p suppressHydrationWarning={suppressText}>
                {t('coupon_value')}{' '}
              </p>
              <div className={`flex flex-row`}>
                <p suppressHydrationWarning={suppressText} className={`px-2 `}>
                  -{promo_code_discount}
                </p>
                <p
                  className={`uppercase `}
                  suppressHydrationWarning={suppressText}
                >
                  {t('kd')}
                </p>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        {/* {(enable_promocode && data.tax)  */}
        {(promo_code_discount && tax) || tax ? (
          <div className="flex justify-between mb-2">
            <p suppressHydrationWarning={suppressText}>{t('tax')} </p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {tax}
              </p>
              <p
                className={`uppercase`}
                suppressHydrationWarning={suppressText}
              >
                %
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}

        {method === 'delivery' ? (
          <div className="flex justify-between mb-2">
            <p suppressHydrationWarning={suppressText}>{t('delivery_fees')}</p>
            <p suppressHydrationWarning={suppressText}></p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {/* {enable_promocode */}
                {free_delivery === true || isNull(delivery_fees)
                  ? 0
                  : delivery_fees}
              </p>
              <p
                className={`uppercase`}
                suppressHydrationWarning={suppressText}
              >
                {t('kd')}
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div
          className={`flex justify-between mb-2 border-t pt-2 mt-1 ${alexandriaFontSemiBold}`}
        >
          <p suppressHydrationWarning={suppressText}>{t('net_total')}</p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {/* {enable_promocode  */}
              {total_cart_after_tax || total}
              {/* {promo_code_discount ? total_cart_after_tax : total} */}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kd')}
            </p>
          </div>
        </div>
      </>
    </div>
  );
};

export default PaymentSummary;
