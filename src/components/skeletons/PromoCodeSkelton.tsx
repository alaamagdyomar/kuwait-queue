import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const PromoCodeSkelton: FC = (): React.ReactNode => {
  return (
    <div className="py-3 px-5">
      <Skeleton width={140} height={20} className="mb-3" />
      <Skeleton width={'100%'} height={30} className="mb-1" />

      <div className="flex gap-1 flex-wrap">
        <Skeleton width={70} height={20} />
        <Skeleton width={70} height={20} />
        <Skeleton width={70} height={20} />
      </div>
    </div>
  );
};
export default PromoCodeSkelton;
