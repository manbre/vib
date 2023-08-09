import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    event: { name: "", type: 1, id: null }, //1: movie, 2: tvshow
  },
  reducers: {
    bringEvent: (state, action) => {
      state.event = action.payload;
    },
  },
});

export const { bringEvent } = eventSlice.actions;
export default eventSlice.reducer;
