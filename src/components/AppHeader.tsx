import { FC, Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { debounce, isNull } from 'lodash';
import {
  alexandriaFontSemiBold,
  appLinks,
  setLang,
  suppressText,
} from '@/constants/*';
import Backbtn from '@/appIcons/backbtn.svg';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { West, East, Close } from '@mui/icons-material';
import { LifebuoyIcon } from '@heroicons/react/24/outline';
import HelpModal from './modals/HelpModal';
import { toggleShowHelpModal } from '@/redux/slices/modalsSlice';

type Props = {
  backHome?: boolean;
  backRoute?: string | null;
  currentModule?: string;
  showHelpBtn?: boolean;
};
type CurrentModule = 'your_number' | 'otp_verification' | 'account_info';

type ModuleWidths = {
  [key in CurrentModule]: string;
};

const AppHeader: FC<Props> = ({
  backHome = false,
  backRoute = null,
  currentModule = 'home',
  showHelpBtn = false,
}): React.ReactElement => {
  // const [offset, setOffset] = useState(0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);
  const moduleWidths: ModuleWidths = {
    your_number: 'w-1/3',
    otp_verification: 'w-2/3',
    account_info: 'w-full',
  };
  const widthClass: string = moduleWidths[currentModule as CurrentModule] || '';
  const handleGoHome = () => {
    router.push(`/`, ``, {
      locale: lang,
      scroll: false,
    });
  };
  const handleBack = async () => {
    if (backHome) {
      handleGoHome();
    } else if (!isNull(backRoute)) {
      router.push(`${backRoute}`, undefined, {
        locale: lang,
        scroll: false,
      });
    } else {
      await setLang(lang).then(() => {
        router.back();
        // if (window.location.href.includes('#')) {
        //   router.push(appLinks.home.path);
        // }
      });
    }
  };

  // const {
  //   appSetting: { currentModule },
  // } = useAppSelector((state) => state);

  // const [isHome, setIsHome] = useState(
  //   router.pathname === '/' || router.pathname === '/home'
  // );

  // useEffect(() => {
  //   const onScroll = () => setOffset(window.pageYOffset);
  //   window.addEventListener('scroll', onScroll, { passive: true });
  //   return () => {
  //     window.removeEventListener('scroll', debounce(onScroll, 400));
  //   };
  // }, [router.pathname]);

  return (
    <header
      className={`relative sticky top-0 z-30 w-full capitalize bg-white border-b-2 py-3`}
      suppressHydrationWarning={suppressText}
    >
      <div className={`flex items-center py-3 px-4 `}>
        <button
          onClick={() => handleBack()}
          className={`flex justify-start items-center `}
        >
          {router.pathname.includes('success') ? (
            <>
            <Close />
            </>
          ): (
            <>
            {router.locale === 'en' ? <West /> : <East />}
            </>
          )}
        </button>
        <div className={`flex flex-1 justify-center items-center  `}>
          <span
            className={`base-mobile-lg-desktop capitalize truncate ${alexandriaFontSemiBold}`}
            suppressHydrationWarning={suppressText}
            style={{ maxWidth: '20ch', textOverflow: 'truncate' }}
          >
            {t(currentModule)}
          </span>
        </div>
        {}
        <div className={`flex justify-center items-center  `}>
          {showHelpBtn && (
            <button
              className="bg-gray-200 rounded-2xl flex justify-beteween items-center px-4 py-3"
              onClick={() => dispatch(toggleShowHelpModal(true))}
            >
              <div className="flex">
                <LifebuoyIcon className="w-6 h-6 me-1" />
              </div>
              <div className="flex capitalize">{t('help_btn')}</div>
            </button>
          )}
        </div>
      </div>
      <div
        className={`h-[2px] absolute -bottom-[2px] ${widthClass}`}
        style={{ backgroundColor: color }}
      ></div>
    </header>
  );
};

export default AppHeader;
