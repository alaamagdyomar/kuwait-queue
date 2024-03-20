import React, { FC, ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import {
  alexandriaFont,
  montserratFontRegular,
  scrollClass,
  setLang,
  suppressText,
} from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import MainAsideLayout from './MainAsideLayout';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { setVendor } from '@/redux/slices/vendorSlice';
import ToastAppContainer from '@/components/ToastAppContainer';
import moment from 'moment';
import * as yup from 'yup';
import { useLazyCreateTempIdQuery } from '@/redux/api/CustomerApi';
import { isAuthenticated, setUserAgent } from '@/redux/slices/customerSlice';
import { isNull } from 'lodash';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import ContentLoader from '@/components/skeletons';

type Props = {
  children: ReactNode | undefined;
  showCart?: boolean;
};

type Handler = (...evts: any[]) => void;

const MainLayout: FC<Props> = ({ children }): React.ReactNode => {
  const {
    version,
    appSetting: { url, sideMenuOpen },
    locale,
    searchParams: { destination, method },
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const isAuth = useAppSelector(isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const desObject = useAppSelector(destinationHeaderObject);
  const desID = useAppSelector(destinationId);
  const [triggerGetVendor, { data: vendorElement, isSuccess: vendorSuccess }] =
    useLazyGetVendorQuery();
  const [triggerCreateTempId, { isSuccess: tempIdSuccess }] =
    useLazyCreateTempIdQuery();

  // vendor..................................
  useEffect(() => {
    if (!isNull(url)) {
      getVendor();
    }
  }, [url, , method, destination, desID]);

  const getVendor = async () => {
    await triggerGetVendor(
      {
        lang: locale.lang,
        url,
        destination: desObject,
      },
      false
    ).then((r: any) => {
      // console.log({ r });
      if (r.data && r.data?.Data) {
        dispatch(setVendor(r.data.Data));
      }
    });
  };

  useEffect(() => {
    setAppDefaults();
  }, [vendorSuccess, url, isAuth, userAgent]);
  // removed tempid success from dependency

  const setAppDefaults = async () => {
    if (isNull(userAgent) && url) {
      await triggerCreateTempId({ url }).then((r: any) => {
        if (r && r.data && r.data.Data && r.data.Data.Id) {
          dispatch(setUserAgent(r.data.Data.Id));
        }
      });
    }
  };

  // locale ......................................
  useEffect(() => {
    if (router.locale !== locale.lang) {
      dispatch(setLocale(router.locale));
    }
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
    setLang(router.locale);
  }, [router.locale]);

  useEffect(() => {
    if (router.locale) {
      if (router.locale !== locale.lang) {
        dispatch(setLocale(router.locale));
      }
      if (router.locale !== i18n.language) {
        i18n.changeLanguage(router.locale);
      }
      moment.locale(router.locale);
      yup.setLocale({
        mixed: {
          required: 'validation.required',
        },
        number: {
          min: ({ min }) => ({ key: 'validation.min', values: { min } }),
          max: ({ max }) => ({ key: 'validation.max', values: { max } }),
        },
        string: {
          email: 'validation.email',
          min: ({ min }) => ({ key: `validation.min`, values: min }),
          max: ({ max }) => ({ key: 'validation.max', values: max }),
          matches: 'validation.matches',
        },
      });
      setLang(router.locale);
    }
  }, [router.locale]);

  useEffect(() => {
    const handleRouteChangeStart: Handler = (url, { shallow }) => {
      dispatch(hideSideMenu());
    };
    const handleChangeComplete: Handler = (url, { shallow }) => {
      if (sideMenuOpen) {
        dispatch(hideSideMenu());
      }
    };

    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
      }
    };

    const handleHashChangeStart: Handler = (url) => {};

    const handleHashChangeComplete: Handler = (url, { shallow }) => {};

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('hashChangeStart', handleHashChangeStart);
    router.events.on('hashChangeComplete', handleHashChangeComplete);
    window.addEventListener('hashchange', handleHashChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
      router.events.off('hashChangeStart', handleHashChangeStart);
      router.events.off('hashChangeComplete', handleHashChangeComplete);
      window.removeEventListener('hashchange', handleHashChangeStart);
    };
  }, [router.pathname]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${
        router.locale === 'ar' ? montserratFontRegular : alexandriaFont
      }
        flex-row justify-start items-start grow lg:flex lg:flex-row flex  h-screen capitalize max-w-8xl`}
    >
      {children}
      <ToastAppContainer />
      <div
        className={`hidden lg:block flex flex-row w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${scrollClass} ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
        suppressHydrationWarning={suppressText}
      >
        {vendorSuccess && vendorElement && vendorElement.Data ? (
          <MainAsideLayout url={url} element={vendorElement.Data} />
        ) : (
          <ContentLoader type="AsideSkelton" sections={1} />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
