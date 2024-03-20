import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const PoweredByQ: FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`w-full h-1/2 flex justify-center items-center bg-white`}>
      <a
        href={`https://getq.app/`}
        target={`_blank`}
        className={`pt-2 capitalize`}
      >
        {t('powered_by_queue')} &reg;
      </a>
    </div>
  );
};

export default PoweredByQ;
