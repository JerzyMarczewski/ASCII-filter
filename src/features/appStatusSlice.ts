import { createSlice } from "@reduxjs/toolkit";

type statusType = "default" | "loading" | "reload" | "final";
export type webcamDimensionsType = { x: number; y: number };
export type filterType =
  | "normal"
  | "grayscale"
  | "sepia"
  | "ascii"
  | "pixelized";
export type settingType = "gamma" | "squareSize";

export type filterSettingsType = {
  [filterName in filterType]: { [setting in settingType]: number | undefined };
};

type settingLimits = {
  [settingName in settingType]: { min: number; max: number };
};

const allFilters: filterType[] = [
  "normal",
  "grayscale",
  "sepia",
  "ascii",
  "pixelized",
];

interface appStatusState {
  status: statusType;
  webcamDimensions: webcamDimensionsType | undefined;
  filter: filterType;
  filterSettings: filterSettingsType;
  settingsLimits: settingLimits;
}

const initialFilterSettings: filterSettingsType = {
  normal: {
    gamma: 1,
    squareSize: undefined,
  },
  grayscale: {
    gamma: 1,
    squareSize: undefined,
  },
  sepia: {
    gamma: 1,
    squareSize: undefined,
  },
  ascii: {
    gamma: 1,
    squareSize: 10,
  },
  pixelized: {
    gamma: 1,
    squareSize: 10,
  },
};

const initialSettingsLimits: settingLimits = {
  gamma: {
    min: 0.1,
    max: 2.1,
  },
  squareSize: {
    min: 5,
    max: 50,
  },
};

const initialState: appStatusState = {
  status: "default",
  webcamDimensions: undefined,
  filter: "normal",
  filterSettings: initialFilterSettings,
  settingsLimits: initialSettingsLimits,
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
    changeSetting(
      state,
      actions: { payload: { settingName: settingType; value: number } }
    ) {
      const selectedFilterSettings = state.filterSettings[state.filter];
      selectedFilterSettings[actions.payload.settingName] =
        actions.payload.value;
    },
    resetFilterSettings(state, actions: { payload: filterType }) {
      state.filterSettings[actions.payload] =
        initialFilterSettings[actions.payload];
    },
  },
});

export const {
  setAppStatus,
  setWebcamDimensions,
  setPreviousFilter,
  setNextFilter,
  changeSetting,
  resetFilterSettings,
} = appStatusSlice.actions;

export default appStatusSlice.reducer;
