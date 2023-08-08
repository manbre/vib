import { useState } from "react";
import axios from "axios";

const useOmdb = () => {
  const [omdbData, setOmdbData] = useState(null);

  const fetchOmdb = ({ title, year }) => {
    axios
      .get(`http://localhost:9000/omdb/${title}/${year}`)
      .then((res) => {
        res && setOmdbData(res.data);
      })
      .catch((error) => console.log(error));
  };

  return { omdbData, fetchOmdb };
};

export default useOmdb;
