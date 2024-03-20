import Image from "next/image";
import { FC, useState } from "react"
import MainModal from "./MainModal";
import Clock from '@/appIcons/clock_icon.svg';
import { useTranslation } from "react-i18next";
import { upperFirst } from "lodash";
import { modalBtnContainer, mainBtnClass, suppressText, imageSizes } from "@/constants/*";
import { themeColor } from '@/redux/slices/vendorSlice';
import CustomImage from "../CustomImage";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/router";

type Props = {
    isOpen: boolean;
    onRequestClose: () => void
};
const WhenClosedModal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const color = useAppSelector(themeColor);
    const router = useRouter();
    
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div>
                    <div className="flex flex-col items-center px-5 pt-4">
                        <Clock />
                        <h5 className="font-bold pt-5 pb-2" suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('store_is_currently_closed')}`)}`}
                        </h5>
                        <div className="space-x-1 pb-8 text-center text-base text-stone-500 w-[80%] mx-auto">
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('dont_worry!')}`)}`}
                            </span>
                            <span suppressHydrationWarning={suppressText}>
                                {`${upperFirst(`${t('you_can_still_browse_offers_and_add_to_cart_for_a_speedy_check_out')}`)}`}
                            </span>
                            <span className="text-black">
                                <span suppressHydrationWarning={suppressText}>{`${upperFirst(`${t('opens_today_at')}`)}`}</span>
                                <span className="uppercase px-1" suppressHydrationWarning={suppressText}>10:00 am</span>    
                            </span>
                        </div>
                    </div>
                    <div className={`${modalBtnContainer}`}>
                        <button 
                            className={`${mainBtnClass}`}
                            style={{ backgroundColor: color }}
                            suppressHydrationWarning={suppressText}
                            onClick={()=> {
                                onRequestClose();
                                router.back();
                            }}
                        >
                            {t('ok_get_it')}
                        </button>    
                    </div>   
                </div>
            </MainModal>
        </>
    )
}
export default WhenClosedModal;