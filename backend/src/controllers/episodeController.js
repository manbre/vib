const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const https = require("https");
const fs = require("fs");
//
const dir = "E:\\vib\\show\\";

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
 * @req series
 * @res all episodes
 */
const getAllEpisodes = async (req, res) => {
  let episodes = await Episodes.findAll({
    order: [[sequelize.literal("series, season"), "ASC"]],
  }).catch((err) => {
    err &&
      res.status(500).send({ message: "ERROR: Could not get all episodes." });
  });
  res.status(200).send(episodes);
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
const getRecent = async (req, res) => {
  let episode = await Episodes.findAll({
    limit: 1,
    where: {
      series: sequelize.where(sequelize.col("series"), req.params.series),
      season: sequelize.where(sequelize.col("season"), req.params.season),
    },
    order: [[sequelize.literal("last_watched"), "DESC"]],
  }).catch((err) => {
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not get recent episodes." });
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
 * @req movie
 * @res movie as result
 */
const createMovie = async (req, res) => {
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
 * @req movie
 * @res -
 */
const updateMovie = async (req, res) => {
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
 * @param posterPath
 * @param trailerPath
 * @param germanPath
 * @param englishPath
 */
const updateFileData = async (
  req,
  posterPath,
  themePath,
  germanPath,
  englishPath
) => {
  await Episodes.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterPath }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.theme
        ? { theme: themePath }
        : req.body.theme === "" && { theme: "" }),
      ...(req.body.german
        ? { german: germanPath }
        : req.body.german === "" && { german: "" }),
      ...(req.body.english
        ? { english: englishPath }
        : req.body.english === "" && { english: "" }),
    },
    { where: { id: req.body.id } }
  )
    .then(deleteFiles(req, true))
    .catch((err) => {
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
 * @req movie
 * @res -
 */
const deleteMovie = async (req, res) => {
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
  let isPosterReady = req.body.poster ? false : true;
  let isThemeReady = req.body.theme ? false : true;
  let isGermanReady = req.body.german ? false : true;
  let isEnglishReady = req.body.english ? false : true;
  //
  let n = req.body.episode < 10 ? "0" : "";
  let s = req.body.season < 10 ? "00" : "0";
  let num = "" + req.body.season + n + req.body.episode;
  //
  let posterName = req.body.season + s + "_" + req.body.changes + ".jpg";
  let themeName = req.body.changes + ".mp3";
  let germanName = num + "_de.mp4";
  let englishName = num + "_en.mp4";
  //
  let posterFolder = dir + "//" + req.body.series + "//";
  let themeFolder = dir + "//" + req.body.series + "//";
  let germanFolder = dir + "//" + req.body.series + "//de//";
  let englishFolder = dir + "//" + req.body.series + "//en//";
  //
  if (req.body.poster) {
    //create "dir" if not exists, "recursive: true" => for parent folder too
    !fs.existsSync(posterFolder) &&
      fs.mkdirSync(posterFolder, { recursive: true });
    //download poster from OMDB api to location
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(posterFolder + posterName);
      https.get(req.body.poster, (response) => {
        response.pipe(file);
        file.on("error", (err) => {
          err &&
            res.status(500).send({
              message:
                "ERROR: Could not download poster of '" +
                req.body.series +
                "', season'" +
                req.body.season +
                "'.",
            });
        });
        file.on("finish", () => {
          file.close();
        });
        isPosterReady = true;
        //
        isPosterReady &&
          isThemeReady &&
          isGermanReady &&
          isEnglishReady &&
          //
          updateFileData(
            req,
            posterName,
            themeName,
            germanName,
            englishName
          ).then(
            res.status(200).send({
              message:
                "files of '" +
                req.body.series +
                "', episode '" +
                num +
                "' were updated.",
            })
          );
      });
    } else {
      //copy and rename local file to directory
      fs.copyFile(req.body.poster, posterFolder + posterName, (err) => {
        err &&
          res.status(500).send({
            message:
              "ERROR: Could not copy poster of '" +
              req.body.series +
              "', season '" +
              req.body.season +
              "'.",
          });
        isPosterReady = true;
        //
        isPosterReady &&
          isThemeReady &&
          isGermanReady &&
          isEnglishReady &&
          //
          updateFileData(
            req,
            posterName,
            themeName,
            germanName,
            englishName
          ).then(
            res.status(200).send({
              message:
                "files of '" +
                req.body.series +
                "', episode '" +
                num +
                "' were updated.",
            })
          );
      });
    }
  }
  if (req.body.theme) {
    !fs.existsSync(themeFolder) &&
      fs.mkdirSync(themeFolder, { recursive: true });
    fs.copyFile(req.body.theme, themeFolder + themeName, (err) => {
      err &&
        res.status(500).send({
          message: "ERROR: Could not copy theme of '" + req.body.series + "'.",
        });
      isThemeReady = true;
      //
      isPosterReady &&
        isThemeReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        updateFileData(
          req,
          posterName,
          themeName,
          germanName,
          englishName
        ).then(
          res.status(200).send({
            message:
              "files of '" +
              req.body.series +
              "', episode '" +
              num +
              "' were updated.",
          })
        );
    });
  }
  if (req.body.german) {
    !fs.existsSync(germanFolder) &&
      fs.mkdirSync(germanFolder, { recursive: true });
    fs.copyFile(req.body.german, germanFolder + germanName, (err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not copy german of '" +
            req.body.series +
            "', episode '" +
            num +
            "'.",
        });
      isGermanReady = true;
      //
      isPosterReady &&
        isThemeReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        updateFileData(
          req,
          posterName,
          themeName,
          germanName,
          englishName
        ).then(
          res.status(200).send({
            message:
              "files of '" +
              req.body.series +
              "', episode '" +
              num +
              "' were updated.",
          })
        );
    });
  }
  if (req.body.english) {
    !fs.existsSync(englishFolder) &&
      fs.mkdirSync(englishFolder, { recursive: true });
    fs.copyFile(req.body.english, englishFolder + englishName, (err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not copy english of '" +
            req.body.series +
            "', episode '" +
            num +
            "'.",
        });
      isEnglishReady = true;
      //
      isPosterReady &&
        isThemeReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        updateFileData(
          req,
          posterName,
          themeName,
          germanName,
          englishName
        ).then(
          res.status(200).send({
            message:
              "files of '" +
              req.body.series +
              "', episode '" +
              num +
              "' were updated.",
          })
        );
    });
  }
};

/**
 * @param req
 * @param isEpisode
 */
const deleteFiles = async (req, isEpisode) => {
  //
  const deleteOneFile = (fileLocation) => {
    fs.existsSync(fileLocation) &&
      fs.rm(fileLocation, (err) => {
        err && console.log(err);
      });
  };
  //delete previous files to clean up
  if (isEpisode) {
    let previousChange = req.body.changes - 1;
    req.body.poster &&
      deleteOneFile(
        dir +
          "//" +
          req.body.series +
          "//" +
          req.body.season +
          s +
          "_" +
          previousChange +
          ".jpg"
      );
    req.body.theme &&
      deleteOneFile(
        dir + "//" + req.body.series + "//" + previousChange + ".mp3"
      );
  }
  //delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isEpisode) &&
    deleteOneFile(
      dir + "//poster//" + req.body.id + "_" + req.body.changes + ".jpg"
    );
  (req.body.theme === "" || !isEpisode) &&
    deleteOneFile(
      dir + "//theme//" + req.body.id + "_" + req.body.changes + ".mp3"
    );
  (req.body.german === "" || !isEpisode) &&
    deleteOneFile(
      dir + "//de//" + req.body.id + "_" + req.body.changes + "._de.mp4"
    );
  (req.body.poster === "" || !isEpisode) &&
    deleteOneFile(
      dir + "//en//" + req.body.id + "_" + req.body.changes + "._en.mp4"
    );
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
