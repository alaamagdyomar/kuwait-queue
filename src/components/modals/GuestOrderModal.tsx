import { FC, useEffect, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import {
  appLinks,
  errorMsgClass,
  mainBtnClass,
  suppressText,
  toEn,
} from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { customerInfoSchema } from 'src/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSaveCustomerInfoMutation } from '@/redux/api/CustomerApi';
import { startCase } from 'lodash';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { setCustomer } from '@/redux/slices/customerSlice';
import { useRouter } from 'next/router';
import flags from 'country-flag-icons/react/3x2';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  url: string;
};
const GuestOrderModal: FC<Props> = ({
  isOpen,
  closeModal,
  url,
}): React.ReactNode => {
  const { t } = useTranslation();
  const {
    customer,
    locale: { dir },
    searchParams: { method },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [triggerSaveCustomerInfo] = useSaveCustomerInfoMutation();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(customerInfoSchema({})),
    defaultValues: {
      id: null,
      name: customer.name ?? ``,
      email: customer.email ?? ``,
      phone: customer.phone ?? ``,
    },
  });

  const onSubmit = async (body: any) => {
    const parsedPhone = parsePhoneNumber(body.phone.toString())?.nationalNumber;
    const parsedCountryCode = `+${
      parsePhoneNumber(body.phone.toString())?.countryCallingCode
    }`;
    dispatch(
      setCustomer({
        ...body,
        id: 'guest',
        phone: parsedPhone || body.phone.toString(), //when phone is in state parsed is= undefined
        // address: 'no addresses',
        // date_of_birth: null,
        // gender: null,
      })
    );
    dispatch(
      showToastMessage({
        content: `info_saved`,
        type: 'success',
      })
    );
    if (method === 'pickup') {
      router.push(appLinks.checkout.path);
    } else {
      // if (destination.id === customer.address.area_id) {
      //   router.push()
      // }
      // router.push(appLinks.selectArea('guest'));
      router.push(appLinks.guestAddress.path);
    }

    // await triggerSaveCustomerInfo({
    //   body: {
    //     ...body,
    //     phone: parsedPhone,
    //     // phone_country_code: parsedCountryCode,
    //   },
    //   url,
    // }).then((r: any) => {
    //   if (r.data && r.data.Data && r.data.status) {
    //     console.log(r.data.Data, {
    //       ...body,
    //       phone: parsedPhone,
    //       address: 'no addresses',
    //       date_of_birth: null,
    //       gender: null,
    //     });
    //     // set country code manually because it doesn't come back from BE
    //     dispatch(setCustomer({ ...r.data.Data }));
    //     dispatch(
    //       showToastMessage({
    //         content: `info_saved`,
    //         type: 'success',
    //       })
    //     );
    //     if (method === 'pickup') {
    //       router.push(appLinks.checkout.path);
    //     } else {
    //       // if (destination.id === customer.address.area_id) {
    //       //   router.push()
    //       // }
    //       // router.push(appLinks.selectArea('guest'));
    //       router.push(appLinks.guestAddress.path);
    //     }
    //   } else if (
    //     r.error &&
    //     r.error.data &&
    //     r.error.data.msg &&
    //     r.error.data.msg.phone[0]
    //   ) {
    //     setError(
    //       'phone',
    //       {
    //         type: 'focus',
    //         message: 'phone_number_must_be_between_8_and_15_number',
    //       },
    //       { shouldFocus: true }
    //     );
    //   } else {
    //     dispatch(
    //       showToastMessage({
    //         content: `all_fields_r_required`,
    //         type: 'error',
    //       })
    //     );
    //   }
    // });
  };

  // console.log({ errors });

  return (
    <>
      <MainModal isOpen={isOpen} closeModal={closeModal}>
        <div>
          <div className="flex lg:grid lg:grid-cols-3 w-full px-4 py-1">
            <div className="w-[5%]">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={closeModal}
              >
                <ExpandMoreIcon className="text-stone-600" />
              </button>
            </div>
            <h5
              className="font-semibold capitalize text-center mx-auto"
              suppressHydrationWarning={suppressText}
            >
              {t('guest_info')}
            </h5>
          </div>
          <div className="px-4" dir={dir}>
            <form className="capitalize" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <input
                  id="name"
                  {...register('name')}
                  //   placeholder={`${startCase(`${t('enter_your_name')}`)}`}
                  //   onChange={(e) => setValue('name', toEn(e.target.value))}
                  className="block px-2.5 pb-2.5 pt-5 w-full text-black border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer"
                  placeholder=" "
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = '#3f3f46')
                  }
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                />
                <label
                  htmlFor="name"
                  className={`absolute text-stone-500 duration-300 transform -translate-y-4 top-4 z-10 origin-[0] left-2.5 peer-focus:text-stone-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full`}
                  suppressHydrationWarning={suppressText}
                >
                  <div>{t('fill_name')}</div>
                </label>
                <div>
                  {errors?.name?.message && (
                    <p
                      className={`${errorMsgClass}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {t('name_is_required')}
                    </p>
                  )}
                </div>
              </div>
              {/* phone */}
              <div className="pt-6 pb-5">
                <label
                  htmlFor="phone"
                  className={`text-gray-500`}
                  suppressHydrationWarning={suppressText}
                >
                  <div>{t('phone_number')} *</div>
                </label>
                <PhoneInput
                  // flags={Object.fromEntries(
                  //   Object.entries(flags).filter(([key]) => key === 'KW')
                  // )}
                  defaultCountry="KW"
                  countries={['KW']}
                  type="text"
                  {...register('phone')}
                  aria-invalid={errors.phone}
                  //   type="text"
                  defaultValue={customer.phone ?? ``}
                  placeholder={`${
                    customer.phone ?? startCase(`${t('enter_your_name')}`)
                  }`}
                  onChange={(e) => setValue('phone', e)}
                  className="border-b-[1px] pb-3"
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = '#3f3f46')
                  }
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                />
                <div>
                  {errors?.phone?.message && (
                    <p
                      className={`${errorMsgClass}`}
                      suppressHydrationWarning={suppressText}
                    >
                      {errors?.phone?.message?.key ||
                      errors?.phone?.type === 'min' ||
                      errors?.phone?.type === 'max'
                        ? t('phone_number_must_be_between_8_and_15_number')
                        : t(`${errors?.phone?.message}`)}
                      {/* {t('phone_number_must_be_between_8_and_15_number')} */}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative">
                <input
                  id="email"
                  {...register('email')}
                  //   placeholder={`${startCase(`${t('enter_your_email')}`)}`}
                  //   onChange={(e) => setValue('email', e?.target?.value)}
                  className="block px-2.5 pb-2.5 pt-5 w-full text-black border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer"
                  placeholder=" "
                  style={{ borderBottomColor: '#e5e7eb' }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = '#3f3f46')
                  }
                  onBlur={(e) => (e.target.style.borderBottomColor = '#e5e7eb')}
                />
                <label
                  htmlFor="email"
                  className={`absolute text-stone-500 duration-300 transform -translate-y-4 top-4 z-10 origin-[0] left-2.5 peer-focus:text-stone-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full`}
                  suppressHydrationWarning={suppressText}
                >
                  <div>{t('email_optional')}</div>
                  <div>
                    {errors?.email?.message && (
                      <p
                        className={`${errorMsgClass}`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t('email_is_required')}
                      </p>
                    )}
                  </div>
                </label>
              </div>
              <div className="border-t-[1px] border-gray-200 pt-4">
                <button
                  className={`${mainBtnClass}`}
                  style={{ backgroundColor: color }}
                  suppressHydrationWarning={suppressText}
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainModal>
    </>
  );
};
export default GuestOrderModal;
