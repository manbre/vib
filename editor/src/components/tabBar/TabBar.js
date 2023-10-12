import React from "react";
import { useState, useEffect } from "react";
import styles from "./TabBar.module.css";

const TabBar = (props) => {
  const [type, setType] = useState(1);

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
    props.changeType(type);
  }, [type]);

  return (
    <div className={styles.container}>
      <button id="movieTab" onClick={() => setType(1)}>
        Movie
      </button>
      <button id="tvShowTab" onClick={() => setType(2)}>
        TV Show
      </button>
      <button
        id="sourceTab"
        className={styles.sourceTab}
        onClick={() => setType(3)}
      >
        Source
      </button>
    </div>
  );
};

export default TabBar;
