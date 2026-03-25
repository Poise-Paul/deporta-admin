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
import customerReducer from "./slices/customer-slice";
import pickupSatationReducer from "./slices/pickup-station-slice";
import dropOffStationReducer from "./slices/drop-off-station-slice";
import busStopReducer from "./slices/bus-stop-slice";
import routesReducer from "./slices/route-slice";
import busReducer from "./slices/bus-slice";
import driverReducer from "./slices/driver-slice";
import corporateReducer from "./slices/co-operate-slice";

const persistConfig = {
  key: "deporta-admin",
  version: 1,
  storage,
  whitelist: [
    "auth",
    "staff",
    "pickupStation",
    "dropOffStation",
    "busStops",
    "routes",
    "bus",
    "customer",
  ], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  staff: staffReducer,
  customer: customerReducer,
  pickupStation: pickupSatationReducer,
  dropOffStation: dropOffStationReducer,
  busStops: busStopReducer,
  driver: driverReducer,
  routes: routesReducer,
  bus: busReducer,
  corporate: corporateReducer,
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
