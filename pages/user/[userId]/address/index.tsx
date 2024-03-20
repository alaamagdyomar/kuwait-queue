import MainLayout from '@/layouts/MainLayout';
import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
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
import { Address, AppQueryResult } from '@/types/queries';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  difference,
  filter,
  first,
  isEmpty,
  isNull,
  isObject,
  isUndefined,
  keyBy,
  keys,
  lowerCase,
  map,
  pickBy,
  toLower,
} from 'lodash';
import {
  resetCustomerAddress,
  setCustomerAddress,
} from '@/redux/slices/customerSlice';
import { useRouter } from 'next/router';

type Props = {
  element: Vendor;
  url: string;
};

const AddressIndex: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {
    customer: { id, countryCode, name, phone },
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const [triggerGetAddresses, { data: addresses, isLoading, isSuccess }] =
    useLazyGetAddressesQuery<{
      data: AppQueryResult<UserAddressFields[]>;
      isLoading: boolean;
      isSuccess: boolean;
    }>();
  const [triggerDeleteAddress] = useDeleteAddressMutation();
  const [nextType, setNextType] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetAddresses({ url }, false).then((r: any) => {
      if (r && r.data && r.data.data) {
        // checkAddressesList(r && r.data && r.data.data);
      }
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

  const showHideEditBtn = (address: any) => {
    if (selectedAddress === address) {
      setSelectedAddress(null);
    } else {
      setSelectedAddress(address);
    }
  };

  const handleEdit = async (address: any) => {
    return router.push(
      appLinks.editAuthAddress(id, address.id, lowerCase(address.type))
    );
  };

  const handleDelete = async (address: any) => {
    await triggerDeleteAddress({
      params: {
        address_id: address.id,
      },
      url,
    }).then((r) => {
      if (r?.data?.status) {
        dispatch(
          showToastMessage({
            content: `address_deleted_successfully`,
            type: `success`,
          })
        );
        triggerGetAddresses({ url }, false).then(() =>
          dispatch(resetCustomerAddress(undefined))
        );
      } else {
        dispatch(
          showToastMessage({
            content: r.error.data.msg,
            type: `error`,
          })
        );
      }
    });
  };

  if (!isSuccess) return <></>;

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="my_addresses">
      <div className="relative h-[100vh]">
        {isSuccess && addresses?.data && !isEmpty(addresses?.data) ? (
          <div>
            {map(addresses?.data, (address: Address) => (
              <div
                className="flex flex-col w-auto justify-start items-start mx-4 space-y-4"
                key={address.id}
              >
                <div className="flex flex-1 flex-col w-auto border-b rounded-md p-3 overflow-hidden w-full xs-mobile-sm-desktop">
                  <div
                    className={`flex flex-1 flex-row justify-between items-start`}
                  >
                    <div>
                      <h5 className="font-semibold pb-2">{address.type}</h5>
                      <div className="text-zinc-600">
                        <p>{handelDisplayAddress(address.address)}</p>
                        <p>{name}</p>
                        <p>{address.address.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div>
                          <EllipsisVerticalIcon
                            className="h-8"
                            onClick={() => showHideEditBtn(address)}
                          />
                        </div>
                        {selectedAddress === address && (
                          <div
                            className={`pe-5 absolute top-0 transform  bg-white rounded-lg py-2 px-4 shadow-md capitalize ${
                              isRTL
                                ? '-left-1/2 translate-x-[40%]'
                                : ' left-1/2 -translate-x-[100%]'
                            }`}
                          >
                            <button
                              onClick={() => handleEdit(address)}
                              className={`capitalize pb-2 px-2 border-b-[1px] border-stone-300 w-100  text-start`}
                            >
                              {t('edit')}
                            </button>
                            <button
                              onClick={() => handleDelete(address)}
                              className={`capitalize py-2 mb-2 px-2 text-red-600  text-start`}
                            >
                              {t('remove')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        {/* {!isNull(nextType) && ( */}
        <div className="relative -bottom-10 p-2 w-full">
          <Link
            href={`${appLinks.createAuthAddress(id, toLower('HOUSE'))}`}
            className={`${mainBtnClass} flex flex-row justify-center items-center`}
            style={{ backgroundColor: color }}
            suppressHydrationWarning={suppressText}
          >
            <PlusSmallIcon className="w-6 h-6" />
            <p className="w-fit sm-mobile-base-desktop text-center mx-2">
              {t('add_address')}
            </p>
          </Link>
        </div>
        {/* )} */}
      </div>
    </MainContentLayout>
  );
};

export default AddressIndex;

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
