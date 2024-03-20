import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { mainBtnClass, toEn } from '@/constants/*';
import moment, { Moment, locale } from 'moment';
import {
  isArray,
  isEmpty,
  isNull,
  isUndefined,
  lowerCase,
  map,
  reverse,
} from 'lodash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { suppressText } from '@/constants/*';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { useLazyGetTimingsQuery } from '@/redux/api/cartApi';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import { setPreferences } from '@/redux/slices/customerSlice';
import { Router, useRouter } from 'next/router';
import ContentLoader from '@/components/skeletons';
import { NextPage } from 'next';
// import 'moment/locale/ar'; // conflict reading arabic timing in 12 hrs mode

// check availability in case no date will return else will just navigate to checkout.
type Day = {
  day: string;
  date: string;
  rawDate: Moment;
};
type Props = {
  url: string;
  method: 'pickup' | 'delivery';
};

const SelectTime: NextPage<Props> = ({ url, method }): React.ReactNode => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const desObject = useAppSelector(destinationHeaderObject);
  const {
    locale: { lang, isRTL },
    searchParams: { destination_type },
  } = useAppSelector((state) => state);
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();
  const [triggerGetTimings, { data: timings, isSuccess: timingsSuccess }] =
    useLazyGetTimingsQuery();
  const [sliderSettings, setSliderSettings] = useState<Settings>({
    dots: false,
    infinite: false,
    slidesToScroll: isRTL ? 1 : 4,
    initialSlide: isRTL ? 2 : 0,
    rtl: isRTL,
    slidesToShow: 4,
    autoplay: false,
  });
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [isBtnEnabled, setIsBtnEnabled] = useState<boolean>(true);
  const [selectedHour, setSelectedHour] = useState<Moment>(
    moment().locale('en')
  );
  const [type, setType] = useState<
    'delivery_now' | 'delivery_later' | 'pickup_now' | 'pickup_later'
  >('delivery_now');
  const [days, setDays] = useState<Day[] | null>(null);
  const [selectedDay, setSelectedDay] = useState({
    day: ``,
    date: ``,
    rawDate: moment().locale('en'),
  });

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    if (!isScheduled) {
      triggerGetVendor(
        {
          lang,
          url,
          destination: desObject,
        },
        false
      ).then((r: any) => {
        if (r?.data?.Data?.delivery?.delivery_time) {
          dispatch(
            setPreferences({
              date: moment().locale('en').format('YYYY-MM-DD'),
              time:
                method === 'delivery'
                  ? r?.data.Data?.delivery?.delivery_time
                  : r?.data.Data?.delivery?.estimated_preparation_time,
              type: method === 'delivery' ? 'delivery_now' : 'pickup_now',
            })
          );
        } else {
          setIsBtnEnabled(false);
        }
      });
    }
    if (!isEmpty(method) && method === 'delivery') {
      setType('delivery_now');
    } else if (!isEmpty(method) && method === 'pickup') {
      setType('pickup_now');
    }
    handleDays();
  }, []);

  const handleDays = () => {
    const today = moment();
    const days: Day[] = [];
    const daysInCurrentMonth = today.daysInMonth();
    for (let i = 0; i < 31; i++) {
      const day = moment().startOf('day').add(i, 'days');
      const isToday = i === 0 || day.isSame(today, 'day');
      const isTomorrow =
        i === 1 || day.isSame(today.clone().add(1, 'day'), 'day');
      const isWithinNextMonth =
        day.isSameOrAfter(today, 'day') &&
        day.isBefore(today.clone().add(1, 'month'));
      if (isToday) {
        days.push({
          day: `today`,
          date: day.format('DD MMM'),
          rawDate: day.locale('en'),
        });
      } else if (isTomorrow) {
        days.push({
          day: `tomorrow`,
          date: day.format('DD MMM'),
          rawDate: day.locale('en'),
        });
      } else if (isWithinNextMonth && day.date() <= daysInCurrentMonth) {
        days.push({
          day: day.format('dddd'),
          date: day.format('DD MMM'),
          rawDate: day.locale('en'),
        });
      }
    }
    setDays(days);
  };

  useEffect(() => {
    if (!isNull(days)) {
      setSelectedDay({
        day: days[0].day,
        date: days[0].date,
        rawDate: days[0].rawDate.locale('en'),
      });
      if (isScheduled) {
        setIsBtnEnabled(false);
        if (!isEmpty(method) && method === 'delivery') {
          setType('delivery_later');
        } else if (!isEmpty(method) && method == 'pickup') {
          setType('pickup_later');
        }
      } else {
        setIsBtnEnabled(true);
        if (!isEmpty(method) && method === 'delivery') {
          setType('delivery_now');
        } else if (!isEmpty(method) && method === 'pickup') {
          setType('pickup_now');
        }
        if (!isEmpty(method)) {
          triggerGetVendor(
            {
              lang,
              url,
              destination: desObject,
            },
            false
          ).then((r: any) => {
            if (r?.data?.Data?.delivery?.delivery_time) {
              dispatch(
                setPreferences({
                  date: moment().locale('en').format('YYYY-MM-DD'),
                  time:
                    method === 'delivery'
                      ? r?.data.Data?.delivery?.delivery_time
                      : r?.data.Data?.delivery?.estimated_preparation_time,
                  type: method === 'delivery' ? 'delivery_now' : 'pickup_now',
                })
              );
            }
          });
        }
      }
    }
  }, [isScheduled, lang]);

  useEffect(() => {
    handleDays();
  }, [lang]);

  useEffect(() => {
    if (selectedDay && selectedDay.rawDate) {
      triggerGetTimings(
        {
          type,
          // date: toEn(moment(selectedDay?.date).format('YYYY-MM-DD')),
          date: selectedDay.rawDate?.locale('en').format('YYYY-MM-DD'),
          area_branch: desObject,
          url,
          lang,
        },
        false
      ).then((r: any) => {
        if (r?.error && r.error.data) {
          setIsBtnEnabled(false);
          dispatch(
            showToastMessage({ type: 'error', content: `no_timings_available` })
          );
        } else if (r && r.data && r.data.Data && r.data.Data.length > 1) {
          setIsBtnEnabled(true);
          if (
            r.data.Data === 'OPEN' &&
            (type === 'delivery_now' || type === 'pickup_now')
          ) {
          } else {
            const firstTiming: Moment = moment(
              r.data.Data[0],
              'HH:mm a'
            ).locale('en');
            if (firstTiming && firstTiming.isValid()) {
              handleSelectHour(firstTiming);
            }
          }
        }
      });
    }
  }, [selectedDay]);

  useEffect(() => {
    if (
      isScheduled &&
      selectedHour.isValid() &&
      selectedDay.rawDate.isValid()
    ) {
      setIsBtnEnabled(true);
    }
  }, [selectedHour]);

  const handleRadioChange = (value: string) => {
    setIsScheduled(value === 'scheduled');
  };

  const handleDaySelect = ({
    day,
    date,
    rawDate,
  }: {
    day: string;
    date: string;
    rawDate: Moment;
  }) => {
    setSelectedDay({
      day,
      date,
      rawDate,
    });
  };

  const handleSelectHour = (time: Moment) => {
    if (time.isValid()) {
      setSelectedHour(time);
    }
  };

  const handleClick = () => {
    if (
      selectedDay.rawDate.isValid() &&
      selectedHour.isValid() &&
      isScheduled
    ) {
      dispatch(
        setPreferences({
          date: selectedDay.rawDate.locale('en').format('YYYY-MM-DD'),
          time: selectedHour.locale('en').format('h:mm a'),
          type,
        })
      );
      // put other scenario here if you want
    }
    router.back();
  };

  if (!vendorSuccess)
    return (
      <MainContentLayout>
        <ContentLoader type="AreaBranch" sections={8} />
      </MainContentLayout>
    );

  return (
    <Suspense>
      <MainHead
        title={t('scheduled_order')}
        url={url}
        description={`${t('scheduled_order')}`}
      />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="select_time"
      >
        <div className="p-5 w-full overflow-x-hidden">
          {((!isUndefined(vendorElement?.Data?.delivery?.delivery_time) &&
            method === 'delivery') ||
            (!isUndefined(
              vendorElement?.Data?.delivery?.estimated_preparation_time
            ) &&
              method === 'pickup')) && (
            <label className="flex items-center w-full pt-2 pb-4 border-b-2 border-gray-100">
              <input
                id="now"
                name="time"
                type="radio"
                value="now"
                checked={!isScheduled}
                onChange={(e) => handleRadioChange(e.target.value)}
                className="h-4 w-4 me-1"
                style={{ accentColor: color }}
                suppressHydrationWarning={suppressText}
              />
              <span className={`font-bold mx-4`}>
                {`${t('now_within')} ${
                  method === 'delivery'
                    ? vendorElement?.Data?.delivery?.delivery_time
                    : vendorElement?.Data?.delivery?.estimated_preparation_time
                } ${t('minutes')}`}
              </span>
            </label>
          )}
          <label className="flex items-center w-full py-4">
            <input
              type="radio"
              name="time"
              value="scheduled"
              checked={isScheduled}
              onChange={(e) => handleRadioChange(e.target.value)}
              className="h-4 w-4 me-1"
              style={{ accentColor: color }}
              suppressHydrationWarning={suppressText}
            />
            <span className={`font-bold mx-4`}>{t('scheduled_order')}</span>
          </label>
          {isScheduled && (
            <div className={`overflow-x-auto flex flex-row`}>
              {map(days, (day, i) => (
                <div className="p-2 ps-0" key={i}>
                  <div
                    className={`w-[96px] h-20 p-2 flex flex-col justify-center items-center text-center rounded-lg capitlalize ${
                      selectedDay?.rawDate?.format('YYYY-MM-DD') ==
                      day.rawDate.format('YYYY-MM-DD')
                        ? `text-white`
                        : ``
                    }`}
                    style={{
                      backgroundColor: `${
                        selectedDay?.rawDate?.format('YYYY-MM-DD') ==
                        day.rawDate.format('YYYY-MM-DD')
                          ? color
                          : '#F5F5F5'
                      }`,
                    }}
                  >
                    <button
                      className="capitalize flex flex-col justify-center items-center"
                      onClick={() =>
                        handleDaySelect({
                          day: day.day,
                          date: day.date,
                          rawDate: day.rawDate,
                        })
                      }
                    >
                      <span className="flex xs-mobile-sm-desktop">
                        {t(lowerCase(day.day))}
                      </span>
                      <span className="flex flex-row xs-mobile-sm-desktop">
                        {day.date}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isScheduled && selectedHour && (
            <div>
              <h1 className="base-mobile-lg-desktop  font-extrbold my-4">
                {t('select_time')}
              </h1>
              {timings &&
                timingsSuccess &&
                isArray(timings.Data) &&
                timings.Data.length > 1 && (
                  <div className="w-100 space-y-4 mt-4">
                    {map(timings.Data, (time, i) => (
                      <label key={i} className="flex items-center w-full">
                        <input
                          type="radio"
                          name="hour"
                          value={time}
                          checked={
                            selectedHour.locale('en').format('h:mm A') ===
                            moment(time, 'h:mm A').locale('en').format('h:mm A')
                          }
                          onChange={() => {
                            handleSelectHour(
                              moment(time, 'h:mm A').locale('en')
                            );
                          }}
                          className="h-4 w-4 me-1"
                          style={{ accentColor: color }}
                        />
                        <span className="mx-2">
                          {moment(time, 'hh:mm a')
                            .locale(lang)
                            .format('h:mm A')}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
        {/* {`${t('now_within')} ${
                vendorElement?.Data?.delivery?.delivery_time
              } ${t('minutes')}`} */}
        <div className="flex justify-center px-5">
          <button
            onClick={() => handleClick()}
            className={`${mainBtnClass} mb-5`}
            disabled={!isBtnEnabled}
            style={{
              backgroundColor: color,
              color: `white`,
            }}
          >
            <span suppressHydrationWarning={suppressText}>{t('set_time')}</span>
            <div
              className="px-1 inline-block"
              suppressHydrationWarning={suppressText}
            >
              {isScheduled &&
              timings &&
              !isEmpty(timings?.Data) &&
              selectedHour.isValid() ? (
                <div className={`flex flex-row`}>
                  <div>
                    <span className="px-1">{t(selectedDay.day)}</span>
                    {selectedDay.day !== 'tomorrow' &&
                    selectedDay.day !== 'today'
                      ? moment(selectedDay.rawDate)
                          .locale('en')
                          .format('DD MMMM')
                      : null}
                  </div>
                  <span className="px-2 inline-block">-</span>
                  <div className={``}>
                    {selectedHour.locale(lang).format('h:mm a') ?? ``}
                  </div>
                </div>
              ) : (
                <div>
                  {t('now_within')}
                  {method === 'delivery'
                    ? vendorElement?.Data?.delivery?.delivery_time
                    : vendorElement?.Data?.delivery
                        ?.estimated_preparation_time}{' '}
                  {t('minutes')}
                </div>
              )}
            </div>
          </button>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};
export default SelectTime;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      const { method }: any = query;
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      if (method === `pickup` || method === `delivery`) {
        return {
          props: {
            url: req.headers.host,
            method: query.method,
          },
        };
      } else {
        return { notFound: true };
      }
    }
);
