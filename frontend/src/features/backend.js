import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backend = createApi({
  reducerPath: "backend",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000" }),
  tagTypes: ["Movie", "Episode"],
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
    getEpisodeGenres: builder.query({
      query: () => "/episodes/genres",
      providesTags: ["Episode"],
    }),
    //------------------------------------------------------------------------------------
    //Preview
    getEpisodesBySeason: builder.query({
      query: ({ series, season }) => `/episodes/${series}/${season}`,
      providesTags: ["Episode"],
    }),
    getRecentEpisode: builder.query({
      query: ({ series, season }) => `/episodes/recent/${series}/${season}`,
      providesTags: ["Episode"],
    }),
    //------------------------------------------------------------------------------------
    //SearchBar
    getMoviesBySearch: builder.query({
      query: ({ search, input }) => `/movies/search/${search}/${input}`,
      providesTags: ["Movie"],
    }),
    getSeasonsBySeries: builder.query({
      //returns first episode (as sample) of the season
      query: (series) => `/episodes/series/${series}`,
      providesTags: ["Episode"],
    }),
    //------------------------------------------------------------------------------------
    //Home
    getMoviesByGenre: builder.query({
      query: (genre) => `/movies/genre/${genre}`,
      providesTags: ["Movie"],
    }),
    getSeasonsByGenre: builder.query({
      //returns first episode (as sample) of the season
      query: (genre) => `/episodes/genre/${genre}`,
      providesTags: ["Episode"],
    }),
    //------------------------------------------------------------------------------------
    //MUTATIONS
    //
    updateMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "PUT",
        body: movie,
      }),
    }),
    updateEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "PUT",
        body: episode,
      }),
    }),
    //
  }),
});

export const {
  useGetSourceQuery,
  //
  useGetMovieGenresQuery,
  useGetEpisodeGenresQuery,
  //
  useGetEpisodesBySeasonQuery,
  useGetRecentEpisodeQuery,
  //
  useGetMoviesBySearchQuery,
  useGetSeasonsBySeriesQuery,
  //
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
  //
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
  //
} = backend;
