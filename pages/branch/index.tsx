import Policy from '@/components/Policy';
import TextTrans from '@/components/TextTrans';
import ContentLoader from '@/components/skeletons';
import { googleMapUrl } from '@/constants/*';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { staticPagesApi } from '@/redux/api/staticPagesApi';
import { vendorApi } from '@/redux/api/vendorApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { StaticPage, Vendor } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import {
  MapIcon,
  PhoneArrowDownLeftIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { LocationCitySharp } from '@mui/icons-material';
import CallIcon from '@/appIcons/branch_call.svg';
import LocationIcon from '@/appIcons/branch_location.svg';
import { find, lowerCase, map } from 'lodash';
import { NextPage } from 'next';
import React, { useEffect, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { setLocale } from 'yup';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  url: string;
};

const BranchIndex: NextPage<Props> = ({ url }): React.ReactNode => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang },
  } = useAppSelector((state) => state);
  const [triggerGetBranches, { data: branches, isSuccess }] =
    useLazyGetBranchesQuery();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
    triggerGetBranches(
      {
        url,
        lang,
      },
      false
    );
  }, []);

  if (!isSuccess) return null;

  return (
    <MainContentLayout url={url} showBackBtnHeader currentModule="our_branches">
      <div className="flex flex-col mx-3  justify-start items-center">
        {map(branches?.Data, (b, i) => (
          <div
            key={i}
            className={`w-full p-4 space-y-2 border-b-2  border-gray-200`}
          >
            <div className="flex flex-row justify-between items-center">
              <span>
                <TextTrans ar={b.name_ar} en={b.name_en} length={60} />
              </span>
              <div className="flex flex-row gap-4">
                <a
                  href={`tel:${b.mobile}`}
                  className={`p-2 bg-gray-100 rounded-full flex justify-center items-center`}
                  target={`_blank`}
                >
                  <CallIcon />
                </a>
                {b.latitude && b.longitude && (
                  <a
                    className={`p-2 bg-gray-100 rounded-full flex justify-center items-center`}
                    href={googleMapUrl(b.longitude, b.latitude)}
                    target="_blank"
                  >
                    <LocationIcon />
                  </a>
                )}
              </div>
            </div>
            <div className="sm-mobile-base-desktop text-gray-400">{b.location}</div>
            <div className="flex flex-row ">
              <div className="sm-mobile-base-desktop me-2">
                <span className="text-green-600">{b.status}</span>
              </div>
              <div className="flex flex-row justify-center items-center sm-mobile-base-desktop">
                <div
                  className={`w-1 h-1 rounded-full ${
                    b.status === 'OPEN' ? `bg-green-600` : `bg-gray-400`
                  } `}
                ></div>
                <a
                  href={`tel:${b.mobile}`}
                  target={`_blank`}
                  className="ms-2 text-gray-500"
                >
                  {b.mobile}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainContentLayout>
  );
};

export default BranchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      if (!url) {
        return { notFound: true };
      }
      return {
        props: {
          url,
        },
      };
    }
);
