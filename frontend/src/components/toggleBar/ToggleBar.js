import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
/* import { useNavigate } from "react-router-dom"; */
import styles from "./ToggleBar.module.css";
/* import { toggleType } from "../../features/view"; */
import { selectVideo } from "../../features/video";
import { selectGenre } from "../../features/video";

const ToggleBar = () => {
  const dispatch = useDispatch();
/*   const navigate = useNavigate(); */
  const genre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);

/*   useEffect(() => {
    dispatch(selectVideo(null));
    genre === "All" ? dispatch(selectGenre("0")) : dispatch(selectGenre("All"));
  }, [viewType, dispatch, genre]); */

/*   const changeToScreen = (type) => {
    switch (type) {
      case 1:
        navigate("/");
        dispatch(toggleType(1));
        break;
      case 2:
        navigate("/episodes");
        dispatch(toggleType(2));
        break;
    }
  }; */

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
/*         onClick={() => changeToScreen(1)} */
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
/*         onClick={() => changeToScreen(2)} */
      >
        TV Shows
      </label>
    </div>
  );
};

export default ToggleBar;
