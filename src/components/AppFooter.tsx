import { useRouter } from 'next/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { appVersion } from '../constants';
import { useAppSelector } from '@/redux/hooks';
import TextTrans from './TextTrans';

type Props = {};

const AppFooter: FC<Props> = ({}): React.ReactNode => {
  const { t } = useTranslation();
  const {
    vendor: { name_ar, name_en },
  } = useAppSelector((state) => state);

  return (
    <footer
      className={`w-full px-3 text-center xxs-mobile-xs-desktop bg-white`}
    >
      <p className=" font-bold">
        {t('rights_reserved')} <TextTrans ar={name_ar} en={name_en} />{' '}
        {new Date().getFullYear()} ©
      </p>
      <a
        href="https://getq.app"
        className=" py-1 pb-2 text-zinc-500 text-sm"
        target="_blank"
      >
        {t('powered_by_queue')}®
      </a>
      <p className=" py-1 text-zinc-500 text-[8px]">v {appVersion}</p>
    </footer>
  );
};

export default AppFooter;
