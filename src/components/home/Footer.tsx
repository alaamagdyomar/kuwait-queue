'use client';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import Link from 'next/link';
import React, { FC } from 'react';
import CustomImage from '../CustomImage';
import TextTrans from '../TextTrans';
import { SocialIcon } from 'react-social-icons';
import { Vendor } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';

type Props = { element: Vendor };

const Footer: FC<Props> = ({ element }) => {
  const { t } = useTranslation();
  const {
    vendor: { name_ar, name_en },
  } = useAppSelector((state) => state);

  return (
    <div>
      <div className="lg:hidden flex flex-col items-center justify-center border-b px-4 py-8 mb-5">
        <Link
          scroll={true}
          href={appLinks.home.path}
          className={`flex flex-col items-center justify-center text-center z-50`}
        >
          <CustomImage
            src={`${imgUrl(element.logo)}`}
            alt={element.name}
            className={`relative object-contain w-20 h-20 shadow-2xl rounded-full mb-4 border border-stone-200 bg-white`}
            width={imageSizes.sm}
            height={imageSizes.sm}
          />
          <TextTrans
            ar={element.name_ar}
            en={element.name_en}
            className="capitalize lg-mobile-xl-desktop block w-full font-bold"
          />
        </Link>

        <div className="relative flex justify-center gap-x-3 my-3">
          {element.facebook && (
            <SocialIcon
              target="_blank"
              url={element.facebook}
              network="facebook"
              bgColor="white"
              fgColor="black"
              className="!w-10 !h-10 text-black"
            />
          )}

          {element.instagram && (
            <SocialIcon
              target="_blank"
              url={element.instagram}
              network="instagram"
              bgColor="white"
              fgColor="black"
              className="!w-10 !h-10 text-black"
            />
          )}

          {element.twitter && (
            <SocialIcon
              target="_blank"
              url={element.twitter}
              network="twitter"
              bgColor="white"
              fgColor="black"
              className="!w-10 !h-10 text-black"
            />
          )}
        </div>

        <div
          className={`flex flex-row gap-x-3 items-center underline underline-offset-2 text-xs md:text-sm xl:text-md`}
        >
          <Link className="text-center" href={appLinks.returnPolicy.path}>
            {t('return_policy')}
          </Link>
          <Link className="text-center" href={appLinks.shippingPolicy.path}>
            {t('shipping_policy')}
          </Link>
          <Link className="text-center" href={appLinks.privacyPolicy.path}>
            {t('privacy_policy')}
          </Link>
        </div>
      </div>

      <div className={`w-full px-3 text-center xxs-mobile-xs-desktop bg-white`}>
        <p className=" font-bold">
          {t('rights_reserved')} <TextTrans ar={name_ar} en={name_en} />{' '}
          {new Date().getFullYear()} ©
        </p>
        <Link
          href="https://getq.app"
          target="_blank"
          className=" py-1 pb-2 text-zinc-500"
        >
          {t('powered_by_queue')}®
        </Link>
      </div>
    </div>
  );
};
export default Footer;
