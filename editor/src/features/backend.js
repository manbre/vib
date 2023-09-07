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
    createMovie: builder.mutation({
      query: (movie) => ({
        url: "/movies",
        method: "POST",
        body: movie,
      }),
    }),
    createEpisode: builder.mutation({
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
  }),
});

export const {
  useGetMovieByIdQuery,
  //
  useCreateMovieMutation,
  useCreateEpisodeMutation,
  //
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
  //
  useDeleteMovieMutation,
  useDeleteEpisodeMutation,
} = backend;
