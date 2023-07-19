import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Form.module.css";

import {
  useGetOMDBDataQuery,
  useCreateNewMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useCopyMovieFilesMutation,
} from "../features/api";

const MovieForm = (props) => {
  //
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  //
  const [year, setYear] = useState("");
  const [part, setPart] = useState("");
  const [awards, setAwards] = useState("");
  const [rating, setRating] = useState("");
  const [runtime, setRuntime] = useState("");
  //
  const [actors, setActors] = useState("");
  const [plot, setPlot] = useState("");
  //
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");


  const [createMovie] = useCreateNewMovieMutation();
  const [updateMovie] = useUpdateMovieMutation();
  const [deleteMovie] = useDeleteMovieMutation();
  const [copyMovie] = useCopyMovieFilesMutation();

  const selectedVideo = useSelector((state) => state.video.video);

  const { data: OMDBData, isSuccess: isOMDB } = useGetOMDBDataQuery({
    title: title,
    year: year,
  });

  useEffect(() => {
    isOMDB && setPoster(OMDBData.Poster);
  }, [OMDBData]);

  useEffect(() => {
    resetInput();
    if (selectedVideo) {
      setTitle(selectedVideo.title),
        setSeries(selectedVideo.series),
        setDirector(selectedVideo.director),
        setGenre(selectedVideo.genre),
        setActors(selectedVideo.actors),
        setPlot(selectedVideo.plot),
        //
        setYear(selectedVideo.year),
        setAwards(selectedVideo.awards),
        setRating(selectedVideo.rating),
        setRuntime(selectedVideo.runtime),
        //
        setPoster(selectedVideo.poster),
        setTrailer(selectedVideo.trailer),
        setGerman(selectedVideo.german),
        setEnglish(selectedVideo.english);
    }
  }, [selectedVideo]);

  const loadOMDBData = () => {
    let data = OMDBData;
    setTitle(data.Title.replace(":", " - "));
    setDirector(data.Director);
    setGenre(data.Genre);
    setActors(data.Actors);
    setPlot(data.Plot);
    setYear(data.Year);
    setAwards(
      data.Awards.includes("Oscar") && !data.Awards.includes("Nominated")
        ? data.Awards.substring(3, 6)
        : "0"
    );
    setRating(data.Ratings[1].Value.substring(0, 2));
    setRuntime(data.Runtime.slice(0, 3));
    setPoster(data.Poster);
  };

  const createVideo = () => {
    title !== "" &&
      createMovie({
        title: title,
        series: series ? series : title,
        director: director,
        genre: genre,
        actors: actors,
        plot: plot,
        //
        year: year,
        part: part,
        awards: awards,
        rating: rating,
        runtime: runtime,
        //
        poster: poster,
        trailer: trailer,
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
    updateMovie({
      id: selectedVideo.id,
      //
      ...(title != selectedVideo.title
        ? { title: title }
        : { title: selectedVideo.title }),
      ...(series != selectedVideo.series ? { series: series } : {}),
      ...(director != selectedVideo.director ? { director: director } : {}),
      ...(genre != selectedVideo.genre ? { genre: genre } : {}),
      //
      ...(year != selectedVideo.year ? { year: year } : {}),
      ...(part != selectedVideo.part ? { part: part } : {}),
      ...(awards != selectedVideo.awards ? { awards: awards } : {}),
      ...(rating != selectedVideo.rating ? { rating: rating } : {}),
      ...(runtime != selectedVideo.runtime ? { runtime: runtime } : {}),
      //
      ...(actors != selectedVideo.actors ? { actors: actors } : {}),
      ...(plot != selectedVideo.plot ? { plot: plot } : {}),
      //
      ...(poster != selectedVideo.poster ? { poster: poster } : {}),
      ...(trailer != selectedVideo.trailer ? { trailer: trailer } : {}),
      ...(german != selectedVideo.german ? { german: german } : {}),
      ...(english != selectedVideo.english ? { english: english } : {}),
    })
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message));
    resetInput();
  };

  const deleteVideo = () => {
    deleteMovie(selectedVideo.id)
      .unwrap()
      .then((payload) => props.changeMessage(payload.message))
      .catch((error) => props.changeMessage(error.message));
  };

  const copyFiles = () => {
    if (
      poster != null ||
      trailer != null ||
      german != null ||
      english != null
    ) {
    }
    copyMovie({
      title: title,
      poster: poster,
      trailer: trailer,
      german: german,
      english: english,
    });
  };

  const resetInput = () => {
    setTitle("");
    setSeries("");
    setDirector("");
    setGenre("");
    setActors("");
    setPlot("");
    //
    setYear("");
    setPart("");
    setAwards("");
    setRating("");
    setRuntime("");
    //
    setPoster("");
    setTrailer("");
    setGerman("");
    setEnglish("");
    //
    let fields = document
      .getElementById("movie_form")
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
      case "trailer":
        setTrailer(e.target.files[0].path);
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
      <div id="movie_form" className={styles.form}>
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
            <label>Title</label>
            <input
              className={styles.lineInput}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label>Title of series</label>
            <input
              className={styles.lineInput}
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
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
              <label>Part</label>
              <input
                className={styles.lineInput}
                type="text"
                value={part}
                onChange={(e) => setPart(e.target.value)}
              ></input>
            </div>
            <div className={styles.shortBox}>
              <label>Awards</label>
              <input
                className={styles.lineInput}
                type="text"
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
              ></input>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.shortBox}>
              <label>Rating</label>
              <input
                className={styles.lineInput}
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
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
            <label>Trailer</label>
            <input
              id="trailer"
              type="file"
              hidden
              onChange={(e) => handleFileChange(e)}
            ></input>
            <input
              className={styles.fileInput}
              type="text"
              value={trailer}
              readOnly
            ></input>
          </div>
          {trailer !== "" && trailer !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => setTrailer("")}
            ></label>
          ) : (
            <>
              <label className={styles.sourceBtn} htmlFor="trailer"></label>
              <label
                className={styles.undoneBtn}
                onClick={() => setTrailer(selectedVideo.trailer)}
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

export default MovieForm;
