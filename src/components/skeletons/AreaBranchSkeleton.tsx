import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const AreaBranchSkeleton: FC = (): React.ReactNode => {
  return (
    <div className="px-5 py-2">
      <Skeleton containerClassName="w-full" height={50} />
    </div>
  );
};
export default AreaBranchSkeleton;
