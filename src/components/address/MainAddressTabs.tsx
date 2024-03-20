import { AddressTypes, UserAddressFields } from '@/types/index';
import {
  CottageOutlined,
  BusinessOutlined,
  WorkOutlineTwoTone,
} from '@mui/icons-material';
import ApartmentIcon from '@/appIcons/apartment.svg';
import OfficeIcon from '@/appIcons/office.svg';
import HomeActive from '@/appIcons/home_active.svg';
import ApartmentActive from '@/appIcons/apartment_active.svg';
import OfficeActive from '@/appIcons/office_active.svg';
import {
  HomeIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { FC, useEffect, useMemo, useState } from 'react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  useCreateAddressMutation,
  useLazyGetAddressesQuery,
} from '@/redux/api/addressApi';
import { AppQueryResult } from '@/types/queries';
import { difference, filter, first, isNull, lowerCase, map } from 'lodash';
import { useRouter } from 'next/router';
import { appLinks } from '@/constants/*';
import { setCustomerAddressType } from '@/redux/slices/customerSlice';

type Props = {
  currentAddressType: string;
  userId: string;
  edit: boolean;
  addressId?: string;
};
const MainAddressTabs: FC<Props> = ({
  currentAddressType,
  userId,
  addressId,
  edit,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [remainingTypes, setRemainingTypes] = useState<[AddressTypes] | null>(
    null
  );
  const [allTypes, setAllTypes] = useState<
    {
      id: string | null;
      type: AddressTypes;
      icon: any;
      edit: boolean;
    }[]
  >([
    { id: null, type: 'HOUSE', icon: <HomeIcon />, edit },
    { id: null, type: 'APARTMENT', icon: <BuildingOffice2Icon />, edit },
    { id: null, type: 'OFFICE', icon: <BriefcaseIcon />, edit },
  ]);
  const [triggerGetAddresses, { data: addresses, isSuccess, isLoading }] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isSuccess: boolean;
      isLoading: boolean;
    }>();

  const handleCreateAddress = (type: AddressTypes) => {
    return router
      .replace(appLinks.createAuthAddress(userId, lowerCase(type)))
      .then((r) => dispatch(setCustomerAddressType(type)));
  };

  const handleEditAddress = (type: AddressTypes, addressId: string) => {
    return router
      .replace(appLinks.editAuthAddress(userId, addressId, lowerCase(type)))
      .then((r) => dispatch(setCustomerAddressType(type)));
  };

  return (
    <div className="flex mx-3 flex-row justify-center items-start mb-4">
      {map(allTypes, (a, i) => (
        <button
          key={i}
          onClick={() =>
            a.edit && addressId
              ? handleEditAddress(a.type, addressId)
              : handleCreateAddress(a.type)
          }
          className={`flex flex-1 flex-col border justify-center items-center p-3 rounded-md capitalize ${
            i === 1 && `mx-2`
          }`}
          style={{ borderColor: currentAddressType === a.type && color }}
        >
          <HomeIcon
            className={`w-8 h-8 `}
            color={currentAddressType === a.type ? color : `text-stone-400`}
          />
          <p>{t(lowerCase(a.type))}</p>
        </button>
      ))}
    </div>
  );
};

export default MainAddressTabs;
