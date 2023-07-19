import React from "react";
import { useEffect } from "react";
import styles from "./MessageBox.module.css";

const MessageBox = ({ message }) => {

  useEffect(() => {
    message !== "" &&
      (document.getElementById("messageBox").style = "display: flex");
    setTimeout(() => {
      document.getElementById("messageBox").style = "display: none";
    }, 2500);
  }, [message]);

  return (
    <div id="messageBox" className={styles.container}>
      <p>{message}</p>
    </div>
  );
};

export default MessageBox;
