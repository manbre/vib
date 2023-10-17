import { useState, useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-loading";
import { useSelector, useDispatch } from "react-redux";


import Home from "./pages/home/Home";
import Watch from "./pages/watch/Watch";

const App = () => {
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const [isFrontend, setIsFrontend] = useState(false);

  //------------------------------------------------------------------------------------
  //WebSocket


  /*   window.onload = () => {
    setIsFrontend(true);
  }; */
/* 
  useUnload((e) => {
    e.preventDefault();
    setIsFrontend(false);
  }); */

  //------------------------------------------------------------------------------------

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:isContinue" element={<Watch />} />
      </Routes>
    </Router>
  );
};

export default App;
