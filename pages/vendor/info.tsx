import React from 'react';
import { useEffect, Suspense, useState } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { Vendor } from '@/types/index';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { useLazyGetVendorQuery, vendorApi } from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Knet from '@/appIcons/knet.svg';
import CashOnDelivery from '@/appIcons/cash_checkout.svg';
import Visa from '@/appIcons/credit_checkout.svg';
import { useTranslation } from 'react-i18next';
import OurBranchesIcon from '@/appIcons/our_branches.svg';
import MinChargeIcon from '@/appIcons/min_charge.svg';
import PayemtOptionsIcon from '@/appIcons/payment_options.svg';
import ContactUsIcon from '@/appIcons/info_contactus.svg';
import FeedbackIcon from '@/appIcons/feedback.svg';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomImage from '@/components/CustomImage';
import Facebook from '@/appIcons/messenger.svg';
import Twitter from '@/appIcons/twitter.png';
import Instagram from '@/appIcons/instgram.svg';
import Call from '@/appIcons/call.svg';
import { themeColor } from '@/redux/slices/vendorSlice';
import Link from 'next/link';
import TextTrans from '@/components/TextTrans';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { isUndefined, map, upperFirst } from 'lodash';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import ContentLoader from '@/components/skeletons';
import FeedbackModal from '@/components/modals/FeedbackModal';

type Props = {
  url: string;
  element: Vendor;
};

const VendorShow: NextPage<Props> = ({ url, element }): React.ReactElement => {
  const {
    locale: { isRTL, lang },
    vendor,
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const [showModal, SetShowModal] = useState(false);
  const desObject = useAppSelector(destinationHeaderObject);
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetVendor(
      {
        lang,
        url,
        destination: desObject,
      },
      false
    );
  }, []);

  const handleClosePopup = () => {
    SetShowModal(false);
  };
  const handleOpenPopup = () => {
    SetShowModal(true);
  };

  if (!vendorSuccess && !vendorElement?.Data) return <></>;
  return (
    <Suspense>
      <MainHead
        title={element.name}
        url={url}
        description={element.desc}
        mainImage={`${element.logo}`}
        icon={`${element.logo}`}
        phone={element.phone}
        twitter={element.twitter}
        facebook={element.facebook}
        instagram={element.instagram}
      />
      <MainContentLayout url={url} showBackBtnHeader currentModule="info">
        {vendorElement && vendorElement.Data ? (
          <>
            <Link
              scroll={true}
              href={appLinks.home.path}
              className={`flex flex-col flex-1 justify-center items-center px-6 py-3 my-3`}
            >
              <CustomImage
                src={`${vendorElement?.Data?.logo}`}
                alt={vendorElement?.Data?.name}
                className={`w-16 h-16 object-cover shadow-md rounded-full border border-stone-200 bg-white`}
                width={imageSizes.sm}
                height={imageSizes.sm}
              />
              <TextTrans
                ar={vendorElement?.Data?.name_ar}
                en={vendorElement?.Data?.name_en}
                className="capitalize sm-mobile-base-desktop text-center my-3"
              />
              <TextTrans
                ar={vendorElement?.Data?.desc}
                en={vendorElement?.Data?.desc}
                className="xs-mobile-sm-desktop text-center leading-6"
                length={600}
              />
            </Link>

            <div className="flex flex-1 flex-col">
              {/* branches */}
              <Link
                href={`${appLinks.branchIndex.path}`}
                className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6 base-mobile-lg-desktop"
              >
                <div
                  className={`flex flex-row space-x-3 justify-center items-center`}
                >
                  <OurBranchesIcon stroke={`black`} />
                  <span className="base-mobile-lg-desktop px-2">{t('our_branches')}</span>
                </div>
                {isRTL ? <ChevronLeftOutlined /> : <ChevronRightOutlined />}
              </Link>
              {/* min_charge */}
              {vendorElement?.Data?.delivery?.minimum_order_price && (
                <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
                  <div
                    className={`flex flex-row space-x-3 justify-center items-center`}
                  >
                    <MinChargeIcon />
                    <span className="base-mobile-lg-desktop px-2">
                      {t('min_order')}
                    </span>
                  </div>
                  <div className={`base-mobile-lg-desktop`}>
                    {vendorElement?.Data?.delivery?.minimum_order_price}{' '}
                    {t(`kwd`)}
                  </div>
                </div>
              )}
              {/* working hours */}
              <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
                <div
                  className={`flex flex-row space-x-3 justify-center items-center`}
                >
                  <AccessTimeIcon />
                  <span className="base-mobile-lg-desktop px-2">
                    {t('opening_hours')}
                  </span>
                </div>
                <div className={`base-mobile-lg-desktop`}>
                  {vendorElement?.Data?.WorkHours}
                </div>
              </div>
              {/* payment */}
              <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-stone-100 p-6">
                <div
                  className={`flex flex-row space-x-3 justify-center items-center`}
                >
                  <PayemtOptionsIcon />
                  <span className="base-mobile-lg-desktop px-2">
                    {t('payment_options')}
                  </span>
                </div>
                <div className="flex justify-center">
                  {vendorElement?.Data?.Payment_Methods.visa === 1 && (
                    <div className="">
                      <Visa className={`h-auto w-8`} />
                    </div>
                  )}
                  {vendorElement?.Data?.Payment_Methods?.cash_on_delivery ? (
                    <div className="px-3">
                      <CashOnDelivery className={`h-auto w-8`} />
                    </div>
                  ) : null}
                  {vendorElement?.Data?.Payment_Methods?.knet ? (
                    <div className=" ">
                      <Knet className={`h-auto w-8`} />
                    </div>
                  ) : null}
                </div>
              </div>
              {/* contactus */}
              <div className="flex flex-row flex-1 justify-between items-center border-t-8 border-b-8 border-stone-100 p-6">
                <div
                  className={`flex flex-row space-x-3 justify-center items-center`}
                >
                  <ContactUsIcon />
                  <span className="base-mobile-lg-desktop px-2">
                    {t('contact_us')}
                  </span>
                </div>
                <div className="flex justify-center items-end">
                  {vendorElement?.Data?.facebook && (
                    <a
                      href={vendorElement?.Data?.facebook}
                      target={'_blank'}
                      className="px-2"
                    >
                      <Facebook />
                    </a>
                  )}
                  {vendorElement?.Data?.instagram && (
                    <a
                      href={vendorElement?.Data?.instagram}
                      target={'_blank'}
                      className="px-2"
                    >
                      <Instagram />
                    </a>
                  )}
                  {vendorElement?.Data?.twitter && (
                    <a
                      href={vendorElement?.Data?.twitter}
                      target={'_blank'}
                      className="px-2"
                    >
                      <CustomImage
                        src={Twitter.src}
                        alt="twitter"
                        width={22}
                        height={22}
                      />
                    </a>
                  )}
                  {vendorElement?.Data?.phone && (
                    <a
                      target="blank"
                      href={`tel:${vendorElement?.Data?.phone}`}
                      className="px-2"
                    >
                      <Call />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col p-6">
              <div className="flex flex-1 flex-col justify-center items-center space-y-3 bg-gray-100 p-6 rounded-2xl">
                <FeedbackIcon />

                <p
                  suppressHydrationWarning={suppressText}
                  className={`text-black py-4`}
                >
                  {t('leave_feedback_desc')}
                </p>
                <button
                  onClick={handleOpenPopup}
                  className={`flex flex-col flex-1 w-2/3 lg:w-1/2 justify-center items-center bg-gray-50 rounded-3xl p-3 shadow-xl`}
                >
                  <p
                    suppressHydrationWarning={suppressText}
                    className={`text-black`}
                  >
                    {upperFirst(`${t('leave_a_feedback')}`)}
                  </p>
                </button>
              </div>
            </div>
            <FeedbackModal
              isOpen={showModal}
              ariaHideApp={false}
              onRequestClose={handleClosePopup}
              url={url}
            />
          </>
        ) : (
          <ContentLoader type="VendorInfo" sections={1} />
        )}
      </MainContentLayout>
    </Suspense>
  );
};

export default VendorShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate(
          { lang: locale, url },
          {
            forceRefetch: true,
          }
        )
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
