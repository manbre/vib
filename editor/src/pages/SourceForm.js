import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { selectMovieSource } from "../features/source";
import { selectEpisodeSource } from "../features/source";

const SourceForm = () => {
  const movieSource = useSelector((state) => state.source.movieSource);
  const episodeSource = useSelector((state) => state.source.episodeSource);
  const dispatch = useDispatch();

  const changeMovieSource = async () => {
    let source = await electron.selectFolder();
    let encodedBtoA = btoa(location); //encode to base64
    writeLocation(encodedBtoA);
    dispatch(selectMovieSource(source));
  };

  const changeEpisodeSource = async () => {
    let source = await electron.selectFolder();
    let encodedBtoA = btoa(location); //encode to base64
    writeLocation(encodedBtoA);
    dispatch(selectEpisodeSource(source));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Movies</label>
            <input
              className={styles.lineInput}
              type="text"
              value={movieSource}
              readOnly
            ></input>
          </div>
          {movieSource !== "" && movieSource !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => dispatch(selectMovieSource(""))}
            ></label>
          ) : (
            <label
              className={styles.sourceBtn}
              onClick={(e) => changeMovieSource(e)}
            ></label>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.longBox}>
            <label>Episodes</label>
            <input
              className={styles.lineInput}
              type="text"
              value={episodeSource}
              readOnly
            ></input>
          </div>
          {episodeSource !== "" && episodeSource !== null ? (
            <label
              className={styles.sourceDeleteBtn}
              onClick={() => dispatch(selectEpisodeSource(""))}
            ></label>
          ) : (
            <label
              className={styles.sourceBtn}
              onClick={(e) => changeEpisodeSource(e)}
            ></label>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceForm;
