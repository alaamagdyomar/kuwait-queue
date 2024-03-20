'use client';
import { FC, ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import OffLineWidget from '@/widgets/OffLineWidget';
import NoInternet from '@/appImages/no_internet.png';
import NextNProgress from 'nextjs-progressbar';
import { themeColor } from '@/redux/slices/vendorSlice';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { isUndefined } from 'lodash';
import { scrollClass, suppressText } from '@/constants/*';
import NoNetwork from '@/appImages/no_network.png';
import ReloadIcon from '@/appIcons/reload.svg';
import { useTranslation } from 'react-i18next';
// import ScrollToTopButton from '@/components/ScrollToTopButton';
import AppHeader from '@/components/AppHeader';
import SideMenu from '@/components/SideMenu';
// const AppHeader = dynamic(() => import(`@/components/AppHeader`), {
//   ssr: false,
// });
// const SideMenu = dynamic(() => import(`@/components/SideMenu`), {
//   ssr: false,
// });

type Props = {
  children: ReactNode | undefined;
  url?: string;
  backHome?: boolean;
  backRoute?: string | null;
  currentModule?: string;
  showBackBtnHeader?: boolean;
  showHelpBtn?: boolean;
  showAppFooter?: boolean;
  hideBack?: boolean;
  showMotion?: boolean;
  productCurrentQty?: number | undefined;
  productOutStock?: boolean | undefined;
};

const MainContentLayout: FC<Props> = ({
  children,
  currentModule = 'home',
  backHome = false,
  backRoute = null,
  showBackBtnHeader = false,
  showAppFooter = false,
  showHelpBtn = false,
  hideBack = false,
  showMotion = true,
  productCurrentQty,
  productOutStock,
  url,
}): React.ReactNode => {
  const {
    appSetting: { showHeader, url: appUrl, showFooterElement },
    customer: { address },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  useEffect(() => {
    if (appUrl !== url && !isUndefined(url)) {
      dispatch(setUrl(url));
    }
  }, []);

  const Button = () => {
    return (
      <div className="pt-5 space-x-3 ">
        <button
          onClick={() => window.location.reload()}
          className={`text-center sm-mobile-base-desktop capitalize text-white px-12 py-2 rounded-full flex items-center`}
          suppressHydrationWarning={suppressText}
          style={{ backgroundColor: color }}
        >
          <ReloadIcon />
          <span className="px-1">{t('try_again')}</span>
        </button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col justify-start items-start w-full lg:w-2/4 xl:w-1/3 relative `}
      suppressHydrationWarning={suppressText}
    >
      <SideMenu />

      {/* backbtn and name header */}
      {showBackBtnHeader && (
        <AppHeader
          backHome={backHome}
          backRoute={backRoute}
          currentModule={currentModule}
          showHelpBtn={showHelpBtn}
        />
      )}

      <main className={`w-full relative bg-white min-h-screen h-auto`}>
        {isOnline ? (
          children
        ) : (
          <OffLineWidget
            img={`${NoNetwork.src}`}
            message={`ooops_no_internet_connection`}
            desc={`check_your_internet_connection_and_try_again`}
            buttons={<Button />}
          />
        )}
      </main>
      <NextNProgress
        color={color}
        startPosition={0.3}
        stopDelayMs={200}
        height={5}
        showOnShallow={true}
        options={{
          // template: `<div class="bar" role="progressbar" aria-role="Changing page" style="background-color: ${color}"></div>`,
          // barSelector: '[role="progressbar"]',
          showSpinner: false,
        }}
      />
    </motion.div>
  );
};

export default MainContentLayout;
