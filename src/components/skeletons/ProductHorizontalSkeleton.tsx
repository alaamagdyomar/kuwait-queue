import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductHorizontalSkeleton: FC = (): React.ReactNode => {
  return (
    <div className="py-3 px-5">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <Skeleton width={140} height={20} className="mb-2" />
          <div className="mb-2">
            <Skeleton width={300} height={10} />
            <Skeleton width={300} height={10} />
            <Skeleton width={300} height={10} />
          </div>

          <div className="flex items-center">
            <div className="mb-1">
              <Skeleton
                width={140}
                height={30}
                style={{ borderRadius: '35px' }}
              />
            </div>
            <div className="mx-2">
              <Skeleton width={30} height={30} circle />
            </div>
          </div>
        </div>
        <div className="flex pb-4">
          <Skeleton width={100} height={100} />
        </div>
      </div>
    </div>
  );
};
export default ProductHorizontalSkeleton;
