import { createSlice } from "@reduxjs/toolkit";

interface MyFeatureState {
  playButtonIsDisplayed: boolean;
  loaderIsDisplayed: boolean;
  reloaderIsDisplayed: boolean;
}

const initialState: MyFeatureState = {
  playButtonIsDisplayed: true,
  loaderIsDisplayed: false,
  reloaderIsDisplayed: false,
};

const mainButtonSlice = createSlice({
  name: "mainButton",
  initialState,
  reducers: {
    setPlayButtonIsDisplayed(state, actions: { payload: boolean }) {
      state.playButtonIsDisplayed = actions.payload;
    },
    setLoaderIsDisplayed(state, actions: { payload: boolean }) {
      state.loaderIsDisplayed = actions.payload;
    },
    setReloaderIsDisplayed(state, actions: { payload: boolean }) {
      state.reloaderIsDisplayed = actions.payload;
    },
  },
});

export const {
  setPlayButtonIsDisplayed,
  setLoaderIsDisplayed,
  setReloaderIsDisplayed,
} = mainButtonSlice.actions;

export default mainButtonSlice.reducer;
