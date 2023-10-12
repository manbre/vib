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
import useWebSocket from "../../hooks/useWebSocket";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
  //
  useGetSeasonsByGenreQuery,
  useGetSeasonsBySearchQuery,
} from "../../features/backend";

const Home = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const [isReady, val, send] = useWebSocket();
  const [type, setType] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const genre = useSelector((state) => state.video.genre);
  const input = useSelector((state) => state.video.title);

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre, {
    skip: type === 2,
  });
  const { data: seasonsByGenre } = useGetSeasonsByGenreQuery(genre, {
    skip: type === 1,
  });

  const { data: moviesBySearch } = useGetMoviesBySearchQuery(input, {
    skip: type === 2,
  });

  const { data: seasonsBySearch } = useGetSeasonsBySearchQuery(input, {
    skip: type === 2,
  });

  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  //reset loader
  useEffect(() => {
    let loader = document.getElementById("loader");
    loader.style = "display: none;";
  }, []);

  //clear complete cache data
  const clearCache = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  };

  //val: receiving messages
  useEffect(() => {
    let loader = document.getElementById("loader");
    if (val?.name === "data" && val?.value === true) {
      loader.style = "display: block;";
      setIsLoaded(false);
    }
    if (val?.name === "data" && val?.value === false) {
      clearCache();
      navigate(0);
      setIsLoaded(true);
      loader.style = "display: none;";
    }
  }, [val]);

  useEffect(() => {
    isReady &&
      send(JSON.stringify({ name: "select", value: selectedVideo?.id }));
  }, [selectedVideo]);

  useEffect(() => {
    type === 1 && moviesByGenre && setVideos(moviesByGenre ?? []);
  }, [type, moviesByGenre]);

  useEffect(() => {
    type === 2 && seasonsByGenre && setVideos(seasonsByGenre ?? []);
  }, [type, seasonsByGenre]);

  useEffect(() => {
    type === 1 && moviesBySearch && setVideos(moviesBySearch ?? []);
    type === 2 && seasonsBySearch && setVideos(seasonsBySearch ?? []);
  }, [input]);

  return (
    <div className={styles.container}>
      <div id="loader" className={styles.loadingScreen}>
        <SpinLoader />
      </div>

      <section className={styles.left}>
        <header>
          <div className={styles.topBar}>
            <SearchBar />
            <ToggleBar changeType={(type) => setType(type)} />
          </div>

          <ChipSlider />
        </header>

        <VideoWall filteredVideos={videos} isLoaded={isLoaded} />
      </section>

      <section className={styles.right}>
        <Preview isLoaded={isLoaded} />
      </section>
    </div>
  );
};

export default Home;
