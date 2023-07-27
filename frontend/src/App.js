import "./App.css";
import Home from "./pages/home/Home";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { bringEvent } from "./features/event";
import { toggleEditor } from "./features/view";
import useUnload from "./hooks/useUnload";
import useWebSocket from "./hooks/useWebSocket";

const App = () => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const event = useSelector((state) => state.event.event);
  const [isFrontend, setIsFrontend] = useState(false);

  //------------------------------------------------------------------------------------
  //WebSocket
  const [ready, val, send] = useWebSocket();

  useEffect(() => {
    val && console.log(val);
    val && val.name !== "" && dispatch(bringEvent(val));
  }, [val]);

  useEffect(() => {
    if (ready) {
      !isFrontend && send(JSON.stringify("frontend is off"));
      isFrontend && send(JSON.stringify("frontend is on"));
    }
  }, [ready, isFrontend]);

  useEffect(() => {
    ready &&
      send(
        JSON.stringify({
          name: "select",
          type: "movie",
          video: selectedVideo,
        })
      );
  }, [ready, selectedVideo]);

  window.onload = () => {
    setIsFrontend(true);
  };

  useUnload((e) => {
    e.preventDefault();
    setIsFrontend(false);
  });

  //------------------------------------------------------------------------------------

  return (
    <>
      <Home />
    </>
  );
};

export default App;
