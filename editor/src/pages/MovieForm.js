import React from "react";
import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import useOmdb from "../hooks/useOmdb";

import {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useUpdateMovieFilesMutation,
} from "../features/backend";

const MovieForm = (props) => {

  const initialState = {
    title: "",
    series: "",
    director: "",
    genre: "",
    //
    year: "",
    fsk: 0,
    awards: "",
    rating: "",
    runtime: "",
    //
    actors: "",
    plot: "",
    //
    poster: "",
    teaser: "",
    german: "",
    english: "",
    //
    changes: 0,
  };

  const [state, updateState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const [createMovie] = useCreateMovieMutation();
  const [updateMovie, { isSuccess: isDataUpdated }] = useUpdateMovieMutation();
  const [deleteMovie, { isSuccess: isMovieDeleted }] = useDeleteMovieMutation();
  const [
    updateFiles,
    { isSuccess: areFilesUpdated },
  ] = useUpdateMovieFilesMutation();

  useEffect(() => {
    isDataUpdated && props.toggleChange(false);
    areFilesUpdated && props.toggleChange(false);
  }, [isDataUpdated, areFilesUpdated]);

  useEffect(() => {
    isMovieDeleted && props.toggleChange(false);
  }, [isMovieDeleted]);

  useEffect(() => {
    resetInput();
    props.selected && updateState(props.selected);
  }, [props.selected]);

  const { omdbData, fetchOmdb } = useOmdb();

  useEffect(() => {
    omdbData &&
      updateState({
        title: omdbData.Title && omdbData.Title.replace(":", " - "),
        director: omdbData.Director && omdbData.Director,
        genre: omdbData.Genre && omdbData.Genre,
        //
        year: omdbData.Year && omdbData.Year,
        awards:
          omdbData.Awards &&
          omdbData.Awards.includes("Oscar") &&
          !omdbData.Awards.includes("Nominated")
            ? omdbData.Awards.substring(3, 6)
            : "0",
        //
        rating:
          omdbData.Ratings &&
          omdbData.Ratings[1] &&
          omdbData.Ratings[1].Value.substring(0, 2),
        runtime: omdbData.Runtime && omdbData.Runtime.slice(0, 3),
        //
        actors: omdbData.Actors && omdbData.Actors,
        plot: omdbData.Plot && omdbData.Plot,
        //
        poster: omdbData.Poster && omdbData.Poster,
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

  const updateVideo = () => {
    updateMovie({
      id: props.selected.id,
      ...(state.title !== props.selected.title && { title: state.title }),
      ...(state.series !== props.selected.series && {
        series: state.series,
      }),
      ...(state.director !== props.selected.director && {
        director: state.director,
      }),
      ...(state.genre !== props.selected.genre && { genre: state.genre }),
      //
      ...(state.year !== props.selected.year && { year: state.year }),
      ...(state.fsk !== props.selected.fsk && {
        fsk: state.fsk,
      }),
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
      //
      changes: props.selected.changes + 1,
    })
      .unwrap()
      .catch((error) => props.changeMessage(error.message));
    //
    updateFiles({
      id: props.selected.id,
      changes: props.selected.changes + 1,
      //
      ...(state.poster !== props.selected.poster && {
        poster: state.poster,
      }),
      ...(state.teaser !== props.selected.teaser && {
        teaser: state.teaser,
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

  const resetInput = async () => {
    updateState({
      id: "",
      title: "",
      series: "",
      director: "",
      genre: "",
      //
      year: "",
      fsk: 0,
      awards: "",
      rating: "",
      runtime: "",
      //
      actors: "",
      plot: "",
      //
      poster: "",
      teaser: "",
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
            <label>Teaser</label>
            <input
              id="teaser"
              type="file"
              hidden
              onChange={(e) => updateState({ teaser: e.target.files[0].path })}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={state.teaser || ""}
              readOnly
            ></input>
          </div>
          {state.teaser !== "" ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => updateState({ teaser: "" })}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="teaser"></label>
              <label
                className={styles.undoneBtn}
                onClick={() =>
                  updateState({
                    teaser: props.selected && props.selected.teaser,
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
