import React from 'react';
import CustomImage from './CustomImage';
import ErrorBoundaryImg from '@/appImages/error_boundary.jpg';
import { useTranslation } from 'react-i18next';
import { footerBtnClass, imageSizes, suppressText } from '../constants';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';

function ErrorHandler() {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const router = useRouter();
  return (
    <div className="flex justify-center items-center text-center h-screen">
      <div role="alert">
        <div style={{ color }}>
          <h2 className="text-2xl" suppressHydrationWarning={suppressText}>
            {t('looks_like_something_went_wrong')}
          </h2>
          <p className="lg-mobile-xl-desktop" suppressHydrationWarning={suppressText}>
            {t('we_are_working_on_it')}
          </p>
        </div>
        <CustomImage
          src={ErrorBoundaryImg}
          alt="error"
          className={`object-fit shadow-xl z-0 overflow-hidden my-4`}
          width={400}
          height={400}
        />
        <button
          className={`${footerBtnClass}`}
          style={{ backgroundColor: `${color}`, color: `white` }}
          suppressHydrationWarning={suppressText}
          onClick={() => router.reload()}
        >
          {t('try_again?')}
        </button>
      </div>
    </div>
  );
}

export default ErrorHandler;
