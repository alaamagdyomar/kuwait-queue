import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import MainModal from './MainModal';
import User from '@/appImages/user.png';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';
import { appLinks, mainBtnClass, suppressText } from '@/constants/*';
import CustomImage from '../CustomImage';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const SigninAddFavModal: FC<Props> = ({
  isOpen,
  onRequestClose,
}): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const router = useRouter();

  return (
    <>
      <MainModal isOpen={isOpen} closeModal={onRequestClose}>
        <div>
          <div className="flex flex-col items-center px-5 pt-4">
            <CustomImage src={User} alt={t('user')} width={120} height={120} />
            <h5
              className="font-bold pt-3 text-center"
              suppressHydrationWarning={suppressText}
            >
              {`${upperFirst(`${t('sign_in_register_to_add_favourite')}`)}`}
            </h5>
            <div className="space-x-1 pb-8 pt-2 text-center xs-mobile-sm-desktop text-stone-500 w-[80%] mx-auto break-words">
              <span suppressHydrationWarning={suppressText}>
                {`${upperFirst(
                  `${t(
                    'you_first_need_to_sign_in_register_to_add_something_to_your_favourite_list'
                  )}`
                )}`}
              </span>
            </div>
          </div>
          <div className="border-t-[1px] border-gray-200 px-4 pt-4">
            <button
              onClick={() => {
                onRequestClose();
                router.push(appLinks.login.path);
              }}
              className={`${mainBtnClass}`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
            >
              {`${upperFirst(`${t('sign_in/')}`)} / ${upperFirst(
                `${t('register_an_account')}`
              )}`}
            </button>
            <button
              className={`${mainBtnClass} !bg-gray-200 !text-black mt-3`}
              suppressHydrationWarning={suppressText}
              onClick={onRequestClose}
            >
              {`${upperFirst(`${t('skip_for_now')}`)}`}
            </button>
          </div>
        </div>
      </MainModal>
    </>
  );
};
export default SigninAddFavModal;
