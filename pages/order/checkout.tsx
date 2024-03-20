import MainContentLayout from '@/layouts/MainContentLayout';
import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from '@/appIcons/location.jpg';
import Image from 'next/image';
import OrderDetails from '@/components/checkout/OrderDetails';
import { useTranslation } from 'react-i18next';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { Address, AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';
import { wrapper } from '@/redux/store';
import CartProduct from '@/components/widgets/product/CartProduct';
// import AddIcon from '@/appIcons/add_checkout.svg';
import Link from 'next/link';
import {
  alexandriaFont,
  alexandriaFontMeduim,
  alexandriaFontSemiBold,
  appLinks,
  suppressText,
} from '@/constants/*';
import CashIcon from '@/appIcons/cash_checkout.svg';
import CreditIcon from '@/appIcons/credit_checkout.svg';
import KnetIcon from '@/appIcons/knet.svg';
import { isEmpty, isNull, map } from 'lodash';
import PaymentSummary from '@/components/PaymentSummary';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import ElementMap from '@/components/address/ElementMap';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import { useLazyCreateOrderQuery } from '@/redux/api/orderApi';
import EmptyCart from '@/components/cart/EmptyCart';
import WhenClosedModal from '@/components/modals/WhenClosedModal';
import {
  RadioButtonCheckedOutlined,
  CircleOutlined,
  Add,
} from '@mui/icons-material';
import moment from 'moment';
import { NextPage } from 'next';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import ChangeMoodModal from '@/components/modals/ChangeMoodModal';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import { useGetAddressesByTypeQuery } from '@/redux/api/addressApi';

type Props = {
  url: string;
};

const checkout: NextPage<Props> = ({ url }): React.ReactElement => {
  const { t } = useTranslation();
  const {
    customer: {
      prefrences,
      userAgent,
      id: customer_id,
      notes,
      name,
      email,
      phone,
      address: CustomerAddress,
      address: { id: addressID, longitude, latitude, type },
    },
    searchParams: { method, destination },
    cart: { enable_promocode, promocode },
    vendor: { Payment_Methods },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const color = useAppSelector(themeColor);
  const isAuth = useAppSelector(isAuthenticated);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'visa' | 'knet' | 'cash_on_delivery' | null
  >(null);
  const [openStoreClosedModal, setOpenClosedStore] = useState(false);
  const [triggerCreateOrder, { isLoading }] = useLazyCreateOrderQuery();
  const [cartLessThanMin, setcartLessThanMin] = useState<boolean | undefined>(
    undefined
  );

  // payment methoda array to map
  const paymentMethods: {
    id: 'visa' | 'knet' | 'cash_on_delivery';
    src: any;
    name: string;
  }[] = [
    { id: 'cash_on_delivery', src: <CashIcon />, name: 'cash_on_delivery' },
    { id: 'visa', src: <CreditIcon />, name: 'credit_card' },
    { id: 'knet', src: <KnetIcon />, name: 'pay_by_knet' },
  ];

  // seturl
  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    dispatch(setAreaBranchModalStatus(false));
  }, []);

  // map marker
  const LocationMarker = ({ icon, longitude, latitude }: any) => {
    // console.log('longitude,latitude', longitude, latitude);
    return <Image src={icon} alt="map marker" width={30} height={30} />;
  };

  // get cart
  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery<{
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

  // cart min order
  useEffect(() => {
    if (
      isSuccess &&
      cartItems?.data &&
      cartItems?.data &&
      cartItems?.data?.Cart
    ) {
      setcartLessThanMin(
        promocode
          ? parseFloat(cartItems?.data?.minimum_order_price?.toString() || '') >
              parseFloat(cartItems?.data?.sub_total?.toString() || '')
          : parseFloat(cartItems?.data?.minimum_order_price?.toString() || '') >
              parseFloat(cartItems?.data?.subTotal?.toString())
      );
    }
  }, [isSuccess]);

  // create order
  const handleCreateOrder = async () => {
    if (!customer_id && !isAuth) {
      router.push(appLinks.login.path);
    } else if (isNull(destID) || prefrences.type === '') {
      dispatch(setAreaBranchModalStatus(true));
    } else if (
      method === 'delivery' &&
      (!addressID ||
        (addressID && CustomerAddress.area_id !== destID.toString()))
    ) {
      if (isAuth) router.push(appLinks.selectAddress(customer_id));
      else router.push(appLinks.guestAddress.path);
    } else if (
      prefrences.type === 'pickup_now' &&
      moment(prefrences.date, 'YYYY-MM-DD').isSameOrAfter(
        moment().format('YYYY-DD-MM')
      )
    ) {
      dispatch(
        showToastMessage({
          content: 'your_pickup_date_is_old_please_choose_recent_date',
          type: `error`,
        })
      );
    } else if (isNull(selectedPaymentMethod)) {
      dispatch(
        showToastMessage({
          content: 'please_select_payment_method',
          type: `error`,
        })
      );
    } else {
      await triggerCreateOrder({
        body: {
          // ...(isAuth ? {} : { user_id: customer_id }),
          // user_id: customer_id,
          ...(isAuth ? {} : { UserAgent: userAgent, name, email, phone }),
          ...(method === `delivery`
            ? isAuth
              ? { address_id: addressID }
              : {
                  address_type:
                    CustomerAddress.type === 'HOUSE'
                      ? 1
                      : CustomerAddress.type === 'APARTMENT'
                      ? 2
                      : CustomerAddress.type === 'OFFICE'
                      ? 3
                      : 1,
                  address: Object.keys(CustomerAddress).reduce(function (r, e) {
                    if (e !== 'id' && e !== '' && CustomerAddress[e] !== null)
                      r[e] = CustomerAddress[e];
                    // if (acceptedValues.includes(CustomerAddress[e])) r[e] = myObject[e]
                    return r;
                  }, {}),
                } //guest address
            : {}),
          order_type: prefrences.type,
          // order_type: method === `delivery` ? 'delivery_now' : 'pickup_now',

          Messg: notes,
          PaymentMethod: selectedPaymentMethod,
          PromoCode: promocode,
          ...(prefrences.date && prefrences.time
            ? {
                Date: prefrences.date,
                Time:
                  prefrences.type === 'pickup_now' ||
                  prefrences.type === 'delivery_now'
                    ? moment()
                        .add(prefrences.time, 'minutes')
                        .locale('en')
                        .format('HH:mm:ss')
                    : moment(prefrences.time, ['h:mm A'])
                        .locale('en')
                        .format('HH:mm:ss'),
              }
            : {}),
        },
        area_branch: destObj,
        url,
      }).then((r: any) => {
        if (r.data) {
          if (r.data.status) {
            if (selectedPaymentMethod === 'cash_on_delivery') {
              router.replace(appLinks.orderSuccess(r.data.data.order_id));
              dispatch(
                showToastMessage({
                  content: `order_created_successfully`,
                  type: `success`,
                })
              );
            } else {
              window.open(r.data.Data.PaymentURL, '_self');
            }
          } else {
            router.replace(appLinks.orderFailure(r.data.data.order_id));
          }
        } else if (r.error && r.error.msg) {
          if (r?.error?.msg?.includes('CLOSE')) {
            setOpenClosedStore(true);
          } else {
            dispatch(
              showToastMessage({
                content: r.error.msg,
                type: `error`,
              })
            );
          }
        }
      });
    }
  };

  if (!isSuccess) {
    <p>loading</p>;
  }

  return (
    <MainContentLayout showBackBtnHeader={true} currentModule="checkout">
      {isSuccess &&
        cartItems?.data &&
        cartItems?.data &&
        cartItems?.data?.Cart &&
        // cartLessThanMin === null &&
        (isEmpty(cartItems?.data?.Cart) ? (
          <EmptyCart />
        ) : (
          <>
            {/* map */}
            {/* <ElementMap lat={59.955413} lng={30.337844} height={'10rem'}/> */}
            {/* <div className={`w-full h-[10rem]`}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                  language: 'en',
                  region: 'US',
                }}
                defaultCenter={{
                  lat: 59.955413,
                  lng: 30.337844,
                }}
                defaultZoom={11}
              >
                <LocationMarker
                  latitude={
                    method
                      ? method === 'delivery'
                        ? latitude // customer address
                        : destination.lat // branch address
                      : 59.955413
                  }
                  longitude={
                    method
                      ? method === 'delivery'
                        ? longitude // customer address
                        : destination.lang // branch address
                      : 59.955413
                  }
                  icon={MapMarker}
                />
              </GoogleMapReact>
            </div> */}

            {/* orderDetails */}
            <div className="p-5 border-b-4">
              <OrderDetails />
            </div>

            {/* items */}
            <div className=" p-5 border-b-4">
              <p
                suppressHydrationWarning={suppressText}
                className={`mb-3 ${alexandriaFontSemiBold}`}
              >
                {t('order_items')}
              </p>
              {cartItems?.data?.Cart?.map((product) => (
                <CartProduct product={product} checkoutProduct={true} />
              ))}

              <Link
                href={appLinks.home.path}
                className="flex items-center gap-x-1 rounded-full border w-fit xxs-mobile-xs-desktop py-1 px-3  mt-3"
                style={{ borderColor: color, color }}
              >
                <Add color={color} fontSize="small" />
                <p
                  suppressHydrationWarning={suppressText}
                  className={`${alexandriaFont}`}
                  style={{ color }}
                >
                  {t('add_items')}
                </p>
              </Link>
            </div>

            {/* payment methods */}
            <div className="p-5 border-b-4">
              <p
                suppressHydrationWarning={suppressText}
                className={`mb-3 ${alexandriaFontSemiBold}`}
              >
                {t('payment_method')}
              </p>
              <div>
                {map(paymentMethods, (m, i) => {
                  return Payment_Methods[m.id] ? (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedPaymentMethod(m.id);
                      }}
                      className="flex items-center gap-x-2 xs-mobile-sm-desktop mb-3"
                    >
                      {selectedPaymentMethod === m.id ? (
                        <RadioButtonCheckedOutlined
                          style={{ color }}
                          className="text-black w-6 h-6 "
                        />
                      ) : (
                        <CircleOutlined className="text-black w-6 h-6 " />
                      )}
                      {m.src}
                      <p
                        suppressHydrationWarning={suppressText}
                        className={`${alexandriaFont}`}
                      >
                        {t(m.name)}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* summary */}
            <div className="p-3">
              <PaymentSummary
                sub_total={
                  cartItems?.data?.subTotal || cartItems?.data?.sub_total || 0
                }
                total={cartItems?.data?.total || 0}
                total_cart_after_tax={
                  cartItems?.data?.total_cart_after_tax || 0
                }
                promo_code_discount={cartItems?.data?.promo_code_discount || 0}
                delivery_fees={
                  cartItems?.data?.delivery_fees ||
                  cartItems?.data?.delivery_fee ||
                  0
                }
                free_delivery={cartItems?.data?.free_delivery || false}
                tax={cartItems?.data?.tax || 0}
              />

              <div className="my-4">
                {cartLessThanMin && (
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`w-full xxs-mobile-xs-desktop text-[#877D78] text-center py-2 ${alexandriaFont}`}
                  >{`${t('add_a_minimum_of')} ${(
                    parseFloat(
                      cartItems?.data?.minimum_order_price?.toString() || ''
                    ) -
                    (cartItems?.data?.subTotal
                      ? parseFloat(cartItems?.data?.subTotal.toString())
                      : parseFloat(
                          cartItems?.data?.sub_total?.toString() || ''
                        ))
                  ).toFixed(3)}  ${t('kd')} ${t('to_place_your_order')}`}</p>
                )}

                <button
                  disabled={cartLessThanMin}
                  onClick={() => handleCreateOrder()}
                  className={`w-full rounded-full py-2 text-white capitalize ${alexandriaFontMeduim}`}
                  style={{ backgroundColor: color }}
                >
                  {t('place_order')}
                </button>
              </div>
            </div>
          </>
        ))}
      <WhenClosedModal
        isOpen={openStoreClosedModal}
        onRequestClose={() => setOpenClosedStore(false)}
      />
      {/* select modal */}
      <ChangeMoodModal url={url} />
    </MainContentLayout>
  );
};

export default checkout;

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
