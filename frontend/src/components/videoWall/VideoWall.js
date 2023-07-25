import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoWall.module.css";

import VideoCard from "../videoCard/VideoCard";

import { selectNext } from "../../features/video";
import { markCard } from "../../features/view";

import {
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
} from "../../features/backend";

const VideoWall = ({ filteredVideos, source }) => {
  const viewType = useSelector((state) => state.view.viewType);
  const selectedVideo = useSelector((state) => state.video.video);
  const event = useSelector((state) => state.event.event);

  const dispatch = useDispatch();

  const { data: allMovies } = useGetMoviesByGenreQuery("All");
  const { data: allEpisodes } = useGetSeasonsByGenreQuery("All");

  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        allMovies && setAllVideos(allMovies ?? []);
        break;
      case 2:
        allEpisodes && setAllVideos(allEpisodes ?? []);
        break;
      default:
    }
  }, [viewType, allMovies, allEpisodes, event]);

  useEffect(() => {
    let globalIndex =
      selectedVideo &&
      allVideos.findIndex((video) => video.id === selectedVideo.id);
    dispatch(selectNext(allVideos[globalIndex + 1]));
    let localIndex =
      selectedVideo &&
      filteredVideos.findIndex((video) => video.id === selectedVideo.id);
    dispatch(markCard(localIndex));
  }, [selectedVideo, allVideos, dispatch, filteredVideos]);

  return (
    <div className={styles.container}>
      {filteredVideos.map((video, index) => (
        <VideoCard video={video} source={source} key={video.id} index={index} />
      ))}
    </div>
  );
};

export default VideoWall;
