import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    event: { name: "", type: "", video: null },
    done: false,
    message: "",
  },
  reducers: {
    bringEvent: (state, action) => {
      state.event = action.payload;
    },
    
    isDone: (state, action) => {
      state.done = action.payload;
    },
    showMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { bringEvent, isDone, showMessage } = eventSlice.actions;
export default eventSlice.reducer;
