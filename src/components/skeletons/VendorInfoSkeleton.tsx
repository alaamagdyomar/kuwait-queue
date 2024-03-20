import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import OrderItemSkeleton from './OrderItemSkeleton';

const VendorInfoSkeleton: FC = (): React.ReactNode => {
  const VendorInfo = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="py-2">
      <Skeleton width={'100%'} height={35} />
    </div>
  ));
  return (
    <div className="px-5 w-full">
      <div className="flex flex-col justify-center items-center py-5">
        <Skeleton width={80} height={80} circle className="mb-5" />
        <Skeleton width={300} height={100} />
      </div>
      {VendorInfo}
      <Skeleton width={'100%'} height={200} className="pb-5" />
    </div>
  );
};
export default VendorInfoSkeleton;
