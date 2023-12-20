const sequelize = require("../config/databaseConfig");
const Seasons = require("../models/seasonModel");
//
const fileOperations = require("../helpers/fileOperations");
const getAttributes = require("../helpers/getAttributes");
//
const path = require("path");
//
const dir = "G:\\vib\\";

//------------------------------------------------------------------------
// QUERY season data
//------------------------------------------------------------------------
/**
 * @req -
 * @res all seasons
 */
const getAllSeasons = async (req, res) => {
  try {
    let seasons = await Seasons.findAll({
      order: [[sequelize.literal("series", "seasonNr"), "ASC"]],
    });
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req series, seasonNr
 * @res one season
 */
const getOneSeason = async (req, res) => {
  try {
    let seasons = await Seasons.findAll({
      where: {
        series: req.params.series,
        seasonNr: req.params.seasonNr,
      },
    });
    console.log(seasons);
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req id
 * @res one season by id
 */
const getOneSeasonById = async (req, res) => {
  try {
    let season = await Seasons.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(season);
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
    let genres = getAttributes.getGenres(Seasons);
    res.status(200).send(genres);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req genre
 * @res seasons by genre
 */
const getSeasonsByGenre = async (req, res) => {
  let seasons;
  try {
    switch (req.params.genre) {
      case "All":
      case "0":
        seasons = await Seasons.findAll({
          order: [[sequelize.literal("series", "seasonNr"), "ASC"]],
        });
        break;
      case "Recent":
        seasons = await Seasons.findAll({
          where: { lastWatched: { $ne: null } },
          limit: 3,
          order: [[sequelize.literal("lastWatched"), "DESC"]],
        });
        break;
      default:
        seasons = await Seasons.findAll({
          where: {
            genre: sequelize.where(
              sequelize.col("genre"),
              "LIKE",
              "%" + req.params.genre + "%"
            ),
          },
          order: [[sequelize.literal("series, seasonNr"), "ASC"]],
        });
    }
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req search, input
 * @res seasons by search
 */
const getSeasonsBySearch = async (req, res) => {
  let seasons = [];
  //
  try {
    let series = await Seasons.findAll({
      where: {
        series: sequelize.where(
          sequelize.col("series"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      order: [[sequelize.literal("series", "seasonNr"), "ASC"]],
    });
    //
    let creator = await Seasons.findAll({
      where: {
        creator: sequelize.where(
          sequelize.col("creator"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      order: [[sequelize.literal("series", "seasonNr"), "ASC"]],
    });
    //
    let actors = await Seasons.findAll({
      where: {
        actors: sequelize.where(
          sequelize.col("actors"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      order: [[sequelize.literal("series", "seasonNr"), "ASC"]],
    });
    //
    //conclude results
    let arr = series.concat(creator).concat(actors);
    //get distinct seasons by series
    seasons = [...new Map(arr.map((item) => [item["series"], item])).values()];
    //sort seasons by series
    seasons.sort((a, b) =>
      a.series.toLowerCase().localeCompare(b.series.toLowerCase())
    );
    //
    res.status(200).send(seasons);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE season data
//------------------------------------------------------------------------
/**
 * @req season
 * @res season as result
 */
const createSeason = async (req, res) => {
  await Seasons.create({
    series: req.body.series,
    //
    creator: req.body.creator,
    genre: req.body.genre,
    //
    fsk: req.body.fsk,
    seasonNr: req.body.seasonNr,
    runtime: req.body.runtime,
    //
    actors: req.body.actors,
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
 * @req season
 * @res -
 */
const updateSeason = async (req, res) => {
  await Seasons.update(
    {
      ...(req.body.series && { series: req.body.series }),
      //
      ...(req.body.creator && { creator: req.body.creator }),
      ...(req.body.genre && { genre: req.body.genre }),
      //
      ...(req.body.fsk && { fsk: req.body.fsk }),
      ...(req.body.seasonNr && { seasonNr: req.body.seasonNr }),
      ...(req.body.runtime && { runtime: req.body.runtime }),
      //
      ...(req.body.actors && { director: req.body.actors }),
      //
      changes: req.body.changes,
      //
      ...(req.body.lastWatched && { lastWatched: req.body.lastWatched }),
    },
    {
      where: { id: req.body.id },
    }
  )
    .then(
      res.status(200).send({
        message:
          "season data of'" +
          req.body.series +
          "', season '" +
          req.body.seasonNr +
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
 */
const updateFileData = async (req, posterName, teaserName) => {
  await Seasons.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterName }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.teaser
        ? { teaser: teaserName }
        : req.body.teaser === "" && { teaser: "" }),
    },
    { where: { id: req.body.id } }
  ).catch((err) => {
    console.log({ error: err.message });
  });
};

/**
 * @req season
 * @res -
 */
const deleteSeason = async (req, res) => {
  //=====================================================
  deleteFiles(req, false);
  //=====================================================
  await Seasons.destroy({ where: { id: req.body.id } })
    .then(
      res.status(200).send({
        message:
          "'" +
          req.body.series +
          "', season '" +
          req.body.seasonNr +
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
// UPDATE / DELETE season files
//------------------------------------------------------------------------
/**
 * @req season
 * @res -
 */
const updateSeasonFiles = async (req, res) => {
  //
  try {
    let id = req.body.id;
    let posterName = "s" + id + "_" + req.body.changes + ".jpg";
    //"path.extname" gets the file type (e.g. .mp3 or .mp4)
    let teaserName =
      "s" + id + "_" + req.body.changes + path.extname(req.body.teaser + "");
    //
    let posterFolder = dir + "//poster//";
    let teaserFolder = dir + "//teaser//";
    //
    let posterPath = posterFolder + posterName;
    let teaserPath = teaserFolder + teaserName;
    //
    let prevChange = req.body.changes - 1;
    let prevPosterPath = posterFolder + "s" + id + "_" + prevChange + ".jpg";
    let prevTeaserPath =
      teaserFolder +
      "s" +
      id +
      "_" +
      prevChange +
      path.extname(req.body.teaser + "");
    //

    fileOperations.copyFile(req.body.poster, posterFolder, posterPath).then(
      fileOperations.copyFile(req.body.teaser, teaserFolder, teaserPath).then(
        //link new files in database
        updateFileData(req, posterName, teaserName)
          .then(
            res.status(200).send({
              message:
                "files of '" +
                req.body.series +
                "', season '" +
                req.body.seasonNr +
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
              //
              prevPosterPath,
              prevTeaserPath
            )
          )
      )
    );
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @param req
 * @param isSeason
 * @param posterPath
 * @param teaserPath
 */
const deleteFiles = async (
  req,
  isSeason,
  posterPath,
  teaserPath,
  //
  prevPosterPath,
  prevTeaserPath
) => {
  //delete previous files to clean up
  if (isSeason) {
    req.body.poster && fileOperations.deleteFile(prevPosterPath);
    req.body.teaser && fileOperations.deleteFile(prevTeaserPath);
  }
  //delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isSeason) &&
    fileOperations.deleteFile(posterPath);
  (req.body.teaser === "" || !isSeason) &&
    fileOperations.deleteFile(teaserPath);
};

module.exports = {
  getAllSeasons,
  getOneSeason,
  getOneSeasonById,
  getAllGenres,
  getSeasonsByGenre,
  getSeasonsBySearch,
  //
  createSeason,
  updateSeason,
  deleteSeason,
  //
  updateSeasonFiles,
};
