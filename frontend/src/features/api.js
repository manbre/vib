import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000" }),
  tagTypes: ["Movie", "Episode"],
  endpoints: (builder) => ({
    //------------------------------------------------------------------------------------
    // Queries
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
      query: ({ series, season }) => `/recent/${series}/${season}`,
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
      query: (series) => `/series/${series}`,
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
    // Mutations
    //------------------------------------------------------------------------------------
    selectVideo: builder.mutation({
      query: ({ type, id }) => ({
        url: `/events/${type}/${id}`,
        method: "PUT",
        body: type,
        id,
      }),
    }),
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
  useSelectVideoMutation,
} = api;
