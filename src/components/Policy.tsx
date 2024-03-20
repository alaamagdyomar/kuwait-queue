import { FC } from 'react';
import TextTrans from './TextTrans';
import { useAppSelector } from '@/redux/hooks';

type Props = {
    policyType: any
};

const Policy: FC<Props> = ({policyType}): JSX.Element => {
  const { locale: { isRTL } } = useAppSelector((state) => state);

  return (
    <div className="p-5">
          <h2 className="font-bold pb-2">
            <TextTrans 
              en={policyType?.title_en} 
              ar={policyType?.title_ar} 
              className="!uppercase base-mobile-lg-desktop"
            />
          </h2>
          <p className="text-[#544A45]">
            <TextTrans 
              en={policyType?.content_en}
              ar={policyType?.content_ar} 
              className="block break-words"
              length={isRTL ? policyType?.content_ar.length : policyType?.content_en.length}
            />
          </p>
    </div>
  );
};

export default Policy;
