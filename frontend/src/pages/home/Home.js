import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import SearchBar from "../../components/searchBar/SearchBar";
import ToggleBar from "../../components/toggleBar/ToggleBar";
import Preview from "../../components/preview/Preview";
import ChipSlider from "../../components/chipSlider/ChipSlider";
import VideoWall from "../../components/videoWall/VideoWall";
import SpinLoader from "../../components/spinLoader/SpinLoader";
import { toggleLoaded } from "../../features/view";
import { selectVideo } from "../../features/video";
import useWebSocket from "../../hooks/useWebSocket";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
} from "../../features/backend";

const Home = () => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const isLoaded = useSelector((state) => state.view.isLoaded);
  const [isReady, val, send] = useWebSocket();

  //val: receiving messages
  useEffect(() => {
    console.log(val?.name);
    if (val?.name === "done") {
      clearCache();
      navigate(0);
      dispatch(toggleLoaded(true));
    }
    if (val?.name === "change") {
      dispatch(toggleLoaded(false));
    }
  }, [val]);

  useEffect(() => {
    selectedVideo &&
      isReady &&
      send(
        JSON.stringify({
          type: 1,
          id: selectedVideo.id,
        })
      );
  }, [isReady, selectedVideo]);

  const viewType = useSelector((state) => state.view.viewType);
  const search = useSelector((state) => state.video.search);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);

  const { data: moviesByTitle } = useGetMoviesBySearchQuery({
    search: search,
    input: title,
  });

  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
   viewType === 1 && dispatch(selectVideo(movies?.[0]))
  }, [movies]);

  useEffect(() => {
    moviesByGenre && setMovies(moviesByGenre ?? []);
  }, [viewType, moviesByGenre]);

  useEffect(() => {
    moviesByTitle && setMovies(moviesByTitle ?? []);
  }, [moviesByTitle]);

  useEffect(() => {
    let loader = document.getElementById("loader");
    !isLoaded
      ? (loader.style = "display: block;")
      : (loader.style = "display: none;");
  }, [isLoaded]);

  const clearCache = () => {
    //clears complete cache data
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  };

  return (
    <div className={styles.container}>
      <div id="loader" className={styles.loadingScreen}>
        <SpinLoader />
      </div>

      <section className={styles.left}>
        <header>
          <div className={styles.topBar}>
            <SearchBar />
            <ToggleBar />
          </div>
          <ChipSlider />
        </header>

        <VideoWall filteredVideos={movies} />
      </section>
      <section className={styles.right}>
        <Preview />
      </section>
    </div>
  );
};

export default Home;
