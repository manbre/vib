import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    viewType: 1 /* 1: Movies, 2: Shows */,
    card: null,
  },
  reducers: {
    toggleType: (state, action) => {
      state.viewType = action.payload;
    },
    markCard: (state, action) => {
      state.card = action.payload;
    },
    muteTeaser: (state, action) => {
      state.muted = action.payload;
    },
  },
});

export const { toggleType, markCard, muteTeaser } = viewSlice.actions;
export default viewSlice.reducer;
