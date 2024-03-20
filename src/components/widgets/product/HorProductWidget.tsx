'use client';
import { FC } from 'react';
import { appLinks, imageSizes } from '@/constants/*';
import { Product } from '@/types/index';
import NoFoundImage from '@/appImages/not_found.png';
import { kebabCase, lowerCase } from 'lodash';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';
import { useAppSelector } from '@/redux/hooks';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';
import { motion } from 'framer-motion';
import PlusIcon from '@/appIcons/add.svg';

type Props = {
  element: Product;
  category_id?: string | null;
};
const HorProductWidget: FC<Props> = ({
  element,
  category_id = null,
}): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  // const {
  //   branch: { id: branchId },
  //   area: { id: areaId },
  // } = useAppSelector((state) => state);

  return (
    <motion.div whileTap={{ opacity: 1 }} whileHover={{ opacity: 0.8 }}>
      <Link
        href={`${appLinks.productShow(element.id, element.name)}`}
        className={`shadow-7xl h-full  block  capitalize mb-2 border-b-2 border-gray-100 py-5`}
        data-cy="product"
      >
        <div className="relative">
          <div className="h-60 w-full overflow-hidden rounded-lg">
            {element.never_out_of_stock === 0 && element.amount < 1 ? (
              <p
                className="absolute right-0 text-white text-xxs w-fit rounded-full px-1 py-px bg-amber-400"
                suppressHydrationWarning={suppressText}
              >
                {t('out_stock')}
              </p>
            ) : (
              <></>
              // <p
              //   className="absolute text-white text-xxs w-fit rounded-full px-1 py-px bg-amber-400"
              //   suppressHydrationWarning={suppressText}
              // ></p>
            )}
            <CustomImage
              src={`${element.cover ?? NoFoundImage.src}`}
              alt={element.name}
              width={imageSizes.lg}
              height={imageSizes.lg}
              className="h-60 w-full object-cover object-center"
            />
          </div>
          <div className="pt-3 px-2">
            <p
              className="sm-mobile-base-desktop font-semibold truncate"
              suppressHydrationWarning={suppressText}
            >
              <TextTrans
                style={{
                  maxWidth: '30ch',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                  color: `black`,
                }}
                className={`sm-mobile-base-desktop`}
                ar={element.name_ar}
                en={element.name_en}
              />
              <TextTrans
                style={{
                  maxWidth: '30ch',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                  color: `black`,
                }}
                className={`sm-mobile-base-desktop`}
                ar={element.description_ar}
                en={element.description_en}
              />
            </p>
            <div className="flex justify-between items-end">
              {element.new_price && element.new_price !== element.price ? (
                <div>
                  <p
                    className="uppercase line-through"
                    style={{ color }}
                    suppressHydrationWarning={suppressText}
                  >
                    {element.price} {t('kd')}
                  </p>
                  <p
                    className=" uppercase"
                    // style={{ color }}
                    suppressHydrationWarning={suppressText}
                  >
                    {element.new_price} {t('kd')}
                  </p>
                </div>
              ) : (
                <p
                  className="sm-mobile-base-desktop uppercase"
                  suppressHydrationWarning={suppressText}
                  style={{ color: `black` }}
                >
                  {parseFloat(element.price).toFixed(3) === '0.000' ? (
                    <span className="xxs-mobile-xs-desktop">
                      {t(`price_on_selection`)}
                    </span>
                  ) : (
                    parseFloat(element.price).toFixed(3)
                  )}
                  {parseFloat(element.price).toFixed(3) !== '0.000' && (
                    <span className={`uppercase px-1`}>{t('kd')}</span>
                  )}
                </p>
              )}
              <button
                className="rounded-md px-4 pt-1 uppercase text-center xs-mobile-sm-desktop"
                suppressHydrationWarning={suppressText}
              >
                <div className={`flex justify-between rtl:flex-row-reverse`}>
                  <p
                    className={`w-8 h-8 rounded-full flex justify-center items-center`}
                    style={{
                      backgroundColor: color,
                    }}
                  >
                    <PlusIcon className="text-white" />
                  </p>
                </div>
              </button>
            </div>
          </div>
          {/* <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
          />

        </div> */}
        </div>
      </Link>
    </motion.div>
  );
};

export default HorProductWidget;
