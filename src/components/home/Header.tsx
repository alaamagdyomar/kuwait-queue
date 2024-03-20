import React, { FC } from 'react';
import CustomImage from '../CustomImage';
import { imageSizes } from '@/constants/*';
import AsideHeader from '../MainAside/Header';
import { wrapper } from '@/redux/store';

type Props = {
  CoverImg: string;
  url:string
};

const Header:FC<Props> = ({ CoverImg ,url}) => {
  return (
    <div className="block lg:hidden lg:h-auto h-60">
      <div className="relative h-full">
        <div
          className="absolute bg-opacity-50 w-full h-full"
          style={{ backgroundColor: '#0000004D' }}
        >
          <AsideHeader  url={url}/>
        </div>

        <CustomImage
          src={CoverImg}
          alt={'cover image'}
          className={`object-fit w-full h-full  shadow-xl z-0 overflow-hidden`}
          width={imageSizes.xl}
          height={imageSizes.xl}
        />
      </div>
    </div>
  );
}
export default Header;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      if (!req.headers.host || !query.type) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
          type: query.type,
        },
      };
    }
);
