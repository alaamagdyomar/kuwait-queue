import CustomImage from '@/components/CustomImage';
import TextTrans from '@/components/TextTrans';
import {
  alexandriaFontLight,
  alexandriaFontSemiBold,
  imageSizes,
  imgUrl,
  appLinks,
  montserratFontRegular,
  suppressText,
} from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import {
  CheckBoxes,
  ProductCart,
  QuantityMeters,
  RadioBtns,
} from '@/types/index';
import { isEmpty, map } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  product: ProductCart;
  checkoutProduct?: boolean;
  HandelDecIncRmv?: (item: ProductCart, process: string) => void;
};

export default function CartProduct({
  product,
  checkoutProduct = false,
  HandelDecIncRmv = () => {},
}: Props) {
  const { t } = useTranslation();
  const {
    locale: { lang },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);

  console.log(product.ProductImage, product.ProductNameEn);
  return (
    <div
      className={`flex border-b gap-x-2 ${checkoutProduct ? 'py-2' : 'py-4'}`}
    >
      {!checkoutProduct && (
        <Link
          className="w-1/4"
          href={`${appLinks.productShow(
            product.ProductID,
            product.ProductName
          )}`}
        >
          <Image
            src={imgUrl(product.ProductImage)}
            alt={'product img'}
            className="rounded-md"
            width={imageSizes.xs}
            height={imageSizes.xs}
          />
        </Link>
      )}

      <div className="flex justify-between gap-x-1 w-full">
        {/* name and addons and qty meter*/}
        <div>
          <Link
            className="flex gap-x-1"
            href={`${appLinks.productShow(
              product.ProductID,
              product.ProductName
            )}`}
          >
            <TextTrans
              className={`capitalize ${alexandriaFontSemiBold}`}
              ar={product.ProductNameAr}
              en={product.ProductNameEn}
              length={15}
            />
            <p
              className={`capitalize ${alexandriaFontSemiBold}`}
              suppressHydrationWarning={suppressText}
            >
              x{product.Quantity}
            </p>
          </Link>
          {/* addons products */}
          {(!isEmpty(product.QuantityMeters) ||
            !isEmpty(product.RadioBtnsAddons) ||
            !isEmpty(product.CheckBoxes)) && (
            <div className={`flex mb-1 ${alexandriaFontLight}`}>
              <div className="w-fit pb-2 pt-1">
                <div className={`flex gap-1 w-auto flex-wrap`}>
                  {!isEmpty(product.QuantityMeters) &&
                    map(product.QuantityMeters, (q: QuantityMeters, i) => (
                      <Fragment key={i}>
                        {map(q.addons, (addon, i) => (
                          <>
                            <TextTrans
                              key={i}
                              className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                              ar={`${addon.name_ar} ${addon.Value}X`}
                              en={`${addon.name_en} ${addon.Value}X`}
                            />
                          </>
                        ))}
                      </Fragment>
                    ))}
                  {!isEmpty(product.RadioBtnsAddons) &&
                    map(product.RadioBtnsAddons, (r: RadioBtns, i) => (
                      <Fragment key={i}>
                        <TextTrans
                          key={r.addons.attributeID}
                          className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                          ar={r.addons.name_ar}
                          en={r.addons.name_en}
                        />
                      </Fragment>
                    ))}
                  {!isEmpty(product.CheckBoxes) &&
                    map(product.CheckBoxes, (c: CheckBoxes, i) => (
                      <Fragment key={i}>
                        {map(c.addons, (addon, i) => (
                          <TextTrans
                            key={i}
                            className={`bg-[#F3F2F2] text-[#544A45] px-1 text-xxs capitalize rounded-lg`}
                            ar={addon.name_ar}
                            en={addon.name_en}
                          />
                        ))}
                      </Fragment>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* notes */}
          {checkoutProduct && (
            <p
              suppressHydrationWarning={suppressText}
              className="xxs-mobile-xs-desktop"
            >
              {product.ExtraNotes}
            </p>
          )}

          {/* quantity meter */}
          {!checkoutProduct && (
            <div
              className={`flex items-center gap-x-2 ${
                lang === 'ar' && 'flex-row-reverse justify-end'
              }`}
            >
              <div
                onClick={() => HandelDecIncRmv(product, 'dec')}
                className="rounded-full text-white cursor-pointer  w-5 h-5 flex items-center justify-center base-mobile-lg-desktop"
                style={{ backgroundColor: color }}
              >
                -
              </div>
              <label className="flex items-center px-1">
                {product.Quantity}
              </label>
              <div
                onClick={() => HandelDecIncRmv(product, 'inc')}
                className="rounded-full text-white cursor-pointer w-5 h-5 flex items-center justify-center base-mobile-lg-desktop"
                style={{ backgroundColor: color }}
              >
                +
              </div>
            </div>
          )}
        </div>

        {/* price */}
        <div className="font-bold xs-mobile-sm-desktop">
          {product.SalePrice !== product.Price ? (
            <div>
              <p
                className="uppercase line-through"
                // style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {parseFloat(product.Price.toString()).toFixed(3)} {t('kd')}
              </p>
              <p
                className={`uppercase`}
                // style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {parseFloat(product?.SalePrice?.toString()).toFixed(3)}{' '}
                {t('kd')}
              </p>
            </div>
          ) : (
            <p
              className=" uppercase"
              //   style={{ color }}
              suppressHydrationWarning={suppressText}
            >
              {parseFloat(product.Price?.toString()).toFixed(3)} {t('kd')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
