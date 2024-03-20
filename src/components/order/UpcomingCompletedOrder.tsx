import {
  alexandriaFont,
  alexandriaFontLight,
  alexandriaFontMeduim,
  alexandriaFontSemiBold,
  appLinks,
  suppressText,
} from '@/constants/*';
import { UpcomingOrders } from '@/types/queries';
import Link from 'next/link';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import TextTrans from '../TextTrans';

type Props = {
  completed?: boolean;
  upcoming?: boolean;
  order: UpcomingOrders;
};

const UpcomingCompletedOrder: FC<Props> = ({
  completed = false,
  upcoming = false,
  order,
}) => {
  const { t } = useTranslation();

  return (
    <div className="border-b-2 border-gray-100 pb-2">
      <div className="text-base space-y-1">
        <p
          className={`${alexandriaFontMeduim}`}
          suppressHydrationWarning={suppressText}
        >
          {t('order')} #{order.order_code}
        </p>
        <p className={`text-[#877D78] xxs-mobile-xs-desktop ${alexandriaFontLight}`}>
          {order.created_at}
        </p>

        {/* status in case of completed */}
        {completed && (
          <>
            {order.order_status === 'completed' ? (
              <p className="xxs-mobile-xs-desktop text-[#12B76A]">
                {t('delivered_successfully')}
              </p>
            ) : order.order_status === 'canceled' ? (
              <p
                className="xxs-mobile-xs-desktop text-[#F04438]"
                suppressHydrationWarning={suppressText}
              >
                {t('cancelled_successfully')}
              </p>
            ) : (
              <></>
            )}
          </>
        )}
        {/* products */}

        <div className={`xs-mobile-sm-desktop ${alexandriaFont}`}>
          {order.items?.map((item) => (
            <div className="flex gap-x-1">
              <TextTrans en={item.item_en} ar={item.item_ar} className={``} />
              <p>x{item.quantity}</p>
            </div>
          ))}
        </div>

        <p
          className={`xs-mobile-sm-desktop ${alexandriaFontSemiBold}`}
          suppressHydrationWarning={suppressText}
        >
          {t('total')} : {order.total} {t('kd')}
        </p>
      </div>

      {/* track order btn in case of upcoming */}
      {upcoming && (
        <div className="py-2">
          <Link
            href={appLinks.orderTrack(order.order_code)}
            className={`w-full block text-center py-2 bg-[#F3F2F2] rounded-full xs-mobile-sm-desktop ${alexandriaFontMeduim}`}
            suppressHydrationWarning={suppressText}
          >
            {t('track_order')}
          </Link>
        </div>
      )}
      {completed && (
        <div className="flex gap-x-2 py-3">
          <Link
            href={`#`}
            className={`w-full md:w-1/3 py-2 bg-[#F3F2F2] rounded-full  xs-mobile-sm-desktop text-center ${alexandriaFontMeduim}`}
            suppressHydrationWarning={suppressText}
          >
            {t('re_order')}
          </Link>
          <Link
            href={appLinks.orderReceipt(order.order_code)}
            className={`w-full md:w-1/3 py-2 bg-[#F3F2F2] rounded-full  xs-mobile-sm-desktop text-center ${alexandriaFontMeduim}`}
            suppressHydrationWarning={suppressText}
          >
            {t('view_receipt')}
          </Link>
        </div>
      )}
    </div>
  );
};
export default UpcomingCompletedOrder;
