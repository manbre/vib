import React from "react";
import { useState, useEffect } from "react";
import styles from "./Preview.module.css";
import { useSelector, useDispatch } from "react-redux";
/* import { useNavigate } from "react-router-dom"; */
import CardSlider from "../cardSlider/CardSlider";
import { selectVideo } from "../../features/video";
import { selectAudio } from "../../features/video";
import { muteTrailer } from "../../features/view";

const Preview = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const isMuted = useSelector((state) => state.view.muted);
  /*   const navigate = useNavigate(); */
  const dispatch = useDispatch();
  //
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [actors, setActors] = useState("");
  const [plot, setPlot] = useState("");
  const [year, setYear] = useState("");
  const [runtime, setRuntime] = useState(0);
  const [poster, setPoster] = useState("");
  //
  const [trailer, setTrailer] = useState("");
  const [rating, setRating] = useState(0);
  const [awards, setAwards] = useState(0);

  const takeAudio = (audio) => {
    let german = document.getElementsByClassName(`${styles.german}`);
    let english = document.getElementsByClassName(`${styles.english}`);
    switch (audio) {
      case 1:
        german[0].style =
          "border-bottom: 2px solid white; transform: scale(1.4)";
        selectedVideo.english && (english[0].style = "border: none;");
        dispatch(selectAudio(1));
        break;
      case 2:
        english[0].style =
          "border-bottom: 2px solid white; transform: scale(1.4)";
        selectedVideo.german && (german[0].style = "border: none;");
        dispatch(selectAudio(2));
        break;
      default:
    }
  };

  const toggleMute = () => {
    if (trailer) {
      const elements = document.getElementsByClassName(`${styles.trailer}`);
      if (isMuted) {
        elements[0].muted = true;
      } else {
        elements[0].muted = false;
      }
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      switch (viewType) {
        case 1:
          setTitle(selectedVideo.title);
          setYear(selectedVideo.year);
          setDirector(selectedVideo.director);
          setGenre(selectedVideo.genre);
          setActors(selectedVideo.actors);
          setPlot(selectedVideo.plot);
          setRuntime(selectedVideo.runtime);
          setPoster(selectedVideo.poster);
          //
          setTrailer(selectedVideo.trailer);
          setRating(selectedVideo.rating);
          setAwards(selectedVideo.awards);
          break;
        case 2:
          setTitle(selectedVideo.title);
          setYear(selectedVideo.year);
          setDirector(selectedVideo.director);
          setGenre(selectedVideo.genre);
          setActors(selectedVideo.actors);
          setPlot(selectedVideo.plot);
          setRuntime(selectedVideo.runtime);
          setPoster(selectedVideo.poster);
          break;
        default:
      }
      selectedVideo.german
        ? takeAudio(1)
        : selectedVideo.english && takeAudio(2);
      toggleMute();
    }
  }, [takeAudio, selectedVideo, toggleMute, viewType]);

  useEffect(() => {
    toggleMute();
  }, [isMuted, toggleMute]);

  const getProgress = () => {
    if (selectedVideo) {
      return (selectedVideo.elapsed_time / (selectedVideo.runtime * 60)) * 100;
    }
  };

  const getRemainingTime = () => {
    if (selectedVideo) {
      return Math.round(
        (selectedVideo.runtime * 60 - selectedVideo.elapsed_time) / 60
      );
    }
  };

  const playVideo = (isContinue) => {
    /*     navigate(`/watch/${isContinue}`); */
  };

  const getPlayButtons = () => {
    if (selectedVideo && selectedVideo.elapsed_time > 60) {
      return (
        <div className={styles.btns}>
          <button className={styles.play1Btn} onClick={() => playVideo(0)}>
            Play
          </button>
          <div className={styles.progressCol}>
            <button className={styles.play2Btn} onClick={() => playVideo(1)}>
              Continue
            </button>
            <progress
              className={styles.progressOnBtn}
              max="100"
              value={getProgress()}
            ></progress>
            <div className={styles.minutesLeft}>
              {getRemainingTime()} min left
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.btns}>
          <button className={styles.play1Btn} onClick={() => playVideo(0)}>
            Play
          </button>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={styles.description}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>
          <div className={styles.numbers}>
            {viewType === 1 ? (
              <div className={styles.rating}>
                {rating > 59 ? (
                  <span className={styles.tomatoes}></span>
                ) : (
                  <span className={styles.rotten}></span>
                )}

                <p>{rating} %</p>
              </div>
            ) : null}
            <div className={styles.runtime}>
              <span className={styles.hourglass}></span>
              <p>{runtime} min</p>
            </div>
            <div className={styles.year}>
              <span className={styles.calendar}></span>
              <p>{year}</p>
            </div>
            {viewType === 1 && (
              <div className={styles.awards}>
                {awards > 0 && <span className={styles.oscar}></span>}
                {awards > 0 && <p>{awards}</p>}
              </div>
            )}
          </div>
          <div className={styles.plot}>{plot}</div>
          <div className={styles.row}>
            <div className={styles.col1}>
              <p>Director</p>
              <p>Actors</p>
              <p>Genre</p>
            </div>
            <div className={styles.col2}>
              <p>{director}</p>
              <p>{actors}</p>
              <p>{genre}</p>
            </div>
          </div>
          <div className={styles.line}>
            {getPlayButtons()}
            <div className={styles.audios}>
              {selectedVideo && selectedVideo.german && (
                <label
                  className={styles.german}
                  onClick={() => takeAudio(1)}
                ></label>
              )}
              {selectedVideo && selectedVideo.english && (
                <label
                  className={styles.english}
                  onClick={() => takeAudio(2)}
                ></label>
              )}
            </div>
          </div>
        </div>
        {viewType === 1 && trailer && (
          <button
            className={isMuted ? styles.volBtn : styles.muteBtn}
            onClick={() =>
              isMuted
                ? dispatch(muteTrailer(false))
                : dispatch(muteTrailer(true))
            }
          ></button>
        )}
      </div>
      <div className={styles.curtain}></div>
      <div className={styles.videoWall}>
        {viewType === 1 && trailer ? (
          <video
            className={styles.trailer}
            autoPlay
            loop
            muted={isMuted}
            src={`http://localhost:9000/stream/video/trailer/${trailer}`}
          ></video>
        ) : (
          viewType === 1 && poster && (
            <img
              alt="poster"
              className={styles.poster}
              src={`http://localhost:9000/stream/image/${poster}`}
            ></img>
            
          )
        )}
      </div>
      {viewType === 2 && <CardSlider />}
    </div>
  );
};

export default Preview;
