import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backend = createApi({
  reducerPath: "backend",
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
    //MUTATIONS (Editor)
    //
    createNewMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "POST",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    createNewEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "POST",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //
    updateMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "PUT",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    updateEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "PUT",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //
    deleteMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "DELETE",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    deleteEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "DELETE",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
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
  useCreateNewMovieMutation,
  useCreateNewEpisodeMutation,
  //
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
  //
  useDeleteMovieMutation,
  useDeleteEpisodeMutation,
  //
} = backend;
