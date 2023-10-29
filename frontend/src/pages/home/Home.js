import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import SearchBar from "../../components/searchBar/SearchBar";
import SwitchBar from "../../components/toggleBar/ToggleBar";
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
  const viewType = useSelector((state) => state.view.viewType);
  const [isReady, val, send] = useWebSocket();
  const [isLoaded, setIsLoaded] = useState(false);

  const genre = useSelector((state) => state.video.genre);
  const search = useSelector((state) => state.video.search);

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);
  const { data: seasonsByGenre } = useGetSeasonsByGenreQuery(genre);
  const { data: moviesBySearch } = useGetMoviesBySearchQuery(search, {
    skip: !search,
  });
  const { data: seasonsBySearch } = useGetSeasonsBySearchQuery(search, {
    skip: !search,
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
  }, [val, navigate]);

  useEffect(() => {
    isReady &&
      send(JSON.stringify({ name: "select", value: selectedVideo?.id }));
  }, [selectedVideo, isReady]);

  useEffect(() => {
    viewType === 1 && moviesByGenre && setVideos(moviesByGenre ?? []);
  }, [viewType, moviesByGenre]);

  useEffect(() => {
    viewType === 2 && seasonsByGenre && setVideos(seasonsByGenre ?? []);
  }, [viewType, seasonsByGenre]);

  useEffect(() => {
    viewType === 1 && moviesBySearch && setVideos(moviesBySearch ?? []);
    viewType === 2 && seasonsBySearch && setVideos(seasonsBySearch ?? []);
  }, [search, viewType, moviesBySearch, seasonsBySearch]);

  return (
    <div className={styles.container}>
      <div id="loader" className={styles.loadingScreen}>
        <SpinLoader />
      </div>

      <section className={styles.left}>
        <header>
          <div className={styles.topBar}>
            <SearchBar />
            <SwitchBar />
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
