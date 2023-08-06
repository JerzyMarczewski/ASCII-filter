import { configureStore } from "@reduxjs/toolkit";
import mainButtonReducer from "../features/mainButtonSlice";
import appStatusReducer from "../features/appStatusSlice";

const store = configureStore({
  reducer: {
    appStatus: appStatusReducer,
    mainButton: mainButtonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
