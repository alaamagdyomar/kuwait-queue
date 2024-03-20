import React, { FC, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  imageSizes,
  submitBtnClass,
  suppressText,
  convertColor,
} from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { isNull } from 'lodash';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  message: string;
  img?: string;
  desc?: string;
  buttons?: React.ReactNode;
};
const OffLineWidget: FC<Props> = ({
  message,
  img = null,
  desc = '',
  buttons,
}): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  return (
    <Suspense>
      <div className="min-h-screen flex items-center">
        <div
          className={`flex w-full flex-col justify-center items-center mt-10 px-4`}
        >
          {!isNull(img) ? (
            <Image
              className="rounded-lg"
              alt="offline"
              fill={false}
              width={250}
              height={250}
              src={img}
            />
          ) : (
            <Image
              className="h-90 w-90"
              alt="offline"
              fill={false}
              width={imageSizes.xs}
              height={imageSizes.xs}
              src={require('@/appImages/offline.webp')}
            />
          )}
          <p
            className={`base-mobile-lg-desktop text-center font-semibold whitespace-wrap break-words w-full pt-5 pb-3`}
            suppressHydrationWarning={suppressText}
          >
            {/* {message} */}
            {t(message)}
          </p>
          <p
            className="text-[#544A45] text-center lowercase"
            suppressHydrationWarning={suppressText}
          >
            {t(desc)}
          </p>
          {/* <Link
            scroll={true}
            href={'/'}
            className={`${submitBtnClass} text-center text-md capitalize`}
            suppressHydrationWarning={suppressText}
            style={{ backgroundColor: convertColor(color, 100) }}
          >
            {t('back_to_home')}
          </Link> */}
          {buttons}
        </div>
      </div>
    </Suspense>
  );
};

export default OffLineWidget;
