import React from "react";
import { useState, useEffect } from "react";
import styles from "./PreviewHero.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectVideo } from "../../features/video";

import {
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
} from "../../features/api";

const PreviewHero = () => {
  const [videos, setVideos] = useState([]);
  const viewType = useSelector((state) => state.view.viewType);
  const { data: movies } = useGetMoviesByGenreQuery("All");
  const { data: seasons } = useGetSeasonsByGenreQuery("All");
  const dispatch = useDispatch();

  useEffect(() => {
    switch (viewType) {
      case 1:
        movies && setVideos(movies ?? []);
        break;
      case 2:
        seasons && setVideos(seasons ?? []);
        break;
      default:
    }
  }, [viewType, movies, seasons]);

  useEffect(() => {
    document.getElementById("first").style.animationDuration =
      4 * videos.length + "s";
    document.getElementById("second").style.animationDuration =
      4 * videos.length + "s";
    document.getElementById("third").style.animationDuration =
      4 * videos.length + "s";
    document.getElementById("fourth").style.animationDuration =
      4 * videos.length + "s";
  }, [videos]);

  const getVideo = (video) => {
    dispatch(selectVideo(video));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.firstHalf}>
            <span id="first">
              {videos.map((video) => (
                <div
                  className={styles.frame}
                  key={video.id}
                  onClick={() => getVideo(video)}
                >
                  <img
                    alt="poster"
                    src={`http://localhost:9000/stream/${video.poster}`}
                    onError={(event) =>
                      (event.target.src = require("../../assets/images/placeholder.jpg").default)
                    }
                    onLoad={(event) =>
                      (event.target.style.display = "inline-block")
                    }
                  />
                </div>
              ))}
            </span>
          </div>
          <div className={styles.secondHalf}>
            <span id="second">
              {videos.map((video) => (
                <div
                  className={styles.frame}
                  key={video.id}
                  onClick={() => getVideo(video)}
                >
                  <img
                    alt="poster"
                    src={`http://localhost:9000/stream/${video.poster}`}
                    onError={(event) =>
                      (event.target.src = require("../../assets/images/placeholder.jpg").default)
                    }
                    onLoad={(event) =>
                      (event.target.style.display = "inline-block")
                    }
                  />
                </div>
              ))}
            </span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.thirdHalf}>
            <span id="third">
              {videos.map((video) => (
                <div
                  className={styles.frame}
                  key={video.id}
                  onClick={() => getVideo(video)}
                >
                  <img
                    alt="poster"
                    src={`http://localhost:9000/stream/${video.poster}`}
                    onError={(event) =>
                      (event.target.src = require("../../assets/images/placeholder.jpg").default)
                    }
                    onLoad={(event) =>
                      (event.target.style.display = "inline-block")
                    }
                  />
                </div>
              ))}
            </span>
          </div>
          <div className={styles.fourthHalf}>
            <span id="fourth">
              {videos.map((video) => (
                <div
                  className={styles.frame}
                  key={video.id}
                  onClick={() => getVideo(video)}
                >
                  <img
                    alt="poster"
                    src={`http://localhost:9000/stream/image/${video.poster}`}
                    onError={(event) =>
                      (event.target.src = require("../../assets/images/placeholder.jpg").default)
                    }
                    onLoad={(event) =>
                      (event.target.style.display = "inline-block")
                    }
                  />
                </div>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewHero;
