'use client';
import { FC } from 'react';
import { Category } from '@/types/queries';
import CustomImage from '@/components/CustomImage';
import {
  alexandriaFontSemiBold,
  appLinks,
  imageSizes,
  imgUrl,
} from '@/constants/*';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isNull, kebabCase, lowerCase } from 'lodash';
import { suppressText } from '@/constants/*';
import TextTrans from '@/components/TextTrans';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { setCategory } from '@/redux/slices/searchParamsSlice';

type Props = {
  element: Category;
};
const CategoryWidget: FC<Props> = ({ element }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const {
  //   branch,
  //   area,
  //   appSetting: { method },
  // } = useAppSelector((state) => state);

  const handleSearchRedirection = (id: string) => {
    dispatch(setCategory(id));
    router.push(`${appLinks.productSearch.path}`);
  };

  return (
    <motion.div
      whileTap={{ opacity: 1 }}
      whileHover={{ opacity: 0.8 }}
      className="pb-3"
    >
      <button
        onClick={() => handleSearchRedirection(element.id.toString())}
        className={`aspect-square rounded-lg capitalize w-full h-full`}
        suppressHydrationWarning={suppressText}
        data-cy="category"
      >
        <div className="">
          <div className="aspect-square overflow-hidden rounded-lg">
            <CustomImage
              src={`${imgUrl(element.img)}`}
              alt={element.name}
              width={imageSizes.sm}
              height={imageSizes.sm}
              className="aspect-square w-full object-cover object-center"
            />
          </div>
          <div className="w-full px-2 pt-2 pb-5">
            <p
              className="relative font-bold"
              suppressHydrationWarning={suppressText}
            >
              <TextTrans
                className={`${alexandriaFontSemiBold} base-mobile-lg-desktop line-clamp-1 ltr:text-left rtl:text-right`}
                // style={{
                //   maxWidth: '30ch',
                //   textOverflow: 'ellipsis',
                //   whiteSpace: 'normal',
                //   overflow: 'hidden',
                //   display: 'block',
                // }}
                ar={element.name_ar}
                en={element.name_en}
              />
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default CategoryWidget;
