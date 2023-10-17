import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VideoControl from "../../components/videoControl/VideoControl";
import Player from "react-player";
import { useParams } from "react-router-dom";
import styles from "./Watch.module.css";

const Watch = () => {
  const { isContinue } = useParams();
  const videoRef = React.createRef();
  const selectedVideo = useSelector((state) => state.video.video);
  const selectedNext = useSelector((state) => state.video.next);
  const selectedAudio = useSelector((state) => state.video.audio);

  const [isPlaying, setIsPlaying] = useState(true);
  const [seek, setSeek] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [timeTotal, setTimeTotal] = useState("00:00:00");
  const [volumeBar, setVolumeBar] = useState(70);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 32: // space
        e.preventDefault();
        isPlaying ? setIsPlaying(false) : setIsPlaying(true);
        break;
      case 37: //left arrow
        e.preventDefault();
        videoRef.current.seekTo(seek - 10);
        break;
      case 39: //right arrow
        e.preventDefault();
        videoRef.current.seekTo(seek + 10);
        break;
    }
  });

  useEffect(() => {
    selectedVideo && videoRef.current.seekTo(seek - 5);
    console.log(selectedVideo && selectedVideo.english);
    console.log(selectedVideo && selectedVideo.german);
  }, [selectedAudio]);

  useEffect(() => {
    /*      ? handleForward(getConvertedIntro(selectedVideo.intro)) */
    console.log(selectedVideo);
    if (isContinue === 1) {
      handleForward(selectedVideo && selectedVideo.elapsed_time);
    }
  }, []);

  //only for episode
  const getConvertedIntro = (intro) => {
    let integer = Math.floor(intro);
    let decimal = (intro - integer) / 0.6;
    return (integer + decimal) * 60;
  };

  const handleVolumeChange = (e) => {
   /*  setVolume(e.target.value / 100), setVolumeBar(e.target.value); */
  };

  const handleForward = (sec) => {
    setSeek(seek + sec);
    videoRef.current.seekTo(seek + sec);
  };

  const handleRewind = (sec) => {
    setSeek(seek - sec);
    videoRef.current.seekTo(seek - sec);
  };

  const handleOnProgress = (e) => {
    var sec = videoRef.current.getDuration();
    setDuration(sec);
    setSeek(e.playedSeconds);
    setTime(toTime(e.playedSeconds));
    setTimeTotal(toTime(sec));
  };

  const handleSeekChange = (e) => {
    setSeek(e.target.value);
    videoRef.current.seekTo(e.target.value);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const toTime = (sec) => {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  };

  return (
    <div className={styles.container}>
      <Player
        className={styles.video}
        url={
          selectedVideo
            ? selectedAudio === 1
              ? selectedVideo.german
                ? `http://localhost:9000/movies/video/german/${selectedVideo.german}`
                : `http://localhost:9000/movies/video/english/${selectedVideo.english}`
              : selectedAudio === 2
              ? selectedVideo.english
                ? `http://localhost:9000/movies/video/english/${selectedVideo.english}`
                : `http://localhost:9000/movies/video/german/${selectedVideo.german}`
              : ""
            : ""
        }
        width="100%"
        height="100%"
        volume={volume}
        muted={isMuted}
        ref={videoRef}
        playing={isPlaying}
        onProgress={handleOnProgress}
      ></Player>
      <VideoControl
        title={selectedVideo && selectedVideo.title}
        seek={seek}
        changeSeek={(seek) => videoRef.current.seekTo(seek)}
        time={time}
        timeTotal={timeTotal}
        playing={isPlaying}
        changePlaying={(isPlaying) => setIsPlaying(isPlaying)}
        volume={volumeBar}
        duration={duration}
        togglePlay={togglePlay}
        handleSeekChange={handleSeekChange}
        handleVolumeChange={handleVolumeChange}
        handleForward={() => handleForward(10)}
        handleRewind={() => handleRewind(10)}
      ></VideoControl>
    </div>
  );
};

export default Watch;
