import { createSlice } from "@reduxjs/toolkit";

type statusType = "default" | "loading" | "reload" | "final";
export type webcamDimensionsType = { x: number; y: number };
type filterType = "normal" | "sepia" | "ascii" | "pixelized";

const allFilters: filterType[] = ["normal", "sepia", "ascii", "pixelized"];

interface appStatusState {
  status: statusType;
  webcamDimensions: webcamDimensionsType | undefined;
  filter: filterType;
}

const initialState: appStatusState = {
  status: "default",
  webcamDimensions: undefined,
  filter: "normal",
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
    setPreviousFilter(state) {
      const index = allFilters.indexOf(state.filter);
      const newIndex = index === 0 ? allFilters.length - 1 : index - 1;
      state.filter = allFilters[newIndex];
    },
    setNextFilter(state) {
      const index = allFilters.indexOf(state.filter);
      state.filter = allFilters[(index + 1) % allFilters.length];
    },
  },
});

export const {
  setAppStatus,
  setWebcamDimensions,
  setPreviousFilter,
  setNextFilter,
} = appStatusSlice.actions;

export default appStatusSlice.reducer;
