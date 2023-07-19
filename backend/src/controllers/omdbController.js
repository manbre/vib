const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const getOMDBData = async (req, res) => {
  await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.params.title}&y=${req.params.year}`
  )
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    });
};

module.exports = {
  getOMDBData,
};
