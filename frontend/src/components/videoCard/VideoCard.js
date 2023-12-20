import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoCard.module.css";
import { selectVideo } from "../../features/video";
import AsyncPoster from "../asyncPoster/AsyncPoster";

const VideoCard = ({ video }) => {
  const [id, setId] = useState(0);
  const markedCard = useSelector((state) => state.view.card);
  const type = useSelector((state) => state.view.viewType);
  const dispatch = useDispatch();

  useEffect(() => {
    let elements = document.getElementsByClassName(`${styles.container}`);
    //!== null ________ !important!
    if (markedCard !== null && elements[markedCard]) {
      elements[markedCard].style =
        "outline: 4px solid white; transform: scale(1.07);";
      //
      for (let i = 0; i < elements.length; i++) {
        if (i !== markedCard) {
          elements[i].style = "border: none;";
        }
      }
    }
    //=== null ________ !important!
    if (markedCard === null) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style = "border: none;";
      }
    }
  }, [markedCard]);

  const convertRuntime = (runtime) => {
    if (runtime < 60) {
      return runtime + " min";
    }
    let hours = Math.floor(runtime / 60);
    let minutes = runtime % 60;
    return minutes > 0 ? hours + " h " + minutes + " min" : hours + " h";
  };

  return (
    <div
      className={styles.container}
      onClick={() => dispatch(selectVideo(video))}
    >
      <div className={styles.poster}>
        <AsyncPoster
          src={
            video.poster && `http://localhost:9000/stream/image/${video.poster}`
          }
        ></AsyncPoster>
      </div>

      <div className={styles.info}>
        <div className={styles.year}>
          <p>{video.year}</p>
        </div>
        <div className={styles.languages}>
          {video.german && <span className={styles.german}></span>}
          {video.english && <span className={styles.english}></span>}
        </div>
        <div className={styles.runtime}>
          <p>{convertRuntime(video.runtime)}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
