'use client';
import { FC } from 'react';
import {
  alexandriaFontLight,
  alexandriaFontSemiBold,
  appLinks,
  imageSizes,
  montserratFontRegular,
  suppressText,
} from '@/constants/*';
import { Product } from '@/types/index';
import { kebabCase, lowerCase } from 'lodash';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import TextTrans from '@/components/TextTrans';
import { motion } from 'framer-motion';
import { themeColor } from '@/redux/slices/vendorSlice';
import NoFoundImage from '@/appImages/not_found.png';
import PlusIcon from '@/appIcons/add.svg';
import DeleteIcon from '@/appIcons/fav_delete.svg';

type Props = {
  element: Product;
  category_id?: string | null;
  show_delete_icon?: boolean;
  delete_function?: (id: number | string) => void;
};
const VerProductWidget: FC<Props> = ({
  element,
  category_id = null,
  show_delete_icon = false,
  delete_function = (id) => {},
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
        className={`h-auto shadow-7xl mb-2 block capitalize border-b-2 border-gray-100 py-3`}
      >
        <div className="relative">
          <div className="flex gap-x-2 justify-between">
            <div className="w-2/3">
              <p className=" flex flex-col ">
                <TextTrans
                  className={`text-black ${alexandriaFontSemiBold} mb-2 base-mobile-lg-desktop`}
                  ar={element.name_ar}
                  en={element.name_en}
                  length={20}
                />
                <TextTrans
                  className={`${alexandriaFontLight} text-[#877D78] xs-mobile-sm-desktop whitespace-wrap break-all pt-1`}
                  ar={element.description_ar}
                  en={element.description_en}
                  length={100}
                />
              </p>

              <div
                className={`flex flex-row justify-start items-center xs-mobile-sm-desktop mt-3`}
              >
                {element.new_price && element.new_price !== element.price ? (
                  <div
                    className="flex justify-center items-center gap-x-2 rounded-full p-1 md:py-1 md:px-2 text-center"
                    style={{ color, borderColor: color, border: '1px solid' }}
                  >
                    <p
                      className={`uppercase ${montserratFontRegular}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {element.new_price} {t('kd')}
                    </p>
                    <p
                      className={`uppercase line-through text-[#877D78] ${montserratFontRegular}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {element.price} {t('kd')}
                    </p>
                  </div>
                ) : (
                  <p
                    className="uppercase  rounded-full p-1 md:py-1 md:px-2 text-center"
                    suppressHydrationWarning={suppressText}
                    style={{ color, borderColor: color, border: '1px solid' }}
                  >
                    {parseFloat(element.price).toFixed(3) === '0.000' ? (
                      <span
                        className={`xxs-mobile-xs-desktop ${montserratFontRegular}`}
                      >
                        {t(`price_on_selection`)}
                      </span>
                    ) : (
                      parseFloat(element.price).toFixed(3)
                    )}
                    {parseFloat(element.price).toFixed(3) !== '0.000' && (
                      <span
                        className={`uppercase px-1 ${montserratFontRegular}`}
                      >
                        {t('kd')}
                      </span>
                    )}
                  </p>
                )}
                <div className="text-end mx-2">
                  <button
                    style={{
                      backgroundColor: color,
                    }}
                    className="p-2 rounded-full text-white uppercase text-center"
                  >
                    <PlusIcon />
                  </button>
                </div>

                {show_delete_icon && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      delete_function(element.id);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                )}
              </div>

              {/* Limited quantity, will end soon */}
              {element.limited_qty && (
                <p
                  className="bg-[#F5F5F5] text-xxs w-fit rounded-full mt-3 px-2 py-px"
                  suppressHydrationWarning={suppressText}
                >
                  {t('limited_quantity_will_end_soon')}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 2xl:h-36 2xl:w-36  aspect-square rounded-lg">
                <CustomImage
                  src={`${element.cover ?? NoFoundImage.src}`}
                  alt={element.name}
                  width={imageSizes.sm}
                  height={imageSizes.sm}
                  className="w-full h-full object-cover object-center rounded-lg"
                />
              </div>
              {element.never_out_of_stock === 0 && element.amount < 1 ? (
                <p
                  className="absolute text-white text-xxs w-fit rounded-full px-1 py-px bg-amber-400"
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
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VerProductWidget;
