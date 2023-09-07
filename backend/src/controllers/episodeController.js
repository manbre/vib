const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const https = require("https");
const fs = require("fs");
//
const dir = "E:\\vib\\show\\";

/**
 * @req series
 * @res all seasons
 */
const getAllSeasons = async (req, res) => {
  let seasons = await Episodes.findAll({
    group: ["series", "season"],
    order: [[sequelize.literal("series", "season"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(seasons);
};

/**
 * @req series
 * @res seasons (sample episode) by series
 */
const getSeasonsBySeries = async (req, res) => {
  let seasons = await Episodes.findAll({
    group: ["season"],
    where: {
      series: sequelize.where(
        sequelize.col("series"),
        "LIKE",
        "%" + req.params.series + "%"
      ),
    },
    order: [[sequelize.literal("season"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(seasons);
};

/**
 * @req series
 * @res all episodes
 */
const getAllEpisodes = async (req, res) => {
  let episodes = await Episodes.findAll({
    order: [[sequelize.literal("series, season"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(episodes);
};

/**
 * @req series, season
 * @res all episodes by season
 */
const getEpisodesBySeason = async (req, res) => {
  let episodes = await Episodes.findAll({
    where: {
      series: sequelize.where(sequelize.col("series"), req.params.series),
      season: sequelize.where(sequelize.col("season"), req.params.season),
    },
    order: [[sequelize.literal("episode"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(episodes);
};

/**
 * @req series, season
 * @res recent episodes by season
 */
const getRecent = async (req, res) => {
  let episode = await Episodes.findAll({
    limit: 1,
    where: {
      series: sequelize.where(sequelize.col("series"), req.params.series),
      season: sequelize.where(sequelize.col("season"), req.params.season),
    },
    order: [[sequelize.literal("last_watched"), "DESC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(episode);
};

/**
 * @req -
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Episodes.findAll({}).catch((err) => {
    res.send(err);
  });
  let a = [];
  //get data out of json
  for (let i = 0; i < genres.length; i++) {
    let str = genres[i].genre;
    a.push(str);
  }
  //eliminates ","
  let b = a.toString().split(", ");
  let c = b.toString().split(",");
  //eliminates duplicates and spaces
  let d = [];
  for (let i = 0; i < c.length; i++) {
    let str = c[i];
    if (!d.includes(c[i]) && c[i] != "") {
      d.push(str);
    }
  }
  d.sort();
  res.send(d);
};

/**
 * @req genre
 * @res seasons (sample episode) by genre
 */
const getSeasonsByGenre = async (req, res) => {
  let seasons = [];
  if (req.params.genre === "All" || req.params.genre === "0") {
    seasons = await Episodes.findAll({
      group: ["series", "season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  } else if (req.params.genre == "Recent") {
    seasons = await Episodes.findAll({
      limit: 3,
      group: ["series", "season"],
      order: [[sequelize.literal("last_watched"), "DESC"]],
    }).catch((err) => {
      res.send(err);
    });
  } else {
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
    }).catch((err) => {
      res.send(err);
    });
  }
  res.send(seasons);
};

/**
 * @req episode
 */
const createNewEpisode = async (req, res) => {
  let series = req.body.series;
  let sh = req.body.series
    .match(/(\b\S)?/g)
    .join("")
    .toUpperCase();
  let s = req.body.season;
  let e = req.body.episode;
  let n = e < 10 ? 0 : "";
  let num = "" + s + n + e;
  //
  let posterPath = path + "//" + series + "//" + sh + "_" + s + ".jpg";
  let themePath = path + "//" + series + "//" + sh + "_" + s + ".mp3";
  let germanPath = path + "//" + series + "//de//" + sh + num + "_de.mp4";
  let englishPath = path + "//" + series + "//en//" + sh + num + "_en.mp4";

  await Episodes.create({
    series: series,
    title: req.body.title,
    director: req.body.director,
    genre: req.body.genre,
    //
    year: req.body.year,
    season: s,
    episode: e,
    awards: req.body.awards,
    runtime: req.body.runtime,
    //
    actors: req.body.actors,
    plot: req.body.plot,
    //
    poster: req.body.poster && posterPath,
    theme: req.body.theme && themePath,
    german: req.body.german && germanPath,
    english: req.body.english && englishPath,
  })
    .catch((err) => {
      res.status(500).send({
        message: "error inserting ep " + s + n + e + " of '" + series + "'.",
      });
      res.send(err);
    })
    .then(() => {
      res.status(200).send({
        message: "ep " + s + n + e + " of '" + series + "' has been inserted.",
      });
    });
};

/**
 * @req episodes
 */
const updateEpisode = async (req, res) => {
  let series = req.body.series;
  console.log("update: " + series);
  let sh = series
    .match(/(\b\S)?/g)
    .join("")
    .toUpperCase();
  let s = req.body.season;
  let e = req.body.episode;
  let n = e < 10 ? 0 : "";
  let num = "" + s + n + e;
  //
  let posterPath = path + "//" + series + "//" + sh + "_" + s + ".jpg";
  let themePath = path + "//" + series + "//" + sh + "_" + s + ".mp3";
  let germanPath = path + "//" + series + "//de//" + sh + num + "_de.mp4";
  let englishPath = path + "//" + series + "//en//" + sh + num + "_en.mp4";
  //
  await Episodes.update(
    {
      ...(req.body.series ? { series: series } : {}),
      ...(req.body.title ? { title: req.body.title } : {}),
      ...(req.body.director ? { director: req.body.director } : {}),
      ...(req.body.genre ? { genre: req.body.genre } : {}),
      ...(req.body.actors ? { director: req.body.actors } : {}),
      ...(req.body.plot ? { plot: req.body.plot } : {}),
      //
      ...(req.body.year ? { year: req.body.year } : {}),
      ...(req.body.season ? { season: s } : {}),
      ...(req.body.episode ? { episode: e } : {}),
      ...(req.body.runtime ? { runtime: req.body.runtime } : {}),
      //
      ...(req.body.poster ? { poster: posterPath } : {}),
      ...(req.body.theme ? { theme: themePath } : {}),
      ...(req.body.german ? { german: germanPath } : {}),
      ...(req.body.english ? { english: englishPath } : {}),
      //
      ...(req.body.elapsed_time ? { elapsed_time: req.body.elapsed_time } : {}),
      ...(req.body.last_viewed ? { last_viewed: req.body.last_viewed } : {}),
    },
    {
      where: { id: req.body.id },
    }
  )
    .catch((err) => {
      res.status(500).send({
        message:
          "error while updating ep " + s + n + e + " of '" + series + "'",
      });
      console.log(err);
    })
    .then(() => {
      res.status(200).send({
        message: "ep " + s + n + e + " of '" + series + "' has been updated.",
      });
    });
};

/**
 * @req id
 */
const deleteEpisode = async (req, res) => {
  let series = req.body.series;
  let sh = series
    .match(/(\b\S)?/g)
    .join("")
    .toUpperCase();
  let s = req.body.season;
  let e = req.body.episode;
  let n = e < 10 ? 0 : "";
  let num = "" + s + n + e;
  //
  let posterDir = dir + "//" + series + "//" + sh + "_" + s + ".jpg";
  let themeDir = dir + "//" + series + "//" + sh + "_" + s + ".mp3";
  let germanDir = dir + "//" + series + "//de//" + sh + num + "_de.mp4";
  let englishDir = dir + "//" + series + "//en//" + sh + num + "_en.mp4";
  //
  await Episodes.destroy({ where: { id: req.params.id } }).catch((err) => {
    res.send(err);
  });
  //delete files if exist
  fs.existsSync(posterDir) && fs.unlinkSync(posterDir);
  fs.existsSync(themeDir) && fs.unlinkSync(themeDir);
  fs.existsSync(germanDir) && fs.unlinkSync(germanDir);
  fs.existsSync(englishDir) && fs.unlinkSync(englishDir);
  //
  res.status(200).send({
    message: "ep " + s + n + e + " of '" + series + "' was removed.",
  });
};

/**
 * @req episode
 * @res copy files to directory
 */
const copyEpisodeFiles = async (req, res) => {
  let series = req.body.series;
  let sh = req.body.series
    .match(/(\b\S)?/g)
    .join("")
    .toUpperCase();
  let s = req.body.season;
  let e = req.body.episode;
  let n = e < 10 ? 0 : "";
  let num = "" + s + n + e;
  //
  let isPosterReady = req.body.poster ? false : true;
  let isThemeReady = req.body.theme ? false : true;
  let isGermanReady = req.body.german ? false : true;
  let isEnglishReady = req.body.english ? false : true;
  //
  let posterDir = dir + "//" + series + "//";
  let themeDir = dir + "//" + series + "//";
  let germanDir = dir + "//" + series + "//de//";
  let englishDir = dir + "//" + series + "//en//";
  //
  if (req.body.poster) {
    !fs.existsSync(posterDir) && fs.mkdirSync(posterDir, { recursive: true });
    //download and rename poster from omdb api
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(posterDir + sh + "_" + s + ".jpg");
      https.get(req.body.poster, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
        });
        isPosterReady = true;
        console.log("poster ready");
        if (isPosterReady && isThemeReady && isGermanReady && isEnglishReady) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      });
    } else {
      !fs.existsSync(posterDir) && fs.mkdirSync(posterDir, { recursive: true });
      //copy and rename poster to directory
      fs.copyFile(req.body.poster, posterDir + sh + "_" + s + ".jpg", (err) => {
        if (err) throw err;
        isPosterReady = true;
        console.log("poster ready");
        if (isPosterReady && isThemeReady && isGermanReady && isEnglishReady) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      });
    }
  }
  if (req.body.theme) {
    !fs.existsSync(themeDir) && fs.mkdirSync(themeDir, { recursive: true });
    //copy and rename theme to directory
    fs.copyFile(req.body.theme, themeDir + sh + "_" + s + ".mp3", (err) => {
      if (err) throw err;
      isGermanReady = true;
      console.log("themes ready");
      if (isPosterReady && isThemeReady && isGermanReady && isEnglishReady) {
        res.status(200).send({
          message: "copy files finished",
        });
      }
    });
  }
  if (req.body.german) {
    !fs.existsSync(germanDir) && fs.mkdirSync(germanDir, { recursive: true });
    //copy and rename german video to directory
    fs.copyFile(req.body.german, germanPath + sh + num + "_de.mp4", (err) => {
      if (err) throw err;
      isGermanReady = true;
      console.log("german ready");
      if (isPosterReady && isThemeReady && isGermanReady && isEnglishReady) {
        res.status(200).send({
          message: "copy files finished",
        });
      }
    });
  }
  if (req.body.english) {
    !fs.existsSync(englishDir) && fs.mkdirSync(englishDir, { recursive: true });
    //copy and rename german video to directory
    fs.copyFile(req.body.english, englishDir + sh + num + "_en.mp4", (err) => {
      if (err) throw err;
      isEnglishReady = true;
      console.log("english ready");
      if (isPosterReady && isThemeReady && isGermanReady && isEnglishReady) {
        res.status(200).send({
          message: "copy files finished",
        });
      }
    });
  }
};

module.exports = {
  getAllGenres,
  //
  getAllSeasons,
  getSeasonsBySeries,
  getAllEpisodes,
  getEpisodesBySeason,
  getRecent,
  getSeasonsByGenre,
  //
  createNewEpisode,
  updateEpisode,
  deleteEpisode,
  //
  copyEpisodeFiles,
};
