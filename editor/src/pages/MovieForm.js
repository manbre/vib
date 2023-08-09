import React from "react";
import { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { bringEvent } from "../features/event";
import useOmdb from "../hooks/useOmdb";
import useWebSocket from "../hooks/useWebSocket";

import {
  useGetMovieByIdQuery,
  //
  useCreateNewMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useCopyMovieFilesMutation,
  useDeleteMovieFilesMutation,
} from "../features/backend";

const MovieForm = (props) => {
  //
  const initialState = {
    id: "",
    title: "",
    series: "",
    director: "",
    genre: "",
    year: "",
    part: "",
    awards: "",
    rating: "",
    runtime: "",
    actors: "",
    plot: "",
    poster: "",
    trailer: "",
    german: "",
    english: "",
  };

  const [state, updateState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const [createMovie] = useCreateNewMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();
  const [copyMovieFiles] = useCopyMovieFilesMutation();
  const [deleteMovieFiles] = useDeleteMovieFilesMutation();

  const selectedVideo = useSelector((state) => state.video.video);

  const dispatch = useDispatch();
  const [isReady, val, send] = useWebSocket();
  const { data: selected } = useGetMovieByIdQuery(val && val.id && val.id);

  useEffect(() => {
    resetInput();
    selected && updateState(selected);
  }, [selected]);

  const { omdbData, fetchOmdb } = useOmdb();

  useEffect(() => {
    omdbData &&
      updateState({
        poster: omdbData.Poster && omdbData.Poster,
        title: omdbData.Title && omdbData.Title.replace(":", " - "),
        director: omdbData.Director && omdbData.Director,
        genre: omdbData.Genre && omdbData.Genre,
        actors: omdbData.Actors && omdbData.Actors,
        plot: omdbData.Plot && omdbData.Plot,
        year: omdbData.Year && omdbData.Year,
        awards:
          omdbData.Awards &&
          omdbData.Awards.includes("Oscar") &&
          !omdbData.Awards.includes("Nominated")
            ? omdbData.Awards.substring(3, 6)
            : "0",
        rating:
          omdbData.Ratings &&
          omdbData.Ratings[1] &&
          omdbData.Ratings[1].Value.substring(0, 2),
        runtime: omdbData.Runtime && omdbData.Runtime.slice(0, 3),
      });
  }, [omdbData]);

  const createVideo = () => {
    if (state.title !== "") {
      createMovie(state)
        .unwrap()
        .then((payload) => props.changeMessage(payload.message))
        .catch((error) => props.changeMessage(error.message))
        .then(copyFiles())
        .then(dispatch(bringEvent({ name: "update", type: 1, id: null })))
        .then(resetInput());
    }
  };

  const updateVideo = () => {
    updateMovie(state)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(copyFiles())
      .then(dispatch(bringEvent({ name: "update", type: 1, id: null })))
      .then(resetInput());
  };

  const deleteVideo = () => {
    deleteMovie(state)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(dispatch(bringEvent({ name: "update", type: 1, id: null })))
      .then(resetInput());
  };

  const deleteFiles = () => {};

  const copyFiles = () => {
    (state.poster != null ||
      state.trailer != null ||
      state.german != null ||
      state.english != null) &&
      copyMovieFiles(state);
  };

  const resetInput = () => {
    updateState({
      id: "",
      title: "",
      series: "",
      director: "",
      genre: "",
      year: "",
      part: "",
      awards: "",
      rating: "",
      runtime: "",
      actors: "",
      plot: "",
      poster: "",
      trailer: "",
      german: "",
      english: "",
    });
    //
    let fields = document
      .getElementById("movie_form")
      .getElementsByTagName("input");
    for (let i = 0; i < fields.length; i++) {
      fields[i].value = "";
    }
    document.getElementsByTagName("textarea").value = "";
  };

  props.childRef.current = {
    createVideo: createVideo,
    updateVideo: updateVideo,
    deleteVideo: deleteVideo,
  };

  return (
    <div className={styles.container}>
      <div id="movie_form" className={styles.form}>
        <div className={styles.omdbRow}>
          <div className={styles.longBox}>
            <label>Title</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.title || ""}
              onChange={(e) => updateState({ title: e.target.value })}
            ></input>
          </div>
          <div className={styles.shortBox}>
            <label>Year</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.year || ""}
              onChange={(e) => updateState({ year: e.target.value })}
            ></input>
          </div>
          <button
            className={styles.omdbBtn}
            onClick={() =>
              fetchOmdb({
                title: state.title,
                year: state.year,
              })
            }
          ></button>
        </div>

        <div className={styles.row}>
          <label className={styles.poster}>
            <img
              src={
                state.poster && !state.poster.includes("http")
                  ? `http://localhost:9000/stream/image/${state.poster}`
                  : state.poster
              }
              onError={(event) =>
                (event.target.src =
                  state.poster && !state.poster.includes("http")
                    ? `http://localhost:9000/stream/image/${state.poster}`
                    : "")
              }
            />
          </label>
        </div>
        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Poster</label>
            <input
              id="poster"
              type="file"
              hidden
              onChange={(e) => updateState({ poster: e.target.files[0].path })}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={state.poster || ""}
              readOnly
            ></input>
          </div>
          {state.poster !== "" ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => updateState({ poster: "" })}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="poster"></label>

              <label
                className={styles.undoneBtn}
                onClick={() =>
                  updateState({
                    poster: selectedVideo && selectedVideo.poster,
                  })
                }
              ></label>
            </>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Title of series</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.series || ""}
              onChange={(e) => updateState({ series: e.target.value })}
            ></input>
          </div>
          <div className={styles.longBox}>
            <label>Director</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.director || ""}
              onChange={(e) => updateState({ director: e.target.value })}
              name="director"
            ></input>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Genre</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.genre || ""}
              onChange={(e) => updateState({ genre: e.target.value })}
            ></input>
          </div>
          <div className={styles.longBox}>
            <label>Actors</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.actors || ""}
              onChange={(e) => updateState({ actors: e.target.value })}
            ></input>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Part</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.part || ""}
                onChange={(e) => updateState({ part: e.target.value })}
              ></input>
            </div>
            <div className={styles.shortBox}>
              <label>Awards</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.awards || ""}
                onChange={(e) => updateState({ awards: e.target.value })}
              ></input>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Rating</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.rating || ""}
                onChange={(e) => updateState({ rating: e.target.value })}
              ></input>
            </div>
            <div className={styles.shortBox}>
              <label>Runtime</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.runtime || ""}
                onChange={(e) => updateState({ runtime: e.target.value })}
              ></input>
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Trailer</label>
            <input
              id="trailer"
              type="file"
              hidden
              onChange={(e) => updateState({ trailer: e.target.files[0].path })}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={state.trailer || ""}
              readOnly
            ></input>
          </div>
          {state.trailer !== "" ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => updateState({ trailer: "" })}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="trailer"></label>
              <label
                className={styles.undoneBtn}
                onClick={() =>
                  updateState({
                    trailer: selectedVideo && selectedVideo.trailer,
                  })
                }
              ></label>
            </>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Video (german)</label>
            <input
              id="german"
              type="file"
              hidden
              onChange={(e) => updateState({ german: e.target.files[0].path })}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={state.german || ""}
              readOnly
            ></input>
          </div>
          {state.german !== "" ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => updateState({ german: "" })}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="german"></label>
              <label
                className={styles.undoneBtn}
                onClick={() =>
                  updateState({ german: selectedVideo && selectedVideo.german })
                }
              ></label>
            </>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Video (english)</label>
            <input
              id="english"
              type="file"
              hidden
              onChange={(e) => updateState({ english: e.target.files[0].path })}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={state.english || ""}
              readOnly
            ></input>
          </div>
          {state.english !== "" ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => updateState({ english: "" })}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="english"></label>
              <label
                className={styles.undoneBtn}
                onClick={() =>
                  updateState({
                    english: selectedVideo && selectedVideo.english,
                  })
                }
              ></label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
