import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const ContactDetailsSkeleton: FC = (): React.ReactNode => {
  const orderDetails = Array.from({ length: 6 }, (_, index) => (
    <Skeleton key={index} width={200} height={20} />
  ));
  return <div>{orderDetails}</div>;
};
export default ContactDetailsSkeleton;
