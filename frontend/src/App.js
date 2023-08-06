import { useState, useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-loading";
import { useSelector, useDispatch } from "react-redux";
import useUnload from "./hooks/useUnload";
import useWebSocket from "./hooks/useWebSocket";

import Home from "./pages/home/Home";
import Watch from "./pages/watch/Watch";

const App = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const [isFrontend, setIsFrontend] = useState(false);

  //------------------------------------------------------------------------------------
  //WebSocket
  const [ready, val, send] = useWebSocket();

  useEffect(() => {
    if (ready) {
      /*       !isFrontend && send(JSON.stringify("frontend is off"));
      isFrontend && send(JSON.stringify("frontend is on")); */
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
