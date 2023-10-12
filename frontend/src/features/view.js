import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    isEditor: false /* false: closed*/,
    viewType: 1 /* 1: Movies, 2: TVShows */,
    card: null,
  },
  reducers: {
    toggleEditor: (state, action) => {
      state.isEditor = action.payload;
    },
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

export const {
  toggleEditor,
  toggleType,
  markCard,
  muteTeaser,
} = viewSlice.actions;
export default viewSlice.reducer;
