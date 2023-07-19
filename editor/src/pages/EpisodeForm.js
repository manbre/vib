import React from "react";
import { useState, useEffect } from "react";
import styles from "./Form.module.css";
import MessageBox from "../components/messageBox/MessageBox";

import {
  useGetOMDBDataQuery,
  useCreateNewEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
  useCopyEpisodeFilesMutation,
} from "../features/api";

const EpisodeForm = (props) => {
  //
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  //
  const [year, setYear] = useState("");
  const [episode, setEpisode] = useState("");
  const [season, setSeason] = useState("");
  const [awards, setAwards] = useState("");
  const [runtime, setRuntime] = useState("");
  //
  const [actors, setActors] = useState("");
  const [plot, setPlot] = useState("");
  //
  const [poster, setPoster] = useState("");
  const [theme, setTheme] = useState("");
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");


  const [createEpisode] = useCreateNewEpisodeMutation();
  const [updateEpisode] = useUpdateEpisodeMutation();
  const [deleteEpisode] = useDeleteEpisodeMutation();
  const [copyEpisode] = useCopyEpisodeFilesMutation();

  const { data: OMDBData, isSuccess: isOMDB } = useGetOMDBDataQuery({
    title: series,
    year: year,
  });

  useEffect(() => {
    isOMDB && setPoster(OMDBData.Poster);
  }, [OMDBData]);

  const loadOMDBData = () => {
    let data = OMDBData;
    setSeries(data.Title.replace(":", " - "));
    setDirector(data.Director);
    setGenre(data.Genre);
    setActors(data.Actors);
    setPlot(data.Plot);
    setYear(data.Year);
    setAwards(
      data.Awards.includes("Emmys") ? data.Awards.substring(3, 6) : "0"
    );
    setRuntime(data.Runtime.slice(0, 3));
    setPoster(data.Poster);
  };

  const createVideo = () => {
    title !== "" &&
      createEpisode({
        series: series,
        title: title,
        director: director,
        genre: genre,
        actors: actors,
        plot: plot,
        //
        year: year,
        episode: episode,
        season: season,
        awards: awards,
        runtime: runtime,
        //
        poster: poster,
        theme: theme,
        german: german,
        english: english,
      })
        .unwrap()
        .then((payload) => props.changeMessage(payload.message))
        .catch((error) => props.changeMessage(error.message))
        .then(copyFiles());
    resetInput();
  };

  const updateVideo = () => {
    copyFiles();
    updateEpisode({
      id: selectedVideo.id,
      //
      ...(title !== selectedVideo.title ? { title: title } : {}),
      ...(series !== selectedVideo.series ? { series: series } : {}),
      ...(director !== selectedVideo.director ? { director: director } : {}),
      ...(genre !== selectedVideo.genre ? { genre: genre } : {}),
      //
      ...(year !== selectedVideo.year ? { year: year } : {}),
      ...(episode !== selectedVideo.episode ? { episode: episode } : {}),
      ...(season !== selectedVideo.season ? { season: season } : {}),
      ...(awards !== selectedVideo.awards ? { awards: awards } : {}),
      ...(runtime !== selectedVideo.runtime ? { runtime: runtime } : {}),
      //
      ...(actors !== selectedVideo.actors ? { actors: actors } : {}),
      ...(plot !== selectedVideo.plot ? { plot: plot } : {}),
      //
      ...(poster !== selectedVideo.poster ? { poster: poster } : {}),
      ...(theme !== selectedVideo.theme ? { theme: theme } : {}),
      ...(german != selectedVideo.german ? { german: german } : {}),
      ...(english !== selectedVideo.english ? { english: english } : {}),
    })
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message));
    resetInput();
  };

  const deleteVideo = () => {
    deleteEpisode(selectedVideo.id)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message));
  };

  const copyFiles = () => {
    if (poster != null || theme != null || german != null || english != null) {
    }
    copyEpisode({
      series: series,
      season: season,
      episode: episode,
      poster: poster,
      theme: theme,
      german: german,
      english: english,
    });
  };

  const resetInput = () => {
    setSeries("");
    setTitle("");
    setDirector("");
    setGenre("");
    setActors("");
    setPlot("");
    //
    setYear("");
    setEpisode("");
    setSeason("");
    setAwards("");
    setRuntime("");
    //
    setPoster("");
    setTheme("");
    setGerman("");
    setEnglish("");
    //
    let fields = document
      .getElementById("episode_form")
      .getElementsByTagName("input");
    for (let i = 0; i < fields.length; i++) {
      fields[i].value = "";
    }
    document.getElementsByTagName("textarea").value = "";
  };

  const handleFileChange = (e) => {
    switch (e.target.id) {
      case "poster":
        setPoster(e.target.files[0].path);
        break;
      case "theme":
        setTheme(e.target.files[0].path);
        break;
      case "german":
        setGerman(e.target.files[0].path);
        break;
      case "english":
        setEnglish(e.target.files[0].path);
        break;
    }
  };

  props.childRef.current = {
    createVideo: createVideo,
    updateVideo: updateVideo,
    deleteVideo: deleteVideo,
  };

  return (
    <div className={styles.container}>
      <div id="episode_form" className={styles.form}>
        <label className={styles.poster}>
          <img
            src={poster}
            onError={(event) =>
              (event.target.src = require("../assets/images/placeholder.jpg").default)
            }
            onLoad={(event) => (event.target.style.display = "inline-block")}
          />
        </label>
        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Poster</label>
            <input
              id="poster"
              type="file"
              hidden
              onChange={(e) => handleFileChange(e)}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={poster}
              readOnly
            ></input>
          </div>
          {poster !== "" && poster !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => setPoster("")}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="poster"></label>

              <label
                className={styles.undoneBtn}
                onClick={() => setPoster(selectedVideo.poster)}
              ></label>
            </>
          )}
        </div>
        <div className={styles.omdbRow}>
          <div className={styles.longBox}>
            <label>Title of series</label>
            <input
              className={styles.lineInput}
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            ></input>
          </div>
          <div className={styles.shortBox}>
            <label>Year</label>
            <input
              className={styles.lineInput}
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            ></input>
          </div>
          <button className={styles.omdbBtn} onClick={loadOMDBData}></button>
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Title</label>
            <input
              className={styles.lineInput}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className={styles.longBox}>
            <label>Director</label>
            <input
              className={styles.lineInput}
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            ></input>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Genre</label>
            <input
              className={styles.lineInput}
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            ></input>
          </div>
          <div className={styles.longBox}>
            <label>Actors</label>
            <input
              className={styles.lineInput}
              type="text"
              value={actors}
              onChange={(e) => setActors(e.target.value)}
            ></input>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Season</label>
              <input
                className={styles.lineInput}
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              ></input>
            </div>
            <div className={styles.shortBox}>
              <label>Episode</label>
              <input
                className={styles.lineInput}
                type="text"
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
              ></input>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Awards</label>
              <input
                className={styles.lineInput}
                type="text"
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
              ></input>
            </div>
            <div className={styles.shortBox}>
              <label>Runtime</label>
              <input
                className={styles.lineInput}
                type="text"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
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
              onChange={(e) => handleFileChange(e)}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={theme}
              readOnly
            ></input>
          </div>
          {theme !== "" && theme !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => setTheme("")}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="theme"></label>
              <label
                className={styles.undoneBtn}
                onClick={() => setTheme(selectedVideo.theme)}
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
              onChange={(e) => handleFileChange(e)}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={german}
              readOnly
            ></input>
          </div>
          {german !== "" && german !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => setGerman("")}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="german"></label>
              <label
                className={styles.undoneBtn}
                onClick={() => setGerman(selectedVideo.german)}
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
              onChange={(e) => handleFileChange(e)}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={english}
              readOnly
            ></input>
          </div>
          {english !== "" && english !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => setEnglish("")}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="english"></label>
              <label
                className={styles.undoneBtn}
                onClick={() => setEnglish(selectedVideo.English)}
              ></label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeForm;
