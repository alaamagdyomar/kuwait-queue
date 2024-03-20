import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import TextTrans from '@/components/TextTrans';
import Link from 'next/link';
import { appLinks } from '@/constants/*';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import MapIcon from '@/appIcons/map_icon.svg';
import { isNull } from 'lodash';
import { useEffect } from 'react';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  element: Vendor;
  url: string;
};

const AddressMap: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const {
    locale: { isRTL },
    customer: { id },
    searchParams: { destination, destination_type, method },
  } = useAppSelector((state) => state);
  const isAuth = useAppSelector(isAuthenticated);
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const dispatch=useAppDispatch()

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);


  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="set_delivery_location"
    >
      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex flex-row h-auto py-6 px-4 justify-start items-center">
          <MapPinIcon className={`w-6 h-6 text-red-600 `} />
          <Link
            href={appLinks.selectArea(``)}
            className="flex flex-1 flex-col px-4 space-y-2"
          >
            <p>{destination_type && t(`${destination_type}`)}</p>
            {!isNull(destination) ? (
              <TextTrans ar={destination?.name_ar} en={destination?.name_en} />
            ) : (
              <p>{t('select_area')}</p>
            )}
          </Link>
          {isRTL ? (
            <ChevronLeftIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          ) : (
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
        {/* {destination?.latitude && destination?.longitude && (
          <ElementMap lat={destination?.latitude} lng={destination?.longitude} />
        )} */}
        <div className="flex h-auto w-full flex-col flex-1 justify-start items-start  px-4 py-4 space-y-2">
          {!isNull(destination) && (
            <>
              <h1>{t(`delivery_address`)}</h1>
              <div className="flex">
                <MapIcon />
                <TextTrans
                  ar={destination?.name_ar}
                  en={destination?.name_en}
                  className={`text-gray-600 mx-4`}
                />
              </div>
            </>
          )}

          <div className="flex flex-1 w-full">
            {isNull(destination) ? (
              <button
                disabled={true}
                className={`flex justify-center items-center w-full h-14 mt-[10%] rounded-3xl disabled:bg-stone-400 p-3 px-8 text-white capitalize`}
                style={{backgroundColor: color}}
              >
                {t(`deliver_here`)}
              </button>
            ) : (
              <Link
                href={
                  method === 'delivery'
                    ? isAuth && id
                      ? appLinks.createAuthAddress(id,'house','prevPG=map')
                      : appLinks.cart.path
                    : appLinks.cart.path
                }
                className={`flex justify-center items-center w-full h-14 mt-[10%] rounded-3xl disabled:bg-stone-400 p-3 px-8 text-white capitalize`}
                style={{backgroundColor: color}}
              >
                {t(`deliver_here`)}
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainContentLayout>
  );
};

export default AddressMap;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale, url })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data || !url) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
          url,
        },
      };
    }
);
