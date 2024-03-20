import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import OrderItemSkeleton from './OrderItemSkeleton';
import OrderDetails from '../checkout/OrderDetails';
import PaymentSummarySkelton from './PaymentSummarySkelton';

const OrderFailureSkeleton: FC = (): React.ReactNode => {
  const OrderInfo = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="py-2">
      <Skeleton containerClassName="w-full" height={50} />
    </div>
  ));
  return (
    <div className={`flex justify-center w-full`}>
      <div className="px-5 w-full">
        <div className="w-full flex flex-col justify-center items-center py-5">
          <Skeleton width={80} height={80} circle className="mb-5" />
          <Skeleton width={250} height={20} />
          <Skeleton width={300} height={20} className="my-3" />
          <Skeleton width={260} height={20} />
        </div>
        {OrderInfo}
        <PaymentSummarySkelton />
      </div>
    </div>
  );
};
export default OrderFailureSkeleton;
