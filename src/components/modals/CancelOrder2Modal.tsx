import { FC, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import { map, upperFirst } from "lodash";
import { useRouter } from "next/router";
import { mainBtnClass, suppressText } from "@/constants/*";
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from "@/redux/hooks";

type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
const CancelOrder2Modal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const router = useRouter();
    const color = useAppSelector(themeColor);

    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div>
                    <div className="flex justify-between w-full px-4 pt-7">
                        <h5 className="text-gray-500 pb-2" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('cancel_order')}`)}`} 
                        </h5>
                        <button
                            className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                            onClick={onRequestClose}
                        >
                            <ExpandMoreIcon/>
                        </button>
                    </div>
                    <div className="px-4 pb-2">
                        <h4 className="font-semibold base-mobile-lg-desktop pb-2" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('why_did_you_cancel_this_order?')}`)}`}
                        </h4>
                        <p className="xs-mobile-sm-desktop pb-4 space-x-1" suppressHydrationWarning={suppressText}>
                            <span>
                                {`${upperFirst(`${t('a_cancellation_of')}`)}`}
                            </span>
                            <span>
                                (refund) 
                            </span>
                            <span>
                                {t('kd')} 
                            </span>
                            <span>
                                {t('has_been_issued_back_to_your_original_payment_method.')}
                            </span>
                            <span>
                                {`${upperFirst(`${t('this_may_take_3_business_days_to_reflect.')}`)}`}
                            </span>
                        </p>
                    </div>
                    <div 
                        className="border-t-[1px] border-gray-200 px-4 flex items-end space-x-5 pt-4" 
                        suppressHydrationWarning={suppressText}>
                            <button 
                                className={`${mainBtnClass} !font-light`}
                                style={{ backgroundColor: color }}
                            >
                                {`${upperFirst(`${t('confirm_cancellation')}`)}`}
                            </button>       
                    </div>
                </div>
            </MainModal>
        </>
    )
}
export default CancelOrder2Modal;