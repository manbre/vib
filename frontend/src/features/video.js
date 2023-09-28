import { createSlice } from "@reduxjs/toolkit";

export const videoReducer = createSlice({
  name: "video",

  initialState: {
    video: null,
    genre: "All",
    title: "",
    nextVideo: null,
  },

  reducers: {
    selectVideo: (state, action) => {
      state.video = action.payload;
    },
    selectGenre: (state, action) => {
      state.genre = action.payload;
    },
    selectTitle: (state, action) => {
      state.title = action.payload;
    },
    selectNext: (state, action) => {
      state.nextVideo = action.payload;
    },
    selectAudio: (state, action) => {
      state.audio = action.payload;
    },
  },
});

export const {
  selectVideo,
  selectGenre,
  selectTitle,
  selectNext,
  selectAudio,
} = videoReducer.actions;
export default videoReducer.reducer;
