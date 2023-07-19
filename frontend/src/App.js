import "./App.css";
import Home from "./pages/home/Home";

import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.css";

const App = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);

  //------------------------------------------------------------------------------------
  //WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000");
    ws.addEventListener("open", () => {
      console.log("web is connected!");
      ws.send(
        JSON.stringify({
          event: "select",
          type: viewType,
          video: selectedVideo,
        })
      );
    });
    ws.addEventListener("message", (e) => {
      const arr = JSON.parse(e.data).data;
      let newData = "";
      arr.forEach((element) => {
        newData += String.fromCharCode(element);
      });
      const json = JSON.parse(newData);
      console.log(json);
    });
    //clean up function
    return () => ws.close();
  }, [selectedVideo]);
  //------------------------------------------------------------------------------------

  return (
    <>
      <Home />
    </>
  );
};

export default App;
