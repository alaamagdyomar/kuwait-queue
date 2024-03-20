import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import error404 from '@/appImages/404_error.png';
import { NextPage } from 'next';
import React from 'react';
import { suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';

const Custom404: NextPage = (): React.ReactElement => {
  const color = useAppSelector(themeColor);
  const router = useRouter();
  const Buttons = () => {
    return (
      <div className='pt-5 space-x-3'>
        <button
          onClick={() => window.location.reload()}
          className={`text-center sm-mobile-base-desktop capitalize text-white px-6 py-2 rounded-full`}
          suppressHydrationWarning={suppressText}
          style={{ backgroundColor: color }}
        >
            {t('try_again')}
        </button>
        <button
          onClick={() => router.back()}
          className={`text-center sm-mobile-base-desktop capitalize bg-[#E8E5E3]  px-11 py-2 rounded-full`}
          suppressHydrationWarning={suppressText}
        >
            {t('back')}
        </button>
      </div>
    );
  };
  
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget 
        img={`${error404.src}`} 
        message={`nothing_to_eat_here`} 
        desc={`we_are _sorry_that_we_can't_find_the_page_please_go_back_or_try_again`}
        buttons={<Buttons />}
      />
    </MainContentLayout>
  );
}
export default Custom404;
