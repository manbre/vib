const express = require("express");
const cors = require("cors");

const sequelize = require("./config/databaseConfig");
sequelize.sync().then(() => console.log("database is ready"));

const app = express();

// allows displaying from other origins
app.use(cors());
// parses incoming requests with JSON payloads
app.use(express.json());
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));

//routes
const movieRoute = require("./routes/movieRoute");
const seasonRoute = require("./routes/seasonRoute");
const episodeRoute = require("./routes/episodeRoute");
//
const omdbRoute = require("./routes/omdbRoute");
const streamRoute = require("./routes/streamRoute");

app.use("/movies", movieRoute);
app.use("/seasons", seasonRoute);
app.use("/episodes", episodeRoute);
//
app.use("/omdb", omdbRoute);
app.use("/stream", streamRoute);

app.listen(9000, () => {
  console.log("server on port 9000");
});
