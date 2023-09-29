import React from "react";
import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { setEvent } from "../features/view";
import useOmdb from "../hooks/useOmdb";

import {
  useCreateNewEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
  useUpdateEpisodeFilesMutation,
} from "../features/backend";

const EpisodeForm = (props) => {
  const dispatch = useDispatch();
  //
  const initialState = {
    series: "",
    title: "",
    director: "",
    genre: "",
    year: "",
    fsk: "",
    season: "",
    episode: "",
    actors: "",
    plot: "",
    poster: "",
    theme: "",
    german: "",
    english: "",
    changes: 0,
  };

  const [state, updateState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const [createEpisode] = useCreateNewEpisodeMutation();
  const [
    updateEpisode,
    { isSuccess: isDataUpdated },
  ] = useUpdateEpisodeMutation();
  const [
    deleteEpisode,
    { isSuccess: isEpisodeDeleted },
  ] = useDeleteEpisodeMutation();
  const [
    updateFiles,
    { isSuccess: areFilesUpdated },
  ] = useUpdateEpisodeFilesMutation();

  useEffect(() => {
    isDataUpdated && dispatch(setEvent({ name: "done", type: 2, value: null }));
    areFilesUpdated &&
      dispatch(setEvent({ name: "done", type: 2, value: null }));
  }, [isDataUpdated, areFilesUpdated]);

  useEffect(() => {
    isEpisodeDeleted &&
      dispatch(setEvent({ name: "done", type: 2, value: null }));
  }, [isEpisodeDeleted]);

  useEffect(() => {
    resetInput();
    props.selected && updateState(props.selected);
  }, [props.selected]);

  const { data: OMDBData, isSuccess: isOMDB } = useGetOMDBDataQuery({
    title: series,
    year: year,
  });

  const { omdbData, fetchOmdb } = useOmdb();

  useEffect(() => {
    omdbData &&
      updateState({
        poster: omdbData.Poster && omdbData.Poster,
        series: omdbData.Title && omdbData.Title.replace(":", " - "),
        director: omdbData.Director && omdbData.Director,
        genre: omdbData.Genre && omdbData.Genre,
        actors: omdbData.Actors && omdbData.Actors,
        plot: omdbData.Plot && omdbData.Plot,
        year: omdbData.Year && omdbData.Year,
        runtime: omdbData.Runtime && omdbData.Runtime.slice(0, 3),
      });
  }, [omdbData]);

  const createVideo = () => {
    if (state.series !== "" && state.title !== "") {
      let episode = state;
      createEpisode(state)
        .unwrap()
        .catch((error) => props.changeMessage(error.message))
        .then((result) => {
          episode.id = result.id;
          updateFiles(episode)
            .unwrap()
            .then((payload) => props.changeMessage(payload.message))
            .catch((error) => props.changeMessage(error.message))
            .then(resetInput());
        });
    }
  };

  const updateVideo = () => {
    updateEpisode({
      id: props.selected.id,
      ...(state.title !== props.selected.title && { title: state.title }),
      ...(state.series !== props.selected.series && {
        series: state.series,
      }),
      ...(state.director !== props.selected.director && {
        director: state.director,
      }),
      ...(state.genre !== props.selected.genre && { genre: state.genre }),
      ...(state.year !== props.selected.year && { year: state.year }),
      ...(state.fsk !== props.selected.fsk && {
        fsk: state.fsk,
      }),
      ...(state.season !== props.selected.season && {
        season: state.season,
      }),
      ...(state.episode !== props.selected.episode && {
        episode: state.episode,
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
    deleteEpisode(props.selected)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message))
      .then(resetInput());
  };

  const resetInput = async () => {
    updateState({
      id: "",
      series: "",
      title: "",
      director: "",
      genre: "",
      year: "",
      fsk: "",
      season: "",
      episode: "",
      runtime: "",
      actors: "",
      plot: "",
      poster: "",
      theme: "",
      german: "",
      english: "",
      changes: 0,
    });
    //
    let fields = document
      .getElementById("episode_form")
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
      <div id="episode_form" className={styles.form}>
        <div className={styles.omdbRow}>
          <div className={styles.longBox}>
            <label>Series</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.series || ""}
              onChange={(e) => updateState({ series: e.target.value })}
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
                  series: state.series,
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
            <label>Title</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.title || ""}
              onChange={(e) => updateState({ title: e.target.value })}
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
              <label>Season</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.season || ""}
                onChange={(e) => updateState({ season: e.target.value })}
              ></input>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Episode</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.episode || ""}
                onChange={(e) => updateState({ episode: e.target.value })}
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
            <label>Theme</label>
            <input
              id="theme"
              type="file"
              hidden
              onChange={(e) => updateState({ theme: e.target.files[0].path })}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={state.theme || ""}
              readOnly
            ></input>
          </div>
          {state.theme !== "" ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => updateState({ theme: "" })}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="theme"></label>
              <label
                className={styles.undoneBtn}
                onClick={() =>
                  updateState({
                    theme: props.selected && props.selected.theme,
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

export default EpisodeForm;
