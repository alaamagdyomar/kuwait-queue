import CustomImage from '@/components/CustomImage';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyOrders from '@/appImages/empty_orders.png';
import NoOrder from '@/appImages/no_order.png';
import { Search } from '@mui/icons-material';
import { suppressText } from '@/constants/*';
import { NextPage } from 'next';
import { useAppDispatch } from '@/redux/hooks';
import { setUrl } from '@/redux/slices/appSettingSlice';

type Props = {
  url: string;
};

const UserOrders: NextPage<Props> = ({ url }): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <Suspense>
      <MainHead
        title={t('track_order')}
        url={url}
        description={`${t('track_order')}`}
      />
      <MainContentLayout
        url={url}
        showBackBtnHeader
        currentModule="track_order"
      >
        <div className="flex flex-col items-center justify-center h-[90vh] space-y-2 px-5">
          <CustomImage
            src={NoOrder}
            alt="empty orders"
            width={150}
            height={150}
          />
          <h3
            className="base-mobile-lg-desktop font-bold"
            suppressHydrationWarning={suppressText}
          >
            {t('no_order_with_this_id')}
          </h3>
          <p className="text-zinc-500" suppressHydrationWarning={suppressText}>
            {t('check_the_id_and_try_again')}
          </p>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default UserOrders;
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
