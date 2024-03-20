import React, { Suspense } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
// import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
import Link from 'next/link';
import {
  alexandriaFontBold,
  alexandriaFontMeduim,
  appLinks,
  deleteToken,
  suppressText,
} from '@/constants/*';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  Close,
  ChevronRightOutlined,
  ChevronLeftOutlined,
} from '@mui/icons-material';
import HorizentalLine from '@/components/HorizentalLine';
import AppFooter from '@/components/AppFooter';
import FastSignInIcon from '@/appIcons/fast_signin.svg';
import MenuIcon from '@/appIcons/more_menu.svg';
import CartIcon from '@/appIcons/more_cart.svg';
import OrdersIcon from '@/appIcons/more_orders.svg';
import WishlistIcon from '@/appIcons/more_love.svg';
import AddressIcon from '@/appIcons/more_address.svg';
import { isAuthenticated, signIn, signOut } from '@/redux/slices/customerSlice';

type Props = {};

const SideMenu: FC<Props> = (): React.ReactNode => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const router = useRouter();
  const {
    locale: { isRTL },
    appSetting,
    customer: { id, token, name },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);

  const handleProtectedRouteNavigation = (path: string) => {
    if (isAuth) {
      return path;
    } else {
      return appLinks.login.path;
    }
  };

  const handleSignOut = async () => {
    dispatch(signOut(undefined));
    await deleteToken();
    return router.push('/').then(() => router.reload());
  };

  return (
    <Suspense fallback={<div>loading skeleton</div>}>
      <Menu
        right={router.locale === 'ar'}
        isOpen={appSetting.sideMenuOpen}
        onClose={() => {
          dispatch(hideSideMenu());
        }}
        className="!w-full lg:!w-2/4 xl:!w-1/3 bg-white"
        itemListClassName="overflow-auto"
        customBurgerIcon={false}
        customCrossIcon={false}
      >
        <div
          style={{ display: 'flex' }}
          className="flex-col justify-between  bg-white h-full outline-none capitalize"
        >
          <div>
            <header className="">
              {/* close btn and more */}
              <div className="flex items-center p-4">
                <p
                  className="cursor-pointer capitalize"
                  id="CloseMenuBtn"
                  onClick={() => dispatch(hideSideMenu(undefined))}
                  suppressHydrationWarning={suppressText}
                >
                  <Close fontSize="small" className={`h-4 w-4`} />
                </p>
                <p className="w-full text-center font-semibold">{t('more')}</p>
              </div>
              <HorizentalLine className="h-1" />

              {/* user or guest section */}
              <div className="bg-slate-100 rounded-md mx-4 my-2 p-3">
                {isAuth ? (
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-1">
                      {/* img */}
                      <div className="rounded-full h-5 w-5"></div>
                      <div>
                        <p className="xs-mobile-sm-desktop mb-1">
                          {t('Welcome_back')} !
                        </p>
                        <p className="font-bold">{name}</p>
                      </div>
                    </div>
                    <button
                      className="bg-white rounded-xl xs-mobile-sm-desktop font-semibold px-2 py-px"
                      onClick={() => handleSignOut()}
                    >
                      {t('sign_out')}
                    </button>
                  </div>
                ) : (
                  <Link
                    className="flex justify-between items-center"
                    href={appLinks.login.path}
                  >
                    <div className="flex gap-x-2">
                      <FastSignInIcon />
                      <p
                        className={`${alexandriaFontMeduim}`}
                        suppressHydrationWarning={suppressText}
                      >
                        <span className={`${alexandriaFontBold}`}>
                          {t('sign_in')}
                        </span>{' '}
                        {t('to_orderfast_now')}
                      </p>
                    </div>
                    {isRTL ? <ChevronLeftOutlined /> : <ChevronRightOutlined />}
                  </Link>
                )}
              </div>
              {/* )} */}
            </header>

            {/* links */}
            <div className="flex-col px-4  gap-y-2 my-5">
              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                replace={false}
                href={appLinks.home.path}
              >
                <MenuIcon fill={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('menu')}
                </p>
              </Link>

              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={appLinks.cart.path}
              >
                <CartIcon stroke={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('my_cart')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={handleProtectedRouteNavigation(
                  appLinks.orderHistory.path
                )}
              >
                <OrdersIcon stroke={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('my_orders')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />

              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={handleProtectedRouteNavigation(appLinks.wishlist.path)}
              >
                <WishlistIcon stroke={color} fill="none" />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('wishlist')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />
              <Link
                className="flex gap-x-3  items-center ps-1"
                scroll={true}
                href={handleProtectedRouteNavigation(
                  appLinks.userAddresses(id)
                )}
              >
                <AddressIcon stroke={color} />
                <p
                  suppressHydrationWarning={suppressText}
                  className="capitalize"
                >
                  {t('my_addresses')}
                </p>
              </Link>
              <HorizentalLine className="my-3" />
            </div>
          </div>

          <AppFooter />
        </div>
      </Menu>
    </Suspense>
  );
};

export default SideMenu;
