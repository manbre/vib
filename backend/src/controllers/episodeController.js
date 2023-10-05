const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const https = require("https");
const fs = require("fs");
//
const dir = "G:\\vib\\show\\";

//------------------------------------------------------------------------
// QUERY episode data
//------------------------------------------------------------------------
/**
 * @req -
 * @res all seasons
 */
const getAllSeasons = async (req, res) => {
  let seasons = await Episodes.findAll({
    group: ["series", "season"],
    order: [[sequelize.literal("series", "season"), "ASC"]],
  }).catch((err) => {
    err &&
      res.status(500).send({
        message: "ERROR: Could not get all seasons.",
      });
  });
  res.status(200).send(seasons);
};

/**
 * @req series
 * @res seasons (sample episode) by series
 */
const getSeasonsBySeries = async (req, res) => {
  let seasons = await Episodes.findAll({
    //get first episode per season
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
    err &&
      res.status(500).send({
        message:
          "ERROR: Could not get seasons of series '" + req.params.series + "'.",
      });
  });
  res.status(200).send(seasons);
};

/**
 * @req id
 * @res one episode by id
 */
const getOneEpisodeById = async (req, res) => {
  let episode = await Episodes.findOne({
    where: { id: req.params.id },
  }).catch((err) => {
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not get episode by 'id'." });
  });
  res.status(200).send(episode);
};

/**
 * @req -
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Episodes.findAll({}).catch((err) => {
    err &&
      res.status(500).send({ message: "ERROR: Could not get all genres." });
  });
  //
  try {
    let all = [];
    //get data out of json
    for (let i = 0; i < genres.length; i++) {
      let str = genres[i].genre;
      all.push(str);
    }
    //eliminates ","
    let withoutBlank = a.toString().split(", ");
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
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not get distinct genres." });
  }
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
    err &&
      res.status(500).send({
        message:
          "ERROR: Could not get episodes of '" +
          req.params.serie +
          "' season '" +
          req.params.season +
          "'.",
      });
  });
  res.status(200).send(episodes);
};

/**
 * @req series, season
 * @res recent episodes by season
 */
const getRecentEpisode = async (req, res) => {
  let episode = await Episodes.findAll({
    limit: 1,
    where: {
      series: sequelize.where(sequelize.col("series"), req.params.series),
      season: sequelize.where(sequelize.col("season"), req.params.season),
    },
    order: [[sequelize.literal("last_watched"), "DESC"]],
  }).catch((err) => {
    err &&
      res.status(500).send({ message: "ERROR: Could not get recent episode." });
  });
  res.status(200).send(episode);
};

/**
 * @req genre
 * @res seasons (sample episode) by genre
 */
const getSeasonsByGenre = async (req, res) => {
  let seasons;
  if (req.params.genre === "All" || req.params.genre === "0") {
    seasons = await Episodes.findAll({
      group: ["series", "season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    }).catch((err) => {
      err &&
        res
          .status(500)
          .send({ message: "ERROR: Could not filter seasons by 'All'." });
    });
  } else if (req.params.genre == "Recent") {
    seasons = await Episodes.findAll({
      limit: 3,
      group: ["series", "season"],
      order: [[sequelize.literal("last_watched"), "DESC"]],
    }).catch((err) => {
      err &&
        res
          .status(500)
          .send({ message: "ERROR: Could not filter seasons by 'Recent'." });
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
      err &&
        res
          .status(500)
          .send({ message: "ERROR: Could not filter seasons by genre." });
    });
  }
  res.status(200).send(seasons);
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
    fsk: req.body.fsk,
    director: req.body.director,
    genre: req.body.genre,
    year: req.body.year,
    season: req.body.season,
    episode: req.body.episode,
    awards: req.body.awards,
    rating: req.body.rating,
    runtime: req.body.runtime,
    actors: req.body.actors,
    plot: req.body.plot,
    changes: req.body.changes,
  })
    //=====================================================
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not create data of '" +
            req.body.series +
            "', episode '" +
            req.body.episode +
            "'.",
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
      ...(req.body.series && { series: req.body.series }),
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.fsk && { fsk: req.body.fsk }),
      ...(req.body.director && { director: req.body.director }),
      ...(req.body.genre && { genre: req.body.genre }),
      ...(req.body.year && { year: req.body.year }),
      ...(req.body.season && { season: req.body.season }),
      ...(req.body.episode && { episode: req.body.episode }),
      ...(req.body.awards && { awards: req.body.awards }),
      ...(req.body.rating && { rating: req.body.rating }),
      ...(req.body.runtime && { runtime: req.body.runtime }),
      ...(req.body.actors && { director: req.body.actors }),
      ...(req.body.plot && { plot: req.body.plot }),
      ...(req.body.elapsed_time && { elapsed_time: req.body.elapsed_time }),
      ...(req.body.last_viewed && { last_viewed: req.body.last_viewed }),
      changes: req.body.changes,
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
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not update data of'" +
            req.body.series +
            "', episode '" +
            req.body.episode +
            "'.",
        });
    });
};

/**
 * @param req
 * @param posterName
 * @param themeName
 * @param germanName
 * @param englishName
 */
const updateFileData = async (
  req,
  posterName,
  themeName,
  germanName,
  englishName
) => {
  await Episodes.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterName }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.theme
        ? { theme: themeName }
        : req.body.theme === "" && { theme: "" }),
      ...(req.body.german
        ? { german: germanName }
        : req.body.german === "" && { german: "" }),
      ...(req.body.english
        ? { english: englishName }
        : req.body.english === "" && { english: "" }),
    },
    { where: { id: req.body.id } }
  ).catch((err) => {
    err &&
      res.status(500).send({
        message:
          "ERROR: Could not update file data of '" +
          req.body.series +
          "', episode '" +
          req.body.episode +
          "'.",
      });
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
      err &&
        res.status(500).send({
          message:
            "Could not delete '" +
            req.body.series +
            "', episode '" +
            req.body.episode +
            "'.",
        });
    });
};

//------------------------------------------------------------------------
// UPDATE / DELETE episode files
//------------------------------------------------------------------------
/**
 * @req episode including new id
 * @res -
 */
const updateEpisodeFiles = async (req, res) => {
  //
  let n = req.body.episode < 10 ? "0" : "";
  let num = "" + req.body.season + n + req.body.episode;
  //
  let posterName = req.body.id + "_" + req.body.changes + ".jpg";
  let themeName = "theme.mp3";
  let germanName = num + "_de.mp4";
  let englishName = num + "_en.mp4";
  //
  let posterFolder =
    dir + "//" + req.body.series + "//" + req.body.season + "//";
  let themeFolder = dir + "//" + req.body.series + "//";
  let germanFolder =
    dir + "//" + req.body.series + "//" + req.body.season + "//de//";
  let englishFolder =
    dir + "//" + req.body.series + "//" + req.body.season + "//en//";
  //
  let posterPath = posterFolder + posterName;
  let themePath = themeFolder + themeName;
  let germanPath = germanFolder + germanName;
  let englishPath = englishFolder + englishName;
  //
  let prevChange = req.body.changes - 1;
  let prevPosterPath = posterFolder + req.body.id + "_" + prevChange + ".jpg";
  //
  copyOneFile(req.body.poster, posterFolder, posterPath).then(
    copyOneFile(req.body.theme, themeFolder, themePath).then(
      copyOneFile(req.body.german, germanFolder, germanPath).then(
        copyOneFile(req.body.english, englishFolder, englishPath).then(
          //link new files in database
          updateFileData(req, posterName, themeName, germanName, englishName)
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
                themePath,
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
        file.on("error", (error) => {
          console.log(error);
        });
        file.on("finish", () => {
          file.close();
        });
      });
    } else {
      //copy local file to location
      fs.copyFile(fileSource, newPath, (error) => {
        console.log(error);
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
  themePath,
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
  (req.body.theme === "" || !isEpisode) && deleteOneFile(themePath);
  (req.body.german === "" || !isEpisode) && deleteOneFile(germanPath);
  (req.body.english === "" || !isEpisode) && deleteOneFile(englishPath);
};

/**
 * @param fileLocation
 */
const deleteOneFile = (fileLocation) => {
  fs.existsSync(fileLocation) &&
    fs.rm(fileLocation, (err) => {
      err && console.log(err);
    });
};

module.exports = {
  getAllSeasons,
  getSeasonsBySeries,
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
