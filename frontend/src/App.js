import "./App.css";
import Home from "./pages/home/Home";

import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { bringEvent } from "./features/event";
import { toggleEditor } from "./features/view";
import useUnload from "./hooks/useUnload";

const App = () => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const event = useSelector((state) => state.event.event);

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

      //set info if editor is there
      json.includes("editor is on") && dispatch(toggleEditor(true));
      json.includes("editor is off") && dispatch(toggleEditor(false));
    };
  }, [socket]);

  useUnload((e) => {
    e.preventDefault();
    socket.send(JSON.stringify("frontend is off"));
  });

  window.onload = () => {
    socket.onopen = () => {
      socket.send(JSON.stringify("frontend is on"));
    };
    return () => socket.close();
  };

  useEffect(() => {
    socket.onopen = () => {
      selectedVideo &&
        socket.send(
          JSON.stringify({
            name: "select",
            type: "movie",
            video: selectedVideo,
          })
        );
    };
    return () => socket.close();
  }, [selectedVideo]);

  //------------------------------------------------------------------------------------

  return (
    <>
      <Home />
    </>
  );
};

export default App;
