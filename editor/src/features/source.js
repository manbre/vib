import { createSlice } from "@reduxjs/toolkit";

export const sourceSlice = createSlice({
  name: "source",
  initialState: {
    movieSource: "",
    episodeSource: "",
  },
  reducers: {
    selectMovieSrc: (state, action) => {
      state.movieSource = action.payload;
    },
    selectEpisodeSrc: (state, action) => {
      state.episodeSource = action.payload;
    },
  },
});

export const { selectMovieSource, selectEpisodeSource } = sourceSlice.actions;
export default sourceSlice.reducer;
