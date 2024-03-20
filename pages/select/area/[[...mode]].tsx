import ElementMap from '@/components/address/ElementMap';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { useLazyGetVendorQuery, vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { ServerCart, Vendor } from '@/types/index';
import { NextPage } from 'next';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ChevronUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useLazyGetLocationsQuery } from '@/redux/api/locationApi';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { AppQueryResult, Area, Branch, Location } from '@/types/queries';
import { useCallback, useEffect, useState } from 'react';
import { debounce, isEmpty, isNull, lowerCase, map } from 'lodash';
import TextTrans from '@/components/TextTrans';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Icon } from '@mui/material';
import { appLinks, suppressText } from '@/constants/*';
import { CheckCircle, CircleOutlined } from '@mui/icons-material';
import {
  destinationHeaderObject,
  destinationId,
  setDestination,
} from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import ContentLoader from '@/components/skeletons';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import ChangeLocationModal from '@/components/modals/ChangeLocationModal';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import {
  isAuthenticated,
  resetCustomerAddress,
  resetPreferences,
  setCustomerAddressArea,
  setPreferences,
} from '@/redux/slices/customerSlice';
import moment from 'moment';

type Props = {
  element: Vendor;
  url: string;
};

const SelectArea: NextPage<Props> = ({ element, url }): React.ReactElement => {
  const { query }: any = useRouter();
  const {
    locale: { lang, isRTL },
    searchParams: { method, destination },
    customer: {
      userAgent,
      prefrences,
      id,
      address: { id: addressId, type: addressType },
    },
    cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const isAuth = useAppSelector(isAuthenticated);
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(0);
  const [allLocations, setAllLocations] = useState<any>();
  const router = useRouter();
  const [showChangeLocModal, setShowChangeLocModal] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<Area | undefined>(undefined);
  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };
  const { data: cartItems, isLoading: cartLoading } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>(
    {
      userAgent,
      area_branch: destObj,
      PromoCode: promocode,
      url,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [
    triggerGetLocations,
    {
      data: locations,
      isLoading: locationsLoading,
      isSuccess: locationsSuccess,
    },
  ] = useLazyGetLocationsQuery<{
    data: AppQueryResult<Location[]>;
    isLoading: boolean;
    isSuccess: boolean;
  }>();
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetLocations({ lang, url, type: method }, false);
  }, []);

  const handleSelectMethod = async (
    destination: Area | Branch,
    type: 'pickup' | 'delivery'
  ) => {
    if (isNull(destID)) {
      handleChangeArea(destination, type);
    } else if (
      type !== method ||
      (type === method && destID !== destination.id)
    ) {
      // change
      if (isEmpty(cartItems?.data?.Cart)) {
        handleChangeArea(destination, type);
      } else {
        setSelectedArea(destination);
        setShowChangeLocModal(true);
      }
    } else {
      router.back();
    }
  };

  const handleChangeArea = async (
    destination: Area | Branch,
    type: 'pickup' | 'delivery'
  ) => {
    // in case of user reset user address cause u changed dest id
    if (isAuth) {
      dispatch(resetCustomerAddress(undefined));
    }
    dispatch(setDestination({ destination, type }));
    dispatch(
      showToastMessage({
        content: `area_selected`,
        type: `success`,
      })
    );
    dispatch(setAreaBranchModalStatus(true));
    await triggerGetVendor(
      {
        lang,
        url,
        destination: { 'x-area-id': destination.id },
      },
      false
    )
      .then((r: any) => {
        if (r?.data?.Data?.delivery?.delivery_time) {
          dispatch(
            setPreferences({
              date: moment().locale('en').format('YYYY-MM-DD'),
              time: r?.data.Data?.delivery?.delivery_time,
              type: 'delivery_now',
            })
          );
        } else {
          dispatch(resetPreferences(undefined));
        }
      })
      .then((r: any) => {
        if (query.mode && query.mode[0]) {
          const currentMode = query.mode[0];
          switch (currentMode) {
            case 'guest':
              return router.push(appLinks.guestAddress.path);
            case 'user_create':
              return router.push(
                appLinks.createAuthAddress(
                  id,
                  lowerCase(addressType),
                  `area_id=${destination.id}&area=${destination.name}`
                )
              );
            case 'user_edit':
              return router.push(
                appLinks.editAuthAddress(
                  id,
                  addressId,
                  lowerCase(addressType),
                  `area_id=${destination.id}&area=${destination.name}`
                )
              );
            case 'select_address':
              return router.push(appLinks.selectAddress(id));
            case 'home':
              return router.push(appLinks.home.path);
            default:
              return router.back();
          }
        } else {
          router.back();
        }
      });
  };

  useEffect(() => {
    setAllLocations(locations?.Data);
  }, [locations]);

  const handleChange = (area: any) => {
    if (area === '') {
      setAllLocations(locations.Data);
    } else {
      if (locationsSuccess) {
        const filteredAreas = locations?.Data?.filter((item) =>
          item.Areas.some((a) => a.name.toLowerCase().includes(area))
        );
        setAllLocations(filteredAreas);
        if (filteredAreas && filteredAreas.length > 0) {
          setOpen(filteredAreas[0]?.id ?? false);
        }
      }
    }
  };

  const Icon = ({ id, open }: { id: number; open: number }) => {
    return open === id ? (
      <ChevronUpIcon className="flex text-black w-auto h-6 " />
    ) : (
      <ChevronDownIcon className="text-black w-auto h-6" />
    );
  };

  if (
    // branchesLoading ||
    locationsLoading ||
    !locations ||
    !locations.Data ||
    cartLoading ||
    !cartItems ||
    !cartItems.data
    // !branches ||
    // !branches.Data ||
  ) {
    return (
      <MainContentLayout>
        <ContentLoader type="AreaBranch" sections={8} />
      </MainContentLayout>
    );
  }

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule={`${t('select_area')}`}
    >
      <div className="flex  flex-col min-h-screen">
        <div className="flex flex-row w-full h-auto justify-center items-center p-6 outline-none">
          <MagnifyingGlassIcon
            className={`absolute ltr:left-14 rtl:right-14 text-gray-500 w-8 h-8 pt-1`}
          />
          <input
            type="text"
            className={`w-full h-14 rounded-full mx-2 bg-gray-100 border border-stone-100 ltr:pl-20 rtl:pr-20 outline-none`}
            placeholder={`${t('search_for_cities_and_areas')}`}
            onChange={debounce((e) => handleChange(e.target.value), 400)}
            suppressHydrationWarning={suppressText}
          />
        </div>

        <div className={`mx-4`}>
          {map(allLocations, (item: Location, i) => {
            return (
              <div key={i}>
                {item.Areas?.length > 0 && (
                  <Accordion
                    key={i}
                    open={open === item.id}
                    icon={<Icon id={item.id} open={open} />}
                  >
                    <AccordionHeader
                      className="flex w-full justify-between py-4 border-b border-gray-200"
                      onClick={() => handleOpen(item.id)}
                      suppressHydrationWarning={suppressText}
                      data-cy="accordion"
                    >
                      <TextTrans
                        ar={item.name_ar}
                        en={item.name_en}
                        className="flex flex-1 base-mobile-lg-desktop font-bold"
                        length={60}
                      />
                    </AccordionHeader>
                    <AccordionBody className="p-0 m-0">
                      <div className="">
                        {map(item.Areas, (a: Area, i) => (
                          <button
                            className={
                              'flex w-full justify-between py-4 border-b border-gray-200'
                            }
                            key={i}
                            onClick={() => handleSelectMethod(a, 'delivery')}
                          >
                            <TextTrans
                              ar={a.name_ar}
                              en={a.name_en}
                              className="flex base-mobile-lg-desktop"
                              length={60}
                            />
                            <div className="flex flex-1 justify-end items-end">
                              {destination && a.id === destination.id ? (
                                <CheckCircle
                                  style={{ color }}
                                  className="text-black w-6 h-6 "
                                />
                              ) : (
                                <CircleOutlined className="text-black w-6 h-6 " />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </AccordionBody>
                  </Accordion>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <ChangeLocationModal
        isOpen={showChangeLocModal}
        onRequestClose={() => setShowChangeLocModal(false)}
        url={url}
        selectedMethod="delivery"
        area_branch={selectedArea as Area}
        changeLocation={handleChangeArea}
      />
    </MainContentLayout>
  );
};

export default SelectArea;

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
