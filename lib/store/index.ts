import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/auth-slice";
import uiReducer from "./slices/ui-slice";
import staffReducer from "./slices/staff-slice";
import pickupSatationReducer from "./slices/pickup-station-slice";
import dropOffStationReducer from "./slices/drop-off-station-slice";

const persistConfig = {
  key: "deporta-admin",
  version: 1,
  storage,
  whitelist: ["auth", "staff", "pickupStation"], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  staff: staffReducer,
  pickupStation: pickupSatationReducer,
  dropOffStation: dropOffStationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
