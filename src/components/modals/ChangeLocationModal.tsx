import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useLazyChangeLocationQuery } from '@/redux/api/locationApi';
import {
  alexandriaFontBold,
  imageSizes,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Area, Branch } from '@/types/queries';
import ChangeBranch from '@/appImages/change_branch.png';
import CustomImage from '../CustomImage';
import ChangeLocationIcon from '@/appIcons/change_location.svg';
import MainModal from './MainModal';

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  url: string;
  selectedMethod: 'pickup' | 'delivery';
  area_branch: Area | Branch;
  changeLocation: (
    destination: Branch | Area,
    type: 'pickup' | 'delivery'
  ) => void;
};

const ChangeLocationModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  selectedMethod,
  area_branch,
  changeLocation,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);

  const [triggerChangeLocation] = useLazyChangeLocationQuery();

  const handleChangeLocationReq = async () => {
    await triggerChangeLocation({
      UserAgent: userAgent,
      area_branch:
        selectedMethod === `pickup`
          ? { 'x-branch-id': area_branch.id }
          : { 'x-area-id': area_branch.id },
      url,
    }).then(() => {
      changeLocation(area_branch, selectedMethod);
      onRequestClose();
    });
  };

  return (
    <MainModal isOpen={isOpen} closeModal={onRequestClose}>
      <div className="flex flex-col justify-between items-center bg-white rounded-lg w-full h-full px-5">
        <div>
          <ChangeLocationIcon />
        </div>

        <div className="mt-5 mb-10">
          <p
            suppressHydrationWarning={suppressText}
            className={`text-center base-mobile-lg-desktop font-semibold mb-3 capitalize ${alexandriaFontBold}`}
          >
            {t(`${'You_’re_about_to_change_your_location'}`)}
          </p>
          <p
            suppressHydrationWarning={suppressText}
            className="text-center xxs-mobile-xs-desktop capitalize text-[#544A45] xs-mobile-sm-desktop"
          >
            {t(
              `${'changing_your_location_might_result_in_removing_the_items_from_your_cart'}`
            )}
          </p>
        </div>
        <button
          onClick={() => {
            handleChangeLocationReq();
          }}
          className={`${mainBtnClass} text-center`}
          style={{ backgroundColor: color }}
          suppressHydrationWarning={suppressText}
        >
          {t('change')}
        </button>
        <button
          onClick={onRequestClose}
          className={`bg-gray-200 !text-black text-center ${mainBtnClass} mt-3`}
          suppressHydrationWarning={suppressText}
        >
          {t('cancel')}
        </button>
      </div>
    </MainModal>
  );
};

export default ChangeLocationModal;
