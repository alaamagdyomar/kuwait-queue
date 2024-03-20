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
import { useEffect, useState, useCallback } from 'react';
import { isEmpty, isNull, map } from 'lodash';
import TextTrans from '@/components/TextTrans';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { themeColor } from '@/redux/slices/vendorSlice';
import { Icon } from '@mui/material';
import { suppressText } from '@/constants/*';
import { CheckCircle, CircleOutlined } from '@mui/icons-material';
import {
  destinationHeaderObject,
  destinationId,
  setDestination,
} from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import WhenClosedModal from '@/components/modals/WhenClosedModal';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import ContentLoader from '@/components/skeletons';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import ChangeLocationModal from '@/components/modals/ChangeLocationModal';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { setPreferences } from '@/redux/slices/customerSlice';
import moment from 'moment';

type Props = {
  element: Vendor;
  url: string;
};

const SelectBranch: NextPage<Props> = ({
  element,
  url,
}): React.ReactElement => {
  const {
    locale: { lang, isRTL },
    searchParams: { method, destination },
    customer: { userAgent, prefrences },
    cart: { enable_promocode, promocode },
  } = useAppSelector((state) => state);
  const destObj = useAppSelector(destinationHeaderObject);
  const destID = useAppSelector(destinationId);
  const router = useRouter();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [openStoreClosedModal, setOpenClosedStore] = useState(false);
  const [showChangeLocModal, setShowChangeLocModal] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(
    undefined
  );
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();
  const {
    data: cartItems,
    isLoading: cartLoading,
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
  const [triggerGetBranches, { data: branches, isLoading: branchesLoading }] =
    useLazyGetBranchesQuery<{
      data: AppQueryResult<Branch[]>;
      isLoading: boolean;
    }>();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetBranches({ lang, url, type: method }, false);
    // triggerGetLocations({ lang, url, type: method }, false);
  }, []);

  const handleSelectMethod = (
    destination: Branch,
    type: 'pickup' | 'delivery'
  ) => {
    if (isNull(destID)) {
      handleChangeBranch(destination, type);
    } else if (
      type !== method ||
      (type === method && destID !== destination.id)
    ) {
      // change
      if (isEmpty(cartItems?.data?.Cart)) {
        handleChangeBranch(destination, type);
      } else {
        setSelectedBranch(destination);
        setShowChangeLocModal(true);
      }
    } else {
      // not changed
      router.back();
    }
  };

  const handleChangeBranch = async (
    destination: Branch | Area,
    type: 'pickup' | 'delivery'
  ) => {
    dispatch(setDestination({ destination, type }));
    if ((destination as Branch).status === 'CLOSE') {
      dispatch(
        showToastMessage({
          type: 'warning',
          content: `branch_is_closed`,
        })
      );
      setOpenClosedStore(true);
      return router.back();
    } else {
      dispatch(setAreaBranchModalStatus(true));
      await triggerGetVendor(
        {
          lang,
          url,
          destination: { 'x-branch-id': destination.id },
        },
        false
      )
        .then((r: any) => {
          if (r?.data?.Data?.delivery?.estimated_preparation_time) {
            dispatch(
              setPreferences({
                date: moment().locale('en').format('YYYY-MM-DD'),
                time: r?.data.Data?.delivery?.estimated_preparation_time,
                type: 'pickup_now',
              })
            );
          }
        })
        .then(() => router.back());
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
    branchesLoading ||
    !branches ||
    !branches.Data ||
    cartLoading ||
    !cartItems ||
    !cartItems.data
    // locationsLoading ||
    // !locations ||
    // !locations.Data
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
      currentModule={`${t('select_branch')}`}
    >
      <div className="flex flex-col min-h-screen">
        {map(branches.Data, (b: Branch, i) => (
          <button
            onClick={() => handleSelectMethod(b, 'pickup')}
            key={i}
            className="flex flex-row w-full justify-start items-center p-4 border-b border-gray-200"
          >
            <div className="flex flex-col flex-1 justify-start items-start space-y-2">
              <TextTrans
                ar={b.name_ar}
                en={b.name_en}
                className="text-black font-bold "
                length={45}
              />
              <TextTrans
                ar={b.location}
                en={b.location}
                className="text-stone-400 font-thin text-left"
                length={45}
              />
            </div>
            <div className="">
              {method === 'pickup' && destination.id === b.id ? (
                <CheckCircleIcon
                  style={{ color }}
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : isRTL ? (
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
          </button>
        ))}
      </div>
      <WhenClosedModal
        isOpen={openStoreClosedModal}
        onRequestClose={() => setOpenClosedStore(false)}
      />
      <ChangeLocationModal
        isOpen={showChangeLocModal}
        onRequestClose={() => setShowChangeLocModal(false)}
        url={url}
        selectedMethod="pickup"
        area_branch={selectedBranch as Branch}
        changeLocation={handleChangeBranch}
      />
    </MainContentLayout>
  );
};

export default SelectBranch;

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
