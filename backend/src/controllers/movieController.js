const sequelize = require("../config/databaseConfig");
const Movies = require("../models/movieModel");
//
const https = require("https");
const fs = require("fs");
//
const dir = "E:\\vib\\movies\\";

//------------------------------------------------------------------------
// QUERY movie data
//------------------------------------------------------------------------
/**
 * @req -
 * @res all movies
 */
const getAllMovies = async (req, res) => {
  let movies = await Movies.findAll({
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    err &&
      res.status(500).send({
        message: "ERROR: Could not get all movies.",
      });
  });
  res.status(200).send(movies);
};

/**
 * @req id
 * @res one movie by id
 */
const getOneMovieById = async (req, res) => {
  let movie = await Movies.findOne({
    where: { id: req.params.id },
  }).catch((err) => {
    err &&
      res.status(500).send({ message: "ERROR: Could not get movie by 'id'." });
  });
  res.status(200).send(movie);
};

/**
 * @req -
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Movies.findAll().catch((err) => {
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
    //eliminates ", "
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
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not get distinct genres." });
  }
};

/**
 * @req genre
 * @res movies by genre
 */
const getMoviesByGenre = async (req, res) => {
  let movies;
  if (req.params.genre === "All" || req.params.genre === "0") {
    movies = await Movies.findAll({
      order: [[sequelize.literal("series, year"), "ASC"]],
    }).catch((err) => {
      err &&
        res
          .status(500)
          .send({ message: "ERROR: Could not filter movies by 'All'." });
    });
  } else if (req.params.genre === "Recent") {
    movies = await Movies.findAll({
      limit: 3,
      order: [[sequelize.literal("last_watched"), "DESC"]],
    }).catch((err) => {
      err &&
        res
          .status(500)
          .send({ message: "ERROR: Could not filter movies by 'Recent'." });
    });
  } else {
    movies = await Movies.findAll({
      where: {
        genre: sequelize.where(
          sequelize.col("genre"),
          "LIKE",
          "%" + req.params.genre + "%"
        ),
      },
      order: [[sequelize.literal("series, year"), "ASC"]],
    }).catch((err) => {
      err &&
        res
          .status(500)
          .send({ message: "ERROR: Could not filter movies by genre." });
    });
  }
  res.status(200).send(movies);
};

/**
 * @req search, input
 * @res movies by search
 */
const getMoviesBySearch = async (req, res) => {
  let movies = [];
  //
  let titles = await Movies.findAll({
    where: {
      title: sequelize.where(
        sequelize.col("title"),
        "LIKE",
        "%" + req.params.input + "%"
      ),
    },
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not filter movies by title." });
  });
  //
  let directors = await Movies.findAll({
    where: {
      director: sequelize.where(
        sequelize.col("director"),
        "LIKE",
        "%" + req.params.input + "%"
      ),
    },
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not filter movies by director." });
  });
  //
  let actors = await Movies.findAll({
    where: {
      actors: sequelize.where(
        sequelize.col("actors"),
        "LIKE",
        "%" + req.params.input + "%"
      ),
    },
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    err &&
      res
        .status(500)
        .send({ message: "ERROR: Could not filter movies by actor." });
  });
  //
  //conclude results
  let arr = titles.concat(directors).concat(actors);
  //get distinct movies by title
  movies = [...new Map(arr.map((item) => [item["title"], item])).values()];
  //sort movies by title
  movies.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );
  //
  res.status(200).send(movies);
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE movie data
//------------------------------------------------------------------------
/**
 * @req movie
 * @res movie as result
 */
const createMovie = async (req, res) => {
  await Movies.create({
    title: req.body.title,
    series: req.body.series ? req.body.series : req.body.title,
    fsk: req.body.fsk,
    director: req.body.director,
    genre: req.body.genre,
    year: req.body.year,
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
            "ERROR: Could not create data of movie'" + req.body.title + "'.",
        });
    });
};

/**
 * @req movie
 * @res -
 */
const updateMovie = async (req, res) => {
  await Movies.update(
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.series && { series: req.body.series }),
      ...(req.body.fsk && { fsk: req.body.fsk }),
      ...(req.body.director && { director: req.body.director }),
      ...(req.body.genre && { genre: req.body.genre }),
      ...(req.body.year && { year: req.body.year }),
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
      res
        .status(200)
        .send({ message: "movie data of'" + req.body.title + "' was updated" })
    )
    .catch((err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not update data of movie'" + req.body.title + "'.",
        });
    });
};

/**
 * @param req
 * @param posterName
 * @param trailerName
 * @param germanName
 * @param englishName
 */
const updateFileData = async (
  req,
  posterName,
  trailerName,
  germanName,
  englishName
) => {
  await Movies.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterName }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.trailer
        ? { trailer: trailerName }
        : req.body.trailer === "" && { trailer: "" }),
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
          "ERROR: Could not update file data of movie'" + req.body.title + "'.",
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
  await Movies.destroy({ where: { id: req.body.id } })
    .then(
      res
        .status(200)
        .send({ message: "movie '" + req.body.title + "' was deleted" })
    )
    .catch((err) => {
      err &&
        res.status(500).send({
          message: "ERROR: Could not delete movie '" + req.body.title + "'.",
        });
    });
};

//------------------------------------------------------------------------
// UPDATE / DELETE movie files
//------------------------------------------------------------------------
/**
 * @req movie including new id
 * @res -
 */
const updateMovieFiles = async (req, res) => {
  let isPosterReady = req.body.poster ? false : true;
  let isTrailerReady = req.body.trailer ? false : true;
  let isGermanReady = req.body.german ? false : true;
  let isEnglishReady = req.body.english ? false : true;
  //
  let posterName = req.body.id + "_" + req.body.changes + ".jpg";
  let trailerName = req.body.id + "_" + req.body.changes + ".mp4";
  let germanName = req.body.id + "_de.mp4";
  let englishName = req.body.id + "_en.mp4";
  //
  let posterFolder = dir + "//poster//";
  let trailerFolder = dir + "//trailer//";
  let germanFolder = dir + "//de//";
  let englishFolder = dir + "//en//";
  //
  let posterPath = posterFolder + posterName;
  let trailerPath = trailerFolder + trailerName;
  let germanPath = germanFolder + germanName;
  let englishPath = englishFolder + englishName;
  //
  if (req.body.poster) {
    //create "dir" if not exists, "recursive: true" => for parent folder too
    !fs.existsSync(posterFolder) &&
      fs.mkdirSync(posterFolder, { recursive: true });
    //download poster from OMDB api to location
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(posterPath);
      https.get(req.body.poster, (response) => {
        response.pipe(file);
        file.on("error", (err) => {
          err &&
            res.status(500).send({
              message:
                "ERROR: Could not download poster of movie '" +
                req.body.title +
                "'.",
            });
        });
        file.on("finish", () => {
          file.close();
        });
        isPosterReady = true;
        //
        isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady &&
          //
          updateFileData(req, posterName, trailerName, germanName, englishName)
            .then(
              res.status(200).send({
                message: "files of movie '" + req.body.title + "' were updated",
              })
            )
            .then(
              deleteFiles(
                req,
                true,
                posterPath,
                trailerPath,
                germanPath,
                englishPath
              )
            );
      });
    } else {
      //copy and rename local file to directory
      fs.copyFile(req.body.poster, posterPath, (err) => {
        err &&
          res.status(500).send({
            message:
              "ERROR: Could not copy poster of movie '" + req.body.title + "'.",
          });
        isPosterReady = true;
        //
        isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady &&
          //
          updateFileData(req, posterName, trailerName, germanName, englishName)
            .then(
              res.status(200).send({
                message: "files of movie '" + req.body.title + "' were updated",
              })
            )
            .then(
              deleteFiles(
                req,
                true,
                posterPath,
                trailerPath,
                germanPath,
                englishPath
              )
            );
      });
    }
  }
  if (req.body.trailer) {
    !fs.existsSync(trailerFolder) &&
      fs.mkdirSync(trailerFolder, { recursive: true });
    fs.copyFile(req.body.trailer, trailerPath, (err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not copy trailer of movie'" + req.body.title + "'.",
        });
      isTrailerReady = true;
      //
      isPosterReady &&
        isTrailerReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        updateFileData(req, posterName, trailerName, germanName, englishName)
          .then(
            res.status(200).send({
              message: "files of movie '" + req.body.title + "' were updated",
            })
          )
          .then(
            deleteFiles(
              req,
              true,
              posterPath,
              trailerPath,
              germanPath,
              englishPath
            )
          );
    });
  }
  if (req.body.german) {
    !fs.existsSync(germanFolder) &&
      fs.mkdirSync(germanFolder, { recursive: true });
    fs.copyFile(req.body.german, germanPath, (err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not copy german of movie '" + req.body.title + "'.",
        });
      isGermanReady = true;
      //
      isPosterReady &&
        isTrailerReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        updateFileData(req, posterName, trailerName, germanName, englishName)
          .then(
            res.status(200).send({
              message: "files of movie '" + req.body.title + "' were updated",
            })
          )
          .then(
            deleteFiles(
              req,
              true,
              posterPath,
              trailerPath,
              germanPath,
              englishPath
            )
          );
    });
  }
  if (req.body.english) {
    !fs.existsSync(englishFolder) &&
      fs.mkdirSync(englishFolder, { recursive: true });
    fs.copyFile(req.body.english, englishPath, (err) => {
      err &&
        res.status(500).send({
          message:
            "ERROR: Could not copy english of movie '" + req.body.title + "'.",
        });
      isEnglishReady = true;
      //
      isPosterReady &&
        isTrailerReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        updateFileData(req, posterName, trailerName, germanName, englishName)
          .then(
            res.status(200).send({
              message: "files of movie '" + req.body.title + "' were updated",
            })
          )
          .then(
            deleteFiles(
              req,
              true,
              posterPath,
              trailerPath,
              germanPath,
              englishPath
            )
          );
    });
  }
};

/**
 * @param req
 * @param isMovie
 */
const deleteFiles = async (
  req,
  isMovie,
  posterPath,
  trailerPath,
  germanPath,
  englishPath
) => {
  //
  const deleteOneFile = (fileLocation) => {
    fs.existsSync(fileLocation) &&
      fs.rm(fileLocation, (err) => {
        err && console.log(err);
      });
  };
  //delete previous files to clean up
  if (isMovie) {
    let previousChange = req.body.changes - 1;
    req.body.poster &&
      deleteOneFile(
        dir + "//poster//" + req.body.id + "_" + previousChange + ".jpg"
      );
    req.body.trailer &&
      deleteOneFile(
        dir + "//trailer//" + req.body.id + "_" + previousChange + ".mp4"
      );
  }
  //delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isMovie) && deleteOneFile(posterPath);
  (req.body.trailer === "" || !isMovie) && deleteOneFile(trailerPath);
  (req.body.german === "" || !isMovie) && deleteOneFile(germanPath);
  (req.body.english === "" || !isMovie) && deleteOneFile(englishPath);
};

module.exports = {
  getAllMovies,
  getOneMovieById,
  getAllGenres,
  getMoviesByGenre,
  getMoviesBySearch,
  //
  createMovie,
  updateMovie,
  deleteMovie,
  //
  updateMovieFiles,
};
