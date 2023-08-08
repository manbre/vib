import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const useOmdb = ({ title, year, isFetch }) => {
  const [data, setData] = useState(null);
  const selected = useSelector((state) => state.video.video);

  useEffect(() => {
    !selected &&
      isFetch &&
      axios
        .get(`http://localhost:9000/omdb/${title}/${year}`)
        .then((res) => {
          res && setData(res.data);
        })
        .catch((error) => console.log(error));
  }, [title, year, isFetch]);

  return [data];
};

export default useOmdb;
