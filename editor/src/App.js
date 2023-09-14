import React from "react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./App.module.css";
import TopBar from "./components/topBar/TopBar";
import TabBar from "./components/tabBar/TabBar";
import MessageBox from "./components/messageBox/MessageBox";
import MovieForm from "./pages/MovieForm";
import EpisodeForm from "./pages/EpisodeForm";
import SourceForm from "./pages/SourceForm";
import useWebSocket from "./hooks/useWebSocket";
import { useGetMovieByIdQuery } from "./features/backend";
import { setEvent } from "./features/view";

const App = () => {
  const dispatch = useDispatch();
  const movieEditor = useRef();
  const episodeEditor = useRef();

  const [box, setBox] = useState("");
  const [type, setType] = useState(1);
  const [id, setId] = useState(null);

  const event = useSelector((state) => state.view.event);
  const { data: selectedMovie } = useGetMovieByIdQuery(id && type === 1 && id);

  //------------------------------------------------------------------------------------
  //WebSocket
  const [isReady, val, send] = useWebSocket();

  useEffect(() => {
    val?.id && setId(val.id);
    val?.type && setType(val.type);
  }, [val]);

  useEffect(() => {
    console.log(event && event.name);
    isReady && send(JSON.stringify(event));
  }, [event, isReady]);

  const handleSubmit = () => {
    dispatch(setEvent({ name: "change", type: 1, value: null }));
    if (selectedMovie) {
      type === 1 && movieEditor.current.updateVideo();
      type === 2 && episodeEditor.current.updateVideo();
    } else {
      type === 1 && movieEditor.current.createVideo();
      type === 2 && episodeEditor.current.createVideo();
    }
  };

  const handleDelete = () => {
    dispatch(setEvent({ name: "change", type: 1, value: null }));
    if (selectedMovie) {
      type === 1 && movieEditor.current.deleteVideo();
      type === 2 && episodeEditor.current.deleteVideo();
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
          selected={selectedMovie}
          changeMessage={(message) => setBox(message)}
          childRef={movieEditor}
        />
      ) : type === 2 ? (
        <EpisodeForm
          selected={selectedMovie}
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
