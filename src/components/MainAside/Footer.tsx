import { appLinks } from '@/constants/*';
import { useCheckStaticPagesQuery } from '@/redux/api/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AsideFooter({ url }: { url: string }) {
  const { t } = useTranslation();
  const {
    locale: { lang },
  } = useAppSelector((state) => state);
  const { data, isSuccess: checkStaticPagesSuccess }: any =
    useCheckStaticPagesQuery({
      lang,
      url,
    });

  return (
    <div
      className={`absolute bottom-0 text-white  xs-mobile-sm-desktop flex flex-1 w-full flex-row justify-between items-center p-4`}
    >
      <div
        className={`flex flex-row gap-x-3 items-center underline underline-offset-2`}
      >
        {checkStaticPagesSuccess && data.Data && (
          <>
            {data.Data.policy && (
              <Link href={appLinks.returnPolicy.path}>
                {t('return_policy')}
              </Link>
            )}
            {data.Data.shipping_policy && (
              <Link href={appLinks.shippingPolicy.path}>
                {t('shipping_policy')}
              </Link>
            )}
            {data.Data.privacy && (
              <Link href={appLinks.privacyPolicy.path}>
                {t('privacy_policy')}
              </Link>
            )}
          </>
        )}
      </div>
      <div className={`flex flex-1 flex-row justify-end items-center`}>
        <Link target="_blank" href="https://getq.app">
          {t('powered_by_queue')}
        </Link>
      </div>
    </div>
  );
}
