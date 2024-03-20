import { useMemo } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { rootReducer } from "./slices/rootReducer";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import storage from "redux-persist/lib/storage";
import rootSaga from "./sagas/rootSaga";
import { productApi } from "./api/productApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import { apiSlice } from "./api";
import { categoryApi } from "@/redux/api/categoryApi";
import { vendorApi } from "@/redux/api/vendorApi";
import { isLocal } from "@/constants/*";
import { locationApi } from "@/redux/api/locationApi";
import { branchApi } from "@/redux/api/branchApi";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["api", "appSetting"],
  // whitelist: [
  // ],
  // stateReconciler: hardSet,
  debug: isLocal,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
const middlewares = [
  apiSlice.middleware,
  categoryApi.middleware,
  productApi.middleware,
  vendorApi.middleware,
  locationApi.middleware,
  branchApi.middleware,
  sagaMiddleware,
];
const appLogger: any = createLogger({
  collapsed: isLocal,
  duration: isLocal,
  diff: isLocal,
});
if (isLocal) {
  middlewares.push(appLogger);
}
let store: any = configureStore({
  reducer: persistedReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (gDM) =>
    gDM({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          HYDRATE,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }).concat(middlewares),
});
sagaMiddleware.run(rootSaga);
export const initializeStore = (preloadedState: RootState) => {
  let _store: any = store;
  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = {
      ...store.getState(),
      ...preloadedState,
    };
    // Reset the current store
    store = undefined;
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;
  return _store;
};
setupListeners(store.dispatch);
const makeStore = () => store;
const persistor = persistStore(store);
export const wrapper = createWrapper<AppStore>(makeStore, { debug: isLocal });
export const useStore = (initialState: RootState) =>
  useMemo(() => initializeStore(initialState), [initialState]);
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof store>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
