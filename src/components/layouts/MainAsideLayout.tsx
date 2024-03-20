import React, { FC, Suspense } from 'react';
import { imageSizes, imgUrl } from '@/constants/*';
import CustomImage from '@/components/CustomImage';
import { Vendor } from '@/types/index';
import AsideFooter from '@/components/MainAside/Footer';
import AsideHeader from '@/components/MainAside/Header';
import AsideContent from '@/components/MainAside/Content';

type Props = {
  element: Vendor;
  url: string;
};
const MainAsideLayout: FC<Props> = ({ element, url }): React.ReactNode => {
  return (
    <Suspense fallback={<div>loading skelton</div>}>
      <div
        className={`flex relative justify-center items-center top-0  w-full h-screen bg-gradient-to-tr from-gray-400 to-gray-800 scrollbar-hide`}
      >
        <CustomImage
          src={`${imgUrl(element.cover)}`}
          alt={element.name}
          className={`absolute top-0 object-cover w-full aspect-1 h-screen z-0`}
          width={imageSizes.xxl}
          height={imageSizes.xxl}
        />
        <AsideHeader url={url} />

        <div className={`flex flex-col justify-center items-center`}>
          {/* vendor info and media */}
          <AsideContent element={element} />

          {/* footer in aside */}
          <AsideFooter url={url} />
        </div>
      </div>
    </Suspense>
  );
};

export default MainAsideLayout;
