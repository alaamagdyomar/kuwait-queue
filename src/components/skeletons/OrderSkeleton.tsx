import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const OrderSkeleton:FC = (): React.ReactElement => {
  const orderDetails = Array.from({ length: 4 }, (_, index) => (
    <div key={index} className="py-1">
      <Skeleton containerClassName="w-full" width={'60%'} height={20} />
    </div>
  ));

  return (
    <div className="p-4">
      <div className="pb-2">
        <div className="py-2">{orderDetails}</div>
        <Skeleton
          containerClassName="w-full"
          width={'100%'}
          height={40}
          style={{ borderRadius: '35px' }}
        />
      </div>
      {Array.from({ length: 2 }, (_, index) => (
        <div key={`order${index}`} className="pb-2">
          <div className="py-2">{orderDetails}</div>
          <div className="flex w-[98%] mx-auto">
            <Skeleton
              containerClassName="w-full"
              width={'80%'}
              height={40}
              style={{ borderRadius: '35px' }}
            />
            <Skeleton
              containerClassName="w-full"
              width={'80%'}
              height={40}
              style={{ borderRadius: '35px' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default OrderSkeleton;
