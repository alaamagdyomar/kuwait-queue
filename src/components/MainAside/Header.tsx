import { appLinks, suppressText } from '@/constants/*';
import Link from 'next/link';
import React, { useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

import SearchIcon from '@/appIcons/aside_search.svg';
import ShoppingCartIcon from '@/appIcons/aside_shopping_cart.svg';
import BurgerMenuIcon from '@/appIcons/aside_burger_menu.svg';
import AsideAR from '@/appIcons/aside_ar.svg';
import AsideEN from '@/appIcons/aside_en.svg';

import { setLocale } from '@/redux/slices/localeSlice';
import {
  hideSideMenu,
  showSideMenu,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { ServerCart } from '@/types/index';
import {
  destinationHeaderObject,
  setCategory,
} from '@/redux/slices/searchParamsSlice';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = { url: string };
export default function AsideHeader({ url }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    appSetting: { sideMenuOpen },
    locale: { otherLang, lang },
    customer: { userAgent },
    searchParams: { method },
    cart: { promocode },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const destObj = useAppSelector(destinationHeaderObject);

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await router
        .replace(router.pathname, router.asPath, {
          locale,
          scroll: false,
        })
        .then(() => dispatch(setLocale(locale)))
        .then(() => {
          dispatch(
            showToastMessage({
              content: `language_changed_successfully`,
              type: `success`,
            })
          );
        });
    }
  };

  const {
    data: cartItems,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>(
    {
      userAgent,
      area_branch: destObj,
      PromoCode: promocode,
      url,
    },
    { refetchOnMountOrArgChange: true }
  );

  // when remove out of stock items
  useEffect(() => {
    if (
      isSuccess &&
      cartItems &&
      cartItems.data &&
      cartItems.msg === 'removed some out of stock item'
    ) {
      dispatch(
        showToastMessage({
          content: 'removed some out of stock item',
          type: 'info',
        })
      );
    }
  }, [cartItems, isSuccess]);

  return (
    <div
      className={`absolute top-0 left-0 flex w-full justify-between items-center grow  z-90 text-white px-4 mt-5
           `}
    >
      {/* burger menu */}
      <div
        onClick={() =>
          sideMenuOpen ? dispatch(hideSideMenu()) : dispatch(showSideMenu())
        }
      >
        <BurgerMenuIcon />
      </div>

      {/* cart , search , lang right icons */}
      <div className={`flex flex-row justify-start items-start gap-1  z-50`}>
        <Link
          scroll={true}
          href={appLinks.cart.path}
          className={` rounded-full flex justify-center items-center text-black capitalize`}
          suppressHydrationWarning={suppressText}
        >
          <div className="relative">
            <ShoppingCartIcon />
            {isSuccess &&
              cartItems.data &&
              cartItems.data?.Cart?.length > 0 && (
                <div
                  style={{ backgroundColor: color }}
                  className="absolute top-0 right-0 opacity-90  rounded-full  w-5 h-5 border border-white shadow-xl flex items-center justify-center text-white text-xxs"
                >
                  <span className={`pt-[2.5px] shadow-md`}>
                    {cartItems.data?.Cart?.length}
                  </span>
                </div>
              )}
          </div>
        </Link>
        <button
          // scroll={true}
          onClick={() => {
            dispatch(setCategory(null));
            router.push(`${appLinks.productSearch.path}`);
          }}
          suppressHydrationWarning={suppressText}
        >
          <SearchIcon />
        </button>
        <button onClick={() => handleChangeLang(lang === 'ar' ? 'en' : 'ar')}>
          {lang === 'ar' ? <AsideEN /> : <AsideAR />}
        </button>
      </div>
    </div>
  );
}
