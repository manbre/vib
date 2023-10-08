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
import useWebSocket from "../../hooks/useWebSocket";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
  //
  useGetSeasonsByGenreQuery,
  useGetSeasonsBySearchQuery,
} from "../../features/backend";

const Home = () => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const isLoaded = useSelector((state) => state.view.isLoaded);
  const [isReady, val, send] = useWebSocket();
  const [type, setType] = useState(1);

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
    isReady &&
      send(
        JSON.stringify({
          name: null,
          type: type,
          id: selectedVideo ? selectedVideo.id : null,
        })
      );
  }, [type, selectedVideo]);

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

  useEffect(() => {
    switch (type) {
      case 1:
        moviesByGenre && setVideos(moviesByGenre ?? []);
        break;
      case 2:
        seasonsByGenre && setVideos(seasonsByGenre ?? []);
        break;
      default:
        moviesByGenre && setVideos(moviesByGenre ?? []);
    }
  }, [type, genre]);

  useEffect(() => {
    switch (type) {
      case 1:
        moviesBySearch && setVideos(moviesBySearch ?? []);
        break;
      case 2:
        seasonsBySearch && setVideos(seasonsBySearch ?? []);
        break;
      default:
        moviesBySearch && setVideos(moviesBySearch ?? []);
    }
  }, [input]);

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
            <ToggleBar changeType={(type) => setType(type)} />
          </div>

          <ChipSlider />
        </header>

        <VideoWall filteredVideos={videos} />
      </section>

      <section className={styles.right}>
        <Preview />
      </section>
    </div>
  );
};

export default Home;
