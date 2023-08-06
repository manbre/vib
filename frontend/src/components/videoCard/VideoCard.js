import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoCard.module.css";
import { selectVideo } from "../../features/video";

const VideoCard = ({ video }) => {
  const markedCard = useSelector((state) => state.view.card);
  const viewType = useSelector((state) => state.view.viewType);
  const dispatch = useDispatch();

  useEffect(() => {
    var elements = document.getElementsByClassName(`${styles.container}`);
    var posters = document.getElementsByClassName(`${styles.poster}`);
    var infos = document.getElementsByClassName(`${styles.info}`);
    //!== null ________ !important!
    if (markedCard !== null && elements[markedCard]) {
      infos[markedCard].style = "transform: translateY(2rem);";
      elements[markedCard].style = "outline: 4px solid rgb(var(--sec-text))";
      //
      for (let i = 0; i < elements.length; i++) {
        if (i !== markedCard) {
          infos[i].style = " translateY(0);";
          elements[i].style = "outline: none";
        }
      }
    }
    if (markedCard === null) {
      for (let i = 0; i < elements.length; i++) {
        infos[i].style = " translateY(0);";
        elements[i].style = "outline: none";
      }
    }
  }, [markedCard]);

  const getTitle = () => {
    switch (viewType) {
      case 1:
        return <p>{video.title}</p>;
      case 2:
        return (
          <>
            <p>
              {video.series} - Season {video.season}
            </p>
          </>
        );
      default:
    }
  };

  return (
    <div
      className={styles.container}
      onClick={() => dispatch(selectVideo(video))}
    >
      <div className={styles.poster}>
        <img
          alt="poster"
          src={
            video.poster
              ? `http://localhost:9000/stream/image/${video.poster}`
              : require("../../assets/images/placeholder.jpg")
          }
          onError={(event) =>
            (event.target.src = `http://localhost:9000/stream/image/${video.poster}`)
          }
        />
      </div>

      <div className={styles.info}>
        {/* <div className={styles.title}>{getTitle()}</div> */}
        <div className={styles.bottom}>
          <div className={styles.year}>
            <p>{video.year}</p>
          </div>
          <div className={styles.languages}>
            {video.german && <span className={styles.german}></span>}
            {video.english && <span className={styles.english}></span>}
          </div>
          <div className={styles.runtime}>
            <p>{video.runtime} min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
