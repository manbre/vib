import React from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./App.module.css";
import TopBar from "./components/topBar/TopBar";
import TabBar from "./components/tabBar/TabBar";
import MessageBox from "./components/messageBox/MessageBox";
import MovieForm from "./pages/MovieForm";
import EpisodeForm from "./pages/EpisodeForm";
import SourceForm from "./pages/SourceForm";
import useWebSocket from "./hooks/useWebSocket";
import {
  useGetMovieByIdQuery,
  useGetEpisodeByIdQuery,
} from "./features/backend";

const App = () => {
  const movieEditor = useRef();
  const episodeEditor = useRef();

  const [box, setBox] = useState("");
  const [type, setType] = useState(1);
  const [id, setId] = useState(null);
  const [isDataChanged, setisDataChanged] = useState(false);

  const {
    data: selectedMovie,
    refetch: refetchMovie,
  } = useGetMovieByIdQuery(id, { skip: type === 2 });
  const {
    data: selectedEpisode,
    refetch: refetchEpisode,
  } = useGetEpisodeByIdQuery(id, { skip: type === 1 });

  //------------------------------------------------------------------------------------
  //WebSocket
  const [isReady, val, send] = useWebSocket();

  useEffect(() => {
    val?.name === "select" && setId(val?.value);
    val?.name === "type" && setType(val?.value);
    type === 1 && refetchMovie();
    type === 2 && refetchEpisode();
  }, [val]);

  useEffect(() => {
    isReady && send(JSON.stringify({ name: "data", value: isDataChanged }));
  }, [isDataChanged]);

  const handleSubmit = () => {
    setisDataChanged(true);
    selectedMovie && type === 1 && movieEditor.current.updateVideo();
    selectedEpisode && type === 2 && episodeEditor.current.updateVideo();
    !selectedMovie && type === 1 && movieEditor.current.createVideo();
    !selectedEpisode && type === 2 && episodeEditor.current.createVideo();
  };

  const handleDelete = () => {
    setisDataChanged(true);
    selectedMovie && type === 1 && movieEditor.current.deleteVideo();
    selectedEpisode && type === 2 && episodeEditor.current.deleteVideo();
  };

  //------------------------------------------------------------------------------------

  return (
    <div className={styles.container}>
      <MessageBox message={box} />
      <TopBar />
      <TabBar changeType={(type) => setType(type)} />
      {type === 1 ? (
        <MovieForm
          selected={selectedMovie}
          changeMessage={(message) => setBox(message)}
          toggleChange={(isChange) => setisDataChanged(isChange)}
          childRef={movieEditor}
        />
      ) : type === 2 ? (
        <EpisodeForm
          selected={selectedEpisode}
          changeMessage={(message) => setBox(message)}
          toggleChange={(isChange) => setisDataChanged(isChange)}
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
