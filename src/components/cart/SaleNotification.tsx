import React, { FC, useState } from 'react';
import Salenotification from '@/appIcons/sale_notification.svg';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import {
  alexandriaFont,
  alexandriaFontMeduim,
  suppressText,
} from '@/constants/*';
import { LinearProgress } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  delivery_fees: number;
  min_for_free_delivery: number;
  total: number;
};

const SaleNotification: FC<Props> = ({
  min_for_free_delivery = 0,
  delivery_fees = 0,
  total,
}) => {
  const { t } = useTranslation();
  const {
    searchParams: { method },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [closeNotification, setCloseNotification] = useState(true);

  return (
    <>
      {method === 'delivery' &&
      closeNotification &&
      delivery_fees &&
      min_for_free_delivery ? (
        <div>
          <div className="bg-[#F5F5F5] xxs-mobile-xs-desktop py-4 px-3">
            <div className="flex justify-between gap-x-2">
              <div className="flex items-center gap-x-2">
                <Salenotification />
                <div>
                  <p
                    className={`${alexandriaFontMeduim} xs-mobile-sm-desktop`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('free_delivery_on_orders_above')} {min_for_free_delivery}{' '}
                    {t('kd')} !
                  </p>
                  <p
                    className={`text-[#544A45] ${alexandriaFont} mt-1`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('add')}{' '}
                    {(
                      parseFloat(min_for_free_delivery) - parseFloat(total)
                    ).toFixed(3)}{' '}
                    {t('kd')} {t('to_your_cart_to_free_delivery')} !
                  </p>
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setCloseNotification(false)}
              >
                <Close />
              </div>
            </div>
          </div>
          <LinearProgress
            variant="determinate"
            classes={{
              root: `!bg-[${color}]`,
            }}
            sx={{
              '& .MuiLinearProgress-root': {
                backgroundColor: color,
                opacity: 0.5,
              },
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
            value={(100 * total) / min_for_free_delivery}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SaleNotification;
