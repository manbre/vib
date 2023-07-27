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
import useWebSocket from "./hooks/useWebSocket";

const App = () => {
  const movieEditor = useRef();
  const episodeEditor = useRef();

  const [box, setBox] = useState("");

  const type = useSelector((state) => state.view.type);
  const event = useSelector((state) => state.event.event);
  const selected = useSelector((state) => state.video.video);

  const dispatch = useDispatch();

  //------------------------------------------------------------------------------------
  //WebSocket
  const [ready, val, send] = useWebSocket();

  useEffect(() => {
    val && console.log(val);
    val && val.name === "select" && dispatch(selectVideo(val.video));
    val === "frontend is on" && dispatch(toggleFrontend(true));
    val === "frontend is off" && dispatch(toggleFrontend(false));
  }, [val]);

  useEffect(() => {
    event && event.name !== "" && ready && send(JSON.stringify(event));
  }, [ready, event]);

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
                ? !selected
                  ? movieEditor.current.createVideo()
                  : movieEditor.current.updateVideo()
                : !selected
                ? episodeEditor.current.createVideo()
                : episodeEditor.current.updateVideo()
            }
          ></button>
        </div>
      )}
    </div>
  );
};

export default App;
