import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { alexandriaFont, imageSizes, suppressText } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { HomePromoCode } from '@/types/index';
import CustomImage from '../CustomImage';
import { url } from 'inspector';
import { setPromocode } from '@/redux/slices/cartSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { isEmpty } from 'lodash';
type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  data: HomePromoCode[];
};
const HomeModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  data,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);

  const ApplyPromocode = () => {
    dispatch(setPromocode(data[0].promo_code));
    dispatch(
      showToastMessage({
        content: 'promo is saved and will be applied to your cart',
        type: `success`,
      })
    );
    onRequestClose();
  };
  return (
    <>
      {isEmpty(data) ? null : (
        <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          className={`w-full mx-auto ${isRTL ? 'right-0' : 'left-0'}`}
          style={{
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 100 },
          }}
          shouldFocusAfterRender={false}
        >
          <div
            className={`w-full h-full flex  ${
              isRTL ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="flex items-center justify-center absolute w-full lg:w-2/4 xl:w-1/3  h-96 md:h-1/2  top-[20%] px-5">
              <div
                className={`relative flex flex-col items-end justify-between rounded-lg max-w-[100%] h-full aspect-square`}
                // style={{
                //   backgroundColor: color,
                //   backgroundImage: `url(${data[0].promo_image})`,
                //   backgroundSize: 'auto',
                //   backgroundRepeat: 'no-repeat',
                //   backgroundPosition: 'center',
                // }}
              >
                <div className="h-full w-full">
                  <CustomImage
                    // src={
                    //   'https://html.com/wp-content/uploads/very-large-flamingo.jpg'
                    // }
                    src={data[0]?.promo_image ?? ''}
                    width={100}
                    height={100}
                    alt="cover img"
                    className="object-fill w-full h-full rounded-lg"
                  />
                </div>
                <div className="absolute h-full w-full flex flex-col justify-between items-end z-10 p-5 rounded-lg">
                  <button className={``} onClick={() => onRequestClose()}>
                    <XMarkIcon
                      className={`w-6 h-6 text-black text-base bg-white rounded-full p-1`}
                    />
                  </button>

                  {/* apply copon btn */}
                  <div className="w-full">
                    <button
                      onClick={() => ApplyPromocode()}
                      className={`bg-white text-black w-full sm-mobile-base-desktop rounded-full h-8 pt-2 pb-8 mx-auto capitalize ${alexandriaFont}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {t('apply_coupon')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default HomeModal;
