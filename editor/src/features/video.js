import { createSlice } from "@reduxjs/toolkit";

export const videoReducer = createSlice({
  name: "video",

  initialState: {
    video: null,
  },

  reducers: {
    selectVideo: (state, action) => {
      state.video = action.payload;
    },
  },
});

export const { selectVideo } = videoReducer.actions;
export default videoReducer.reducer;
