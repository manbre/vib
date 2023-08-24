import React, { useEffect } from "react";
import { useRef, useState } from "react";
import styles from "./App.module.css";
import TopBar from "./components/topBar/TopBar";
import TabBar from "./components/tabBar/TabBar";
import MessageBox from "./components/messageBox/MessageBox";
import MovieForm from "./pages/MovieForm";
import EpisodeForm from "./pages/EpisodeForm";
import SourceForm from "./pages/SourceForm";
import useWebSocket from "./hooks/useWebSocket";
import { useGetMovieByIdQuery } from "./features/backend";

const App = () => {
  const movieEditor = useRef();
  const episodeEditor = useRef();

  const [event, setEvent] = useState({
    name: null,
    type: null,
    value: null,
  });
  const [box, setBox] = useState("");
  const [type, setType] = useState(1);
  const [id, setId] = useState(null);

  const { data: selected } = useGetMovieByIdQuery(id && type === 1 && id);

  //------------------------------------------------------------------------------------
  //WebSocket
  const [isReady, val, send] = useWebSocket();

  useEffect(() => {
    val && val.id && setId(val.id);
    val && val.type && setType(val.type);
  }, [val]);

  useEffect(() => {
    event.name && isReady && send(JSON.stringify(event));
  }, [event, isReady]);

  const handleSubmit = () => {
    setEvent({ name: "change", type: type, value: null });
    if (selected) {
      type === 1 &&
        movieEditor.current
          .updateVideo()
          .then(setEvent({ name: "done", type: type, value: null }));
      type === 2 &&
        episodeEditor.current
          .updateVideo()
          .then(setEvent({ name: "done", type: type, value: null }));
    } else {
      type === 1 &&
        movieEditor.current
          .createVideo()
          .then(setEvent({ name: "done", type: type, value: null }));
      type === 2 &&
        episodeEditor.current
          .createVideo()
          .then(setEvent({ name: "done", type: type, value: null }));
    }
  };

  const handleDelete = () => {
    setEvent({ name: "change", type: type, value: null });
    if (selected) {
      type === 1 &&
        movieEditor.current
          .deleteVideo()
          .then(setEvent({ name: "done", type: type, value: null }));
      type === 2 &&
        episodeEditor.current
          .deleteVideo()
          .then(setEvent({ name: "done", type: type, value: null }));
    }
  };

  //------------------------------------------------------------------------------------

  return (
    <div className={styles.container}>
      <MessageBox message={box} />
      <TopBar />
      <TabBar />
      {type === 1 ? (
        <MovieForm
          selected={selected}
          changeMessage={(message) => setBox(message)}
          childRef={movieEditor}
        />
      ) : type === 2 ? (
        <EpisodeForm
          selected={selected}
          changeMessage={(message) => setBox(message)}
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
            onClick={() => handleSubmit()}
          ></button>
        </div>
      )}
    </div>
  );
};

export default App;
