import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import { Vendor } from '@/types/index';
import Link from 'next/link';
import React from 'react';
import CustomImage from '../CustomImage';
import TextTrans from '../TextTrans';
import { SocialIcon } from 'react-social-icons';

type Props = { element: Vendor };

export default function AsideContent({ element }: Props) {
  return (
    <div>
      <Link
        scroll={true}
        href={appLinks.home.path}
        className={`flex flex-col items-center justify-center text-center text-white z-50`}
      >
        <CustomImage
          src={`${imgUrl(element.logo)}`}
          alt={element.name}
          className={`relative object-fill w-28 h-28 shadow-2xl rounded-full mb-4 border border-stone-200 bg-white`}
          width={imageSizes.md}
          height={imageSizes.md}
        />
        <TextTrans
          ar={element.name_ar}
          en={element.name_en}
          className="capitalize text-2xl block w-full shadow-stone-300/50 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
        />
      </Link>

      <div className="relative flex justify-center gap-x-3 mt-3">
        {element.facebook && (
          <SocialIcon
            target="_blank"
            url={element.facebook}
            network="facebook"
            bgColor="white"
            fgColor="black"
            className="!w-7 !h-7 text-stone-700"
          />
        )}

        {element.instagram && (
          <SocialIcon
            target="_blank"
            url={element.instagram}
            network="instagram"
            bgColor="white"
            fgColor="black"
            className="!w-7 !h-7 text-stone-700"
          />
        )}

        {element.twitter && (
          <SocialIcon
            target="_blank"
            url={element.twitter}
            network="twitter"
            bgColor="white"
            fgColor="black"
            className="!w-7 !h-7 text-stone-700"
          />
        )}
      </div>
    </div>
  );
}
