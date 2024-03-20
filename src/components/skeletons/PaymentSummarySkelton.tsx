import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const PaymentSummarySkelton: FC = (): React.ReactNode => {
  return (
    <div className="p-5">
      <Skeleton width={140} height={20} className="mb-3" />
      <Skeleton width={'100%'} height={100} className="mb-1" />
    </div>
  );
};
export default PaymentSummarySkelton;
