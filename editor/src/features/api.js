import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9000/" }),
  tagTypes: ["Movie", "Episode"],
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
      query: (id) => ({
        url: `/movies/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Movie"],
    }),
    deleteEpisode: builder.mutation({
      query: (id) => ({
        url: `/episodes/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Episode"],
    }),
    //
    copyMovieFiles: builder.mutation({
      query: (movie) => ({
        url: "/movies/files",
        method: "POST",
        body: movie,
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
  useCopyEpisodeFilesMutation,
} = api;
