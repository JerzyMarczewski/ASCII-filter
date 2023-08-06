import { createSlice } from "@reduxjs/toolkit";

type statusType = "default" | "loading" | "reload" | "final";

interface appStatusState {
  status: statusType;
}

const initialState: appStatusState = {
  status: "default",
};

const appStatusSlice = createSlice({
  name: "appStatus",
  initialState,
  reducers: {
    setAppStatus(state, actions: { payload: statusType }) {
      state.status = actions.payload;
    },
  },
});

export const { setAppStatus } = appStatusSlice.actions;

export default appStatusSlice.reducer;
