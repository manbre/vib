import React from "react";
import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import { selectVideo } from "../features/video";
import useOmdb from "../hooks/useOmdb";

import {
  useCreateMovieDataMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  //
  useCreateMovieFilesMutation,
  useUpdateMovieFilesMutation,
  useDeleteMovieFilesMutation,
} from "../features/backend";

const MovieForm = (props) => {
  //
  const initialState = {
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

  const [createMovieData] = useCreateMovieDataMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();
  const [createMovieFiles] = useCreateMovieFilesMutation();
  const [updateMovieFiles] = useUpdateMovieFilesMutation();
  const [deleteMovieFiles] = useDeleteMovieFilesMutation();

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
      createMovieData(state)
        .unwrap()
        .then((payload) => props.changeMessage(payload.message))
        .catch((error) => props.changeMessage(error.message))
        .then(updateFiles())
        .then(resetInput());
    }
  };

  const updateVideo = () => {
    updateMovie({
      id: props.selected.id,
      //
      ...(state.title !== props.selected.title
        ? { title: state.title }
        : { title: props.selected.title }),
      ...(state.series !== props.selected.series && { series: state.series }),
      ...(state.director !== props.selected.director && {
        director: state.director,
      }),
      ...(state.genre !== props.selected.genre && { genre: state.genre }),
      //
      ...(state.year !== props.selected.year && { year: state.year }),
      ...(state.awards !== props.selected.awards && { awards: state.awards }),
      ...(state.rating !== props.selected.rating && { rating: state.rating }),
      ...(state.runtime !== props.selected.runtime && {
        runtime: state.runtime,
      }),
      //
      ...(state.actors !== props.selected.actors && { actors: state.actors }),
      ...(state.plot !== props.selected.plot && { plot: state.plot }),
      //
      ...{ poster: state.poster },
      ...{ trailer: state.trailer },
      ...{ german: state.german },
      ...{ english: state.english },
    })
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(updateFiles())
      .then(resetInput());
  };

  const deleteVideo = () => {
    deleteMovieFiles({
      title: props.selected && props.selected.title,
      poster: null,
      trailer: null,
      german: null,
      english: null,
    });
    deleteMovie(state)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(resetInput());
  };

  const updateFiles = () => {
    if (props.selected) {
      createMovieFiles({
        //create new file if filename of state is different to filename of selectedVideo
        title: state.title,
        poster: state.poster !== props.selected.poster && state.poster,
        trailer: state.trailer !== props.selected.trailer && state.trailer,
        german: state.german !== props.selected.german && state.german,
        english: state.english !== props.selected.english && state.english,
      });
      //
      updateMovieFiles({
        //rename file if title of state of is different to title of selectedVideo
        title: state.title,
        old_title: state.title !== props.selected.title && props.selected.title,
        poster: state.title !== props.selected.title && state.poster,
        trailer: state.title !== props.selected.title && state.trailer,
        german: state.title !== props.selected.title && state.german,
        english: state.title !== props.selected.title && state.english,
      });
      //
      deleteMovieFiles({
        //delete file if filename of state is ""
        title: props.selected.title,
        poster: state.poster !== "" && state.poster,
        trailer: state.trailer !== "" && state.trailer,
        german: state.german !== "" && state.german,
        english: state.english !== "" && state.english,
      });
    } else {
      (poster || trailer || german || english) &&
        createMovieFiles({
          title: state.title,
          poster: state.poster,
          trailer: state.trailer,
          german: state.german,
          english: state.english,
        });
    }
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
