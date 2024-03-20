import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const MainAsideSkelton: FC = (): React.ReactNode => {
  return (
    <div className="flex relative justify-center items-center top-0  w-full h-screen bg-gradient-to-tr from-gray-400 to-gray-800 scrollbar-hide">
      <Skeleton width={'100%'} height={'100%'} />
    </div>
  );
};
export default MainAsideSkelton;
