import Policy from '@/components/Policy';
import TextTrans from '@/components/TextTrans';
import ContentLoader from '@/components/skeletons';
import MainContentLayout from '@/layouts/MainContentLayout';
import { apiSlice } from '@/redux/api';
import {
  staticPagesApi,
  useLazyGetVendorStaticPagesQuery,
} from '@/redux/api/staticPagesApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { wrapper } from '@/redux/store';
import { StaticPage } from '@/types/index';
import { find } from 'lodash';
import { NextPage } from 'next';
import React, { useEffect } from 'react';

type Props = {
  url: string;
};

const PrivacyPolicy: NextPage<Props> = ({ url }): React.ReactNode => {
  const dispatch = useAppDispatch();
  const [triggerVendorStaticPages, { data: element }] =
    useLazyGetVendorStaticPagesQuery();
  const privacyPolicy = find(element?.Data, (e) => e.key === 'Privacy policy');

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
      triggerVendorStaticPages({ url }, false);
    }
  }, []);

  return (
    <MainContentLayout
      url={url}
      showBackBtnHeader
      currentModule="privacy_policy"
    >
      {privacyPolicy ? (
        <Policy policyType={privacyPolicy} />
      ) : (
        <ContentLoader type="Policy" sections={1} />
      )}
    </MainContentLayout>
  );
};

export default PrivacyPolicy;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, locale }) => {
      const url = req.headers.host;
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      return {
        props: {
          url,
        },
      };
    }
);
