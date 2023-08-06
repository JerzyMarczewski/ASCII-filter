import { configureStore } from "@reduxjs/toolkit";
import mainButtonSlice from "../features/mainButtonSlice";
import appStatusSlice from "../features/appStatusSlice";

const store = configureStore({
  reducer: {
    appStatus: appStatusSlice,
    mainButton: mainButtonSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
