import { createSlice } from "@reduxjs/toolkit";

export const videoReducer = createSlice({
  name: "video",

  initialState: {
    video: null,
    genre: "All",
    title: "",
    search: "title",
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
    selectSearch: (state, action) => {
      state.search = action.payload;
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
  selectSearch,
  selectNext,
  selectAudio,
} = videoReducer.actions;
export default videoReducer.reducer;
