import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { useLazyGetVendorQuery, vendorApi } from '@/redux/api/vendorApi';
import { wrapper } from '@/redux/store';
import { UserAddressFields, Vendor } from '@/types/index';
import {
  EllipsisVerticalIcon,
  PlusSmallIcon,
} from '@heroicons/react/24/outline';
import NoAddresses from '@/appImages/no_address.svg';
import {
  appLinks,
  imageSizes,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import Link from 'next/link';
import {
  addressApi,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useLazyGetAddressesQuery,
} from '@/redux/api/addressApi';
import { useEffect, useState } from 'react';
import { Address, AppQueryResult, Area, Branch } from '@/types/queries';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  difference,
  filter,
  first,
  isEmpty,
  isNull,
  isObject,
  isUndefined,
  map,
  toLower,
  upperFirst,
} from 'lodash';
import {
  isAuthenticated,
  resetCustomerAddress,
  resetPreferences,
  setCustomer,
  setCustomerAddress,
  setPreferences,
} from '@/redux/slices/customerSlice';
import { useRouter } from 'next/router';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import {
  destinationId,
  setDestination,
} from '@/redux/slices/searchParamsSlice';
import ChangeLocationModal from '@/components/modals/ChangeLocationModal';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import moment from 'moment';

type Props = {
  element: Vendor;
  url: string;
};

const AddressSelectionIndex: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const destID = useAppSelector(destinationId);
  const [showChangeLocModal, setShowChangeLocModal] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(undefined);

  const {
    customer: {
      id,
      countryCode,
      name,
      phone,
      address: { id: addressId },
    },
    locale: { isRTL, lang },
  } = useAppSelector((state) => state);
  const [triggerGetAddresses, { data: addresses, isLoading, isSuccess }] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
      isSuccess: boolean;
    }>();
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetAddresses({ url }, false).then((r: any) => {
      const addressesWithSameAreaId = filter(
        r.data.data,
        (a) => a.address.area_id && a.address.area_id === destID.toString()
      );

      // check if the selected address in th
      // state is with the same area id
      const selectedAddressExist = filter(
        addressesWithSameAreaId,
        (add) => add.id === addressId
      );
      // console.log({ addressesWithSameAreaId }, { selectedAddressExist });

      // when no address is selected in the state
      if (isEmpty(selectedAddressExist)) {
        dispatch(setCustomerAddress(first(addressesWithSameAreaId)));
      }

      // const addressWithSameAreaId = first(
      //   filter(
      //     r.data.data,
      //     (a) => a.address.area_id && a.address.area_id === destID.toString()
      //   )
      // );
      // if (addressWithSameAreaId) {
      //   dispatch(setCustomerAddress(addressWithSameAreaId));
      // }
    });
  }, []);

  const handelDisplayAddress = (address: any) => {
    if (address && !isUndefined(address) && isObject(address)) {
      const addressValues =
        !isUndefined(address) &&
        Object.values(address).filter((value) => value !== null);

      const allAddress = addressValues ? addressValues.join(', ') : '';

      return allAddress;
    }
  };

  const handleSelectAddress = (address: Address) => {
    if (address.address.area_id === destID.toString()) {
      // set customer assress
      // destid === addressid
      dispatch(setCustomerAddress(address));
    } else {
      // setSelectedArea({
      //   id: address.address.area_id,
      //   name: address.address.area_en,
      //   name_ar: address.address.area_ar,
      //   name_en: address.address.area_ar,
      // });

      // destid !== addressid
      // set selected address
      setSelectedAddress(address);

      setShowChangeLocModal(true);

      // dispatch(
      //   showToastMessage({
      //     content: 'select_area_to_mach_your_selected_address',
      //     type: `info`,
      //   })
      // );
      // router.push(appLinks.selectArea('select_address'));
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

    // when selecting address with
    //diffrent area change area then set address
    dispatch(setDestination({ destination, type }));
    dispatch(setCustomerAddress(selectedAddress));

    await triggerGetVendor(
      {
        lang,
        url,
        destination: { 'x-area-id': destination.id },
      },
      false
    ).then((r: any) => {
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
    });
    dispatch(
      showToastMessage({
        content: `area_changed`,
        type: `success`,
      })
    );
    // router.reload();
  };

  if (!isSuccess) return <></>;

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="my_addresses">
      <div className="relative h-[100vh] mx-4 my-4">
        {addresses?.data && !isEmpty(addresses?.data) ? (
          <div>
            <div className={`mx-4 mb-4`}>
              <h1 className="base-mobile-lg-desktop font-extrabold">
                {t('select_address')}
              </h1>
            </div>
            {map(addresses?.data, (address: Address) => (
              <button
                onClick={() => handleSelectAddress(address)}
                className="flex flex-col w-full justify-start items-start space-y-4 rounded-lg mb-4 border"
                style={{ borderColor: color }}
                key={address.id}
              >
                <div className="flex  flex-col w-full border-b rounded-md p-3 overflow-hidden w-full xs-mobile-sm-desktop">
                  <div
                    className={`flex  flex-row w-full justify-between items-start p-2`}
                  >
                    <div className="w-full">
                      <div
                        className={`flex w-full flex-row justify-between items-center pb-2`}
                      >
                        <div>
                          <h5 className="font-semibold pb-2">{address.type}</h5>
                        </div>
                        <div>
                          {address.id == addressId ? (
                            <RadioButtonChecked style={{ color }} />
                          ) : (
                            <RadioButtonUnchecked style={{ color }} />
                          )}
                        </div>
                      </div>

                      <div className="text-zinc-400 text-left">
                        <p>{handelDisplayAddress(address.address)}</p>
                        <p>{name}</p>
                        <p>{address.address.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 min-h-screen space-y-3 flex-col justify-center items-center mx-4">
            <NoAddresses className="w-auto h-auto object-contain " />
            <p className="sm-mobile-base-desktop text-extrabold">
              {t('no_address')}
            </p>
            <p className="sm-mobile-base-desktop text-extrabold text-center w-full lg:w-[80%]">
              {t('no_address_des')}
            </p>
          </div>
        )}

        <div className="relative -bottom-10 p-2 w-full">
          <Link
            href={`${appLinks.createAuthAddress(id, 'house')}`}
            className={`${mainBtnClass} flex flex-row justify-center items-center bg-gray-200`}
            suppressHydrationWarning={suppressText}
          >
            <PlusSmallIcon className="w-6 h-6 text-black" />
            <p className="w-fit sm-mobile-base-desktop text-center mx-2 text-black">
              {t('add_new_address')}
            </p>
          </Link>

          <button
            disabled={!addressId}
            onClick={() => router.push(appLinks.checkout.path)}
            className={`${mainBtnClass} mt-4`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
          >
            {`${upperFirst(`${t('continue')}`)}`}
          </button>
        </div>
      </div>
      <ChangeLocationModal
        isOpen={showChangeLocModal}
        onRequestClose={() => setShowChangeLocModal(false)}
        url={url}
        selectedMethod="delivery"
        area_branch={
          {
            id: selectedAddress?.address?.area_id,
            name: selectedAddress?.address?.area_en,
            name_ar: selectedAddress?.address?.area_ar,
            name_en: selectedAddress?.address?.area_ar,
          } as Area
        }
        changeLocation={handleChangeArea}
      />
    </MainContentLayout>
  );
};

export default AddressSelectionIndex;

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
