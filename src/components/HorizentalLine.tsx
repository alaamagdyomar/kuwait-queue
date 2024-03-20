import { FC } from 'react';

type Props = {
  className?: string;
};

const HorizentalLine: FC<Props> = ({ className='' }): JSX.Element => {
  return (
    <div className={'bg-slate-100 h-px w-full ' + className}></div>
  );
};

export default HorizentalLine;
