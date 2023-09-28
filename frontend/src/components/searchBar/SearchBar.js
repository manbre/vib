import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SearchBar.module.css";
import { selectGenre } from "../../features/video";
import { selectTitle } from "../../features/video";

const SearchBar = () => {
  const dispatch = useDispatch();
  const genre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);
  const [input, setInput] = useState("");

  useEffect(() => {
    document.getElementById("myInput").value = "";
  }, [viewType, genre]);

  useEffect(() => {
    input === ""
      ? genre === "All"
        ? dispatch(selectGenre("0"))
        : dispatch(selectGenre("All"))
      : dispatch(selectTitle(input));
  }, [input]);

  return (
    <div className={styles.container}>
      <input
        className={styles.searchInput}
        id="myInput"
        type="text"
        placeholder="search"
        onKeyUp={(e) => setInput(e.target.value)}
        onClick={() => dispatch(selectGenre("All"))}
      ></input>
    </div>
  );
};

export default SearchBar;
