import { FC, useState } from "react"
import MainModal from "./MainModal";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';import { map, upperFirst } from "lodash";
import { mainBtnClass, suppressText } from "@/constants/*";
import { useRouter } from "next/router";
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from "@/redux/hooks";

type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};

const CancelOrderModal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const router = useRouter();
    const color = useAppSelector(themeColor);
    const reasons = [
        { id: 1, name: 'order_is_taking_long_time'},
        { id: 2, name: 'placed_order_by_accident'},
        { id: 3, name: 'change_payment_method'},
        { id: 4, name: 'forgot_to_add_something'},
        { id: 5, name: 'wrong_address'},
        { id: 6, name: 'other'}
    ]
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div>
                    <div className="flex justify-between w-full px-4">
                        <h5 className="text-gray-500 pb-2 pt-4" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('cancel_order')}`)}`} 
                        </h5>
                        <button
                            className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                            onClick={onRequestClose}
                        >
                            <ExpandMoreIcon className="text-stone-600" />
                        </button>
                    </div>
                    <div className="px-4 pb-2">
                        <h4 className="font-bold base-mobile-lg-desktop pb-2" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('why_did_you_cancel_this_order?')}`)}`}
                        </h4>
                        <p className="xs-mobile-sm-desktop pb-4 w-full md:w-[75%]" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('to_help_provide_the_right_next_step_please_let_us_know_why_you_canceled_your_order')}`)}`}
                        </p>
                        {map(reasons, (reason) => (
                            <label 
                                key={reason.id} 
                                htmlFor={`${reason.id}`}
                                className="border-t-[1px] border-slate-200 px-4 py-3 xs-mobile-sm-desktop flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio"
                                    name="cancelReason" 
                                    id={`${reason.id}`} 
                                    className="h-5 w-5"
                                    style={{ accentColor: color }} 
                                />
                                <span suppressHydrationWarning={suppressText}>
                                    {`${upperFirst(`${t(`${reason.name}`)}`)}`}
                                </span>
                            </label>
                        ))}
                    </div>
                    <div className="border-t-[1px] border-gray-200 px-4 flex items-end space-x-5 pt-4">
                        <button 
                            className={`${mainBtnClass}`}
                            style={{ backgroundColor: color }}
                            suppressHydrationWarning={suppressText}
                        >
                            {`${upperFirst(`${t('continue')}`)}`}
                        </button>       
                    </div>
                </div>
            </MainModal>
        </>
    )
}
export default CancelOrderModal;