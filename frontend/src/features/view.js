import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    isEditor: false /* false: closed*/,
    viewType: 1 /* 1: Movies, 2: TVShows */,
    card: null,
    isLoading: false,
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
    muteTrailer: (state, action) => {
      state.muted = action.payload;
    },
    toggleLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  toggleEditor,
  toggleType,
  markCard,
  muteTrailer,
  toggleLoading,
} = viewSlice.actions;
export default viewSlice.reducer;
