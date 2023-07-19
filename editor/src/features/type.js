import { createSlice } from "@reduxjs/toolkit";

export const typeSlice = createSlice({
  name: "type",
  initialState: {
    /* 1: Movies, 2: TVShows, 3: Source */
    type: 1,
  },
  reducers: {
    toggleType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { toggleType } = typeSlice.actions;
export default typeSlice.reducer;
