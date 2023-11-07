import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backend = createApi({
  reducerPath: "backend",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000" }),
  tagTypes: ["Movie", "Season", "Episode"],
  endpoints: (builder) => ({
    //------------------------------------------------------------------------------------
    // QUERIES
    //------------------------------------------------------------------------------------
    //
    getSource: builder.query({
      query: () => "/source/",
    }),
    //------------------------------------------------------------------------------------
    //ChipSlider
    getMovieGenres: builder.query({
      query: () => "/movies/genres",
      providesTags: ["Movie"],
    }),
    getSeasonGenres: builder.query({
      query: () => "/seasons/genres",
      providesTags: ["Season"],
    }),
    //------------------------------------------------------------------------------------
    //Preview
    getAllEpisodesBySeason: builder.query({
      query: ({ series, season }) => `/episodes/season/${series}/${season}`,
      providesTags: ["Episode"],
    }),
    getRecentEpisodeBySeason: builder.query({
      query: ({ series, season }) => `/episodes/recent/${series}/${season}`,
      providesTags: ["Episode"],
    }),
    //------------------------------------------------------------------------------------
    //SearchBar
    getMoviesBySearch: builder.query({
      query: (input) => `/movies/search/${input}`,
      providesTags: ["Movie"],
    }),
    getSeasonsBySearch: builder.query({
      //returns first episode (as sample) of the season
      query: (input) => `/seasons/search/${input}`,
      providesTags: ["Season"],
    }),
    //------------------------------------------------------------------------------------
    //Home
    getMoviesByGenre: builder.query({
      query: (genre) => `/movies/genre/${genre}`,
      providesTags: ["Movie"],
    }),
    getSeasonsByGenre: builder.query({
      //returns first episode (as sample) of the season
      query: (genre) => `/seasons/genre/${genre}`,
      providesTags: ["Season"],
    }),
    //------------------------------------------------------------------------------------
    //MUTATIONS for updating "last_watched"
    //------------------------------------------------------------------------------------
    updateMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "PUT",
        body: movie,
      }),
    }),
    updateSeason: builder.mutation({
      query: (season) => ({
        url: "/seasons",
        method: "PUT",
        body: season,
      }),
    }),
    updateEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "PUT",
        body: episode,
      }),
    }),
  }),
});

export const {
  useGetSourceQuery,
  //
  useGetMovieGenresQuery,
  useGetSeasonGenresQuery,
  //
  useGetAllEpisodesBySeasonQuery,
  useGetRecentEpisodeBySeasonQuery,
  //
  useGetMoviesBySearchQuery,
  useGetSeasonsBySearchQuery,
  //
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
  //
  useUpdateMovieMutation,
  useUpdateSeasonMutation,
  useUpdateEpisodeMutation,
  //
} = backend;
