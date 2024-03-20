import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductVerticalSkeleton: FC = (): React.ReactNode => {
  const skeletonContent = (
    <div className="py-2">
      <Skeleton height={140} />
      <Skeleton width={180} height={30} />
      <div className="flex items-center">
        <div>
          <Skeleton width={140} height={50} style={{ borderRadius: '35px' }} />
        </div>
        <div className="mx-2">
          <Skeleton width={50} height={50} circle />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 w-[98%] mx-auto">
      {skeletonContent}
      {skeletonContent}
    </div>
  );
};
export default ProductVerticalSkeleton;
