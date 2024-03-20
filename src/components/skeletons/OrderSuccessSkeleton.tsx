import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import OrderItemSkeleton from './OrderItemSkeleton';

const OrderSuccessSkeleton: FC = (): React.ReactNode => {
  const CustomerInfo = Array.from({ length: 3 }, (_, index) => (
    <div key={index} className="py-5">
      <div className="flex">
        <div>
          <Skeleton width={40} height={40} circle />
        </div>
        <div className="px-3">
          <Skeleton width={250} height={15} />
          <Skeleton width={250} height={15} />
          <Skeleton width={250} height={15} />
        </div>
      </div>
    </div>
  ));
  return (
    <div
      className={`flex flex-col justify-start items-start w-full relative`}
    >
      <div className="px-5 w-full">
        <div className="flex flex-col justify-center items-center py-5 w-full">
          <Skeleton width={80} height={80} circle className="mb-5" />
          <Skeleton width={250} height={20} />
          <Skeleton width={300} height={20} className="my-3" />
          <Skeleton width={260} height={20} />
        </div>
        {CustomerInfo}
        <Skeleton width={200} height={20} className="pb-5" />
        <div className="flex py-5">
          <Skeleton width={60} height={15} />
          <Skeleton width={200} height={15} className="mx-5" />
        </div>
        <Skeleton width={200} height={20} className="pb-5" />
        <OrderItemSkeleton />
        <div className="py-5">
          <Skeleton width={250} height={20} className="mb-3" />
          <Skeleton width={200} height={20} />
        </div>
      </div>
    </div>
  );
};
export default OrderSuccessSkeleton;
