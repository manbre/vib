import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoCard.module.css";
import { selectVideo } from "../../features/video";

const VideoCard = ({ video }) => {
  const markedCard = useSelector((state) => state.view.card);
  const dispatch = useDispatch();

  useEffect(() => {
    let elements = document.getElementsByClassName(`${styles.container}`);
    //!== null ________ !important!
    if (markedCard !== null && elements[markedCard]) {
      elements[markedCard].style = "outline: 5px solid white;";
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

  return (
    <div
      className={styles.container}
      onClick={() => dispatch(selectVideo(video))}
    >
      <div className={styles.poster}>
     {/*    <img
          alt="poster"
          src={
            video.poster
              ? `http://localhost:9000/stream/image/${video.poster}`
              : require("../../assets/images/placeholder.jpg")
          }
          onError={(event) =>
            (event.target.src = `http://localhost:9000/stream/image/${video.poster}`)
          }
        /> */}
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
          <p>{video.runtime} min</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
