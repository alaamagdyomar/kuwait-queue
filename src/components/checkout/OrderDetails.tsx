import React, { FC, ReactNode } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import OfficeIcon from '@/appIcons/office_checkout.svg';
import HouseIcon from '@/appIcons/house_checkout.svg';
import ApartmentIcon from '@/appIcons/apartment_checkout.svg';
import AddressIcon from '@/appIcons/address_checkout.svg';
import RemarksIcon from '@/appIcons/remarks_checkout.svg';
import ContactsIcon from '@/appIcons/contacts_checkout.svg';
import ClockIcon from '@/appIcons/time_checkout.svg';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  alexandriaFont,
  alexandriaFontLight,
  alexandriaFontSemiBold,
  appLinks,
  displayUserAddress,
  suppressText,
} from '@/constants/*';
import Link from 'next/link';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import moment from 'moment';
import { UserAddressFields } from '@/types/index';

type Props = {
  OrderStatus?: boolean;
};

const OrderDetails: FC<Props> = ({ OrderStatus = false }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, otherLang },

    customer: {
      id,
      name,
      phone,
      notes,
      customerAddressInfo,
      address: CustomerAddress,
      address: { type: address_type },
      prefrences,
    },
    searchParams: { method, destination },
  } = useAppSelector((state) => state);
  const isAuth = useAppSelector(isAuthenticated);

  const DetailComponent = ({
    icon,
    p1,
    p2,
    p3 = '',
    editPath = '#',
    onclick = () => {},
  }: {
    icon: ReactNode;
    p1: string;
    p2: string;
    p3?: string;
    editPath?: string;
    onclick?: () => void;
  }) => {
    return (
      <div
        onClick={() => onclick()}
        className="flex justify-between items-center gap-x-2 py-2 xxs-mobile-xs-desktop cursor-pointer"
      >
        <div className="flex gap-x-3">
          <div>{icon}</div>
          <div>
            <p
              suppressHydrationWarning={suppressText}
              className={`text-[#B7B1AE] pb-1 ${alexandriaFont}`}
            >
              {t(p1)}
            </p>
            <p
              suppressHydrationWarning={suppressText}
              className={`${alexandriaFontSemiBold}`}
            >
              {t(p2)}
            </p>
            <p
              suppressHydrationWarning={suppressText}
              className={`text-[#1A1615] ${
                p2 ? alexandriaFontLight : alexandriaFontSemiBold
              }`}
            >
              {p3}
            </p>
          </div>
        </div>
        {OrderStatus ? (
          <></>
        ) : // <Link href={editPath}>
        //   <p suppressHydrationWarning={suppressText}>{t('edit')}</p>
        // </Link>
        router.locale === 'en' ? (
          <KeyboardArrowRight className="text-[#A5A5A5]" />
        ) : (
          <KeyboardArrowLeft className="text-[#A5A5A5]" />
        )}
      </div>
    );
  };

  return (
    <div>
      {(method === 'delivery' && CustomerAddress.id) ||
      (method === 'pickup' && destination.id) ? (
        <DetailComponent
          onclick={() =>
            method === 'delivery'
              ? isAuth
                ? router.push(appLinks.selectAddress(id))
                : router.push(appLinks.guestAddress.path)
              : router.push(appLinks.selectBranch.path)
          }
          icon={
            method === 'pickup' ? (
              <AddressIcon />
            ) : (
              {
                [0]: <ApartmentIcon />,
                ['HOUSE']: <HouseIcon />,
                ['APARTMENT']: <ApartmentIcon />,
                ['OFFICE']: <OfficeIcon />,
              }[address_type as string]
            )
          }
          p1={method === 'delivery' ? 'your_address' : 'branch_address'}
          p2={
            method === 'delivery'
              ? {
                  [0]: '',
                  ['HOUSE']: 'house',
                  ['APARTMENT']: 'apartment',
                  ['OFFICE']: 'office',
                }[address_type as number]
              : ''
          }
          p3={
            method === 'delivery'
              ? isAuth
                ? displayUserAddress(CustomerAddress)
                : displayUserAddress(CustomerAddress)
              : destination.location
          }
        />
      ) : (
        <></>
      )}

      {id ? (
        <DetailComponent
          onclick={() =>
            method === 'delivery'
              ? isAuth
                ? router.push(appLinks.selectAddress(id))
                : router.push(appLinks.guestAddress.path)
              : router.push(appLinks.selectBranch.path)
          }
          icon={<ContactsIcon />}
          p1="contacts_info"
          p2={`${customerAddressInfo.name} , ${customerAddressInfo.phone}`}
        />
      ) : (
        <></>
      )}

      {prefrences.time && (
        <DetailComponent
          onclick={() => router.push(appLinks.selectTime(method))}
          icon={<ClockIcon />}
          p1={
            {
              ['delivery']: 'delivery_time',
              ['pickup']: 'pickup_time',
            }[method as string]
          }
          p2={`${prefrences.date}  ,  ${
            prefrences.type === 'pickup_now' ||
            prefrences.type === 'delivery_now'
              ? moment()
                  .add(prefrences.time, 'minutes')
                  .locale('en')
                  .format('hh:mm A')
              : prefrences.time
          }`}
        />
      )}

      {method === 'delivery' && (
        <DetailComponent
          onclick={() =>
            isAuth
              ? router.push(appLinks.userAddresses(id))
              : router.push(appLinks.guestAddress.path)
          }
          icon={<RemarksIcon />}
          p1="special_remarks"
          p2={
            isAuth
              ? `${CustomerAddress.notes || 'no_notes_added'}`
              : `${CustomerAddress.notes || 'no_notes_added'}`
          }
        />
      )}
    </div>
  );
};
export default OrderDetails;
