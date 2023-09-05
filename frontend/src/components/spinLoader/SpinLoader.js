import React from "react";
import styles from "./SpinLoader.module.css";

const SpinLoader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>loading...</div>
      <div className={styles.loader}></div>
    </div>
  );
};

export default SpinLoader;
