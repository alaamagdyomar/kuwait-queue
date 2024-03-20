import AppHeader from '@/components/AppHeader';
import MainHead from '@/components/MainHead';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { wrapper } from '@/redux/store';
import { useRouter } from 'next/router';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { West, East } from '@mui/icons-material';
import { appLinks, suppressText, imageSizes, scrollClass } from '@/constants/*';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { themeColor } from '@/redux/slices/vendorSlice';
import Image from 'next/image';
import NoProductFound from '@/appImages/no_product.png';


import {
  debounce,
  isEmpty,
  isNull,
  isUndefined,
  map,
  upperFirst,
} from 'lodash';
import TextTrans from '@/components/TextTrans';
import { setUrl } from '@/redux/slices/appSettingSlice';
import { destinationHeaderObject } from '@/redux/slices/searchParamsSlice';
import {
  useGetTopSearchQuery,
  useLazyGetProductsQuery,
  useLazyGetSearchProductsQuery,
} from '@/redux/api/productApi';
import { Product } from '@/types/index';
import VerProductWidget from '@/components/widgets/product/VerProductWidget';
import ContentLoader from '@/components/skeletons';
import { NextPage } from 'next';
import HorProductWidget from '@/components/widgets/product/HorProductWidget';
import { useGetVendorQuery } from '@/redux/api/vendorApi';

type Props = {
  url: string;
};

const Search: NextPage<Props> = ({ url }): React.ReactElement => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    searchParams: { category_id },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [icon, setIcon] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1); // storing current page number
  const [previousPage, setPreviousPage] = useState<number>(0); // storing prev page number
  const [latest, setLatest] = useState(false); // setting a flag to know the last list
  const [searchKey, setSearchKey] = useState<string | undefined>(``);
  const { query }: any = useRouter();
  const [currentProducts, setCurrentProducts] = useState<any>([]);
  const desObject = useAppSelector(destinationHeaderObject);
  const { data: vendor, isLoading } = useGetVendorQuery(
    {
      lang,
      url,
    },
    { refetchOnMountOrArgChange: 0.1 }
  );
  const [triggerGetProducts, { isLoading: getProductsLoading }] =
    useLazyGetProductsQuery();
  const [triggerSearchProducts] = useLazyGetSearchProductsQuery();
  const { data: topSearch, isSuccess: topSearchSuccess } = useGetTopSearchQuery(
    {
      lang,
      destination: desObject,
      url,
    }
  );
  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const handleFire = async () => {
    await triggerGetProducts({
      category_id: category_id?.toString(),
      destination: desObject,
      page: currentPage.toString(),
      limit: '30',
      url,
      lang,
    }).then((r) => {
      if (r.data && r.data?.Data && r.data?.Data?.products) {
        if (r.data.Data?.products?.length === 0) {
          setLatest(true);
          return;
        }
        setPreviousPage(currentPage);
        setCurrentProducts([...currentProducts, ...r.data.Data.products]);
      } else {
        // nothing
      }
    });
  };

  useEffect(() => {
    if (!latest && previousPage !== currentPage) {
      handleFire();
    }
  }, [latest, currentProducts, previousPage, currentPage]);

  const onScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const resetPages = async () => {
    setCurrentProducts([]);
    setCurrentPage(1);
    setPreviousPage(0);
  };

  const handleChange = async (key: string) => {
    if (key.length >= 2 && url) {
      setSearchKey(key);
      await triggerSearchProducts({
        category_id: category_id?.toString() ?? ``,
        key,
        lang,
        destination: desObject,
        url,
      }).then((r: any) => {
        if (r.data && r.data.Data && r.data.Data.length > 0) {
          setCurrentProducts(r.data.Data);
        } else {
          setCurrentProducts([]);
        }
      });
    } else {
      await resetPages().then(() => setSearchKey(undefined));
    }
  };

  useEffect(() => {
    isUndefined(searchKey) && handleFire();
  }, [searchKey]);

  // set products once page loaded , commented for now till confirmation
  // useEffect(() => {
  //  if(!(category_id)) {
  //   triggerSearchProducts({
  //     lang,
  //     destination: desObject,
  //     url,
  //   }).then((r: any) => {
  //     if (r.data && r.data.Data && r.data.Data.length > 0) {
  //       setCurrentProducts(r.data.Data);
  //     } else {
  //       setCurrentProducts([]);
  //     }
  //   });
  //  }
  // }, []);

  return (
    <Suspense>
      <MainHead
        title={t('search_products')}
        description={`${t('search_products')}`}
        url={url}
      />
      <MainContentLayout url={url}>
        <>
          {getProductsLoading && isEmpty(currentProducts) ? (
            <>
              <ContentLoader type="ProductHorizontal" sections={8} />
            </>
          ) : (
            <>
              <div className="flex justify-start items-center p-3 sticky top-0 z-50 w-full bg-white border-b-2 border-gray-200">
                <button
                  onClick={() => router.back()}
                  className={`flex justify-start items-center pt-1`}
                >
                  {router.locale === 'en' ? <West /> : <East />}
                </button>
                <input
                  type="text"
                  name="search"
                  id="search"
                  defaultValue={searchKey}
                  onChange={debounce((e) => handleChange(e.target.value), 400)}
                  className={`flex-1 px-5 py-3 h-12 base-mobile-lg-desktop placeholder:text-stone-500 capitalize foucs:ring-0 outline-none`}
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t('search')}`}
                />
              </div>
              {topSearchSuccess &&
                topSearch.Data &&
                isNull(category_id) &&
                isEmpty(currentProducts) &&
                ((!isUndefined(searchKey) && searchKey?.length < 2) ||
                  isUndefined(searchKey)) && (
                  <div className="p-5">
                    <h3
                      className="base-mobile-lg-desktop font-semibold pb-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('popular_search')}
                    </h3>
                    <div className="flex items-center flex-wrap">
                      {map(
                        topSearch.Data.topSearch,
                        (keyword, i) =>
                          !isEmpty(keyword) &&
                          !isNull(keyword) &&
                          keyword !== 'null' && (
                            <div className="pe-3 pb-3 ps-0" key={i}>
                              <button
                                className="bg-[#F3F2F2] text-stone-600 rounded-full w-fit h-12 px-5 flex justify-center items-center"
                                onClick={debounce(
                                  (e) => handleChange(keyword),
                                  400
                                )}
                              >
                                {keyword}
                              </button>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              {!isUndefined(searchKey) && searchKey?.length >= 2 && (
                <>
                  {isEmpty(currentProducts) && searchKey !== `` && (
                    <div className="flex justify-center items-center h-[75vh]">
                      <div className="flex flex-col items-center space-y-2">
                        <Image
                          src={NoProductFound}
                          alt="no product found"
                          width={150}
                          height={150}
                        />
                        <h4
                          className="font-semibold"
                          suppressHydrationWarning={suppressText}
                        >
                          {upperFirst(`${t('no_product_were_found')}`)}
                        </h4>
                        <p
                          className="text-stone-700"
                          suppressHydrationWarning={suppressText}
                        >
                          {upperFirst(
                            `${t('check_the_speling_or_try_searching_again')}`
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div
                ref={listRef}
                onScroll={onScroll}
                className={` ${scrollClass} ${
                  !isUndefined(searchKey) && currentProducts.length <= 5
                    ? `h-min`
                    : ``
                }  overflow-y-scroll
          `}
              >
                {currentProducts.length > 0 ? (
                  <div
                    className={`p-5 ${
                      vendor?.Data?.template_type === 'THEME_TWO_CATEGORY_LIST'
                        ? `grid grid-cols-2 gap-x-2`
                        : ``
                    }`}
                  >
                    {map(currentProducts, (product: Product) => (
                      <>
                        {vendor?.Data?.template_type ===
                        'THEME_TWO_CATEGORY_LIST' ? (
                          <HorProductWidget
                            element={product}
                            category_id={`${category_id}`}
                            key={product.id}
                          />
                        ) : (
                          <VerProductWidget
                            element={product}
                            category_id={`${category_id}`}
                            key={product.id}
                          />
                        )}
                      </>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col min-h-screen  justify-center items-center border-4">
                    <Image
                      src={NoProductFound}
                      alt="no product found"
                      width={150}
                      height={150}
                    />
                    <h1 className="capitalize">
                      {upperFirst(`${t('no_products_found')}`)}
                    </h1>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      </MainContentLayout>
    </Suspense>
  );
};
export default Search;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
