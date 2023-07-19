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

const App = () => {
  const movieEditor = useRef();
  const episodeEditor = useRef();

  const [message, setMessage] = useState("");

  const type = useSelector((state) => state.type.type);

  const dispatch = useDispatch();

  //------------------------------------------------------------------------------------
  //WebSocket
  const ws = new WebSocket("ws://127.0.0.1:8000");
  ws.addEventListener("open", () => {
    console.log("editor is connected!");
  });

  ws.addEventListener("message", (e) => {
    const arr = JSON.parse(e.data).data;
    let newData = "";
    arr.forEach((element) => {
      newData += String.fromCharCode(element);
    });
    const json = JSON.parse(newData);
    console.log(json.event);
    console.log(json.type);
    console.log(json.video);
    dispatch(selectVideo(json.video));
  });
  //------------------------------------------------------------------------------------

  return (
    <div className={styles.container}>
      <MessageBox message={message} />
      <TopBar />
      <TabBar />
      {type === 1 ? (
        <MovieForm
          changeMessage={(message) => setMessage(message)}
          childRef={movieEditor}
        />
      ) : type === 2 ? (
        <EpisodeForm
          changeMessage={(message) => setMessage(message)}
          childRef={episodeEditor}
        />
      ) : (
        <SourceForm />
      )}
      {type !== 3 && (
        <div className={styles.btnsBar}>
          <button
            className={styles.deleteBtn}
            onClick={() => handleDelete()}
          ></button>
          <button
            className={styles.submitBtn}
            onClick={() =>
              type === 1
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
