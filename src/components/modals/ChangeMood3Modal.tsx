import Image from "next/image";
import { FC, useState } from "react"
import MainModal from "./MainModal";
import ChangeMood from '@/appImages/change_mood.png';
import { useTranslation } from "react-i18next";
import { upperFirst } from "lodash";
import { appLinks, imgUrl, mainBtnClass, suppressText } from "@/constants/*";
import CustomImage from "../CustomImage";
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

type Props = {
    isOpen: boolean;
    onRequestClose: () => void;
};
const ChangeMood3Modal: FC<Props> = ({ isOpen, onRequestClose }):JSX.Element => {
    const { t } = useTranslation();
    const color = useAppSelector(themeColor);
    const { searchParams: { method }} = useAppSelector((state) => state);
    
    return (
        <>
            <MainModal 
                isOpen={isOpen} 
                closeModal={onRequestClose}
            >
                <div className="flex flex-col items-center px-5 pt-4">
                    <CustomImage
                        src={ChangeMood}
                        alt={t('change_mood')}
                        width={120} 
                        height={120}  
                    />
                    <h5 className="font-bold pt-3" suppressHydrationWarning={suppressText}>
                        {`${upperFirst(`${t('your_item_is_not_available')}`)}`}
                    </h5>
                    <div className="space-x-1 pb-8 pt-2 text-center xs-mobile-sm-desktop text-stone-500 w-[80%] mx-auto break-words">
                        <span suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('we_are_sorry_about_that_the_item_is_not_available_in')}
                            ${method === 'delivery' ? t('area'): t('branch')}
                            `)}`}
                        </span>
                        <span suppressHydrationWarning={suppressText}>
                            {`${upperFirst(`${t('please_change')}
                            ${method === 'delivery' ? t('the_area') : t('the_branch')}
                            ${t('or_re-order_again')}`)}`}
                        </span>
                    </div>
                    <Link 
                        href={
                            method === 'delivery'? appLinks.selectArea(``)  
                            : appLinks.selectBranch.path
                        }
                        className={`${mainBtnClass} text-center`}
                        style={{ backgroundColor: color }}
                        suppressHydrationWarning={suppressText}
                    >
                        {t('change')} {method === 'delivery' ? t('area') : t('branch')}
                    </Link>   
                    <Link 
                        href={appLinks.home.path}
                        className={`bg-gray-200 !text-black text-center ${mainBtnClass} mt-3`}
                        suppressHydrationWarning={suppressText}
                    >
                        {t('change_order')}
                    </Link>     
                </div>
            </MainModal>
        </>
    )
}
export default ChangeMood3Modal;