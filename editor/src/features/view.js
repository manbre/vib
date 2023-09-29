import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    /* 1: movie, 2: episode, 3: source */
    type: {
      movie: 1,
      episode: 2,
      source: 3,
    },
    event: { name: null, value: null },
  },
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setEvent: (state, action) => {
      state.event = action.payload;
    },
  },
});

export const { setType, setEvent } = viewSlice.actions;
export default viewSlice.reducer;
