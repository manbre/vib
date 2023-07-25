import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const backend = createApi({
  reducerPath: "backend",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/" }),
  endpoints: (builder) => ({
    //QUERIES
    getOMDBData: builder.query({
      query: ({ title, year }) => `/omdb/${title}/${year}`,
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
    copyMovieFiles: builder.mutation({
      query: (movie) => ({
        url: "/movies/files",
        method: "POST",
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
  useGetOMDBDataQuery,
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
  useCopyMovieFilesMutation,
  useDeleteMovieFilesMutation,
  useCopyEpisodeFilesMutation,
} = backend;
