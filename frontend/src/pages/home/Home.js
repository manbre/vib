import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.css";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import SearchBar from "../../components/searchBar/SearchBar";
import ToggleBar from "../../components/toggleBar/ToggleBar";
import PreviewHero from "../../components/previewHero/PreviewHero";
import Preview from "../../components/preview/Preview";
import ChipSlider from "../../components/chipSlider/ChipSlider";
import VideoWall from "../../components/videoWall/VideoWall";
import { selectVideo } from "../../features/video";
import { bringEvent } from "../../features/event";

import {
  useGetSourceQuery,
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
  useCreateNewMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from "../../features/backend";

const Home = ({socket}) => {
  const viewType = useSelector((state) => state.view.viewType);
  const selectedVideo = useSelector((state) => state.video.video);
  const search = useSelector((state) => state.video.search);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);
  const event = useSelector((state) => state.event.event);

  const { data: sourceData } = useGetSourceQuery;
  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);
  const { data: moviesByTitle } = useGetMoviesBySearchQuery({
    search: search,
    input: title,
  });

  const [createMovie] = useCreateNewMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  const [source, setSource] = useState([]);
  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    sourceData && setSource(sourceData ?? []);
  }, [sourceData]);

  useEffect(() => {
    moviesByGenre && setMovies(moviesByGenre ?? []);
  }, [viewType, moviesByGenre]);

  useEffect(() => {
    moviesByTitle && setMovies(moviesByTitle ?? []);
  }, [moviesByTitle]);
/*   useEffect(() => {
      switch (event.name) {
        case "create":
          console.log(event.video)
          createMovie(event.video);
          break;
        case "update":
          break;
        case "delete":
          break;
        default:
      }
    
  }, [event]); */

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.light}>
            {viewType === 1 && selectedVideo && (
              <video
                className={styles.light_trailer}
                autoPlay
                loop
                muted
                src={`http://localhost:9000/stream/${selectedVideo.trailer}/trailer`}
              >
                Your browser does not support the video tag
              </video>
            )}
          </div>
          <div className={styles.preview}>
            {selectedVideo && (
              <button
                className={styles.closeBtn}
                onClick={() => dispatch(selectVideo(null))}
              ></button>
            )}
            {selectedVideo ? <Preview /> : ""}
          </div>
          <ChipSlider />
        </div>
        <VideoWall filteredVideos={movies} source={source} />
      </div>
    </div>
  );
};

export default Home;
