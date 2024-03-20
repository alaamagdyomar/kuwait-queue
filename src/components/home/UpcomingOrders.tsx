import {
  alexandriaFont,
  alexandriaFontBold,
  alexandriaFontLight,
  alexandriaFontMeduim,
  alexandriaFontSemiBold,
  appLinks,
  suppressText,
} from '@/constants/*';
import { useGetUpcomingOrdersQuery } from '@/redux/api/orderApi';
import { useAppSelector } from '@/redux/hooks';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { AppQueryResult, UpcomingOrders } from '@/types/queries';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import DeliveryIcon from '@/appIcons/order_status_delivery.svg';
import PreparingIcon from '@/appIcons/order_status_preparing.svg';
import Slider from 'react-slick';
import ContentLoader from '../skeletons';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';

const UpComingOrders: FC = () => {
  const { t } = useTranslation();
  const {
    locale: { lang, isRTL, dir },
    appSetting: { url },
    customer: { phone },
  } = useAppSelector((state) => state);
  const desObject = useAppSelector(destinationHeaderObject);
  const router = useRouter();

  const { data, isSuccess, isLoading } = useGetUpcomingOrdersQuery(
    {
      lang,
      destination: desObject,
      url,
      phone,
    },
    { refetchOnMountOrArgChange: true, skip: !phone }
  );

  var settings = {
    // dots: true,
    // className: 'transform-none',
    rtl: isRTL,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    // variableWidth: true,
    // useTransform: false,
    centerMode: true,
    centerPadding: isRTL ? '0px 0px 0px 50px' : '50px 0px 0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: isRTL ? '0px 0px 0px 50px' : '50px 0px 0px',
          //   infinite: true,
          //   dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // centerPadding: '30px 0px 0px',
          centerPadding: isRTL ? '0px 0px 0px 30px' : '30px 0px 0px',
          //   initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // centerPadding: '10px 0px 0px',
          centerPadding: isRTL ? '0px 0px 0px 10px' : '10px 0px 0px',
        },
      },
    ],
  };

  return (
    <>
      {phone && (
        <>
          {isSuccess ? (
            !isEmpty(data.data) && (
              <div className="px-4 mt-7">
                <p
                  className={`${alexandriaFontBold} mb-3 mt-5 base-mobile-lg-desktop`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('your_upcoming_order')}
                </p>
                <Slider {...settings}>
                  {data?.data.map((order, i) => (
                    <div className="px-2 " dir={dir} key={i}>
                      <div
                        className={`border-2 border-[#E8E5E3] rounded-md p-5 w-full h-auto md:h-[150px]`}
                      >
                        <div className="flex justify-between gap-x-2 text-[#544A45] xxs-mobile-xs-desktop border-b border-dashed border-[#E8E5E3] pb-3 mb-3">
                          <p
                            className={`${alexandriaFont}`}
                            suppressHydrationWarning={suppressText}
                          >
                            {order.created_at}
                          </p>
                          <p
                            className={`${alexandriaFontSemiBold}`}
                            suppressHydrationWarning={suppressText}
                          >
                            {order.total} {t('kd')}
                          </p>
                        </div>

                        <div className="flex justify-between gap-2 flex-wrap md:flex-nowrap">
                          <div className="flex gap-x-2">
                            <div>
                              {order.order_type === 'pickup_later' ||
                              order.order_type === 'pickup_now' ? (
                                <PreparingIcon />
                              ) : (
                                <DeliveryIcon />
                              )}
                            </div>

                            <div
                              className={`text-[#544A45] xxs-mobile-xs-desktop ${alexandriaFontLight}`}
                            >
                              <p
                                className={`${alexandriaFontMeduim}`}
                                suppressHydrationWarning={suppressText}
                              >
                                {order.order_status}
                              </p>
                              <p suppressHydrationWarning={suppressText}>
                                {t('order_id')} : #{order.order_code}
                              </p>
                              <p suppressHydrationWarning={suppressText}>
                                {t('estimated_time')} {order.estimated_time}
                              </p>
                            </div>
                          </div>
                          <div className="flex md:block justify-end w-full md:w-auto">
                            <button
                              onClick={() =>
                                router.push(
                                  appLinks.orderTrack(order.order_code)
                                )
                              }
                              className={`whitespace-nowrap bg-[#F3F2F2] text-[#1A1615] h-fit rounded-full px-2 text-xxs ${alexandriaFontSemiBold}`}
                            >
                              {t('track_order')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )
          ) : (
            <ContentLoader type="SliderSkelton" sections={1} />
          )}
        </>
      )}
    </>
  );
};
export default UpComingOrders;
