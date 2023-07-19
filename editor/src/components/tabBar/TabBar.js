import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./TabBar.module.css";
import { toggleType } from "../../features/type";

const TabBar = () => {
  const type = useSelector((state) => state.type.type);
  const dispatch = useDispatch();

  useEffect(() => {
    let movieTab = document.getElementById("movieTab");
    let tvShowTab = document.getElementById("tvShowTab");
    let sourceTab = document.getElementById("sourceTab");
    switch (type) {
      case 1:
        movieTab.style =
          "background-color: rgb(var(--menu-color)); color: rgb(var(--primary-text));";
        tvShowTab.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        sourceTab.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        break;
      case 2:
        movieTab.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        tvShowTab.style =
          "background-color: rgb(var(--menu-color)); color: rgb(var(--primary-text));";
        sourceTab.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        break;
      case 3:
        movieTab.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        tvShowTab.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        sourceTab.style =
          "background-color: rgb(var(--menu-color)); color: rgb(var(--primary-text));";
    }
  }, [type]);

  return (
    <div className={styles.container}>
      <button id="movieTab" onClick={() => dispatch(toggleType(1))}>
        Movie
      </button>
      <button id="tvShowTab" onClick={() => dispatch(toggleType(2))}>
        TV Show
      </button>
      <button
        id="sourceTab"
        className={styles.sourceTab}
        onClick={() => dispatch(toggleType(3))}
      >
        Source
      </button>
    </div>
  );
};

export default TabBar;
