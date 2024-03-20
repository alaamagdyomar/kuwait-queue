import CustomImage from '@/components/CustomImage';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyOrders from '@/appImages/empty_orders.png';
import Search from '@/appIcons/gray_search.svg';
import MyOrders from '@/appImages/my_orders.png';
import {
  alexandriaFontBold,
  alexandriaFontLight,
  appLinks,
  toEn,
} from '@/constants/*';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  debounce,
  isEmpty,
  kebabCase,
  lowerCase,
  snakeCase,
  toLower,
} from 'lodash';
import { suppressText } from '@/constants/*';
import {
  useGetUserOrdersQuery,
  useLazyTrackOrderQuery,
} from '@/redux/api/orderApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import { AppQueryResult, UpcomingOrders } from '@/types/queries';
import EmptyUserOrders from '@/components/order/EmptyUserOrders';
import UpcomingCompletedOrder from '@/components/order/UpcomingCompletedOrder';
import ContentLoader from '@/components/skeletons';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import { NextPage } from 'next';

type Props = {
  url: string;
};

const OrderIndex: NextPage<Props> = ({ url }): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    customer: { token },
    locale: { lang },
  } = useAppSelector((state) => state);
  const destination = useAppSelector(destinationHeaderObject);
  const { data, isLoading, isSuccess } = useGetUserOrdersQuery<{
    isSuccess: boolean;
    isLoading: boolean;
    data: AppQueryResult<any>;
  }>({ url, lang, destination }, { refetchOnMountOrArgChange: true });
  const [triggerTrackOrder, { data: order, isSuccess: orderSuccess }] =
    useLazyTrackOrderQuery();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const handleChange = async (search: string) => {
    if (search && search?.length >= 3) {
      await triggerTrackOrder({ order_code: toEn(search), url }).then((r) => {
        if (r.error) {
          dispatch(
            showToastMessage({
              type: 'error',
              content: toLower(snakeCase(r.error.data?.msg)),
            })
          );
        } else if (r.data && r.data.data) {
          router.push(`${appLinks.orderTrack(search)}`);
        } else {
          dispatch(
            showToastMessage({ type: 'error', content: 'no_orders_found' })
          );
        }
      });
    }
  };

  return (
    <Suspense>
      <MainHead title={t('orders')} url={url} description={`${t('orders')}`} />
      <MainContentLayout url={url} showBackBtnHeader currentModule="my_orders">
        {isSuccess ? (
          <>
            {data.data &&
            isEmpty(data.data.completed) &&
            isEmpty(data.data.upcoming) ? (
              <EmptyUserOrders handleChange={handleChange} />
            ) : (
              <div>
                {isEmpty(data.data.upcoming) ? (
                  <>
                    {/* enter id to track */}
                    <div className="flex flex-col items-center space-y-2 px-4 py-8">
                      <CustomImage
                        src={MyOrders}
                        alt="my orders"
                        width={100}
                        height={100}
                      />
                      <h3
                        className="text-base font-bold"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('have_a_order_id?_enter_it_to_track_it')}
                      </h3>
                      <div className="w-full flex items-center border-b-2 border-gray-200">
                        <Search className="text-zinc-500" />
                        <input
                          type="search"
                          name="searchArea"
                          id="searchArea"
                          placeholder={`${t('order_id')}`}
                          suppressHydrationWarning={suppressText}
                          className={`flex-1 px-2 py-3 h-12 bg-transparent text-base text-zinc-600 capitalize foucs:ring-0 outline-none`}
                          onChange={debounce(
                            (e) => handleChange(e.target.value),
                            400
                          )}
                          // onKeyDown={debounce((e) => {
                          //   handleChange(e);
                          // }, 300)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* upcoming */}
                    <div>
                      <h2 className={`p-3 base-mobile-lg-desktop ${alexandriaFontBold}`}>
                        {t('upcoming')}
                      </h2>
                      <div className="px-5">
                        {data.data.upcoming.map((order: UpcomingOrders) => (
                          <UpcomingCompletedOrder
                            upcoming={true}
                            order={order}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!isEmpty(data.data.completed) && (
                  <div className="border-t-4 border-[#F3F2F2]">
                    {/* completed */}

                    <h2 className={`p-3 base-mobile-lg-desktop ${alexandriaFontBold}`}>
                      {t('completed')}
                    </h2>
                    <div className="px-5 ">
                      {data.data.completed.map((order: UpcomingOrders) => (
                        <UpcomingCompletedOrder
                          completed={true}
                          order={order}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <ContentLoader type="MyOrders" sections={1} />
        )}
      </MainContentLayout>
    </Suspense>
  );
};
export default OrderIndex;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
