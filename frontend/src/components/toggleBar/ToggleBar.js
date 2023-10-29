import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ToggleBar.module.css";
import { toggleType } from "../../features/view";
import { selectVideo } from "../../features/video";
import { selectGenre } from "../../features/video";

const ToggleBar = () => {
  const dispatch = useDispatch();
  const genre = useSelector((state) => state.video.genre);


  const selectType = (type) =>{
    genre === "All" ? dispatch(selectGenre("0")) : dispatch(selectGenre("All"));
    dispatch(selectVideo(null));
    dispatch(toggleType(type));
  }


  return (
    <div className={styles.container}>
      <input
        id="toggleOn"
        className={styles.toggleLeft}
        name="toggle"
        type="radio"
        defaultChecked
      />
      <label
        htmlFor="toggleOn"
        className={styles.btn}
        onClick={() => selectType(1)}
      >
        Movies
      </label>
      <input
        id="toggleOff"
        className={styles.toggleRight}
        name="toggle"
        type="radio"
      />
      <label
        htmlFor="toggleOff"
        className={styles.btn}
        onClick={() => selectType(2)}
      >
        Shows
      </label>
    </div>
  );
};

export default ToggleBar;
