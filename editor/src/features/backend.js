import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backend = createApi({
  reducerPath: "backend",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/" }),
  tagTypes: ["Movie", "Season", "Episode"],
  endpoints: (builder) => ({
    //------------------------------------------------------------------------------------
    //QUERIES
    //
    getMovieById: builder.query({
      query: (id) => `movies/id/${id}`,
      providesTags: ["Movie"],
    }),
    getSeasonById: builder.query({
      query: (id) => `seasons/id/${id}`,
      providesTags: ["Season"],
    }),
    getEpisodeById: builder.query({
      query: (id) => `episodes/id/${id}`,
      providesTags: ["Episode"],
    }),
    //
    getOneSeason: builder.query({
      query: ({ series, seasonNr }) => `seasons/season/${series}/${seasonNr}`,
      providesTags: ["Season"],
    }),
    getOneEpisode: builder.query({
      query: ({ seasonId, episodeNr }) =>
        `episodes/episode/${seasonId}/${episodeNr}`,
      providesTags: ["Episode"],
    }),
    //
    getAllEpisodesBySeason: builder.query({
      query: (id) => `/episodes/season/${id}`,
      providesTags: ["Episode"],
    }),
    //------------------------------------------------------------------------------------
    //MUTATIONS
    //
    createMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "POST",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    createSeason: builder.mutation({
      query: (season) => ({
        url: "/seasons",
        method: "POST",
        body: season,
      }),
      invalidatesTags: ["Season"],
    }),
    createEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "POST",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //_________________________________________
    updateMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "PUT",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    updateSeason: builder.mutation({
      query: (season) => ({
        url: "/seasons",
        method: "PUT",
        body: season,
      }),
      invalidatesTags: ["Season"],
    }),
    updateEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "PUT",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //_________________________________________
    deleteMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "DELETE",
        body: movie,
      }),
      invalidatesTags: ["Movie"],
    }),
    deleteSeason: builder.mutation({
      query: (season) => ({
        url: "/seasons",
        method: "DELETE",
        body: season,
      }),
      invalidatesTags: ["Season"],
    }),
    deleteEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "DELETE",
        body: episode,
      }),
      invalidatesTags: ["Episode"],
    }),
    //_________________________________________
    updateMovieFiles: builder.mutation({
      query: (movie) => ({
        url: "/movies/files",
        method: "PUT",
        body: movie,
      }),
    }),
    updateSeasonFiles: builder.mutation({
      query: (season) => ({
        url: "/seasons/files",
        method: "PUT",
        body: season,
      }),
    }),
    updateEpisodeFiles: builder.mutation({
      query: (episode) => ({
        url: "/episodes/files",
        method: "PUT",
        body: episode,
      }),
    }),
  }),
});

export const {
  useGetMovieByIdQuery,
  useGetOneSeasonQuery,
  useGetOneEpisodeQuery,
  useGetSeasonByIdQuery,
  useGetEpisodeByIdQuery,
  //
  useGetAllEpisodesBySeasonQuery,
  //
  useCreateMovieMutation,
  useCreateSeasonMutation,
  useCreateEpisodeMutation,
  //
  useUpdateMovieMutation,
  useUpdateSeasonMutation,
  useUpdateEpisodeMutation,
  //
  useDeleteMovieMutation,
  useDeleteSeasonMutation,
  useDeleteEpisodeMutation,
  //
  useUpdateMovieFilesMutation,
  useUpdateSeasonFilesMutation,
  useUpdateEpisodeFilesMutation,
} = backend;
