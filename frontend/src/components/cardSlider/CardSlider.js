import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./CardSlider.module.css";
import { selectVideo } from "../../features/video";
import {
  useGetAllEpisodesBySeasonQuery,
  useGetRecentEpisodeBySeasonQuery,
} from "../../features/backend";
import AsyncPoster from "../asyncPoster/AsyncPoster";

const CardSlider = () => {
  const [episodes, setEpisodes] = useState([]);
  const [index, setIndex] = useState(0);

  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const genre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);

  const { data: episodesBySeason } = useGetAllEpisodesBySeasonQuery(
    {
      series: selectedVideo.series,
      season: selectedVideo.season,
    },
    { skip: viewType === 1 }
  );
  const { data: recentEpisode } = useGetRecentEpisodeBySeasonQuery(
    {
      series: selectedVideo.series,
      season: selectedVideo.season,
    },
    { skip: viewType === 1 }
  );

  useEffect(() => {
    console.log(episodes.length);
    console.log(episodes[index]?.poster);
  }, [episodes, index]);

  useEffect(() => {
    let image = document.getElementsByClassName(`${styles.image}`);
    image.src = `http://localhost:9000/stream/image/${episodes[index]?.poster}`;
  }, [index]);

  useEffect(() => {
    episodesBySeason && setEpisodes(episodesBySeason ?? []);
  }, [episodesBySeason]);

  useEffect(() => {
    let recent;
    if (genre === "Recent" && recentEpisode) {
      recent = recentEpisode ?? [];
      setIndex(recent[0].episode - 1);
      dispatch(selectVideo(recent[0]));
    } else {
      setIndex(0);
    }
  }, [recentEpisode]);

  const nextSlide = () => {
    index < episodes.length - 1 ? setIndex(index + 1) : setIndex(0);
    index < episodes.length - 1
      ? dispatch(selectVideo(episodes[index + 1]))
      : dispatch(selectVideo(episodes[0]));
  };

  const prevSlide = () => {
    index > 0 ? setIndex(index - 1) : setIndex(episodes.length - 1);
    index > 0
      ? dispatch(selectVideo(episodes[index - 1]))
      : dispatch(selectVideo(episodes[episodes.length - 1]));
  };

  return (
    <div className={styles.container}>
      <button className={styles.prev} onClick={() => prevSlide()}>
        &#10094;
      </button>
      <div className={styles.card}>
        <div className={styles.poster}>
          <AsyncPoster className={styles.image} />
        </div>
        {/*         <div className={styles.info}>
          <div className={styles.series}>
            {episodes[index] && episodes[index].series}
          </div>
          <div className={styles.episode}>
            {episodes[index] &&
              "S " + episodes[index].season + ", Ep " + episodes[index].episode}
          </div>
          <div className={styles.counter}>{`${index + 1} / ${
            episodes.length
          }`}</div>
          <div className={styles.languages}>
            {episodes[index] && episodes[index].german && (
              <span className={styles.german}></span>
            )}
            {episodes[index] && episodes[index].english && (
              <span className={styles.english}></span>
            )}
          </div>
        </div> */}
      </div>
      <button className={styles.next} onClick={() => nextSlide()}>
        &#10095;
      </button>
    </div>
  );
};

export default CardSlider;
