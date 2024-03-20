import React, { FC, ReactNode } from 'react';
import OfficeIcon from '@/appIcons/office_checkout.svg';
import ContactsIcon from '@/appIcons/contacts_checkout.svg';
import ClockIcon from '@/appIcons/time_checkout.svg';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { googleMapUrl, suppressText } from '@/constants/*';
import { Order } from '@/types/index';
import { isObject, isUndefined } from 'lodash';
import BranchIcon from '@/appIcons/branch_address.svg';
import DirectionIcon from '@/appIcons/direction.svg';

type Props = {
  order: Order;
};

const GuestOrderStatus: FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);

  const handelDisplayAddress = () => {
    if (
      order?.customer &&
      !isUndefined(order?.customer?.address) &&
      isObject(order?.customer.address?.address)
    ) {
      const addressValues =
        !isUndefined(order.customer?.address) &&
        Object.values(order.customer.address?.address).filter(
          (value) => value !== null
        );

      const allAddress = addressValues ? addressValues.join(', ') : '';

      return allAddress;
    }
  };

  const DetailComponent = ({
    icon,
    p1,
    p2,
    p3 = '',
    isDelivery = true,
  }: {
    icon: ReactNode;
    p1: string;
    p2: string;
    p3?: string;
    isDelivery?: boolean;
  }) => {
    return (
      <div className="flex justify-between items-center gap-x-2 py-2 xxs-mobile-xs-desktop">
        <div className="flex gap-x-3">
          <div>{icon}</div>
          <div>
            <p
              suppressHydrationWarning={suppressText}
              className="text-[#B7B1AE] pb-1 uppercase flex justify-between items-center"
            >
              <span>{t(p1)}</span>
            </p>
            <p suppressHydrationWarning={suppressText} className="font-bold">
              {t(p2)}
            </p>
            <p
              suppressHydrationWarning={suppressText}
              className="text-[#1A1615]"
            >
              {p3}
            </p>
          </div>
        </div>
        {!isDelivery && (
          <a
            target="blank"
            href={googleMapUrl(
              order.customer.address.latitude,
              order.customer.address.longitude
            )}
            className="btn min-w-fit h-9 px-2 bg-gray-100 flex justify-center items-center rounded-full xxs-mobile-xs-desktop"
          >
            <div className={`${isRTL && '-rotate-90'}`}>
              <DirectionIcon />
            </div>
            <p className="min-w-fit px-1">{t('get_direction')}</p>
          </a>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* {isObject(order?.customer.address?.address) && ( */}
      <DetailComponent
        icon={order?.orderType === 'delivery' ? <OfficeIcon /> : <BranchIcon />}
        p1={order?.orderType === 'delivery' ? 'your_address' : 'branch_address'}
        p2={
          order?.orderType === 'delivery'
            ? order?.customer?.address?.address?.type
            : order.branch_address
        }
        isDelivery={order.orderType === 'delivery'}
        p3={handelDisplayAddress()}
      />
      {/* )} */}
      <DetailComponent
        icon={<ContactsIcon />}
        p1="contact_info"
        p2={`${order.customer.name}, ${order.customer.phone}`}
      />

      <DetailComponent
        icon={<ClockIcon />}
        p1={order.orderType === 'delivery' ? 'delivery_time' : 'pickup_time'}
        p2={order.delivery_date_time.replace(',', ' ')}
      />
    </div>
  );
};
export default GuestOrderStatus;
