import React from "react";
import { useState, useEffect, useReducer } from "react";
import styles from "./Preview.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardSlider from "../cardSlider/CardSlider";
import AsyncPoster from "../asyncPoster/AsnycPoster";
import { selectVideo } from "../../features/video";
import { selectAudio } from "../../features/video";
import { muteTeaser } from "../../features/view";

const Preview = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const isMuted = useSelector((state) => state.view.muted);
  const isLoaded = useSelector((state) => state.view.isLoaded);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const initialState = {
    title: "",
    director: "",
    genre: "",
    actors: "",
    plot: "",
    rating: "",
    year: "",
    runtime: "",
    fsk: "",
    awards: "",
    poster: "",
    teaser: "",
  };

  const [state, updateState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

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
    if (state.teaser) {
      const elements = document.getElementsByClassName(`${styles.teaser}`);
      if (isMuted) {
        elements[0].muted = true;
      } else {
        elements[0].muted = false;
      }
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      updateState(selectedVideo);
      selectedVideo.german
        ? takeAudio(1)
        : selectedVideo.english && takeAudio(2);
      toggleMute();
    }
  }, [selectedVideo, takeAudio, toggleMute]);

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
    navigate(`/watch/${isContinue}`);
  };

  const getPlayButtons = () => {
    if (selectedVideo?.elapsed_time > 60) {
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
      <div className={styles.teaser}>
        {state.teaser ? (
          <video
            autoPlay
            loop
            muted={isMuted}
            src={
              isLoaded &&
              state.teaser &&
              `http://localhost:9000/stream/video/trailer/${state.teaser}`
            }
          ></video>
        ) : (
          <AsyncPoster
            src={
              isLoaded &&
              state.poster &&
              `http://localhost:9000/stream/image/${state.poster}`
            }
          />
        )}
        <div className={styles.btns}>
          {(selectedVideo?.german || selectedVideo?.english) &&
            getPlayButtons()}
          <div className={styles.audios}>
            {selectedVideo?.german && (
              <label
                className={styles.german}
                onClick={() => takeAudio(1)}
              ></label>
            )}
            {selectedVideo?.english && (
              <label
                className={styles.english}
                onClick={() => takeAudio(2)}
              ></label>
            )}
          </div>
        </div>
        {viewType === 1 && state.teaser && (
          <button
            className={isMuted ? styles.volBtn : styles.muteBtn}
            onClick={() =>
              isMuted ? dispatch(muteTeaser(false)) : dispatch(muteTeaser(true))
            }
          ></button>
        )}
      </div>
      {selectedVideo && (
        <div className={styles.description}>
          <p className={styles.title}>{state.title}</p>
          <div className={styles.numbers}>
            {viewType === 1 && (
              <div className={styles.rating}>
                {state.rating > 74 ? (
                  <span className={styles.fresh}></span>
                ) : state.rating > 59 ? (
                  <span className={styles.tomatoes}></span>
                ) : (
                  <span className={styles.rotten}></span>
                )}

                <p>{state.rating} %</p>
              </div>
            )}
            <div className={styles.year}>
              <span className={styles.calendar}></span>
              <p>{state.year}</p>
            </div>
            <div className={styles.runtime}>
              <span className={styles.hourglass}></span>
              <p>{state.runtime} min</p>
            </div>
            <div className={styles.fsk}>
              <p>{state.fsk}+</p>
            </div>
            {state.awards > 0 && (
              <div className={styles.awards}>
                <span className={styles.oscar}></span>
                <p>{state.awards}</p>
              </div>
            )}
          </div>
          <p className={styles.plot}>{state.plot}</p>
          <div className={styles.row}>
            <div className={styles.colLeft}>
              <p>Director</p>
              <p>Actors</p>
              <p>Genre</p>
            </div>
            <div className={styles.colRight}>
              <p>{state.director}</p>
              <p>{state.actors}</p>
              <p>{state.genre}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
