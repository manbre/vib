import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SearchBar.module.css";
import { selectGenre } from "../../features/video";
import { selectSearch } from "../../features/video";

const SearchBar = () => {
  const dispatch = useDispatch();
  const genre = useSelector((state) => state.video.genre);
  const search = useSelector((state) => state.video.search);
  const viewType = useSelector((state) => state.view.viewType);

  useEffect(() => {
    document.getElementById("myInput").value = "";
  }, [genre]);

  useEffect(() => {
    document.getElementById("myInput").value = "";
    dispatch(selectSearch(""));
  }, [viewType]);

  useEffect(() => {
    if (search === "") {
      genre === "All"
        ? dispatch(selectGenre("0"))
        : dispatch(selectGenre("All"));
    }
  }, [search]);

  return (
    <div className={styles.container}>
      <input
        className={styles.searchInput}
        id="myInput"
        type="text"
        placeholder="search..."
        onKeyUp={(e) => dispatch(selectSearch(e.target.value))}
        onClick={() => dispatch(selectGenre("All"))}
      ></input>
    </div>
  );
};

export default SearchBar;
