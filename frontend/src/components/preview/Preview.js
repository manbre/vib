import React from "react";
import { useState, useEffect } from "react";
import styles from "./Preview.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardSlider from "../cardSlider/CardSlider";
import AsyncPoster from "../asyncPoster/AsyncPoster";
import { selectAudio } from "../../features/video";
import { muteTeaser } from "../../features/view";

const Preview = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const isMuted = useSelector((state) => state.view.muted);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [actors, setActors] = useState("");
  const [plot, setPlot] = useState("");
  const [year, setYear] = useState("");
  const [fsk, setFsk] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [poster, setPoster] = useState("");
  //
  const [teaser, setTeaser] = useState("");
  const [rating, setRating] = useState(0);
  const [awards, setAwards] = useState(0);

  const toggleMute = () => {
    if (teaser) {
      const elements = document.getElementsByClassName(`${styles.teaser}`);
      if (isMuted) {
        elements[0].muted = true;
      } else {
        elements[0].muted = false;
      }
    }
  };

  const takeAudio = (audio) => {
    let german = document.getElementsByClassName(`${styles.german}`);
    let english = document.getElementsByClassName(`${styles.english}`);
    switch (audio) {
      case 1:
        german[0].style =
          "border-bottom: 2px solid white; transform: scale(1.4)";
        selectedVideo?.english && (english[0].style = "border: none;");
        dispatch(selectAudio(1));
        break;
      case 2:
        english[0].style =
          "border-bottom: 2px solid white; transform: scale(1.4)";
        selectedVideo?.german && (german[0].style = "border: none;");
        dispatch(selectAudio(2));
        break;
      default:
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      switch (viewType) {
        case 1:
          setTitle(selectedVideo.title);
          setYear(selectedVideo.year);
          setFsk(selectedVideo.fsk);
          setDirector(selectedVideo.director);
          setGenre(selectedVideo.genre);
          setActors(selectedVideo.actors);
          setPlot(selectedVideo.plot);
          setRuntime(selectedVideo.runtime);
          setPoster(selectedVideo.poster);
          //
          setTeaser(selectedVideo.teaser);
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
          //
          setTeaser(selectedVideo.teaser);
          break;
        default:
      }
      selectedVideo.german
        ? takeAudio(1)
        : selectedVideo.english && takeAudio(2);
      toggleMute();
    }
  }, [selectedVideo, viewType, takeAudio]);

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

  const convertRuntime = (runtime) => {
    if (runtime < 60) {
      return runtime + " min";
    }
    let hours = Math.floor(runtime / 60);
    let minutes = runtime % 60;
    return minutes > 0 ? hours + " h " + minutes + " min" : hours + " h";
  };

  return (
    <div className={styles.container}>
      <div className={styles.teaser}>
        {teaser && (
          <video
            autoPlay
            loop
            muted={isMuted}
            src={
              teaser && `http://localhost:9000/stream/media/teaser/${teaser}`
            }
          ></video>
        )}

        {!teaser && viewType === 1 && (
          <AsyncPoster
            src={poster && `http://localhost:9000/stream/image/${poster}`}
          />
        )}

         {viewType === 2 && selectedVideo && <CardSlider />} 

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

        {teaser && (
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
          {/*           <p className={styles.title}>{series}</p> */}
          <p className={styles.title}>{title}</p>
          <div className={styles.content}>
            <div className={styles.numbers}>
              {viewType === 1 && (
                <div className={styles.rating}>
                  {/*   {state.rating > 74 ? (
                  <span className={styles.fresh}></span>
                ) : state.rating > 59 ? (
                  <span className={styles.tomatoes}></span>
                ) : (
                  <span className={styles.rotten}></span>
                )} */}

                  <p>{rating / 10}</p>
                </div>
              )}
              <div className={styles.year}>
                <p>{year}</p>
              </div>
              <div className={styles.runtime}>
                <p>{convertRuntime(runtime)}</p>
              </div>
              <div className={styles.fsk}>
                <p>{fsk}+</p>
              </div>
              {awards > 0 && viewType === 1 && (
                <div className={styles.awards}>
                  <span className={styles.oscar}></span>
                  <p>{awards}</p>
                </div>
              )}
            </div>
            <p className={styles.plot}>{plot}</p>
            <div className={styles.row}>
              <div className={styles.colLeft}>
                <p>Director</p>
                <p>Actors</p>
                <p>Genre</p>
              </div>
              <div className={styles.colRight}>
                <p>{director}</p>
                <p>{actors}</p>
                <p>{genre}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
