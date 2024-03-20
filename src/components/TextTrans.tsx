import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { truncate } from 'lodash';
import { suppressText } from '@/constants/*';

type Props = {
  ar: string;
  en: string;
  className?: string;
  length?: number;
  style?: {};
};
const TextTrans: FC<Props> = ({
  ar,
  en,
  className = ``,
  style = {},
  length = 99,
}) => {
  const { isRTL } = useAppSelector((state) => state.locale);
  return (
    <span
      className={`capitalize ${className}`}
      style={style}
      suppressHydrationWarning={suppressText}
    >
      {truncate(isRTL ? ar : en, { length })}
    </span>
  );
};
export default TextTrans;
