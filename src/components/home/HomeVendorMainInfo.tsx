import { FC, useEffect } from 'react';
import CustomImage from '@/components/CustomImage';
import {
  alexandriaFontSemiBold,
  alexandriaFont,
  appLinks,
  imageSizes,
  imgUrl,
  suppressText,
} from '@/constants/*';
import Link from 'next/link';
import { InfoOutlined, Check } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TextTrans from '@/components/TextTrans';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { filter, isEmpty } from 'lodash';
import { Vendor } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import ClockIcon from '@/appIcons/time.svg';
import MinOrderIcon from '@/appIcons/min_order_home.svg';

type Props = {
  element: AppQueryResult<Vendor> | undefined;
};
const HomeVendorMainInfo: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang },
  } = useAppSelector((state) => state);

  // vendor status
  const storeStatus = [
    { id: 1, status: 'open', className: 'text-[#12B76A]' },
    { id: 2, status: 'busy', className: 'text-[#E30015]' },
    { id: 3, status: 'close', className: 'text-[#E30015]' },
  ];
  const currentStoreStatus = filter(
    storeStatus,
    (store) => store.status === element?.Data?.status.toLowerCase()
  );

  return (
    <div className="py-5">
      <div className="flex gap-x-2 justify-between items-start capitalize">
        <div className="flex grow gap-x-2">
          <Link
            href={appLinks.home.path}
            scroll={true}
            className={` w-1/3 md:w-1/4 rounded-md`}
          >
            <CustomImage
              width={imageSizes.xs}
              height={imageSizes.xs}
              className="rounded-md w-full h-fit aspect-square border border-[#D6D6D6]"
              alt={element?.Data?.name ?? ''}
              src={imgUrl(element?.Data?.logo ?? '')}
            />
          </Link>
          <div className={`flex flex-col w-full px-1`}>
            {/* name */}
            <TextTrans
              className={`base-mobile-lg-desktop ${alexandriaFontSemiBold}`}
              ar={element?.Data?.name_ar ?? ''}
              en={element?.Data?.name_en ?? ''}
            />

            {/*info */}
            <div
              className={`xxs-mobile-xs-desktop space-y-1 text-[#544A45] ${alexandriaFont}`}
            >
              {element?.Data?.delivery && (
                // check if method is pickup or deliery
                <>
                  <div className="flex items-center gap-x-1">
                    <ClockIcon />
                    <p suppressHydrationWarning={suppressText}>
                      {t('within')} {element?.Data?.delivery?.delivery_time}{' '}
                      {t(`${element?.Data?.delivery?.delivery_time_type}`)}
                    </p>
                  </div>

                  {parseFloat(element?.Data?.delivery?.minimum_order_price) ? (
                    <div className="flex items-center gap-x-1">
                      <MinOrderIcon />
                      <p suppressHydrationWarning={suppressText}>
                        {t('min_order')} :{' '}
                        {element?.Data?.delivery?.minimum_order_price} {t('kd')}
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}

              {/* status */}
              {element?.Data?.status && !isEmpty(currentStoreStatus) && (
                <div
                  className={`flex flex-row items-center xxs-mobile-xs-desktop`}
                  suppressHydrationWarning={suppressText}
                >
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`${currentStoreStatus[0].className}`}
                  >
                    {t(`${currentStoreStatus[0].status}`)}

                    <span className="text-xxs text-[#544A45]">
                      {element?.Data?.close_at &&
                        currentStoreStatus[0].status === 'open' && (
                          <>
                            . {t(`close_at`)} {element?.Data?.close_at}
                          </>
                        )}
                      {element?.Data?.open_at &&
                        currentStoreStatus[0].status === 'close' && (
                          <>
                            . {t(`open_at`)} {element?.Data?.open_at}
                          </>
                        )}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* vendorshow icon */}
        <Link
          href={appLinks.vendorDetails.path}
          scroll={true}
          className={`flex-none grayscale`}
        >
          <InfoOutlined className="w-6 h-6 lg:w-8 lg:h-8" style={{ color }} />
        </Link>
      </div>
    </div>
  );
};

export default HomeVendorMainInfo;
