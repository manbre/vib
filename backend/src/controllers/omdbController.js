const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const getOMDBData = async (req, res) => {
  try {
    await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.params.title}&y=${req.params.year}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        res.send(data);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOMDBData,
};
