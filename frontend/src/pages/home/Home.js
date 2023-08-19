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
import useWebSocket from "../../hooks/useWebSocket";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
} from "../../features/backend";

const Home = () => {
  const viewType = useSelector((state) => state.view.viewType);
  const selectedVideo = useSelector((state) => state.video.video);
  const search = useSelector((state) => state.video.search);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);

  const { data: moviesByTitle } = useGetMoviesBySearchQuery({
    search: search,
    input: title,
  });

  const [movies, setMovies] = useState([]);

  const [isReady, val, send] = useWebSocket();
  useEffect(() => {
    val && val.name && val.name === "update" && dispatch(selectVideo(null));
  }, [val]);

  const dispatch = useDispatch();

  /*   useEffect(() => {
    console.log(action);
    action.name != "select" && action.name != "" && setEvent(action);
    refetch();
  }, [action]); */

  useEffect(() => {
    moviesByGenre && setMovies(moviesByGenre ?? []);
  }, [viewType, genre]);

  useEffect(() => {
    moviesByTitle && setMovies(moviesByTitle ?? []);
  }, [viewType, search, title]);

  return (
    <div className={styles.container}>
      <section className={styles.left}>
        <header>
          <ChipSlider />
        </header>

        <VideoWall filteredVideos={movies} />

        <footer>
          <p>{movies.length}</p>
          <SearchBar />
        </footer>
      </section>

      <section className={styles.right}>
        <Preview />
      </section>
    </div>
  );
};

export default Home;
