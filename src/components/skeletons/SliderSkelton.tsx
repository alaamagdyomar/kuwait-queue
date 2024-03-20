import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const SliderSkelton: FC = (): React.ReactNode => {
  return (
    <div className="flex gap-x-3 overflow-hidden">
      <Skeleton width={'75%'} height={200} />
      <Skeleton width={'50%'} height={200} />
    </div>
  );
};
export default SliderSkelton;
