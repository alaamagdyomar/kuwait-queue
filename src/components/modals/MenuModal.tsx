import { FC, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isEmpty, map } from 'lodash';
import Link from 'next/link';
import { Category } from '@/types/queries';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  Categories: Category[];
};
const MenuModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  Categories,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);

  return (
    <>
      <MainModal
        isOpen={isOpen}
        closeModal={onRequestClose}
        contentClass={`h-2/3 overflow-y-auto ${isRTL ? 'text-right' : ''}`}
      >
        <div>
          <div className="flex w-[90%] p-4">
            <div className="w-1/2">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={onRequestClose}
              >
                <ExpandMoreIcon className="text-gray-500" />
              </button>
            </div>
            <h5 className="font-semibold capitalize">{t('menu')}</h5>
          </div>
          {map(
            Categories,
            (Category) =>
              !isEmpty(Category.items) && (
                <Link
                  onClick={() => onRequestClose()}
                  href={`#${Category?.cat_id}`}
                  key={Category?.cat_id}
                  className="border-t-[1px] border-slate-200 block px-4 py-2 font-semibold capitalize"
                >
                  <p>{Category.name}</p>
                </Link>
              )
          )}
        </div>
      </MainModal>
    </>
  );
};
export default MenuModal;
