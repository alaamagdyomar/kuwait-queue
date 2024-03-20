import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ReceiptSkeleton: FC = (): React.ReactNode => {
  return (
    <div className="p-4">
      <div className="border-b-2 border-zinc-200 pt-2 pb-5">
        <Skeleton containerClassName="w-full" width={'60%'} height={30} />
      </div>
      <div className="border-b-2 border-zinc-200 pt-2 pb-5">
        <div className="flex justify-between w-full ">
          <div className="w-1/2">
            <Skeleton containerClassName="w-full" height={30} />
          </div>
          <div className="w-1/5">
            <Skeleton containerClassName="w-full" height={30} />
          </div>
        </div>
        <div className="py-1">
          <Skeleton containerClassName="w-full" width={'60%'} height={30} />
        </div>
        <div className="py-1">
          <Skeleton containerClassName="w-full" width={'60%'} height={30} />
        </div>
      </div>
      <div className="border-b-2 border-zinc-200 pt-2 pb-5">
        <div className="flex justify-between w-full ">
          <div className="w-1/2">
            <Skeleton containerClassName="w-full" height={30} />
          </div>
          <div className="w-1/5">
            <Skeleton containerClassName="w-full" height={30} />
          </div>
        </div>
        <div className="py-1">
          <Skeleton containerClassName="w-full" width={'60%'} height={30} />
        </div>
        <div></div>
      </div>
      <div className="border-b-2 border-zinc-200 pt-2 pb-5">
        <Skeleton containerClassName="w-full" width={'60%'} height={30} />
        <div className="py-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="py-1" key={index}>
              <Skeleton containerClassName="w-full" width={'70%'} height={20} />
            </div>
          ))}
        </div>
      </div>
      <div className="border-b-2 border-zinc-200 pt-2 pb-5">
        <Skeleton containerClassName="w-full" width={'60%'} height={30} />
        <div className="flex w-full py-2">
          <div className="w-1/5 pe-3">
            <Skeleton containerClassName="w-full" height={30} />
          </div>
          <div className="w-1/2">
            <Skeleton containerClassName="w-full" height={30} />
          </div>
        </div>
        <div className="py-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="flex justify-between w-full" key={index}>
              <div className="w-1/2">
                <Skeleton containerClassName="w-full" height={30} />
              </div>
              <div className="w-1/5">
                <Skeleton containerClassName="w-full" height={30} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ReceiptSkeleton;
