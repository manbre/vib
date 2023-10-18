const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const https = require("https");
const fs = require("fs");
const path = require("path");
//
const dir = "G:\\vib\\";

//------------------------------------------------------------------------
// QUERY episode data
//------------------------------------------------------------------------
/**
 * @req -
 * @res all seasons
 */
const getAllSeasons = async (req, res) => {
  try {
    let seasons = await Episodes.findAll({
      group: ["series", "season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    });
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req search, input
 * @res movies by search
 */
const getSeasonsBySearch = async (req, res) => {
  let seasons = [];
  //
  try {
    let series = await Episodes.findAll({
      where: {
        series: sequelize.where(
          sequelize.col("series"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      group: ["series", "season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    });
    //
    let directors = await Episodes.findAll({
      where: {
        director: sequelize.where(
          sequelize.col("director"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      group: ["series", "season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    });
    //
    let actors = await Episodes.findAll({
      where: {
        actors: sequelize.where(
          sequelize.col("actors"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      group: ["series", "season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    });
    //
    //conclude results
    let arr = series.concat(directors).concat(actors);
    //get distinct seasons by series
    seasons = [...new Map(arr.map((item) => [item["series"], item])).values()];
    //sort movies by title
    seasons.sort((a, b) =>
      a.series.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    //
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req id
 * @res one episode by id
 */
const getOneEpisodeById = async (req, res) => {
  try {
    let episode = await Episodes.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(episode);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req -
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  try {
    let genres = await Episodes.findAll();
    //
    let all = [];
    //get data out of json
    for (let i = 0; i < genres.length; i++) {
      let str = genres[i].genre;
      all.push(str);
    }
    //eliminates ","
    let withoutBlank = all.toString().split(", ");
    let withoutComma = withoutBlank.toString().split(",");
    //eliminates duplicates and spaces
    let distinct = [];
    for (let i = 0; i < withoutComma.length; i++) {
      let str = withoutComma[i];
      if (!distinct.includes(withoutComma[i]) && withoutComma[i] !== "") {
        distinct.push(str);
      }
    }
    //in alphabetical order
    distinct.sort();
    res.status(200).send(distinct);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req series, season
 * @res all episodes by season
 */
const getEpisodesBySeason = async (req, res) => {
  try {
    let episodes = await Episodes.findAll({
      where: {
        series: sequelize.where(sequelize.col("series"), req.params.series),
        season: sequelize.where(sequelize.col("season"), req.params.season),
      },
      order: [[sequelize.literal("episode"), "ASC"]],
    });
    res.status(200).send(episodes);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req series, season
 * @res recent episodes by season
 */
const getRecentEpisode = async (req, res) => {
  try {
    let episode = await Episodes.findAll({
      limit: 1,
      where: {
        series: sequelize.where(sequelize.col("series"), req.params.series),
        season: sequelize.where(sequelize.col("season"), req.params.season),
      },
      order: [[sequelize.literal("last_watched"), "DESC"]],
    });
    res.status(200).send(episode);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req genre
 * @res seasons (sample episode) by genre
 */
const getSeasonsByGenre = async (req, res) => {
  let seasons;
  try {
    switch (req.params.genre) {
      case "All":
      case "0":
        seasons = await Episodes.findAll({
          group: ["series", "season"],
          order: [[sequelize.literal("series", "season"), "ASC"]],
        });
        break;
      case "Recent":
        seasons = await Episodes.findAll({
          limit: 3,
          group: ["series", "season"],
          order: [[sequelize.literal("last_watched"), "DESC"]],
        });
        break;
      default:
        seasons = await Episodes.findAll({
          where: {
            genre: sequelize.where(
              sequelize.col("genre"),
              "LIKE",
              "%" + req.params.genre + "%"
            ),
          },
          group: ["series", "season"],
          order: [[sequelize.literal("series, season"), "ASC"]],
        });
    }
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE movie data
//------------------------------------------------------------------------
/**
 * @req episode
 * @res episode as result
 */
const createEpisode = async (req, res) => {
  await Episodes.create({
    series: req.body.series,
    title: req.body.title,
    director: req.body.director,
    genre: req.body.genre,
    //
    year: req.body.year,
    fsk: req.body.fsk,
    season: req.body.season,
    episode: req.body.episode,
    runtime: req.body.runtime,
    //
    actors: req.body.actors,
    plot: req.body.plot,
    //
    changes: req.body.changes,
  })
    //=====================================================
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
};

/**
 * @req episode
 * @res -
 */
const updateEpisode = async (req, res) => {
  await Episodes.update(
    {
      series: req.body.series,
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.director && { director: req.body.director }),
      ...(req.body.genre && { genre: req.body.genre }),
      //
      ...(req.body.year && { year: req.body.year }),
      ...(req.body.fsk && { fsk: req.body.fsk }),
      ...(req.body.season && { season: req.body.season }),
      ...(req.body.episode && { episode: req.body.episode }),
      ...(req.body.runtime && { runtime: req.body.runtime }),
      //
      ...(req.body.actors && { director: req.body.actors }),
      ...(req.body.plot && { plot: req.body.plot }),
      //
      changes: req.body.changes,
      //
      ...(req.body.elapsed_time && { elapsed_time: req.body.elapsed_time }),
      ...(req.body.last_viewed && { last_viewed: req.body.last_viewed }),
    },
    {
      where: { id: req.body.id },
    }
  )
    .then(
      res.status(200).send({
        message:
          "episode data of'" +
          req.body.series +
          "', episode '" +
          req.body.episode +
          "' was updated",
      })
    )
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
};

/**
 * @param req
 * @param posterName
 * @param teaserName
 * @param germanName
 * @param englishName
 */
const updateFileData = async (
  req,
  posterName,
  teaserName,
  germanName,
  englishName
) => {
  await Episodes.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterName }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.teaser
        ? { teaser: teaserName }
        : req.body.teaser === "" && { teaser: "" }),
      ...(req.body.german
        ? { german: germanName }
        : req.body.german === "" && { german: "" }),
      ...(req.body.english
        ? { english: englishName }
        : req.body.english === "" && { english: "" }),
    },
    { where: { id: req.body.id } }
  ).catch((err) => {
    console.log({ error: err.message });
  });
};

/**
 * @req episode
 * @res -
 */
const deleteEpisode = async (req, res) => {
  //=====================================================
  deleteFiles(req, false);
  //=====================================================
  await Episodes.destroy({ where: { id: req.body.id } })
    .then(
      res.status(200).send({
        message:
          "'" +
          req.body.series +
          "', episode '" +
          req.body.episode +
          "' was deleted.",
      })
    )
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
};

//------------------------------------------------------------------------
// UPDATE / DELETE episode files
//------------------------------------------------------------------------
/**
 * @req episode
 * @res -
 */
const updateEpisodeFiles = async (req, res) => {
  //
  try {
    let n = req.body.episode < 10 ? "0" : "";
    let num = "" + req.body.season + n + req.body.episode;
    let initials = req.body.series
      .match(/(\b\S)?/g)
      .join("")
      .toUpperCase();
    //
    let posterName = initials + "_" + num + "_" + req.body.changes + ".jpg";
    //"path.extname" gets the file type (e.g. .mp3 or .mp4)
    let teaserName = initials + "_teaser" + path.extname(req.body.teaser + "");
    let germanName = "//" + initials + "//" + initials + "_" + num + "_de.mp4";
    let englishName = "//" + initials + "//" + initials + "_" + num + "_en.mp4";
    //
    let posterFolder = dir + "//poster//";
    let teaserFolder = dir + "//teaser//";
    let germanFolder = dir + "//de//";
    let englishFolder = dir + "//en//";
    //
    let posterPath = posterFolder + posterName;
    let teaserPath = teaserFolder + teaserName;
    let germanPath = germanFolder + germanName;
    let englishPath = englishFolder + englishName;
    //
    let prevChange = req.body.changes - 1;
    let prevPosterPath =
      posterFolder + initials + "_" + num + "_" + prevChange + ".jpg";
    //
    copyOneFile(req.body.poster, posterFolder, posterPath).then(
      copyOneFile(req.body.teaser, teaserFolder, teaserPath).then(
        copyOneFile(req.body.german, germanFolder, germanPath).then(
          copyOneFile(req.body.english, englishFolder, englishPath).then(
            //link new files in database
            updateFileData(req, posterName, teaserName, germanName, englishName)
              .then(
                res.status(200).send({
                  message:
                    "files of '" +
                    req.body.series +
                    "', episode '" +
                    req.body.episode +
                    "' were updated.",
                })
              )
              .then(
                //remove old files
                deleteFiles(
                  req,
                  true,
                  posterPath,
                  teaserPath,
                  germanPath,
                  englishPath,
                  //
                  prevPosterPath
                )
              )
          )
        )
      )
    );
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @param fileSource
 * @param newFolder
 * @param newPath
 */
const copyOneFile = async (fileSource, newFolder, newPath) => {
  if (fileSource) {
    //create "dir" if not exists, "recursive: true" => for parent folder too
    !fs.existsSync(newFolder) && fs.mkdirSync(newFolder, { recursive: true });
    //download poster from web (e.g. OMDB api) to location
    if (fileSource.includes("http")) {
      https.get(fileSource, (response) => {
        let file = fs.createWriteStream(newPath);
        response.pipe(file);
        file.on("error", (err) => {
          console.log(err);
        });
        file.on("finish", () => {
          file.close();
        });
      });
    } else {
      //copy local file to location
      fs.copyFile(fileSource, newPath, (err) => {
        console.log({ error: err.message });
      });
    }
  }
};

/**
 * @param req
 * @param isEpisode
 */
const deleteFiles = async (
  req,
  isEpisode,
  posterPath,
  teaserPath,
  germanPath,
  englishPath,
  prevPosterPath
) => {
  //delete previous files to clean up
  isEpisode && req.body.poster && deleteOneFile(prevPosterPath);

  // delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isEpisode) && deleteOneFile(posterPath);
  (req.body.teaser === "" || !isEpisode) && deleteOneFile(teaserPath);
  (req.body.german === "" || !isEpisode) && deleteOneFile(germanPath);
  (req.body.english === "" || !isEpisode) && deleteOneFile(englishPath);
};

/**
 * @param fileLocation
 */
const deleteOneFile = (fileLocation) => {
  fs.existsSync(fileLocation) &&
    fs.rm(fileLocation, (err) => {
      console.log({ error: err.message });
    });
};

module.exports = {
  getAllSeasons,
  getSeasonsBySearch,
  getOneEpisodeById,
  getAllGenres,
  getEpisodesBySeason,
  getRecentEpisode,
  getSeasonsByGenre,
  //
  createEpisode,
  updateEpisode,
  deleteEpisode,
  //
  updateEpisodeFiles,
};
