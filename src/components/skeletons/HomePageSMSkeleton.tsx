import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const HomePageSMSkeleton:FC = (): React.ReactElement => {
  const skeletonContent = (
    <div className="py-2">
      <Skeleton height={140} />
      <Skeleton width={180} height={30} />
    </div>
  );

  return (
    <div className="flex w-[98%] mx-auto">
      <Skeleton className="ps-5" width={140} height={100} />
      <div className="px-5">
        <Skeleton width={200} height={30} style={{ borderRadius: '35px' }} />
        <Skeleton width={230} height={25} style={{ borderRadius: '35px' }} />
        <Skeleton width={230} height={20} style={{ borderRadius: '35px' }} />
        <Skeleton width={230} height={15} style={{ borderRadius: '35px' }} />
      </div>
    </div>
  );
}
export default HomePageSMSkeleton;
