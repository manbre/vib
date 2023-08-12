import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    /* 1: movie, 2: episode, 3: source */
    type: 1,
    isFrontend: false,
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    toggleFrontend: (state, action) => {
      state.isFrontend = action.payload;
    },
  },
});

export const { setType, toggleFrontend } = viewSlice.actions;
export default viewSlice.reducer;
