import React from "react";
import styles from "./VideoControl.module.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAudio,
  selectGenre,
  selectVideo,
  selectNext,
} from "../../features/video";
import {
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
} from "../../features/backend";

const VideoControl = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: allMovies, isSuccess: isMovie } = useGetMoviesByGenreQuery(
    "All"
  );
  const { data: allEpisodes, isSuccess: isEpisode } = useGetSeasonsByGenreQuery(
    "All"
  );
  const selectedVideo = useSelector((state) => state.video.video);
  const selectedNext = useSelector((state) => state.video.nextVideo);
  const selectedAudio = useSelector((state) => state.video.audio);
  const viewType = useSelector((state) => state.view.viewType);
  const [videos, setVideos] = useState([]);
  const [updateMovie] = useUpdateMovieMutation();
  const [updateEpisode] = useUpdateEpisodeMutation();
  const [isAudioSelect, setIsAudioSelect] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countDown, setCountDown] = useState(10);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  var timeout;

  /*   document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 27: //escape
        e.preventDefault();
        electron.leaveFullscreen();
        break;
    }
  }); */

  document.addEventListener("mousemove", function () {
    let player = document.getElementById("player");
    if (player && !isFinished) {
      player.style = "opacity: 1;";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        player.style = "opacity: 0;";
      }, 2000);
    }
  });

  useEffect(() => {
    switch (viewType) {
      case 1:
        isMovie && setVideos(allMovies ?? []);
        break;
      case 2:
        isEpisode && setVideos(allEpisodes ?? []);
        break;
    }
  }, [viewType, isMovie, isEpisode]);

  useEffect(() => {
    let nextBtn = document.getElementById("nextBtn");
    selectedVideo && viewType == 2
      ? props.seek > selectedVideo.intro
        ? (nextBtn.innerHTML = "next")
        : (nextBtn.innerHTML = "skip")
      : (nextBtn.innerHTML = "next");
  }, [props.seek]);

  const handleClose = () => {
    dispatch(selectGenre("0"));
    navigate("/");
    if (selectedVideo) {
      switch (viewType) {
        case 1:
          updateMovie({
            id: selectedVideo.id,
            elapsed_time: props.seek,
            last_viewed: new Date(),
          });
          break;
        case 2:
          updateEpisode({
            id: selectedVideo.id,
            elapsed_time: props.seek,
            last_viewed: new Date(),
          });
          break;
      }
    }
    /*     electron.leaveFullscreen(); */
  };

  const openAudioSelect = () => {
    let german = document.getElementsByClassName(`${styles.german}`);
    let english = document.getElementsByClassName(`${styles.english}`);
    switch (selectedAudio) {
      case 1:
        german[0].style = "border-top: 2px solid white;";
        selectedVideo.english && (english[0].style = "border: none;");
        break;
      case 2:
        english[0].style = "border-top: 2px solid white;";
        selectedVideo.german && (german[0].style = "border: none;");
        break;
    }
    if (isAudioSelect) {
      document.getElementById("audioDrop").style = "visibility: hidden;";
      setIsAudioSelect(false);
    } else {
      document.getElementById("audioDrop").style = "visibility: visible;";
      setIsAudioSelect(true);
    }
  };

  const takeAudio = (audio) => {
    let german = document.getElementsByClassName(`${styles.german}`);
    let english = document.getElementsByClassName(`${styles.english}`);
    switch (audio) {
      case 1:
        german[0].style = "border-top: 2px solid white;";
        selectedVideo.english && (english[0].style = "border: none;");
        dispatch(selectAudio(1));
        break;
      case 2:
        english[0].style = "border-top: 2px solid white;";
        selectedVideo.german && (german[0].style = "border: none;");
        dispatch(selectAudio(2));
        break;
    }
  };

  const handleNext = () => {
    /*   if (
      viewType == 2 &&
      selectedVideo.intro > 0 &&
      selectedVideo.intro > props.seek
    ) {
      props.changeSeek(selectedVideo.intro);
    } else { */
    let index =
      selectedVideo &&
      videos.findIndex((video) => video.id == selectedVideo.id);
    videos[index + 1]
      ? dispatch(selectVideo(videos[index + 1]))
      : dispatch(selectVideo(videos[0]));
    videos[index + 2]
      ? dispatch(selectNext(videos[index + 2]))
      : dispatch(selectNext(videos[0]));
    document.getElementById("preview").style = "visibility: hidden;";
    document.getElementById("nextBtn").style = "visibility: hidden;";
    document.getElementById("countDown").style = "visibility: hidden;";
    document.getElementById("cancelBtn").style = "visibility: hidden;";
    /*   } */
  };

  const handelCancel = () => {
    document.getElementById("preview").style = "visibility: hidden;";
    document.getElementById("nextBtn").style = "visibility: hidden;";
    document.getElementById("countDown").style = "visibility: hidden;";
    document.getElementById("cancelBtn").style = "visibility: hidden;";
    setIsCancelled(true);
  };

  useEffect(() => {
    let player = document.getElementById("player");
    let restTime = Math.floor(props.duration - props.seek);
    let time = viewType == 1 ? 250 : 15;

    if (props.seek < 10) {
      document.getElementById("preview").style = "visibility: visible;";
      document.getElementById("nextBtn").style = "visibility: visible;";
      document.getElementById("countDown").style = "visibility: hidden;";
      document.getElementById("cancelBtn").style = "visibility: hidden;";
    } else if (restTime > time) {
      document.getElementById("preview").style = "visibility: hidden;";
      document.getElementById("nextBtn").style = "visibility: hidden;";
      document.getElementById("countDown").style = "visibility: hidden;";
      document.getElementById("cancelBtn").style = "visibility: hidden;";
      setCountDown(10);
      isCancelled && setIsCancelled(false);
    } else if (restTime < time && !isCancelled) {
      document.getElementById("preview").style = "visibility: visible;";
      document.getElementById("nextBtn").style = "visibility: visible;";
      document.getElementById("countDown").style = "visibility: visible;";
      document.getElementById("cancelBtn").style = "visibility: visible;";
      setCountDown(countDown - 1);
      player.style = "opacity:1;";
      setIsFinished(true);
    }
    if (countDown == 1) {
      document.getElementById("nextBtn").click();
      setIsFinished(false);
    }
  }, [props.seek]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      /*      electron.enterFullscreen(); */
      setIsFullscreen(true);
    } else {
      /*   electron.leaveFullscreen(); */
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    let bar = document.getElementById("topBar");
    isFullscreen
      ? bar && (bar.style = "display: none;")
      : bar && (bar.style = "display: block;");
  }, [isFullscreen]);

  return (
    <div className={styles.container}>
      <div id="player" className={styles.player}>
        <div className={styles.top}>
          <button className={styles.closeButton} onClick={handleClose}></button>
          <div className={styles.title}>
            <p>{props.title}</p>
            <p></p>
          </div>
          <div className={styles.controls}>
            <div className={styles.audioSelect}>
              <button
                className={styles.speechButton}
                onClick={() => openAudioSelect()}
              ></button>
              <div id="audioDrop" className={styles.dropContent}>
                {selectedVideo && selectedVideo.german && (
                  <a className={styles.german} onClick={() => takeAudio(1)}></a>
                )}
                {selectedVideo && selectedVideo.english && (
                  <a
                    className={styles.english}
                    onClick={() => takeAudio(2)}
                  ></a>
                )}
              </div>
            </div>

            {props.volume > 50 ? (
              <button className={styles.volumeOver}></button>
            ) : props.volume > 0 ? (
              <button className={styles.volumeUnder}></button>
            ) : (
              <button className={styles.volumeMute}></button>
            )}
            <input
              className={styles.volumeRange}
              type="range"
              min={0}
              max={100}
              value={props.volume}
              onChange={props.handleVolumeChange}
            ></input>
            <button
              className={styles.screenButton}
              onClick={() => toggleFullscreen()}
            ></button>
          </div>
        </div>

        <div
          className={styles.mid}
          onClick={() =>
            props.playing
              ? props.changePlaying(false)
              : props.changePlaying(true)
          }
        >
          <button
            className={styles.rewind}
            onClick={props.handleRewind}
          ></button>
          {props.playing ? (
            <button
              className={styles.pause}
              onClick={props.togglePlay}
            ></button>
          ) : (
            <button className={styles.play} onClick={props.togglePlay}></button>
          )}
          <button
            className={styles.forward}
            onClick={props.handleForward}
          ></button>
        </div>
        <div className={styles.bottom}>
          <div className={styles.progress}>
            <input
              className={styles.seekRange}
              type="range"
              min="0"
              max={props.duration}
              onChange={props.handleSeekChange}
              value={props.seek}
            ></input>
          </div>
          <p className={styles.time}>
            {props.time} / {props.timeTotal}
          </p>
        </div>
        <div className={styles.preview}>
          <button
            id="cancelBtn"
            className={styles.cancelButton}
            onClick={() => handelCancel()}
          >
            cancel
          </button>
          <button
            id="nextBtn"
            className={styles.nextButton}
            onClick={() => handleNext()}
          ></button>
          <div id="countDown" className={styles.countDown}>
            {countDown}
          </div>
          <img
            id="preview"
            src={
              selectedNext &&
              `http://localhost:9000/stream/image/${selectedNext.poster}`
            }
            onError={(event) =>
              (event.target.src = `http://localhost:9000/stream/image/${selectedNext.poster}`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default VideoControl;
