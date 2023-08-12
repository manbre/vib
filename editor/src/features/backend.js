import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backend = createApi({
  reducerPath: "backend",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/" }),
  endpoints: (builder) => ({
    //------------------------------------------------------------------------------------
    //QUERIES
    getMovieById: builder.query({
      query: (id) => `movies/id/${id}`,
    }),
    //------------------------------------------------------------------------------------
    //MUTATIONS
    //
    createMovieData: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "POST",
        body: movie,
      }),
    }),
    createNewEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "POST",
        body: episode,
      }),
    }),
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
    deleteMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "DELETE",
        body: movie,
      }),
    }),
    deleteEpisode: builder.mutation({
      query: (episode) => ({
        url: "/episodes",
        method: "DELETE",
        body: episode,
      }),
    }),
    //
    createMovieFiles: builder.mutation({
      query: (movie) => ({
        url: "/movies/files",
        method: "POST",
        body: movie,
      }),
    }),
    updateMovieFiles: builder.mutation({
      query: (movie) => ({
        url: "/movies/files",
        method: "PUT",
        body: movie,
      }),
    }),
    deleteMovieFiles: builder.mutation({
      query: (files) => ({
        url: "/movies/files",
        method: "DELETE",
        body: files,
      }),
    }),
    copyEpisodeFiles: builder.mutation({
      query: (episode) => ({
        url: "/episodes/files",
        method: "POST",
        body: episode,
      }),
    }),
  }),
});

export const {
  useGetMovieByIdQuery,
  //
  useCreateMovieDataMutation,
  useCreateNewEpisodeMutation,
  //
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
  //
  useDeleteMovieMutation,
  useDeleteEpisodeMutation,
  //
  useCreateMovieFilesMutation,
  useUpdateMovieFilesMutation,
  useDeleteMovieFilesMutation,
  useCopyEpisodeFilesMutation,
} = backend;
