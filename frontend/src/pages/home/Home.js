import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import SearchBar from "../../components/searchBar/SearchBar";
import ToggleBar from "../../components/toggleBar/ToggleBar";
import PreviewHero from "../../components/previewHero/PreviewHero";
import Preview from "../../components/preview/Preview";
import ChipSlider from "../../components/chipSlider/ChipSlider";
import VideoWall from "../../components/videoWall/VideoWall";
import SpinLoader from "../../components/spinLoader/SpinLoader";
import { selectVideo } from "../../features/video";
import { toggleLoading } from "../../features/view";
import useWebSocket from "../../hooks/useWebSocket";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
} from "../../features/backend";

const Home = () => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const isLoading = useSelector((state) => state.view.isLoading);
  const [isReady, val, send] = useWebSocket();

  //val: receiving messages
  useEffect(() => {
    if (val && val.name) {
      if (val.name === "done") {
        console.log(val.name);
        navigate(0);
        dispatch(toggleLoading(false));
      }
      if (val.name === "change") {
        console.log(val.name);
        dispatch(toggleLoading(true));
      }
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

  /*   useEffect(() => {
    console.log(action);
    action.name != "select" && action.name != "" && setEvent(action);
    refetch();
  }, [action]); */

  useEffect(() => {
    moviesByGenre && setMovies(moviesByGenre ?? []);
  }, [viewType, moviesByGenre]);

  useEffect(() => {
    moviesByTitle && setMovies(moviesByTitle ?? []);
  }, [moviesByTitle]);

  useEffect(() => {
    let loader = document.getElementById("loader");
    isLoading
      ? loader && (loader.style = "display: block;")
      : loader && (loader.style = "display: none;");
  }, [isLoading]);

  return (
    <div className={styles.container}>
      <div id="loader" className={styles.loadingScreen}>
        <SpinLoader />
      </div>

      <section className={styles.left}>
        <header>
          <ChipSlider />
        </header>

        <VideoWall filteredVideos={movies} />

        <footer>
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
