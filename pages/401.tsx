import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';

const Custom401: NextPage = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget
        message={'network_is_not_available_please_check_your_internet'}
      />
    </MainContentLayout>
  );
}
export default Custom401;
