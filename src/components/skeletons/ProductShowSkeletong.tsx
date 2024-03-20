import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductShowSkeleton:FC = (): React.ReactElement => {
  return (
    <div>
      <Skeleton width={'100%'} height={70} />
      <Skeleton width={'100%'} height={'40vh'} className="mb-5" />
      <div className="px-8">
        <Skeleton width={200} height={30} className="mb-3" />
        <Skeleton width={300} height={60} />
        <Skeleton width={180} height={30} className="mb-3" />
        <Skeleton width={'80%'} height={40} />
        <div className="w-[98%] mx-auto py-5">
            <Skeleton width={'100%'} height={60} style={{ borderRadius: '35px'}} />
        </div>
      </div>
    </div>
  );
}
export default ProductShowSkeleton;
