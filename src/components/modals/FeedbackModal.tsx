import { FC, useCallback, useState } from 'react';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'react-phone-number-input/style.css';
import PhoneInput, {
  getCountries,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import {
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentSatisfiedOutlined,
  MoodOutlined,
} from '@mui/icons-material';
import { map } from 'lodash';
import { useRouter } from 'next/router';
import {
  modalBtnContainer,
  mainBtnClass,
  suppressText,
  toEn,
  errorMsgClass,
} from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { feedbackSchema } from 'src/validations';
import { Controller, useForm } from 'react-hook-form';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useCreateFeedbackMutation } from '@/redux/api/feedbackApi';

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  url: String;
};
const FeedbackModal: FC<Props> = ({
  isOpen,
  onRequestClose,
  url,
}): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    locale: { isRTL, dir },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [rateVal, setRateVal] = useState<number>();
  const [phone, setPhone] = useState();
  const [triggerCreateFeedback] = useCreateFeedbackMutation();
  const dispatch = useAppDispatch();
  const ratings = [
    { id: 1, icon: <SentimentDissatisfied fontSize="large" /> },
    { id: 2, icon: <SentimentVeryDissatisfied fontSize="large" /> },
    { id: 3, icon: <SentimentNeutral fontSize="large" /> },
    { id: 4, icon: <SentimentSatisfiedOutlined fontSize="large" /> },
    { id: 5, icon: <MoodOutlined fontSize="large" /> },
  ];
  const excludedCountries = ['IL'];
  const filteredCountries = getCountries().filter(
    (country) => !excludedCountries.includes(country)
  );
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      user_name: ``,
      rate: ``,
      note: ``,
      phone: ``,
    },
  });

  const onSubmit = async (body: any) => {
    await triggerCreateFeedback({ body, url }).then((r: any) => {
      if (r.data && r.data.status) {
        dispatch(
          showToastMessage({
            content: 'thanks_for_your_feedback',
            type: `success`,
          })
        );
        setRateVal(0);
        reset(
          {
            user_name: ``,
            rate: ``,
            note: ``,
            phone: ``,
          },
          { keepValues: false }
        );
        onRequestClose();
      }
    });
  };

  const handleChange = ({ target }: any) => {
    setValue(target.name, toEn(target.value));
    clearErrors(target.name);
  };

  console.log({ errors });

  const LimitedTextarea = () => {
    return (
      <div className="bg-gray-100 px-4 pb-1 rounded-lg">
        <Controller
          name="note"
          control={control}
          rules={{
            minLength: {
              value: 2,
              message: 'Note must be at least 2 characters',
            },
            maxLength: {
              value: 460,
              message: `Note must not exceed 460 characters`,
            },
          }}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                rows={5}
                cols={10}
                className="bg-gray-100 w-full resize-none h-16 capitalize placeholder:text-gray-500 focus:outline-none"
                placeholder={t('your_feedback')}
                onChange={(e) => field.onChange(e.target.value)}
                maxLength={460}
              />
              <p className="text-end text-gray-500">
                {field.value.length}/{460}
              </p>
            </>
          )}
        />
      </div>
    );
  };

  return (
    <>
      <MainModal isOpen={isOpen} closeModal={onRequestClose}>
        <div>
          <div className="flex w-full py-2 px-4 border-b-[1px] border-gray-200">
            <div className="w-[5%]">
              <button
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center"
                onClick={onRequestClose}
              >
                <ExpandMoreIcon className="text-stone-600" />
              </button>
            </div>
            <h5
              className="font-semibold capitalize text-center w-[95%]"
              suppressHydrationWarning={suppressText}
            >
              {t('leave_a_feedback')}
            </h5>
          </div>
          <div>
            <div
              className={`flex justify-between w-[80%] m-auto py-1 my-2`}
              dir={dir}
            >
              {map(ratings, (rate) => (
                <button
                  key={rate.id}
                  dir={`${isRTL ? 'rtl' : 'ltr'}`}
                  style={{
                    color: rateVal === rate.id ? color : '#877D78',
                  }}
                  suppressHydrationWarning={suppressText}
                  onClick={() => {
                    setValue('rate', rate.id);
                    setRateVal(rate.id);
                  }}
                >
                  {rate.icon}
                </button>
              ))}
            </div>
            <div className="px-5">
              {errors?.rate?.message && (
                <p
                  className={`${errorMsgClass}  ${
                    isRTL ? 'text-end' : 'text-start'
                  }`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('rate_is_required')}
                </p>
              )}
            </div>
          </div>
          <div className="px-4" dir={dir}>
            <form className="capitalize" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative mb-2">
                <input
                  {...register('user_name')}
                  name="user_name"
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                  aria-invalid={errors.user_name ? 'true' : 'false'}
                  className="block px-2.5 pb-2.5 pt-5 w-full text-black bg-gray-50 border-b-[1px] border-gray-200 appearance-none focus:outline-none focus:ring-0  peer placeholder:text-stone-500"
                  placeholder=" "
                />
                <label
                  htmlFor="user_name"
                  className={`absolute text-stone-500 duration-300 transform -translate-y-4 top-4 z-10 origin-[0] left-2.5 peer-focus:text-stone-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus::scale-100 peer-focus:-translate-y-4 w-full text-start ${
                    isRTL && 'ps-4'
                  }`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('your_name')}*
                </label>
              </div>
              <div>
                {errors?.user_name?.message && (
                  <p
                    className={`${errorMsgClass}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('name_is_required')}
                  </p>
                )}
              </div>
              <div className="py-1 ms-1 mb-3">
                <label
                  htmlFor="phone number"
                  className="text-stone-500"
                  suppressHydrationWarning={suppressText}
                >
                  {t('phone_number_optional')}
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => isValidPhoneNumber(value),
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      defaultCountry="KW"
                      className="focus:outline-none mt-2 border-b border-gray-100"
                      style={{ borderBottomColor: '#e5e7eb' }}
                      onFocus={(e) =>
                        (e.target.style.borderBottomColor = '#3f3f46')
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottomColor = '#e5e7eb')
                      }
                      {...field}
                      countries={filteredCountries}
                    />
                  )}
                />
                {errors?.phone?.message && (
                  <p
                    className={`${errorMsgClass}`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('phone_number_must_be_between_8_and_15_number')}
                  </p>
                )}
              </div>
              <LimitedTextarea control={control} errors={errors} />
              {errors.note && (
                <p
                  className={`${errorMsgClass}`}
                >
                  {t('note_is_required')}
                </p>
              )}
              <div className={`${modalBtnContainer} mt-5`}>
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
export default FeedbackModal;
