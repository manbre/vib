import { useState, useEffect } from "react";
import axios from "axios";

const useOmdb = ({ title, year }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:9000/omdb/${title}/${year}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => console.log(error));
  }, [title, year]);

  return [data];
};

export default useOmdb;
