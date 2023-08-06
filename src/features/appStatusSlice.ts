import { createSlice } from "@reduxjs/toolkit";

type statusType = "default" | "loading" | "reload" | "final";
export type webcamDimensionsType = { x: number; y: number };

interface appStatusState {
  status: statusType;
  webcamDimensions: webcamDimensionsType | undefined;
}

const initialState: appStatusState = {
  status: "default",
  webcamDimensions: undefined,
};

const appStatusSlice = createSlice({
  name: "appStatus",
  initialState,
  reducers: {
    setAppStatus(state, actions: { payload: statusType }) {
      state.status = actions.payload;
    },
    setWebcamDimensions(state, actions: { payload: webcamDimensionsType }) {
      state.webcamDimensions = actions.payload;
    },
  },
});

export const { setAppStatus, setWebcamDimensions } = appStatusSlice.actions;

export default appStatusSlice.reducer;
