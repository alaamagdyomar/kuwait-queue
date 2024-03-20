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
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  appLinks,
  errorMsgClass,
  mainBtnClass,
  suppressText,
} from '@/constants/*';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useCreateAddressMutation,
  useLazyGetAddressesByIdQuery,
  useLazyGetAddressesQuery,
  useUpdateAddressMutation,
} from '@/redux/api/addressApi';
import { addressSchema } from 'src/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import { setCustomerAddress, setNotes } from '@/redux/slices/customerSlice';
import {
  filter,
  first,
  kebabCase,
  lowerCase,
  toUpper,
  upperCase,
} from 'lodash';
import { useRouter } from 'next/router';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Address, AppQueryResult } from '@/types/queries';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import MainAddressTabs from '@/components/address/MainAddressTabs';

type Props = {
  element: Vendor;
  url: string;
  userId: string;
  addressId: string;
  type: string;
};

const AddressEdit: NextPage<Props> = ({
  element,
  url,
  userId,
  addressId,
  type,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    locale: { isRTL },
    customer,
    searchParams: { method, destination },
    cart: { promocode },
  } = useAppSelector((state) => state);
  // const desObject = useAppSelector(destinationHeaderObject);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  // const [currentAddresses, setCurrentAddresses] = useState<any>(null);
  // const refForm = useRef<any>();
  const [triggerUpdateAddress, { isLoading: AddAddressLoading }] =
    useUpdateAddressMutation();
  const [
    triggerGetAddressById,
    { data: address, isSuccess: addressByIdSuccess },
  ] = useLazyGetAddressesByIdQuery();
  // const [triggerGetAddresses, { data: addresses, isLoading }, isSuccess] =
  //   useLazyGetAddressesQuery<{
  //     data: AppQueryResult<UserAddressFields[]>;
  //     isLoading: boolean;
  //   }>();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addressSchema('delivery', t)),
    defaultValues: {
      method: 'delivery',
      address_type: toUpper(type),
      longitude: ``,
      latitude: ``,
      customer_id: userId.toString(),
      phone: '',
      name: '',
      block: '',
      street: '',
      house_no: '',
      floor_no: '',
      building_no: '',
      appartment_no: '',
      office_no: '',
      area: '',
      area_id: '',
      avenue: '',
      paci: '',
      other_phone: '',
      notes: '',
    },
  });

  // const { data: cartItems } = useGetCartProductsQuery({
  //   userAgent: customer.userAgent,
  //   area_branch: desObject,
  //   url,
  //   PromoCode: promocode,
  // });

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  useEffect(() => {
    setValue('address_type', toUpper(type));
  }, [type]);

  useEffect(() => {
    if (router.isReady) {
      triggerGetAddressById({ address_id: addressId, url }, false)
        .then((r: any) => {
          if (r.data && r.data.Data) {
            reset({
              ...r.data.Data.address,
              address_type: toUpper(type),
              customer_id: r.data.Data.customer_id,
              method: 'delivery',
            });
          }
        })
        .then(() => {
          if (router.query.area_id) {
            setValue('area_id', router.query.area_id);
            if (router.query.area_id === destination.id) {
              setValue(
                'area',
                isRTL ? destination.name_ar : destination.name_en
              );
            } else {
              setValue('area', router.query.area);
            }
          }
        });
    }
  }, [addressId, type]);

  const handleSaveAddress = async (body: any) => {
    await triggerUpdateAddress({
      body: {
        address_id: addressId,
        address_type: upperCase(body.address_type),
        customer_id: userId.toString(),
        address: {
          phone: body.phone,
          name: body.name,
          block: body.block,
          street: body.street,
          house_no: body.house_no,
          avenue: body.avenue,
          paci: body.paci,
          floor_no: body.floor_no,
          building_no: body.building_no,
          apartment_no: body.apartment_no,
          office_no: body.office_no,
          other_phone: body.other_phone,
          area: body.area,
          area_id: body.area_id,
          notes: body.notes,
        },
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data.status) {
        dispatch(
          showToastMessage({
            content: `address_saved_successfully`,
            type: `success`,
          })
        );
        dispatch(setCustomerAddress(r.data.Data));
        reset({
          ...r.data.Data.address,
          address_type: r.data.Data.type,
          customer_id: r.data.Data.customer_id,
          method,
        });
        if (body.notes) {
          dispatch(setNotes(body.notes));
        }
        router.back();
      } else {
        if (r.error && r.error.data?.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg[`address`][0])),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const onSubmit = async (body: any) => {
    await handleSaveAddress(body);
  };

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader={true}
      currentModule="address_details"
    >
      <div className="flex flex-1 flex-col h-full mt-8">
        <MainAddressTabs
          userId={userId}
          addressId={addressId}
          edit={true}
          currentAddressType={toUpper(type)}
        />

        {/*  form  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-1 flex-col justify-start items-start m-3 space-y-4`}
        >
          {/*  phone  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="phone"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('phone_no')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('phone')}
                suppressHydrationWarning={suppressText}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                placeholder={`${t('phone_no')}`}
              />
            </div>
            {errors?.phone && (
              <span
                className={`${errorMsgClass}`}
                suppressHydrationWarning={suppressText}
              >
                {t('phone_is_required')}
              </span>
            )}
          </div>

          {/*  full_name  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="full_name"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('full_name')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                suppressHydrationWarning={suppressText}
                {...register('name')}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                placeholder={`${t('full_name')}`}
              />
            </div>
            {errors?.name && (
              <span
                className={`${errorMsgClass}`}
                suppressHydrationWarning={suppressText}
              >
                {t('name_is_required')}
              </span>
            )}
          </div>

          {/*  city / area   */}
          <div
            className="w-full"
            onClick={() => router.push(appLinks.selectArea(`user_edit`))}
          >
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="city_and_area"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('city_and_area')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                suppressHydrationWarning={suppressText}
                {...register('area')}
                name="area"
                disabled
                id="area"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6 disabled:bg-white"
                placeholder={`${t('city_and_area')}`}
                onFocus={() => router.push(appLinks.selectArea(`user_edit`))}
              />
              <input
                type="text"
                suppressHydrationWarning={suppressText}
                {...register('area_id')}
                name="area_id"
                disabled
                id="area_id"
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6 disabled:bg-white hidden"
                placeholder={`${t('city_and_area')}`}
                onFocus={() => router.push(appLinks.selectArea(`user_edit`))}
              />
              <div
                className={`${
                  isRTL ? `left-0` : `right-0`
                } pointer-events-none absolute inset-y-0  flex items-center`}
              >
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
            </div>
            {(errors?.area?.message || errors?.area_id?.message) && (
              <span
                className={`${errorMsgClass}`}
                suppressHydrationWarning={suppressText}
              >
                {t('area_is_required')}
              </span>
            )}
          </div>

          {/*  block  */}
          <div className="w-full">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="block"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('block')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('block')}
                defaultValue={currentAddress?.address?.block}
                suppressHydrationWarning={suppressText}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                placeholder={`${t('block')}`}
              />
            </div>
            {errors?.block?.message && (
              <span
                className={`${errorMsgClass}`}
                suppressHydrationWarning={suppressText}
              >
                {t('block_is_required')}
              </span>
            )}
          </div>

          {/*  street  */}
          <div className="w-full">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="street"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('street')}*
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('street')}
                defaultValue={currentAddress?.address?.street}
                suppressHydrationWarning={suppressText}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                placeholder={`${t('street')}`}
              />
            </div>
            {errors?.street?.message && (
              <span
                className={`${errorMsgClass}`}
                suppressHydrationWarning={suppressText}
              >
                {t('street_is_required')}
              </span>
            )}
          </div>

          {/*  house_no  */}
          {toUpper(type) === 'HOUSE' && (
            <div className="w-full ">
              <label
                suppressHydrationWarning={suppressText}
                htmlFor="house_no"
                className="block xs-mobile-sm-desktop font-medium text-gray-900"
              >
                {t('house_no')}*
              </label>
              <div className="relative rounded-md">
                <input
                  {...register('house_no')}
                  suppressHydrationWarning={suppressText}
                  defaultValue={currentAddress?.address?.house_no}
                  className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                  placeholder={`${t('house_no')}`}
                />
              </div>
              {errors?.house_no?.message && (
                <span
                  className={`${errorMsgClass}`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('house_no_is_required')}
                </span>
              )}
            </div>
          )}

          {/*  building_no  */}
          {toUpper(type) !== 'HOUSE' && (
            <div className="w-full ">
              <label
                suppressHydrationWarning={suppressText}
                htmlFor="building_no"
                className="block xs-mobile-sm-desktop font-medium text-gray-900"
              >
                {t('building_no')}*
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  {...register('building_no')}
                  suppressHydrationWarning={suppressText}
                  defaultValue={currentAddress?.address?.building_no}
                  className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                  placeholder={`${t('building_no')}`}
                />
              </div>
              {errors?.building_no?.message && (
                <span
                  className={`${errorMsgClass}`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('building_no_is_required')}
                </span>
              )}
            </div>
          )}

          {/*  floor_no  */}
          {/*  apartment_no  */}
          {toUpper(type) === 'APARTMENT' && (
            <>
              {/*  floor_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="floor_no"
                  className="block xs-mobile-sm-desktop font-medium text-gray-900"
                >
                  {t('floor_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('floor_no')}
                    suppressHydrationWarning={suppressText}
                    defaultValue={currentAddress?.address?.floor_no}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                    placeholder={`${t('floor_no')}`}
                  />
                </div>
                {errors?.floor_no?.message && (
                  <span
                    className={`${errorMsgClass}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('floor_no_is_required')}
                  </span>
                )}
              </div>

              {/*  apartment_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="apartment_no"
                  className="block xs-mobile-sm-desktop font-medium text-gray-900"
                >
                  {t('apartment_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('apartment_no')}
                    suppressHydrationWarning={suppressText}
                    defaultValue={currentAddress?.address?.apartment_no}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                    placeholder={`${t('apartment_no')}`}
                  />
                </div>
                {errors?.apartment_no?.message && (
                  <span
                    className={`${errorMsgClass}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('apartment_no_is_required')}
                  </span>
                )}
              </div>
            </>
          )}

          {toUpper(type) === 'OFFICE' && (
            <>
              {/*  office_no  */}
              <div className="w-full ">
                <label
                  suppressHydrationWarning={suppressText}
                  htmlFor="office_no"
                  className="block xs-mobile-sm-desktop font-medium text-gray-900"
                >
                  {t('office_no')}*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    {...register('office_no')}
                    suppressHydrationWarning={suppressText}
                    defaultValue={currentAddress?.address?.office_no}
                    className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                    placeholder={`${t('office_no')}`}
                  />
                </div>
                {errors?.office_no?.message && (
                  <span
                    className={`${errorMsgClass}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('office_no_is_required')}
                  </span>
                )}
              </div>
            </>
          )}

          {/*  notice  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="notice"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('notice')}{' '}
              <span className="text-[10px]">({t('optional')})</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('notes')}
                suppressHydrationWarning={suppressText}
                defaultValue={currentAddress?.address?.notes}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                placeholder={`${t('notice')}`}
              />
            </div>
            {errors?.notes?.message && (
              <span
                className={`${errorMsgClass}`}
                suppressHydrationWarning={suppressText}
              >
                {t('notes')}
              </span>
            )}
          </div>

          {/*  other_phone  */}
          <div className="w-full ">
            <label
              suppressHydrationWarning={suppressText}
              htmlFor="other_phone"
              className="block xs-mobile-sm-desktop font-medium text-gray-900"
            >
              {t('other_phone_no')}{' '}
              <span className="text-[10px]">({t('optional')})</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                {...register('other_phone')}
                suppressHydrationWarning={suppressText}
                defaultValue={currentAddress?.address?.other_phone}
                className="block w-full border-0 py-1 text-gray-900 border-b border-gray-400 placeholder:text-gray-400 focus:border-red-600 xs-mobile-sm-desktop sm:leading-6"
                placeholder={`${t('other_phone_no')}`}
              />
            </div>
          </div>

          <div className="flex flex-1 justify-center items-end w-full">
            <button
              type="submit"
              className={`${mainBtnClass}`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
            >
              <p className="sm-mobile-base-desktop">{t('save_address')}</p>
            </button>
          </div>
        </form>
      </div>
    </MainContentLayout>
  );
};

export default AddressEdit;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale, query }) => {
      const url = req.headers.host;
      if (!query.userId || !query.id || !query.type) {
        return {
          notFound: true,
        };
      }
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
          userId: query.userId,
          addressId: query.id,
          type: query.type,
          url,
        },
      };
    }
);
