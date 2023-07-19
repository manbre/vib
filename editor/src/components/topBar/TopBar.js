import React from "react";
import styles from "./TopBar.module.css";

const TopBar = () => {
  return (
    <div className={styles.container}>
      <label className={styles.logo}></label>
      <div className={styles.dragBar}></div>
      <div className={styles.buttonsBar}>
        <button className={styles.minBtn}></button>
        <button className={styles.maxBtn}></button>
        <button className={styles.closeBtn}></button>
      </div>
    </div>
  );
};

export default TopBar;
