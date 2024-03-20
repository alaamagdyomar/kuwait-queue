import { FC, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { map, upperFirst } from 'lodash';
import { PhoneIphone, Chat, ChatOutlined } from '@mui/icons-material';
import {
  modalBtnContainer,
  mainBtnClass,
  suppressText,
  whatsappUrl,
} from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';
type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  phone: string;
};
const HelpModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  phone,
}): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);

  return (
    <>
      <MainModal isOpen={isOpen} closeModal={onRequestClose}>
        <div>
          <div className="flex lg:grid lg:grid-cols-3 w-full pb-5 px-4 border-b-[1px] border-gray-200">
            <div className="w-1/3">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={onRequestClose}
              >
                <ExpandMoreIcon className="text-stone-600" />
              </button>
            </div>
            <h5
              className="font-semibold capitalize ps-6"
              suppressHydrationWarning={suppressText}
            >
              {t('need_help?')}
            </h5>
          </div>
          <div className={`p-4 ${isRTL ? `text-right` : `text-left`}`}>
            <h4
              className="font-semibold base-mobile-lg-desktop capitalize pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('how_can_we_help_you?')}
            </h4>
            <p
              className="text-base text-stone-500 pb-4"
              suppressHydrationWarning={suppressText}
            >
              {`${upperFirst(
                `${t(
                  'if_you_have_any_technical_problem_or_problem_with_the_order_please_contact_us_via_voice_call_or_by_chatting_via_whatsapp_or_our_messenger.'
                )}`
              )}`}
            </p>
          </div>
          <div
            className="flex flex-col flex-1 w-full border-t-[1px] border-gray-200 px-4 pt-4"
            suppressHydrationWarning={suppressText}
          >
            <a
              target="blank"
              href={`tel:${phone}`}
              className={`${mainBtnClass} w-full text-center py-3`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
            >
              <PhoneIphone className="mx-1 mb-1" />
              {`${upperFirst(`${t('call_us')}`)}`}
            </a>
            <a
              target="blank"
              className={`${mainBtnClass} !bg-white border-2 mt-3 w-full text-center py-3`}
              style={{ color, borderColor: color }}
              href={`${whatsappUrl}${phone}`}
            >
              <ChatOutlined className="mx-1" />
              {`${upperFirst(`${t('message_us')}`)}`}
            </a>
          </div>
        </div>
      </MainModal>
    </>
  );
};
export default HelpModal;
