import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const OrderItemSkeleton: FC = (): React.ReactNode => {
  return (
    <div className="flex justify-between">
      <div>
        <Skeleton width={200} height={20} />
        <Skeleton
          width={140}
          height={30}
          style={{ borderRadius: '35px' }}
          className="my-3"
        />
        <Skeleton width={120} height={20} />
      </div>
      <div>
        <Skeleton width={80} height={20} />
      </div>
    </div>
  );
};
export default OrderItemSkeleton;
