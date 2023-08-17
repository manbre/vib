import { useState, useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-loading";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./components/searchBar/SearchBar";
import ToggleBar from "./components/toggleBar/ToggleBar";
import ChipSlider from "./components/chipSlider/ChipSlider";
import useUnload from "./hooks/useUnload";
import useWebSocket from "./hooks/useWebSocket";

import Home from "./pages/home/Home";
import Watch from "./pages/watch/Watch";

const App = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const [isFrontend, setIsFrontend] = useState(false);

  //------------------------------------------------------------------------------------
  //WebSocket
  const [isReady, val, send] = useWebSocket();

  useEffect(() => {
    if (isReady) {
      /*       !isFrontend && send(JSON.stringify("frontend is off"));
      isFrontend && send(JSON.stringify("frontend is on")); */
    }
  }, [isReady, isFrontend]);

  useEffect(() => {
    isReady &&
      send(
        JSON.stringify({
          name: "selected",
          type: 1,
          id: selectedVideo && selectedVideo.id,
        })
      );
  }, [isReady, selectedVideo]);

  /*   window.onload = () => {
    setIsFrontend(true);
  }; */

  useUnload((e) => {
    e.preventDefault();
    setIsFrontend(false);
  });

  //------------------------------------------------------------------------------------

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*  <Route path="/episodes" element={<EpisodesScreen />} /> */}
        <Route path="/watch/:isContinue" element={<Watch />} />
      </Routes>
    </Router>
  );
};

export default App;
