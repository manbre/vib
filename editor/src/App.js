import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./App.module.css";
import TopBar from "./components/topBar/TopBar";
import TabBar from "./components/tabBar/TabBar";
import MessageBox from "./components/messageBox/MessageBox";
import MovieForm from "./pages/MovieForm";
import EpisodeForm from "./pages/EpisodeForm";
import SourceForm from "./pages/SourceForm";
import { selectVideo } from "./features/video";
import { bringEvent } from "./features/event";
import { toggleFrontend } from "./features/view";

const App = () => {
  const movieEditor = useRef();
  const episodeEditor = useRef();

  const [box, setBox] = useState("");

  const type = useSelector((state) => state.view.type);
  const isFrontend = useSelector((state) => state.view.isFrontend);

  const event = useSelector((state) => state.event.event);

  const dispatch = useDispatch();

  //------------------------------------------------------------------------------------
  //WebSocket
  var socket;

  useEffect(() => {
    socket = new WebSocket("ws://127.0.0.1:8000");
  });

  useEffect(() => {
    socket.onmessage = (e) => {
      //parse object to JSON
      let arr = JSON.parse(e.data).data;
      let newData = "";
      arr.forEach((element) => {
        newData += String.fromCharCode(element);
      });
      let json = JSON.parse(newData);
      //

      console.log(json);

      //set info if frontend is there
      json.includes("frontend is on") && dispatch(toggleFrontend(true));
      json.includes("frontend is off") && dispatch(toggleFrontend(false));
    };
  }, [socket]);

  window.onload = () => {
    socket.onopen = () => {
      socket.send(JSON.stringify("editor is on"));
    };
    return () => socket.close();
  };

  //------------------------------------------------------------------------------------

  return (
    <div className={styles.container}>
      <MessageBox message={box} />
      <TopBar />
      <TabBar />
      {type === "movie" ? (
        <MovieForm
          changeMessage={(message) => setBox(message)}
          childRef={movieEditor}
        />
      ) : type === "episode" ? (
        <EpisodeForm
          changeMessage={(message) => setBox(message)}
          childRef={episodeEditor}
        />
      ) : (
        <SourceForm />
      )}
      {type !== "source" && (
        <div className={styles.btnsBar}>
          <button
            className={styles.deleteBtn}
            onClick={() =>
              type === "movie"
                ? movieEditor.current.deleteVideo()
                : episodeEditor.current.deleteVideo()
            }
          ></button>
          <button
            className={styles.submitBtn}
            onClick={() =>
              type === "movie"
                ? movieEditor.current.createVideo()
                : episodeEditor.current.createVideo()
            }
          ></button>
        </div>
      )}
    </div>
  );
};

export default App;
