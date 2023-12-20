const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const fileOperations = require("../helpers/fileOperations");
//
const path = require("path");
//
const dir = "G:\\vib\\";

//------------------------------------------------------------------------
// QUERY episode data
//------------------------------------------------------------------------
/**
 * @req seasonId
 * @res all episodes by season
 */
const getAllEpisodesBySeason = async (req, res) => {
  try {
    let episodes = await Episodes.findAll({
      where: {
        seasonId: sequelize.where(
          sequelize.col("seasonId"),
          req.params.seasonId
        ),
      },
      order: [[sequelize.literal("lastWatched"), "DESC"]],
    });
    res.status(200).send(episodes);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req seasonId
 * @res one recent episode by season
 */
const getRecentEpisodeBySeason = async (req, res) => {
  try {
    let episode = await Episodes.findAll({
      where: { seasonId: req.params.seasonId, lastWatched: { $ne: null } },
      limit: 1,
      order: [[sequelize.literal("lastWatched"), "DESC"]],
    });
    res.status(200).send(episode);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req seasonId, episodeNr
 * @res one episode
 */
const getOneEpisode = async (req, res) => {
  try {
    let episode = await Episodes.findOne({
      where: { seasonId: req.params.seasonId, episodeNr: req.params.episodeNr },
    });
    res.status(200).send(episode);
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
    year: req.body.year,
    episodeNr: req.body.episodeNr,
    plot: req.body.plot,
    seasonId: req.body.seasonId,
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
      ...(req.body.episodeNr && { episodeNr: req.body.episodeNr }),
      ...(req.body.plot && { plot: req.body.plot }),
      ...(req.body.seasonId && { seasonId: req.body.seasonId }),
      ...(req.body.elapsedTime && { elapsedTime: req.body.elapsedTime }),
      ...(req.body.lastWatched && { lastWatched: req.body.lastWatched }),
    },
    {
      where: { id: req.body.id },
    }
  )
    .then(
      res.status(200).send({
        message: "episode '" + req.body.episodeNr + "' was updated",
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
        message: "episode '" + req.body.episodeNr + "' was deleted.",
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
    let n = req.body.episodeNr < 10 ? "0" : "";
    let num = req.body.seasonId + "_" + n + req.body.episodeNr;
    //"path.extname" gets the file type (e.g. .mp4 or .mpeg)
    let germanName = "s" + num + "_de" + path.extname(req.body.german + "");
    let englishName = "s" + num + "_en" + path.extname(req.body.english + "");
    //
    let germanFolder = dir + "//de//";
    let englishFolder = dir + "//en//";
    //
    let germanPath = germanFolder + germanName;
    let englishPath = englishFolder + englishName;
    //
    fileOperations.copyFile(req.body.german, germanFolder, germanPath).then(
      fileOperations
        .copyFile(req.body.english, englishFolder, englishPath)
        .then(
          //link new files in database
          updateFileData(req, germanName, englishName)
            .then(
              res.status(200).send({
                message: "episode '" + req.body.episodeNr + "' were updated.",
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
  (req.body.german === "" || !isEpisode) &&
    fileOperations.deleteFile(germanPath);
  (req.body.english === "" || !isEpisode) &&
    fileOperations.deleteFile(englishPath);
};

module.exports = {
  getAllEpisodesBySeason,
  getRecentEpisodeBySeason,
  getOneEpisode,
  getOneEpisodeById,
  //
  createEpisode,
  updateEpisode,
  deleteEpisode,
  //
  updateEpisodeFiles,
};
