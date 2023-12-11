import React from "react";
import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import useOmdb from "../hooks/useOmdb";

import {
  useCreateSeasonMutation,
  useUpdateSeasonMutation,
  useDeleteSeasonMutation,
  useUpdateSeasonFilesMutation,
  //
  useCreateEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
  useUpdateEpisodeFilesMutation,
  //
  useGetSeasonByIdQuery,
  useGetOneEpisodeQuery,
  useGetAllEpisodesBySeasonQuery,
  useGetOneSeasonQuery,
} from "../features/backend";

const EpisodeForm = (props) => {
  const initialState = {
    //season
    series: "",
    creator: "",
    genre: "",
    year: "",
    fsk: 0,
    seasonNr: "",
    actors: "",
    poster: "",
    teaser: "",
    changes: 0,
    //=================================================================================================
    //episode
    title: "",
    episodeNr: "",
    runtime: "",
    plot: "",
    german: "",
    english: "",
  };
  const [state, updateState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const [createSeason] = useCreateSeasonMutation();
  const [
    updateSeason,
    { isSuccess: isSeasonUpdated },
  ] = useUpdateSeasonMutation();
  const [
    deleteSeason,
    { isSuccess: isSeasonDeleted },
  ] = useDeleteSeasonMutation();
  const [
    updateSeasonFiles,
    { isSuccess: areSeasonFilesUpdated },
  ] = useUpdateSeasonFilesMutation();
  //=================================================================================================
  const [createEpisode] = useCreateEpisodeMutation();
  const [
    updateEpisode,
    { isSuccess: isEpisodeUpdated },
  ] = useUpdateEpisodeMutation();
  const [
    deleteEpisode,
    { isSuccess: isEpisodeDeleted },
  ] = useDeleteEpisodeMutation();
  const [
    updateEpisodeFiles,
    { isSuccess: areEpisodeFilesUpdated },
  ] = useUpdateEpisodeFilesMutation();

  useEffect(() => {
    isEpisodeUpdated && props.toggleChange(false);
    areEpisodeFilesUpdated && props.toggleChange(false);
  }, [isEpisodeUpdated, areEpisodeFilesUpdated]);

  useEffect(() => {
    isEpisodeDeleted && props.toggleChange(false);
  }, [isEpisodeDeleted]);

  const { data: listedSeason } = useGetSeasonByIdQuery(
    props.selected?.seasonId
  );
  const { data: oneSeason } = useGetOneSeasonQuery({
    series: state.series,
    seasonNr: state.seasonNr,
  });

  useEffect(() => {
    resetInput();
    console.log(props.selected);
    console.log(props.selected?.seasonId);
    console.log(listedSeason ?? []);
    if (props.selected) {
      let season = listedSeason;
      let episode = props.selected;
      updateState({
        //season
        series: season?.series,
        creator: season?.creator,
        genre: season?.genre,
        year: season?.year,
        seasonNr: season?.seasonNr,
        fsk: season?.fsk,
        actors: season?.actors,
        poster: season?.poster,
        teaser: season?.teaser,
        //episode
        title: episode.title,
        episodeNr: episode.episodeNr,
        runtime: episode.runtime,
        plot: episode.plot,
        german: episode.german,
        english: episode.english,
      });
    }
  }, [props.selected]);

  const { data: listedEpisodes } = useGetAllEpisodesBySeasonQuery(
    props.selected?.seasonId
  );

  const { omdbData, fetchOmdb } = useOmdb();

  useEffect(() => {
    omdbData &&
      updateState({
        series: omdbData.Title && omdbData.Title.replace(":", " - "),
        creator: omdbData.Director && omdbData.Director,
        genre: omdbData.Genre && omdbData.Genre,
        year: omdbData.Year && omdbData.Year,
        actors: omdbData.Actors && omdbData.Actors,
        poster: omdbData.Poster && omdbData.Poster,
      });
  }, [omdbData]);

  const createVideo = () => {
    console.log(state.series + " , " + state.seasonNr);
    let arr = oneSeason ?? [];
    console.log(arr)
    console.log(arr.length)
    console.log(arr.length === 0)
    if (arr.length === 0) {
      let season = state;
      createSeason(season)
        .unwrap()
        .catch((error) => props.changeMessage(error.message))
        .then((result) => {
          season.id = result.id;
          updateSeasonFiles(season)
            .unwrap()
            .then((payload) => props.changeMessage(payload.message))
            .catch((error) => props.changeMessage(error.message))
            .then(resetInput());
          //=================================================================================================
          let episode = state;
          episode.seasonId = season.id;
          console.log(season.id);
          createEpisode(episode)
            .unwrap()
            .catch((error) => props.changeMessage(error.message))
            .then((result) => {
              episode.id = result.id;
              updateEpisodeFiles(episode)
                .unwrap()
                .then((payload) => props.changeMessage(payload.message))
                .catch((error) => props.changeMessage(error.message))
                .then(resetInput());
            });
        });
    } else {
      let episode = state;
      let arr = oneSeason ?? [];
      episode.seasonId = arr[0].id;
      createEpisode(episode)
        .unwrap()
        .catch((error) => props.changeMessage(error.message))
        .then((result) => {
          episode.id = result.id;
          updateEpisodeFiles(episode)
            .unwrap()
            .then((payload) => props.changeMessage(payload.message))
            .catch((error) => props.changeMessage(error.message))
            .then(resetInput());
        });
    }
  };

  const updateVideo = () => {
    updateSeason({
      id: props.selected.seasonId,
      ...(state.series !== listedSeason.series && {
        series: state.series,
      }),
      ...(state.creator !== listedSeason.creator && {
        creator: state.creator,
      }),
      ...(state.genre !== listedSeason.genre && {
        genre: state.genre,
      }),
      ...(state.year !== listedSeason.year && {
        year: state.year,
      }),
      ...(state.seasonNr !== listedSeason.seasonNr && {
        seasonNr: state.seasonNr,
      }),
      ...(state.actors !== listedSeason.actors && {
        actors: state.actors,
      }),
      changes: listedSeason.changes + 1,
    })
      .unwrap()
      .catch((error) => props.changeMessage(error.message));
    //
    updateSeasonFiles({
      id: props.selected.seasonId,
      ...(state.poster !== props.selected.poster && {
        poster: state.poster,
      }),
      ...(state.teaser !== props.selected.teaser && {
        teaser: state.teaser,
      }),
    })
      .unwrap()
      .catch((error) => props.changeMessage(error.message));
    //=================================================================================================
    updateEpisode({
      id: props.selected.id,
      ...(state.title !== props.selected.title && { title: state.title }),
      ...(state.episodeNr !== props.selected.episodeNr && {
        episodeNr: state.episodeNr,
      }),
      ...(state.runtime !== props.selected.runtime && {
        runtime: state.runtime,
      }),
      ...(state.plot !== props.selected.plot && { plot: state.plot }),
      changes: props.selected.changes + 1,
    })
      .unwrap()
      .catch((error) => props.changeMessage(error.message));
    //
    updateEpisodeFiles({
      id: props.selected.id,
      episode: state.episode,
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
    //=================================================================================================
    console.log(listedEpisodes ?? []);
    if (listedEpisodes ?? [].length === 0) {
      console.log("00000000000000000");
    }
  };

  const resetInput = async () => {
    updateState({
      //season
      series: "",
      creator: "",
      genre: "",
      year: "",
      seasonNr: "",
      fsk: 0,
      actors: "",
      poster: "",
      teaser: "",
      changes: 0,
      //=================================================================================================
      //episode
      title: "",
      episodeNr: "",
      runtime: "",
      plot: "",
      german: "",
      english: "",
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
                  title: state.series,
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
            <label>Creator</label>
            <input
              className={styles.lineInput}
              type="text"
              value={state.creator || ""}
              onChange={(e) => updateState({ creator: e.target.value })}
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
                value={state.seasonNr || ""}
                onChange={(e) => updateState({ seasonNr: e.target.value })}
              ></input>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Episode</label>
              <input
                className={styles.lineInput}
                type="text"
                value={state.episodeNr || ""}
                onChange={(e) => updateState({ episodeNr: e.target.value })}
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

export default EpisodeForm;
