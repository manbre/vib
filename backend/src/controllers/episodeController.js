const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const copyFile = require("../helpers/copyFile");
const deleteFile = require("../helpers/deleteFile");
//
const path = require("path");
//
const dir = "G:\\vib\\";

//------------------------------------------------------------------------
// QUERY episode data
//------------------------------------------------------------------------
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
 * @req season_id
 * @res all episodes by season
 */
const getEpisodesBySeason = async (req, res) => {
  try {
    let episodes = await Episodes.findAll({
      where: {
        season: sequelize.where(
          sequelize.col("season_id"),
          req.params.season_id
        ),
      },
      order: [[sequelize.literal("episode"), "ASC"]],
    });
    res.status(200).send(episodes);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req season_id
 * @res recent episode by season
 */
const getRecentEpisode = async (req, res) => {
  try {
    let episode = await Episodes.findAll({
      limit: 1,
      where: {
        season: sequelize.where(sequelize.col("season"), req.params.season_id),
      },
      order: [[sequelize.literal("last_watched"), "DESC"]],
    });
    res.status(200).send(episode);
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
    title: req.body.title,
    //
    year: req.body.year,
    //
    episode: req.body.episode,
    //
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
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.year && { year: req.body.year }),
      ...(req.body.episode && { episode: req.body.episode }),
      ...(req.body.plot && { plot: req.body.plot }),
      changes: req.body.changes,
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
 * @param germanName
 * @param englishName
 */
const updateFileData = async (req, germanName, englishName) => {
  await Episodes.update(
    {
      //no update if file is null / undefined
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
    let id = req.body.season_id;
    let n = req.body.episode < 10 ? "0" : "";
    let num = "" + req.body.season + n + req.body.episode;
    //
    let germanName =
      "//" + id + "//" + num + "_de" + path.extname(req.body.german + "");
    let englishName =
      "//" + id + "//" + num + "_en" + path.extname(req.body.english + "");
    //
    let germanFolder = dir + "//de//";
    let englishFolder = dir + "//en//";
    //
    let germanPath = germanFolder + germanName;
    let englishPath = englishFolder + englishName;
    //
    copyFile(req.body.german, germanFolder, germanPath).then(
      copyFile(req.body.english, englishFolder, englishPath).then(
        //link new files in database
        updateFileData(req, germanName, englishName)
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
            deleteFiles(req, true, germanPath, englishPath)
          )
      )
    );
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @param req
 * @param isEpisode
 */
const deleteFiles = async (req, isEpisode, germanPath, englishPath) => {
  // delete file if :
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.german === "" || !isEpisode) && deleteFile(germanPath);
  (req.body.english === "" || !isEpisode) && deleteFile(englishPath);
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
