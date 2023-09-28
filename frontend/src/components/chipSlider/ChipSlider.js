import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ChipSlider.module.css";
import { selectGenre } from "../../features/video";
import { selectVideo } from "../../features/video";
import {
  useGetMovieGenresQuery,
  useGetEpisodeGenresQuery,
} from "../../features/backend";

const ChipSlider = () => {
  let scroll = useRef(null);
  const [scrolled, setScrolled] = useState(0);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [lastEventTarget, setLastEventTarget] = useState([]);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);
  
  const { data: movieGenres } = useGetMovieGenresQuery();
  const { data: episodeGenres } = useGetEpisodeGenresQuery();

  window.addEventListener("resize", () => {
    checkScroll();
  });
  useEffect(() => {
    checkScroll();
  }, []);

  useEffect(() => {
    switch (viewType) {
      case 1:
        movieGenres && setGenres(movieGenres ?? []);
        break;
      case 2:
        episodeGenres && setGenres(episodeGenres ?? []);
        break;
      default:
    }
  }, [viewType, movieGenres, episodeGenres]);

  const slide = (width) => {
    scroll.current.scrollLeft += width;
    setScrolled(scrolled + width);
    Math.floor(scroll.current.scrollWidth - scroll.current.scrollLeft) <=
    scroll.current.offsetWidth
      ? setIsScrollEnd(true)
      : setIsScrollEnd(false);
  };

  const checkScroll = () => {
    scroll.current && setScrolled(scroll.current.scrollLeft);
    scroll.current &&
    Math.floor(scroll.current.scrollWidth - scroll.current.scrollLeft) <=
      scroll.current.offsetWidth
      ? setIsScrollEnd(true)
      : setIsScrollEnd(false);
  };

  useEffect(() => {
    scroll.current &&
    scroll?.current?.scrollWidth === scroll?.current?.offsetWidth
      ? setIsScrollEnd(true)
      : setIsScrollEnd(false);
    return () => {};
  }, [scroll?.current?.scrollWidth, scroll?.current?.offsetWidth]);

  useEffect(() => {
    if (selectedGenre === "All" || selectedGenre === "0") {
      document.getElementById("all").click();
    }
  }, [selectedGenre]);

  const styleSelectedChip = (event) => {
    lastEventTarget.style =
      "background: rgb(var(--menu-color)); color: rgb(var(prim-text));";
    var chip = event.target;
    chip.style =
      "background: rgb(var(--sec-text)); color: rgb(var(--menu-color));";
    var genre = chip.innerText;
    setLastEventTarget(chip);
    dispatch(selectVideo(null));
    dispatch(selectGenre(genre));
  };

  const styleOverChip = (event) => {
    event.target !== lastEventTarget &&
      (event.target.style = "background: rgb(var(--hover-color));");
  };

  const styleOutChip = (event) => {
    event.target !== lastEventTarget &&
      (event.target.style = "background: rgb(var(--menu-color));");
  };

  return (
    <div className={styles.container}>
      {scrolled !== 0 && (
        <button className={styles.prev} onClick={() => slide(-150)}>
          &#10094;
        </button>
      )}
      <ul className={styles.list} ref={scroll} onScroll={checkScroll}>
        <button
          id="recent"
          className={styles.recent}
          onClick={(e) => styleSelectedChip(e)}
          onMouseOver={(e) => styleOverChip(e)}
          onMouseOut={(e) => styleOutChip(e)}
        >
          Recent
        </button>
        <button
          id="all"
          className={styles.chip}
          onClick={(e) => styleSelectedChip(e)}
          onMouseOver={(e) => styleOverChip(e)}
          onMouseOut={(e) => styleOutChip(e)}
        >
          All
        </button>
        {Array.from(genres).map((genre, key) => (
          <button
            className={styles.chip}
            key={key}
            onClick={(e) => styleSelectedChip(e)}
            onMouseOver={(e) => styleOverChip(e)}
            onMouseOut={(e) => styleOutChip(e)}
          >
            {genre}
          </button>
        ))}
      </ul>
      {!isScrollEnd && (
        <button className={styles.next} onClick={() => slide(+150)}>
          &#10095;
        </button>
      )}
    </div>
  );
};

export default ChipSlider;
