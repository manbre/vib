import React, { useRef } from "react";

const VideoPlayer = ({ type, videoId }) => {
  const videoRef = useRef(null);

  /*   useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  }); */

  return (
    <video ref={videoRef} autoPlay loop muted>
      <source
        src={`http://localhost:9000/stream/video/1/${type}/${videoId}`}
        type="video/mp4"
      ></source>
      Your browser does not support the video tag
    </video>
  );
};

export default VideoPlayer;
