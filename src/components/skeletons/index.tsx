'use client';
import React from 'react';
import CategorySkeleton from './CategorySkeleton';
import ContactDetailsSkeleton from './ContactDetailsSkeleton';
import DeliveryAddressSkeleton from './DeliveryAddressSkeleton';
import HomePageSMSkeleton from './HomePageSMSkeleton';
import AreaBranchSkeleton from './AreaBranchSkeleton';
import OrderItemSkeleton from './OrderItemSkeleton';
import OrderSkeleton from './OrderSkeleton';
import PopularSearchSkeleton from './PopularSearchSkeleton';
import ProductHorizontalSkeleton from './ProductHorizontalSkeleton';
import ProductShowSkeleton from './ProductShowSkeletong';
import ProductVerticalSkeleton from './ProductVerticalSkeleton';
import PolicySkeleton from './PolicySkeleton';
import ProductCartSkelton from './ProductCartSkelton';
import PromoCodeSkelton from './PromoCodeSkelton';
import PaymentSummarySkelton from './PaymentSummarySkelton';
import OrderSuccessSkeleton from './OrderSuccessSkeleton';
import VendorInfoSkeleton from './VendorInfoSkeleton';
import MainAsideSkelton from './MainAsideSkelton';
import SliderSkelton from './SliderSkelton';
import ReceiptSkeleton from './ReceiptSkeleton';
import OrderFailureSkeleton from './PaymentFailureSkeleton';

type Props = {
  type: string;
  sections: number;
};

const ContentLoader = ({ type, sections }: Props): React.ReactNode => {
  let SkeletonComponent: React.FC;

  switch (type) {
    case 'ProductHorizontal':
      SkeletonComponent = ProductHorizontalSkeleton;
      break;
    case 'AreaBranch':
      SkeletonComponent = AreaBranchSkeleton;
      break;
    case 'Category':
      SkeletonComponent = CategorySkeleton;
      break;
    case 'ProductVertical':
      SkeletonComponent = ProductVerticalSkeleton;
      break;
    case 'DeliveryAddress':
      SkeletonComponent = DeliveryAddressSkeleton;
      break;
    case 'PopularSearch':
      SkeletonComponent = PopularSearchSkeleton;
      break;
    case 'MyOrders':
      SkeletonComponent = OrderSkeleton;
      break;
    case 'OrderITem':
      SkeletonComponent = OrderItemSkeleton;
      break;
    case 'ContactDetails':
      SkeletonComponent = ContactDetailsSkeleton;
      break;
    case 'Policy':
      SkeletonComponent = PolicySkeleton;
      break;
    case 'Home':
      SkeletonComponent = HomePageSMSkeleton;
      break;
    case 'ProductShow':
      SkeletonComponent = ProductShowSkeleton;
      break;
    case 'ProductCart':
      SkeletonComponent = ProductCartSkelton;
      break;
    case 'Promocode':
      SkeletonComponent = PromoCodeSkelton;
      break;
    case 'PaymentSummary':
      SkeletonComponent = PaymentSummarySkelton;
      break;
    case 'OrderSuccess':
      SkeletonComponent = OrderSuccessSkeleton;
      break;
    case 'VendorInfo':
      SkeletonComponent = VendorInfoSkeleton;
      break;
    case 'AsideSkelton':
      SkeletonComponent = MainAsideSkelton;
      break;
    case 'SliderSkelton':
      SkeletonComponent = SliderSkelton;
      break;
    case 'Receipt':
      SkeletonComponent = ReceiptSkeleton;
      break;
    case 'OrderFailure':
      SkeletonComponent = OrderFailureSkeleton;
      break;
    default:
      return null;
  }

  return (
    <div>
      {Array.from({ length: sections }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

export default ContentLoader;
