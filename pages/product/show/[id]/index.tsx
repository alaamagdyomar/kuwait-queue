import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { Product, ProductSection, QuantityMeters, img } from '@/types/index';
import { productApi, useGetProductQuery } from '@/redux/api/productApi';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState, Fragment, Suspense } from 'react';
import Carousel from 'react-material-ui-carousel';
import { setUrl, showToastMessage } from '@/redux/slices/appSettingSlice';
import {
  appLinks,
  imageSizes,
  imgUrl,
  mainBtnClass,
  modalBtnContainer,
  suppressText,
  toEn,
} from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import {
  concat,
  debounce,
  filter,
  find,
  first,
  flatMap,
  isEmpty,
  isNull,
  isUndefined,
  join,
  kebabCase,
  lowerCase,
  map,
  maxBy,
  min,
  minBy,
  multiply,
  now,
  startCase,
  sum,
  sumBy,
  groupBy,
  snakeCase,
} from 'lodash';
import {
  addMeter,
  addRadioBtn,
  addToCheckBox,
  disableAddToCart,
  enableAddToCart,
  removeFromCheckBox,
  removeMeter,
  removeMinQtyValidationID,
  resetCheckBoxes,
  resetMeters,
  resetMinQtyValidationID,
  resetRadioBtns,
  setCartProductQty,
  setInitialProductCart,
  setMinQtyValidationID,
  setNotes,
  updateId,
  updatePrice,
} from '@/redux/slices/productCartSlice';
import { Accordion, AccordionBody } from '@material-tailwind/react';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoFoundImage from '@/appImages/not_found.png';
import Image from 'next/image';
import FavouriteAndShare from '@/components/ProductShow/FavouriteAndShare';
import ChangeMoodModal from '@/components/modals/ChangeMoodModal';
import { West, East } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ContentLoader from '@/components/skeletons';
import {
  useGetCartProductsQuery,
  useAddToCartMutation,
  useLazyGetCartProductsQuery,
  useLazyCheckPromoCodeQuery,
} from '@/redux/api/cartApi';
import ChangeMood3Modal from '@/components/modals/ChangeMood3Modal';
import search from '../../search';
import {
  destinationId,
  destinationHeaderObject,
} from '@/redux/slices/searchParamsSlice';
import { setAreaBranchModalStatus } from '@/redux/slices/modalsSlice';
import PlusIcon from '@/appIcons/plus.svg';
import MinusIcon from '@/appIcons/minus.svg';
import { resetPromo } from '@/redux/slices/cartSlice';
import { toast } from 'react-toastify';

type Props = {
  product: Product;
  url: string;
  currentLocale: string;
  resolvedUrl: string;
};
const ProductShow: NextPage<Props> = ({
  product,
  url,
  currentLocale,
  resolvedUrl,
}): React.ReactNode => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    productCart,
    locale: { lang, isRTL },
    searchParams: { method, destination },
    customer: { userAgent, prefrences },
    vendor: { logo },
    cart: { promocode , enable_promocode},
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [currentQty, setCurrentyQty] = useState<number>(
    productCart.ProductID === product.id ? productCart.Quantity : 1
  );
  const [tabsOpen, setTabsOpen] = useState<{ id: number }[]>([]);
  const [isReadMoreShown, setIsReadMoreShown] = useState<boolean>(false);
  const [isNotAvailable, setIsOpenNotAvailable] = useState(false);
  const [offset, setOffset] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [outOfStock, setOutOfStock] = useState<boolean>(false);
  const DestinationId = useAppSelector(destinationId);
  const desObject = useAppSelector(destinationHeaderObject);
  const [triggerAddToCart] = useAddToCartMutation();
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();
  const [triggerCheckPromoCode] = useLazyCheckPromoCodeQuery();

  const {
    data: element,
    isSuccess,
    refetch: refetchGetProduct,
  } = useGetProductQuery({
    id: product.id,
    lang,
    destination: desObject,
    url,
  });
  const [requiredSection, setRequiredSection] = useState(false);
  // const minPrice = minBy(element?.Data?.sections?.[0]?.choices, (choice) => Number(choice?.price))?.price;
  // const maxPrice = maxBy(element?.Data?.sections?.[0]?.choices, (choice) => Number(choice?.price))?.price;
  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // min for checkbox and meter ===> optional and required
  const handleValidateMinQty = () => {
    dispatch(resetMinQtyValidationID());
    const groupByCheckboxes = groupBy(productCart.CheckBoxes, 'addonID');
    const groupByMeters = groupBy(productCart.QuantityMeters, 'addonID');

    let allCheckboxesValid = true;
    let allMetersValid = true;

    // checkboxes review min quantities
    for (const item in groupByCheckboxes) {
      const sumOfSelectedChoices = sumBy(
        groupByCheckboxes[item],
        (itm) => itm.addons[0].Value
      );

      const checkboxSection = filter(
        element?.Data?.sections,
        (addon) => addon.id === parseInt(item)
      )[0];

      // in caase of optional check error put id of section in state
      if (checkboxSection.selection_type === 'optional') {
        if (sumOfSelectedChoices < checkboxSection.min_q) {
          dispatch(setMinQtyValidationID(checkboxSection.id.toString()));
        } else {
          dispatch(removeMinQtyValidationID(checkboxSection.id.toString()));
        }
      }

      if (sumOfSelectedChoices < checkboxSection.min_q) {
        allCheckboxesValid = false;
      }
    }

    // meter review min quantities
    for (const item in groupByMeters) {
      const sumOfSelectedChoices = sumBy(
        groupByMeters[item],
        (itm) => itm.addons[0].Value
      );

      const MeterSection = filter(
        element?.Data?.sections,
        (addon) => addon.id === parseInt(item)
      )[0];

      // in caase of optional check error put id of section in state
      if (MeterSection.selection_type === 'optional') {
        if (sumOfSelectedChoices < MeterSection.min_q) {
          dispatch(setMinQtyValidationID(MeterSection.id.toString()));
        } else {
          dispatch(removeMinQtyValidationID(MeterSection.id.toString()));
        }
      }

      if (sumOfSelectedChoices < MeterSection.min_q) {
        allMetersValid = false;
      }
    }
    return allMetersValid && allCheckboxesValid;
  };

  useEffect(() => {
    if (isSuccess && element.Data) {
      // setOutOfStock(
      //   element.Data.never_out_of_stock === 0 &&
      //     element.Data.amount < currentQty
      // );
      if (productCart.ProductID !== element?.Data?.id) {
        handleResetInitialProductCart();
      }
      if (element?.Data?.sections?.length === 0) {
        dispatch(enableAddToCart());
      }
      if (
        element?.Data?.sections?.length !== 0 &&
        element?.Data?.sections?.filter(
          (itm) => itm.selection_type === 'mandatory'
        ).length === 0
      ) {
        dispatch(enableAddToCart());
      }
      if (
        element?.Data?.amount === 0 &&
        element?.Data?.never_out_of_stock === 0
      ) {
        setOutOfStock(true);
      } else if (element?.Data?.never_out_of_stock === 1) {
        setOutOfStock(false);
      }
    }
  }, [isSuccess, element?.Data?.id, isRTL]);

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  const handleValidateMendatory = () => {
    const requiredSections = filter(
      element?.Data?.sections,
      (c) => c.selection_type === 'mandatory'
    );
    for (const i in requiredSections) {
      // radio btns
      if (requiredSections[i].must_select === 'single') {
        // rb is short for checkbox
        let rbExist =
          productCart.RadioBtnsAddons.filter(
            (rb) => rb.addonID === requiredSections[i].id && rb.addons.Value
          ).length > 0;
        if (!rbExist) {
          return false;
        }
      }

      // checkboxes
      if (requiredSections[i].must_select === 'multi') {
        // cb is short for checkbox
        let cbExist =
          productCart.CheckBoxes.filter(
            (cb) => cb.addonID === requiredSections[i].id && cb.addons[0].Value
          ).length > 0;

        if (!cbExist) {
          return false;
        }
      }

      // qmeter
      if (requiredSections[i].must_select === 'q_meter') {
        let sumValue = 0;
        let qmExist =
          productCart.QuantityMeters.filter((qm) => {
            if (qm.addonID === requiredSections[i].id && qm.addons[0].Value) {
              sumValue += qm.addons[0].Value;
              return qm;
            }
          }).length > 0;
        if (!qmExist || sumValue < requiredSections[i].min_q) {
          return false;
        }
      }
    }

    return true;
  };

  useEffect(() => {
    if (
      isSuccess &&
      !isNull(element) &&
      !isNull(element.Data) &&
      !isEmpty(productCart) &&
      (currentQty > 0 ||
        (element?.Data?.amount >= 0 && element?.Data?.never_out_of_stock === 1))
    ) {
      const allCheckboxes = map(productCart.CheckBoxes, (q) => q.addons[0]);
      const allRadioBtns = map(productCart.RadioBtnsAddons, (q) => q.addons);
      const allMeters = map(productCart.QuantityMeters, (q) => q.addons[0]);
      const metersSum = sumBy(allMeters, (a) => multiply(a.price, a.Value)); // qty
      const checkboxesSum = sumBy(allCheckboxes, (a) => a.Value * a.price); // qty
      const radioBtnsSum = sumBy(allRadioBtns, (a) => a.Value * a.price); // qty
      const requiredMeters = filter(
        element?.Data?.sections,
        (c) => c.must_select === 'q_meter' && c.selection_type === 'mandatory'
      );
      const requiredRadioBtns = filter(
        element?.Data?.sections,
        (c) => c.must_select === 'single' && c.selection_type === 'mandatory'
      );
      const requiredCheckboxes = filter(
        element?.Data?.sections,
        (c) => c.must_select === 'multi' && c.selection_type === 'mandatory'
      );
      const MendatoryValidation = handleValidateMendatory();
      const minValueValidation = handleValidateMinQty();

      if (
        (requiredRadioBtns.length > 0 && allRadioBtns.length === 0) ||
        (requiredRadioBtns.length > 0 &&
          allRadioBtns.length < requiredRadioBtns.length) ||
        (requiredMeters.length > 0 && allMeters.length === 0) ||
        (requiredMeters.length > 0 &&
          allMeters.length < requiredMeters.length) ||
        (requiredCheckboxes.length > 0 && allCheckboxes.length === 0) ||
        (requiredCheckboxes.length > 0 &&
          allCheckboxes.length < requiredCheckboxes.length)
      ) {
        dispatch(disableAddToCart());
      } else {
        // to execute the for looop only when all those if conditions is failed
        // const MendatoryValidation = handleValidateMendatory();
        // const minValueValidation = handleValidateMinQty();

        if (!MendatoryValidation || !minValueValidation) {
          dispatch(disableAddToCart());
        } else {
          dispatch(enableAddToCart());
        }
      }

      dispatch(
        updatePrice({
          totalPrice: sum([
            parseFloat(
              element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
                ? element?.Data?.new_price
                : element?.Data?.price
            ),
            metersSum,
            checkboxesSum,
            radioBtnsSum,
          ]),
          totalQty: currentQty,
        })
      );
      const uIds = concat(
        productCart.QuantityMeters &&
          map(productCart.QuantityMeters, (q) => `_${q.uId2}`),
        productCart.CheckBoxes &&
          map(productCart.CheckBoxes, (c) => `_${c.uId}`),
        productCart.RadioBtnsAddons &&
          map(productCart.RadioBtnsAddons, (r) => `_${r.uId}`),
        ` _${productCart.ExtraNotes.replace(/[^A-Z0-9]/gi, '')}`
      );
      dispatch(updateId(`${productCart.ProductID}${join(uIds, '')}`));
    }
  }, [
    productCart.QuantityMeters,
    productCart.CheckBoxes,
    productCart.RadioBtnsAddons,
    currentQty,
    productCart.ExtraNotes,
  ]);

  useEffect(() => {
    if (productCart.enabled) {
      setRequiredSection(false);
    }
  }, [productCart.enabled]);

  const customAnimation = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };
  ``;
  const handleIncrease = () => {
    if (element && !outOfStock) {
      setCurrentyQty(currentQty + 1);
      dispatch(setCartProductQty(currentQty + 1));
    }
  };

  const handleDecrease = () => {
    if (isSuccess && !isNull(element)) {
      if (currentQty - 1 > 0) {
        setCurrentyQty(currentQty - 1);
        dispatch(setCartProductQty(currentQty - 1));
      } else {
        setCurrentyQty(0);
        handleResetInitialProductCart();
      }
    }
  };

  const handleResetInitialProductCart = () => {
    if (isSuccess && !isNull(element) && element.Data) {
      dispatch(
        setInitialProductCart({
          ProductID: element?.Data?.id,
          ProductName: element?.Data?.name,
          ProductImage: element?.Data?.cover ?? ``,
          ProductNameAr: element?.Data?.name_ar,
          ProductNameEn: element?.Data?.name_en,
          ProductDesc: element?.Data?.desc,
          Quantity: currentQty,
          ExtraNotes: ``,
          totalPrice: parseFloat(
            element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
              ? element?.Data?.new_price
              : element?.Data?.price
          ),
          grossTotalPrice: parseFloat(
            element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
              ? element?.Data?.new_price
              : element?.Data?.price
          ),
          totalQty: currentQty,
          Price: parseFloat(
            element?.Data?.new_price && !isEmpty(element?.Data?.new_price)
              ? element?.Data?.new_price
              : element?.Data?.price
          ),
          enabled:
            filter(
              element?.Data.sections,
              (s) => s.selection_type === 'mandatory'
            ).length === 0 &&
            element?.Data?.amount >= 0 &&
            element?.Data?.never_out_of_stock === 1,
          image: imgUrl(element?.Data.img[0]?.toString()),
          id: now().toString(),
          MinQtyValidationID: '',
        })
      );
    }
  };

  const handleSelectAddOn = async (
    selection: ProductSection,
    choice: any,
    type: string,
    checked: boolean
  ) => {
    if (type === 'checkbox') {
      if (checked) {
        const checkboxMaxQty = filter(
          element?.Data?.sections,
          (c) => c.id === selection.id
        )[0].max_q;

        const checkboxSelectedQty = filter(
          productCart.CheckBoxes,
          (c) => c.addonID === selection.id
        ).length;

        // if max val disable checkbox
        if (checkboxSelectedQty + 1 <= checkboxMaxQty) {
          dispatch(
            addToCheckBox({
              addonID: selection.id,
              uId: `${selection.id}${choice.id}${choice.name_en}`,
              addons: [
                {
                  attributeID: choice.id,
                  name: choice.name,
                  name_ar: choice.name_ar,
                  name_en: choice.name_en,
                  Value: 1,
                  price: parseFloat(choice.price),
                },
              ],
            })
          );
        }
      } else {
        dispatch(
          removeFromCheckBox(`${selection.id}${choice.id}${choice.name_en}`)
        );
      }
    } else if (type === 'radio') {
      dispatch(
        addRadioBtn({
          addonID: selection.id,
          uId: `${selection.id}${choice.id}${choice.name_en}`,
          addons: {
            attributeID: choice.id,
            name: choice.name,
            name_ar: choice.name_ar,
            name_en: choice.name_en,
            Value: 1,
            price: parseFloat(choice.price),
          },
        })
      );
    } else if (type === 'q_meter') {
      const currentMeter = filter(
        productCart.QuantityMeters,
        (q: QuantityMeters) =>
          q.uId === `${selection.id}${choice.id}` && q.addons[0]
      );

      if (checked) {
        // to disable on max qty
        const currentSelectionAddonsValues = filter(
          productCart.QuantityMeters,
          (q: QuantityMeters) => {
            if (q.addonID === selection.id && q.addons[0])
              return q.addons[0].Value;
          }
        );
        const sumSelectedMeterValues = sumBy(
          currentSelectionAddonsValues,
          (qm) => qm.addons[0].Value
        );
        // update value and check max qty
        const Value =
          sumSelectedMeterValues + 1 <= selection.max_q
            ? isEmpty(currentMeter)
              ? 1
              : parseFloat(currentMeter[0]?.addons[0].Value) + 1
            : isEmpty(currentMeter)
            ? 0
            : parseFloat(currentMeter[0]?.addons[0].Value);

        dispatch(
          addMeter({
            addonID: selection.id,
            uId2: `${selection.id}${choice.id}${Value}`,
            uId: `${selection.id}${choice.id}`,
            addons: [
              {
                attributeID: choice.id,
                name: choice.name,
                name_ar: choice.name_ar,
                name_en: choice.name_en,
                Value,
                price: parseFloat(choice.price),
              },
            ],
          })
        );
      } else {
        // decrease
        if (!isEmpty(currentMeter)) {
          const Value = isEmpty(currentMeter)
            ? 1
            : parseFloat(currentMeter[0]?.addons[0].Value) - 1 >= 0
            ? parseFloat(currentMeter[0]?.addons[0].Value) - 1
            : parseFloat(currentMeter[0]?.addons[0].Value);

          dispatch(
            addMeter({
              addonID: selection.id,
              uId2: `${selection.id}${choice.id}${Value}`,
              uId: `${selection.id}${choice.id}`,
              addons: [
                {
                  attributeID: choice.id,
                  name: choice.name,
                  name_ar: choice.name_ar,
                  name_en: choice.name_en,
                  Value,
                  price: parseFloat(choice.price),
                },
              ],
            })
          );
        } else {
          dispatch(removeMeter(`${selection.id}${choice.id}`));
        }
      }
    }
  };

  const { data: cartItems } = useGetCartProductsQuery({
    userAgent,
    area_branch: desObject,
    url,
    PromoCode: promocode,
  });
  const handelCartPayload = () => {
    let items = map(cartItems?.data.Cart, (i) => {
      // if item is not in the cart return all items in cart
      if (
        i.id?.split('_').sort().join(',') !==
        productCart.id.split('_').sort().join(',')
      ) {
        return i;
      }
      // if item is in the cart return item but with quantity increased
      // if (i.id === productCart.id)
      else if (
        i.id?.split('_').sort().join(',') ===
        productCart.id.split('_').sort().join(',')
      ) {
        return {
          ...i,
          Quantity: i.Quantity + productCart.Quantity,
        };
      }
    });
    // if item is not in the cart add it
    if (
      isUndefined(
        find(
          items,
          (x) =>
            x?.id?.split('_').sort().join(',') ===
            productCart.id.split('_').sort().join(',')
        )
      )
    ) {
      items.push(productCart);
    }
    return items;
  };

  const handleAddToCart = async () => {
    if (isNull(destination) || prefrences.type === '') {
      dispatch(setAreaBranchModalStatus(true));
      return;
    }
    if (!productCart.enabled) {
      setRequiredSection(true);
      dispatch(
        showToastMessage({
          content: `please_provide_all_required_information`,
          type: `error`,
        })
      );
    } else {
      if (!isEmpty(productCart) && userAgent) {
        await triggerAddToCart({
          process_type: method,
          destination: desObject,
          body: {
            UserAgent: userAgent,
            Cart:
              cartItems && cartItems.data && cartItems.data.Cart
                ? handelCartPayload()
                : [productCart],
          },
          url,
        }).then((r: any) => {
          if (r && r.data && r.data.status && r.data.data && r.data.data.Cart) {
            // dispatch(resetPromo());
            if (enable_promocode && promocode) {
              // check if promo is still valid or not
              triggerCheckPromoCode({
                userAgent: userAgent,
                PromoCode: promocode,
                url,
                area_branch: desObject,
              }).then((r: any) => {
                // console.log({ r });
                if (r.error && r.error?.msg) {
                  dispatch(resetPromo());
                }
              });
            }
            triggerGetCartProducts({
              userAgent,
              area_branch: desObject,
              url,
              PromoCode: promocode,
            }).then((r) => {
              if ((r.data && r.data.data) || r.data?.data.Cart) {
                dispatch(
                  showToastMessage({
                    content: 'item_added_successfully',
                    type: `success`,
                  })
                );
                dispatch(resetRadioBtns());
                dispatch(resetCheckBoxes());
                dispatch(resetMeters());
                if (
                  router.query.category_id &&
                  router.query.category_id !== 'null' &&
                  router.query.category_id !== 'undefined'
                ) {
                  // router.replace(
                  //   appLinks.productIndex(
                  //     router.query.category_id.toString(),
                  //     ``,
                  //     destination?.id,
                  //     destination?.id
                  //   )
                  // );
                  // will edit routing to productSearch page when complete product search
                  router.replace('/');
                } else {
                  router.replace('/');
                }
              } else {
              }
            });
          } else {
            if (r?.error && r?.error?.data) {
              if (
                // r &&
                // r.error &&
                // r.error.data &&
                typeof r.error.data.msg === 'string' &&
                r.error.data.msg.includes('not available')
              ) {
                setIsOpenNotAvailable(true);
              } else if (
                // r &&
                // r.error &&
                // r.error.data &&
                r.error.data.product &&
                r.error.data.product[0].amount
              ) {
                toast(
                  `${t(snakeCase(lowerCase(r.error.data.msg)), {
                    amount: r.error.data.product[0]?.amount,
                  })}`,
                  { type: 'error' }
                );
              } else {
                dispatch(
                  showToastMessage({
                    content: r.error.data.msg
                      ? lowerCase(
                          kebabCase(
                            r.error.data.msg.isArray
                              ? first(values(r.error.data.msg))
                              : r.error.data.msg
                          )
                        )
                      : 'select_a_branch_or_area_before_order_or_some_fields_are_required_missing',
                    type: `error`,
                  })
                );
              }
            } else {
            }
          }
        });
      }
    }
  };

  return (
    <Suspense>
      <MainHead
        title={`${currentLocale === 'ar' ? product.name_ar : product.name_en}`}
        url={`${url}${resolvedUrl}`}
        description={`${
          currentLocale === 'ar'
            ? product.description_ar
            : product.description_en
        }`}
        mainImage={`${product?.cover?.toString()}`}
        icon={`${logo}`}
        twitter={`${url}${resolvedUrl}`}
        facebook={`${url}${resolvedUrl}`}
        instagram={`${url}${resolvedUrl}`}
      />
      <MainContentLayout url={url}>
        {isSuccess && !isNull(element) && element.Data ? (
          <div className={`min-h-screen`}>
            <div
              className={`flex justify-between items-center p-3 ${
                offset > 80 ? 'fixed lg:sticky' : 'sticky'
              } top-0 z-50 w-full capitalize bg-white border-b-20`}
            >
              <div className="flex">
                <button onClick={() => router.back()}>
                  {router.locale === 'en' ? <West /> : <East />}
                </button>
                {offset > 80 && (
                  <TextTrans
                    ar={element?.Data?.name_ar}
                    en={element?.Data?.name_en}
                    style={{
                      maxWidth: '25ch',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'block',
                      color: `black`,
                    }}
                    className="px-6"
                  />
                )}
              </div>
              <FavouriteAndShare
                product_id={product.id.toString()}
                url={url}
                existInWishlist={element.Data.productWishList}
                slug={lowerCase(kebabCase(product.name))}
              />
            </div>
            <div className="relative w-full capitalize">
              <div className="relative w-full h-auto overflow-hidden">
                {!isEmpty(element?.Data?.img) ? (
                  <Carousel
                    className={`w-full h-full`}
                    height={'45vh'}
                    navButtonsAlwaysInvisible={true}
                    indicatorIconButtonProps={{
                      style: {
                        padding: '1px',
                        color: 'lightgray',
                      },
                    }}
                    activeIndicatorIconButtonProps={{
                      style: {
                        padding: '0.5px',
                        fontSize: '1px',
                        color,
                      },
                    }}
                    indicatorContainerProps={{
                      style: {
                        marginTop: '2px', // 5
                      },
                    }}
                    indicators={element?.Data?.img.length > 1}
                  >
                    {map(element?.Data?.img, (image: img, i) => (
                      <Image
                        src={`${
                          image && image.original
                            ? imgUrl(image.original)
                            : NoFoundImage.src
                        }`}
                        alt={element?.Data?.name ?? ``}
                        sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      33vw"
                        fill={true}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <CustomImage
                    src={`${NoFoundImage.src}`}
                    alt={element?.Data?.name}
                    width={imageSizes.xl}
                    height={imageSizes.lg}
                    className={`object-cover w-full h-80`}
                  />
                )}
              </div>
            </div>
            <div className={`capitalize pt-5`}>
              {/*   name and desc */}
              <div className="flex flex-row w-full justify-between items-center px-4 md:px-8 pb-4 border-b-2 border-stone-200">
                <div className={`flex-1 space-y-2`}>
                  <p className="font-bold text-base lg:text-xl">
                    <TextTrans
                      ar={element?.Data?.name_ar}
                      en={element?.Data?.name_en}
                      style={{
                        maxWidth: '30ch',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        display: 'block',
                        color: `black`,
                      }}
                    />
                  </p>
                  <p
                    className={`rtl:pl-1 ltr:pr-1 ${
                      isReadMoreShown ? '' : 'line-clamp-4'
                    }`}
                  >
                    <TextTrans
                      ar={element?.Data?.description_ar}
                      en={element?.Data?.description_en}
                      length={
                        isReadMoreShown
                          ? isRTL
                            ? element?.Data?.description_ar.length
                            : element?.Data?.description_en.length
                          : 99
                      }
                      className="text-[#877D78] xs-mobile-sm-desktop lg:text-base break-all"
                    />
                    {((element?.Data?.description_ar.length >= 99 && isRTL) ||
                      (element?.Data?.description_en.length >= 99 &&
                        !isRTL)) && (
                      <button
                        onClick={() => setIsReadMoreShown(!isReadMoreShown)}
                        style={{ color }}
                        className="font-semibold xs-mobile-sm-desktop px-3"
                      >
                        {isReadMoreShown
                          ? startCase(`${t('read_less')}`)
                          : startCase(`${t('read_more')}`)}
                      </button>
                    )}
                  </p>
                  {/* {(!isUndefined(element?.Data?.sections?.length) && 
                  element?.Data?.sections?.length > 0 && 
                  minPrice !== maxPrice) &&
                  (
                     <div className={`w-fit h-10 border-[1px] rounded-full flex justify-center items-center space-x-2 px-4`} 
                          style={{ borderColor: color, color }}>
                      <span>{minPrice}</span>
                      <span>-</span>
                      <span>{maxPrice} {t('kd')}</span>
                    </div>
                  )} */}
                </div>
              </div>
              {/*     sections  */}
              {map(element?.Data?.sections, (s: ProductSection, i) => (
                <div
                  className={`border-b-8 border-stone-100 px-4 lg:px-8 py-4`}
                  key={i}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="base-mobile-lg-desktop pb-2">
                        {t('select')}{' '}
                        <TextTrans ar={s.title_ar} en={s.title_en} />
                      </p>
                      <p className="text-[#877D78] sm-mobile-base-desktop">
                        {s.must_select === 'single'
                          ? t('select1')
                          : t('multi_selection')}
                      </p>
                    </div>
                    <div
                      className={`xs-mobile-sm-desktop text-center rounded-full w-20 h-8 pt-2 lg:pt-1 ${
                        requiredSection && s.selection_type === 'mandatory'
                          ? 'bg-white border-red-600 border-[1px] text-red-600'
                          : 'bg-gray-100'
                      }`}
                    >
                      <span>
                        {s.selection_type === 'mandatory'
                          ? t('required')
                          : t('optional')}
                      </span>
                    </div>
                  </div>
                  {s.hidden ? (
                    <div className={`flex flex-col gap-x-2 gap-y-1  mt-2`}>
                      <div className={`flex pb-1`}>
                        <input
                          id={`${s.id}${s.selection_type}`}
                          name={`${s.id}${s.selection_type}`}
                          type="radio"
                          checked={
                            !isEmpty(filter(tabsOpen, (t) => t.id === s.id))
                          }
                          onClick={() =>
                            setTabsOpen([...tabsOpen, { id: s.id }])
                          }
                          className="h-4 w-4 lg:h-5 lg:w-5"
                          style={{ accentColor: color }}
                        />
                        <label
                          onClick={() =>
                            setTabsOpen([...tabsOpen, { id: s.id }])
                          }
                          htmlFor={`${s.id}${s.selection_type}`}
                          className="mx-3 block xs-mobile-sm-desktop"
                        >
                          {t('yes')}
                        </label>
                      </div>
                      <div className={`flex flex-row`}>
                        <input
                          id={`${s.id}${s.selection_type}`}
                          name={`${s.id}${s.selection_type}`}
                          type="radio"
                          checked={isEmpty(
                            filter(tabsOpen, (t) => t.id === s.id)
                          )}
                          onClick={() => {
                            if (
                              s.selection_type === `optional` &&
                              s.must_select === 'multi'
                            ) {
                              dispatch(resetCheckBoxes());
                            } else {
                              dispatch(resetRadioBtns());
                            }
                            setTabsOpen(filter(tabsOpen, (t) => t.id !== s.id));
                          }}
                          className="h-4 w-4 lg:h-5 lg:w-5"
                          style={{ accentColor: color }}
                        />
                        <label
                          onClick={() => {
                            if (
                              s.selection_type === `optional` &&
                              s.must_select === 'multi'
                            ) {
                              dispatch(resetCheckBoxes());
                            } else {
                              dispatch(resetRadioBtns());
                            }
                            setTabsOpen(filter(tabsOpen, (t) => t.id !== s.id));
                          }}
                          htmlFor={`${s.id}${s.selection_type}`}
                          className="mx-3 block xs-mobile-sm-desktop"
                        >
                          {t('no')}
                        </label>
                      </div>
                    </div>
                  ) : null}
                  <Accordion
                    hidden={true}
                    open={
                      !s.hidden
                        ? true
                        : !isEmpty(filter(tabsOpen, (t) => t.id === s.id))
                    }
                    animate={customAnimation}
                    className={`w-full`}
                  >
                    <AccordionBody
                      style={{
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                    >
                      {/* {(s.must_select === 'q_meter' ||
                        s.must_select === 'multi') &&
                      s.selection_type === 'mandatory' ? (
                        <p className={`flex -w-full text-red-600 pb-3`}>
                          {t(`must_select_min_and_max`, {
                            min: s.min_q,
                            max: s.max_q,
                          })}
                        </p>
                      ) : (
                        s.selection_type === 'mandatory' && (
                          <p className={`flex -w-full text-red-600 pb-3`}>
                            {t(`field_must_select_at_least_one`)}
                          </p>
                        )
                      )} */}
                      {s.selection_type === 'mandatory' ? (
                        s.must_select === 'q_meter' ||
                        s.must_select === 'multi' ? (
                          <p className={`flex -w-full text-red-600 pb-3`}>
                            {t(`must_select_min_and_max`, {
                              min: s.min_q,
                              max: s.max_q,
                            })}
                          </p>
                        ) : (
                          // radio btn msg
                          <p className={`flex -w-full text-red-600 pb-3`}>
                            {t(`field_must_select_at_least_one`)}
                          </p>
                        )
                      ) : (
                        // optional addons min qty msg
                        productCart.MinQtyValidationID.includes(
                          s.id.toString()
                        ) && (
                          <p className={`flex -w-full text-red-600 pb-3`}>
                            {t(`must_select_min_and_max`, {
                              min: s.min_q,
                              max: s.max_q,
                            })}
                          </p>
                        )
                      )}
                      {map(s.choices, (c, i) => (
                        <div className="flex items-center w-full pb-2" key={i}>
                          {s.must_select === 'q_meter' ? (
                            <div
                              className={`flex flex-row w-full justify-between items-center`}
                            >
                              <div className={`space-y-1`}>
                                {/* addon name */}
                                <div>
                                  <TextTrans ar={c.name_ar} en={c.name_en} />
                                </div>
                                <div>
                                  +{c.price}{' '}
                                  <span className={`uppercase`}>
                                    {t(`kwd`)}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`flex items-center ${
                                  isRTL && 'flex-row-reverse'
                                }`}
                              >
                                <button
                                  disabled={
                                    currentQty === 0 ||
                                    first(
                                      filter(
                                        productCart.QuantityMeters,
                                        (q) => q.uId === `${s.id}${c.id}`
                                      )
                                    )?.addons.Value === 0
                                  }
                                  onClick={() =>
                                    handleSelectAddOn(
                                      s,
                                      c,
                                      s.must_select,
                                      false
                                    )
                                  }
                                  type="button"
                                  className={`w-6 h-6 lg:w-7 lg:h-7 base-mobile-lg-desktop font-semibold bg-white border-[1px] rounded-full pb-4 disabled:border-gray-300 disabled:text-gray-300`}
                                  style={{ borderColor: color, color }}
                                >
                                  -
                                </button>
                                <span className="text-black lg-mobile-xl-desktop inline-block text-center w-10 h-7">
                                  {filter(
                                    productCart?.QuantityMeters,
                                    (q) => q.uId === `${s.id}${c.id}`
                                  )[0]?.addons[0]?.Value ?? 0}
                                </span>
                                <button
                                  disabled={currentQty < 1}
                                  onClick={() =>
                                    handleSelectAddOn(s, c, s.must_select, true)
                                  }
                                  type="button"
                                  className="w-6 h-6 lg:w-7 lg:h-7 text-white base-mobile-lg-desktop font-semibold rounded-full pb-3 disabled:!bg-gray-200 disabled:cursor-not-allowed"
                                  style={{ backgroundColor: color }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={i}
                              className="pb-2 flex flex-1 justify-between"
                            >
                              <div className="flex">
                                <input
                                  id={`${c.id}${s.selection_type}${s.title_en}`}
                                  name={`${c.id}${s.selection_type}${s.title_en}`}
                                  required={s.selection_type !== 'optional'}
                                  type={
                                    s.must_select === 'multi'
                                      ? `checkbox`
                                      : 'radio'
                                  }
                                  checked={
                                    s.must_select !== 'multi'
                                      ? filter(
                                          productCart.RadioBtnsAddons,
                                          (q) =>
                                            q.uId ===
                                            `${s.id}${c.id}${c.name_en}`
                                        )[0]?.uId ===
                                        `${s.id}${c.id}${c.name_en}`
                                      : filter(
                                          productCart.CheckBoxes,
                                          (q) =>
                                            q.uId ===
                                            `${s.id}${c.id}${c.name_en}`
                                        )[0]?.uId ===
                                        `${s.id}${c.id}${c.name_en}`
                                  }
                                  onChange={(e) =>
                                    handleSelectAddOn(
                                      s,
                                      c,
                                      s.must_select === 'multi'
                                        ? `checkbox`
                                        : 'radio',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 lg:h-5 lg:w-5 border-red-600 checked:ring-0 focus:ring-0"
                                  style={{ accentColor: color }}
                                />
                                {/* addon name */}
                                <label
                                  onClick={(e) =>
                                    handleSelectAddOn(
                                      s,
                                      c,
                                      s.must_select === 'multi'
                                        ? `checkbox`
                                        : 'radio',
                                      e.target.checked
                                    )
                                  }
                                  htmlFor={`${c.id}${s.selection_type}`}
                                  className="ltr:ml-3 rtl:mr-3 block xs-mobile-sm-desktop"
                                >
                                  <TextTrans ar={c.name_ar} en={c.name_en} />
                                </label>
                              </div>
                              <div>
                                {parseFloat(c.price).toFixed(3)}
                                <span className={`mx-1 uppercase`}>
                                  {t(`kwd`)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </AccordionBody>
                  </Accordion>
                </div>
              ))}

              {/* notes */}
              <div className="px-4 lg:px-8 py-4">
                <p className="pb-3 sm-mobile-base-desktop">
                  {t('special_instructions')}
                </p>
                <input
                  type="text"
                  placeholder={`${t('add_instructions')}`}
                  suppressHydrationWarning={suppressText}
                  value={productCart?.ExtraNotes}
                  onChange={(e) => dispatch(setNotes(toEn(e.target.value)))}
                  className={`bg-neutral-100 py-3 rounded-md px-5 w-full focus:ring-0 outline-none capitalize placeholder:text-stone-400 sm-mobile-base-desktop`}
                />
              </div>
            </div>
            <div className="lg:sticky bottom-0 bg-white">
              <div className="flex justify-center items-center w-full px-4 lg:px-8">
                <div
                  className={`flex flex-row justify-center items-center my-4 capitalize`}
                >
                  <div
                    className={`flex items-center ${
                      !isRTL && 'flex-row-reverse'
                    }`}
                  >
                    <button
                      disabled={currentQty === element.Data?.amount}
                      onClick={handleIncrease}
                      type="button"
                      className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-white text-base rounded-full disabled:bg-gray-300"
                      style={{ backgroundColor: color }}
                    >
                      <PlusIcon />
                    </button>
                    <span className="text-black lg-mobile-xl-desktop inline-block text-center w-10 h-7">
                      {currentQty}
                    </span>
                    <button
                      disabled={currentQty === 1}
                      onClick={handleDecrease}
                      type="button"
                      className={`w-6 h-6 lg:w-8 lg:h-8 flex justify-center items-center bg-white border-[1px] rounded-full disabled:border-gray-300 disabled:text-gray-300`}
                      style={{ backgroundColor: color }}
                    >
                      <MinusIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div className={`px-4 border-b-[1px] pb-5`}>
                <button
                  disabled={outOfStock}
                  onClick={debounce(() => handleAddToCart(), 400)}
                  className={`font-light ${mainBtnClass} py-2 flex justify-between px-5`}
                  style={{
                    backgroundColor: color,
                    color: `white`,
                  }}
                >
                  <div className="px-5 text-center w-full">
                    {outOfStock ? (
                      t('out_stock')
                    ) : isNull(destination) ? (
                      t(`start_ordering`)
                    ) : (
                      <div className="w-full flex justify-between">
                        {t('add_to_cart')}
                        <span className="flex">
                          <p className={`text-white`}>
                            {parseFloat(productCart.grossTotalPrice).toFixed(
                              3
                            ) === '0.000' && productCart.price_on_selection
                              ? t(`price_on_selection`)
                              : parseFloat(productCart.grossTotalPrice).toFixed(
                                  3
                                )}
                          </p>
                          {parseFloat(productCart.grossTotalPrice).toFixed(
                            3
                          ) !== '0.000' && (
                            <span className={`text-white uppercase px-2`}>
                              {t('kd')}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
                <ChangeMoodModal url={url} />

                <ChangeMood3Modal
                  isOpen={isNotAvailable}
                  onRequestClose={() => setIsOpenNotAvailable(false)}
                />
              </div>
            </div>
          </div>
        ) : (
          <ContentLoader type="ProductShow" sections={1} />
        )}
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale, req, resolvedUrl }) => {
      const { id, branchId, areaId }: any = query;
      if (!id || !req.headers.host) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: {
        data: AppQueryResult<Product>;
        isError: boolean;
      } = await store.dispatch(
        productApi.endpoints.getProduct.initiate(
          {
            id,
            lang: locale,
            url: req.headers.host,
          },
          {
            forceRefetch: true,
          }
        )
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          product: element.Data,
          url: req.headers.host,
          currentLocale: locale,
          resolvedUrl,
        },
      };
    }
);
