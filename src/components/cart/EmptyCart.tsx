'use client';
import React, { FC } from 'react';
import CustomImage from '../CustomImage';
import Link from 'next/link';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import EmptyCartImage from '@/appIcons/cart_empty.svg';

const EmptyCart: FC = () => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  return (
    <div className="flex flex-col items-center justify-center p-5 absolute top-[20%] w-full">
      <div className="flex justify-center h-auto px-3">
        <EmptyCartImage />
      </div>
      <div className="capitalize text-center">
        <div className="my-5">
          <p suppressHydrationWarning={suppressText} className="font-bold pb-1">
            {t('your_cart_is_empty')}
          </p>
          <p
            suppressHydrationWarning={suppressText}
            className="text-[#544A45] xs-mobile-sm-desktop mb-5"
          >
            {t('add_some_items_to_your_cart')}
          </p>
        </div>

        <Link
          href={appLinks.home.path}
          scroll={true}
          className={`w-full xs-mobile-sm-desktop px-8 py-2 text-white rounded-full`}
          style={{ backgroundColor: color }}
        >
          {t('continue_shopping')}
        </Link>
      </div>
    </div>
  );
};
export default EmptyCart;
