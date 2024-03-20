import { call, put, delay, select, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import i18n from 'i18next';
import { toast, TypeOptions } from 'react-toastify';
import { appSettingSlice } from '@/redux/slices/appSettingSlice';
import { lowerCase, snakeCase } from 'lodash';
import { persistor } from '@/redux/store';

export function* startResetEnireAppSceanrio() {
  const version: any = localStorage.getItem('version');
  if (process.env.NEXT_PUBLIC_APP_VERSION && version !== process.env.NEXT_PUBLIC_APP_VERSION) {
    localStorage.setItem('version', process.env.NEXT_PUBLIC_APP_VERSION);
    yield delay(5000)
    persistor.purge()
    yield delay(5000)
    window.location.reload();
  }
}

export function* startEnableLoadingScenario(action: PayloadAction) {
  try {
  } catch (e) {
  } finally {
  }
}

export function* startUpdateCartProductScenario(action: PayloadAction<any>) {
  try {
  } catch (e) {
  } finally {
  }
}

export function* startChangeLangScenario(action: PayloadAction<string>) {
  try {
    yield put({ type: `${appSettingSlice.actions.hideSideMenu}` });
    yield delay(2000);
    i18n.changeLanguage(action.payload);
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  } finally {
  }
}

export function* startShowToastMessageScenario(
  action: PayloadAction<{
    content: string;
    type: TypeOptions | undefined;
    title?: string;
  }>
) {
  try {
    const content = i18n.t(snakeCase(lowerCase(action.payload.content)));
    toast(content, { type: action.payload.type });
  } catch (e: any) {
    yield put({
      type: `${appSettingSlice.actions.showToastMessage}`,
      payload: {
        content: e.message,
        type: 'error',
      },
    });
  }
}
