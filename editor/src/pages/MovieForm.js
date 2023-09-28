import React from "react";
import { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { setEvent } from "../features/view";
import useOmdb from "../hooks/useOmdb";

import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useUpdateMovieFilesMutation,
} from "../features/backend";

const MovieForm = (props) => {
  const dispatch = useDispatch();

  const initialState = {
    title: "",
    series: "",
    director: "",
    genre: "",
    year: "",
    fsk: "",
    awards: "",
    rating: "",
    runtime: "",
    actors: "",
    plot: "",
    poster: "",
    trailer: "",
    german: "",
    english: "",
    changes: 0,
  };

  const [state, updateState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const [createMovie] = useCreateMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie, { isSuccess: isDeleted }] = useDeleteMovieMutation();
  const [updateFiles, { isSuccess: isUpdated }] = useUpdateMovieFilesMutation();

  useEffect(() => {
    console.log(isUpdated);
    isUpdated && dispatch(setEvent({ name: "done", type: 1, value: null }));
  }, [isUpdated]);

  useEffect(() => {
    isDeleted && dispatch(setEvent({ name: "done", type: 1, value: null }));
  }, [isDeleted]);

  useEffect(() => {
    resetInput();
    props.selected && updateState(props.selected);
  }, [props.selected]);

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
      let movie = state;
      createMovie(state)
        .unwrap()
        .catch((error) => props.changeMessage(error.message))
        .then((result) => {
          movie.id = result.id;
          updateFiles(movie)
            .unwrap()
            .then((payload) => props.changeMessage(payload.message))
            .catch((error) => props.changeMessage(error.message))
            .then(resetInput());
        });
    }
  };

  const updateVideo = async () => {
    await updateMovie({
      id: props.selected.id,
      ...(state.title !== props.selected.title
        ? { title: state.title }
        : { title: props.selected.title }),
      ...(state.series !== props.selected.series && {
        series: state.series,
      }),
      ...(state.director !== props.selected.director && {
        director: state.director,
      }),
      ...(state.genre !== props.selected.genre && { genre: state.genre }),
      ...(state.year !== props.selected.year && { year: state.year }),
      ...(state.awards !== props.selected.awards && {
        awards: state.awards,
      }),
      ...(state.rating !== props.selected.rating && {
        rating: state.rating,
      }),
      ...(state.runtime !== props.selected.runtime && {
        runtime: state.runtime,
      }),
      //
      ...(state.actors !== props.selected.actors && {
        actors: state.actors,
      }),
      ...(state.plot !== props.selected.plot && { plot: state.plot }),
      changes: props.selected.changes + 1,
    })
      .unwrap()
      .catch((error) => props.changeMessage(error.message));
    //
    updateFiles({
      id: props.selected.id,
      title: props.selected.title,
      changes: props.selected.changes + 1,
      //
      ...(state.poster !== props.selected.poster && {
        poster: state.poster,
      }),
      ...(state.trailer !== props.selected.trailer && {
        trailer: state.trailer,
      }),
      ...(state.german !== props.selected.german && {
        german: state.german,
      }),
      ...(state.english !== props.selected.english && {
        english: state.english,
      }),
    })
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(resetInput());
  };

  const deleteVideo = () => {
    deleteMovie(props.selected)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(resetInput());
  };

  const resetInput = () => {
    updateState({
      id: "",
      title: "",
      series: "",
      director: "",
      genre: "",
      year: "",
      fsk: "",
      awards: "",
      rating: "",
      runtime: "",
      actors: "",
      plot: "",
      poster: "",
      trailer: "",
      german: "",
      english: "",
      changes: 0,
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
          {!props.selected ? (
            <button
              className={styles.omdbBtn}
              onClick={() =>
                fetchOmdb({
                  title: state.title,
                  year: state.year,
                })
              }
            ></button>
          ) : (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => resetInput()}
            ></label>
          )}
        </div>

        <div className={styles.row}>
          <label className={styles.poster}>
            {state.poster &&
            !state.poster.includes("http") &&
            !state.poster.includes(":") ? (
              <img src={`http://localhost:9000/stream/image/${state.poster}`} />
            ) : (
              <img src={state.poster} />
            )}
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
                    poster: props.selected && props.selected.poster,
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
              <label>FSK</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.fsk || ""}
                onChange={(e) => updateState({ fsk: e.target.value })}
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
                    trailer: props.selected && props.selected.trailer,
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
                  updateState({
                    german: props.selected && props.selected.german,
                  })
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
                    english: props.selected && props.selected.english,
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
