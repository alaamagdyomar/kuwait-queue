'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { FC } from 'react';
import DeliveryIcon from '@/appIcons/delivery animation.json';
import PickupIcon from '@/appIcons/pick up animation.json';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';
import TextTrans from '@/components/TextTrans';
import {
  alexandriaFont,
  alexandriaFontMeduim,
  displayUserAddress,
  suppressText,
} from '@/constants/*';
import { Player } from '@lottiefiles/react-lottie-player';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import ChangeMoodModal from '@/components/modals/ChangeMoodModal';
import { truncate } from 'lodash';

type Props = { url: string };

const DeliveryPickup: FC<Props> = ({ url }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    searchParams: { method, destination },
    customer: {
      prefrences: { type: prefType, date, time },
      address: customerAddress,
    },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();

  return (
    <div className="px-4">
      {(method === 'pickup' || method === 'delivery') && (
        <div className="flex gap-x-2 xs-mobile-sm-desktop cursor-pointer">
          {method === 'pickup' && (
            <Player
              src={PickupIcon}
              className="player w-10 h-10 bg-blue-100 rounded-full"
              style={{
                borderRadius: '100%',
                backgroundColor: '#F3F2F2',
                padding: '8px',
              }}
              loop={true}
              autoplay={true}
            />
          )}
          {method === 'delivery' && (
            <Player
              src={DeliveryIcon}
              className="player w-10 h-10 bg-blue-100 rounded-full"
              style={{
                borderRadius: '100%',
                backgroundColor: '#F3F2F2',
                padding: '8px',
              }}
              loop={true}
              autoplay={true}
            />
          )}

          <div className="flex items-end justify-between gap-x-2 w-full">
            {method === 'pickup' && (
              <div>
                <div className="flex gap-x-1">
                  <p
                    className={`xxs-mobile-xs-desktop ${alexandriaFont}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {prefType === 'pickup_now' ? (
                      t('pickup_now')
                    ) : prefType === 'pickup_later' ? (
                      <>
                        {t('pickup_later')}
                        <span className="px-1.5">
                          {date} {time}
                        </span>
                        {t('from')}
                      </>
                    ) : (
                      t('pickup_from')
                    )}
                    {/* {
                      {
                        ['pickup_now']: t('pickup_now'),
                        ['pickup_later']: `${t(
                          'pickup_later'
                        )} ${date} ${time} ${t('from')}`,
                        ['']: t('pickup_from'),
                      }[prefType as string]
                    } */}
                  </p>
                </div>
                <p
                  className={`${alexandriaFontMeduim}`}
                  suppressHydrationWarning={suppressText}
                >
                  <TextTrans
                    ar={destination.name_ar}
                    en={destination.name_en}
                  />
                  ,{' '}
                  {truncate(destination.location, {
                    length: 30,
                    omission: '...',
                  })}
                </p>
              </div>
            )}

            {method === 'delivery' && (
              <div>
                <div className="flex gap-x-1">
                  <p
                    className={`xxs-mobile-xs-desktop ${alexandriaFont}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {prefType === 'delivery_now' ? (
                      t('delivery_now')
                    ) : prefType === 'delivery_later' ? (
                      <>
                        {t('delivery_later')}
                        <span className="px-1.5">
                          {date} {time} {t('to')}
                        </span>
                      </>
                    ) : (
                      t('deliver_to')
                    )}
                    {/* {
                      {
                        ['delivery_now']: t('delivery_now'),
                        ['delivery_later']: t('delivery_later'),
                        ['']: t('deliver_to'),
                      }[prefType as string]
                    } */}
                  </p>

                  {/* {prefType === 'delivery_later' && (
                    <p
                      className={`xxs-mobile-xs-desktop ${alexandriaFont}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {date} {time} {t('to')}
                    </p>
                  )} */}
                </div>

                <p
                  className={`${alexandriaFontMeduim}`}
                  suppressHydrationWarning={suppressText}
                >
                  <TextTrans
                    ar={destination.name_ar}
                    en={destination.name_en}
                  />
                  {customerAddress.id ? (
                    <>
                      ,{' '}
                      {truncate(displayUserAddress(customerAddress), {
                        length: 30,
                        omission: '...',
                      })}
                    </>
                  ) : null}{' '}
                </p>
              </div>
            )}

            <div
              className="flex items-center"
              onClick={() => dispatch(setAreaBranchModalStatus(true))}
            >
              <p
                suppressHydrationWarning={suppressText}
                style={{ color: color }}
                className={`xxs-mobile-xs-desktop ${alexandriaFontMeduim}`}
              >
                {t('change')}
              </p>

              {router.locale === 'en' ? (
                <KeyboardArrowRight
                  style={{ color: color, fontSize: 16, textAlign: 'center' }}
                />
              ) : (
                <KeyboardArrowLeft
                  style={{ color: color, fontSize: 16, textAlign: 'center' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <ChangeMoodModal url={url} />
    </div>
  );
};

export default DeliveryPickup;
