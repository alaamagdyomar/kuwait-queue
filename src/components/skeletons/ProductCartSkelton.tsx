import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductCartSkelton: FC = (): React.ReactNode => {
  return (
    <div className="py-3 px-5">
      <div className="flex justify-between">
        <div className="flex  gap-x-3 pb-4">
          <Skeleton width={100} height={100} />
          <div className="flex flex-col">
            <Skeleton width={140} height={20} />
            <div className="flex gap-1 flex-wrap">
              <Skeleton width={40} height={10} />
              <Skeleton width={40} height={10} />
              <Skeleton width={40} height={10} />
            </div>
            <Skeleton width={70} height={20} style={{ borderRadius: '100' }} />
          </div>
        </div>

        <Skeleton width={70} height={30} />
      </div>
    </div>
  );
};
export default ProductCartSkelton;
