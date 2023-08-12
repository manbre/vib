const sequelize = require("../config/databaseConfig");
const Movies = require("../models/movieModel");
//
const https = require("https");
const fs = require("fs");
//
const path = "E:\\vib\\movies\\";
const dir = path;

//------------------------------------------------------------------------
// QUERIE movie data from database
//------------------------------------------------------------------------
/**
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Movies.findAll().catch((err) => {
    res.status(500).send({
      message: "error while getting all genres: " + err,
    });
  });
  try {
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
  } catch (err) {
    res.status(500).send({
      message: "error while getting distinct genres: " + err,
    });
  }
};

/**
 * @res all movies
 */
const getAllMovies = async (req, res) => {
  let movies = await Movies.findAll({
    order: [[sequelize.literal("series, year"), "ASC"]],
  })
    .then(() => {
      res.send(movies);
    })
    .catch((err) => {
      res.status(500).send({
        message: "error while getting all movies: " + err,
      });
    });
};

/**
 * @req id
 * @res movie by id
 */
const getOneMovieById = async (req, res) => {
  let movie = await Movies.findOne({
    where: { id: req.params.id },
  }).catch((err) => {
    res.status(500).send({
      message: "error while getting movie data by id: " + err,
    });
  });
  res.send(movie);
};

/**
 * @req genre
 * @res movies by genre
 */
const getMoviesByGenre = async (req, res) => {
  let movies = [];
  console.log(req.params.genre);
  if (req.params.genre === "All" || req.params.genre === "0") {
    movies = await Movies.findAll({
      order: [[sequelize.literal("series, year"), "ASC"]],
    }).catch((err) => {
      res.status(500).send({
        message: "error while filtering movie data by genre: ",
        err,
      });
    });
  } else if (req.params.genre === "Recent") {
    movies = await Movies.findAll({
      limit: 3,
      order: [[sequelize.literal("last_watched"), "DESC"]],
    }).catch((err) => {
      res.status(500).send({
        message: "error while filtering movie data by genre: ",
        err,
      });
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
      res.status(500).send({
        message: "error while filtering movie data by genre: ",
        err,
      });
    });
  }
  res.send(movies);
};

/**
 * @req search, input
 * @res movies by search
 */
const getMoviesBySearch = async (req, res) => {
  let movies;
  switch (req.params.search) {
    case "title":
      movies = await Movies.findAll({
        where: {
          title: sequelize.where(
            sequelize.col("title"),
            "LIKE",
            "%" + req.params.input + "%"
          ),
        },
        order: [[sequelize.literal("series, year"), "ASC"]],
      })
        .then(() => {
          res.send(movies);
        })
        .catch((err) => {
          res.status(500).send({
            message: "error while filtering movie data by title search: " + err,
          });
        });
      break;
    case "director":
      movies = await Movies.findAll({
        where: {
          director: sequelize.where(
            sequelize.col("director"),
            "LIKE",
            "%" + req.params.input + "%"
          ),
        },
        order: [[sequelize.literal("series, year"), "ASC"]],
      })
        .then(() => {
          res.send(movies);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              "error while filtering movie data by director search: " + err,
          });
        });
      break;
    case "actor":
      movies = await Movies.findAll({
        where: {
          actors: sequelize.where(
            sequelize.col("actors"),
            "LIKE",
            "%" + req.params.input + "%"
          ),
        },
        order: [[sequelize.literal("series, year"), "ASC"]],
      })
        .then(() => {
          res.send(movies);
        })
        .catch((err) => {
          res.status(500).send({
            message: "error while filtering movie data by actor search: " + err,
          });
        });
      break;
  }
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE movie data from database
//------------------------------------------------------------------------

/**
 * @req movie
 */
const createMovieData = async (req, res) => {
  let posterPath = req.body.title + ".jpg";
  let trailerPath = req.body.title + ".mp4";
  let germanPath = req.body.title + "_de.mp4";
  let englishPath = req.body.title + "_en.mp4";
  //
  await Movies.create({
    title: req.body.title,
    series: req.body.series ? req.body.series : req.body.title,
    part: req.body.part,
    director: req.body.director,
    genre: req.body.genre,
    //
    year: req.body.year,
    awards: req.body.awards,
    rating: req.body.rating,
    runtime: req.body.runtime,
    //
    actors: req.body.actors,
    plot: req.body.plot,
    //
    poster: req.body.poster && posterPath,
    trailer: req.body.trailer && trailerPath,
    german: req.body.german && germanPath,
    english: req.body.english && englishPath,
  })
    .then(() => {
      res.status(200).send({
        message: "movie '" + req.body.title + "' has been inserted.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "error while inserting movie data of '" +
          req.body.title +
          "': " +
          err,
      });
    });
};

/**
 * @req movie
 */
const updateMovieData = async (req, res) => {
  let posterPath = req.body.title + ".jpg";
  let trailerPath = req.body.title + ".mp4";
  let germanPath = req.body.title + "_de.mp4";
  let englishPath = req.body.title + "_en.mp4";

  await Movies.update(
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.series && { series: req.body.series }),
      ...(req.body.part && { part: req.body.part }),
      ...(req.body.director && { director: req.body.director }),
      ...(req.body.genre && { genre: req.body.genre }),
      //
      ...(req.body.year && { year: req.body.year }),
      ...(req.body.awards && { awards: req.body.awards }),
      ...(req.body.rating && { rating: req.body.rating }),
      ...(req.body.runtime && { runtime: req.body.runtime }),
      //
      ...(req.body.actors && { director: req.body.actors }),
      ...(req.body.plot && { plot: req.body.plot }),
      //
      ...(req.body.poster && { poster: posterPath }),
      ...(req.body.trailer && { trailer: trailerPath }),
      ...(req.body.german && { german: germanPath }),
      ...(req.body.english && { english: englishPath }),
      //
      ...(req.body.elapsed_time && { elapsed_time: req.body.elapsed_time }),
      ...(req.body.last_viewed && { last_viewed: req.body.last_viewed }),
    },
    {
      where: { id: req.body.id },
    }
  )
    .then(() => {
      res.status(200).send({
        message: "movie data of '" + req.body.title + "' have been updated.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "error while updating movie data of '" + req.body.title + "': ",
        err,
      });
    });
};

/**
 * @req movie
 */
const deleteMovieData = async (req, res) => {
  await Movies.destroy({ where: { id: req.body.id } })
    .then(() => {
      res.status(200).send({
        message: "movie data of '" + req.body.title + "' have been removed.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "error while removing movie data of '" + req.body.title + "': ",
        err,
      });
    });
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE movie files
//------------------------------------------------------------------------

/**
 * @req movie
 * @res copy files to directory
 */
const createMovieFiles = async (req, res) => {
  let posterIsReady = true;
  let trailerIsReady = true;
  let germanIsReady = true;
  let englishIsReady = true;

  let posterDir = dir + "//poster//";
  let trailerDir = dir + "//trailer//";
  let germanDir = dir + "//de//";
  let englishDir = dir + "//en//";
  //

  if (req.body.poster) {
    posterIsReady = false;
    //create "dir" if not exists, "recursive: true" => for parent folder too
    !fs.existsSync(posterDir) && fs.mkdirSync(posterDir, { recursive: true });
    //download poster from OMDB api to location
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(posterDir + req.body.title + ".jpg");
      https
        .get(req.body.poster, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
          });
        })
        .then((posterIsReady = true))
        .then(console.log("poster is ready"));
    } else {
      //copy and rename file to directory
      fs.copyFile(req.body.poster, posterDir + req.body.title + ".jpg")
        .then((posterIsReady = true))
        .then(console.log("poster is ready"));
    }
  } else {
    fs.existsSync(posterDir) &&
      fs
        .rm(posterDir, (err) => {
          console.log(err);
        })
        .then((posterIsReady = true));
  }
  //
  if (req.body.trailer) {
    trailerIsReady = false;
    !fs.existsSync(trailerDir) && fs.mkdirSync(trailerDir, { recursive: true });
    fs.copyFile(req.body.trailer, trailerDir + req.body.title + ".mp4")
      .then((trailerIsReady = true))
      .then(console.log("trailer is ready"));
  } else {
    fs.existsSync(trailerDir) &&
      fs
        .rm(trailerDir, (err) => {
          console.log(err);
        })
        .then((trailerIsReady = true));
  }
  //
  if (req.body.german) {
    germanIsReady = false;
    !fs.existsSync(germanDir) && fs.mkdirSync(germanDir, { recursive: true });
    fs.copyFile(req.body.german, req.body.title + "_de.mp4")
      .then((germanIsReady = true))
      .then(console.log("german is ready"));
  } else {
    fs.existsSync(germanDir) &&
      fs
        .rm(germanDir, (err) => {
          console.log(err);
        })
        .then((germanIsReady = true));
  }
  //
  if (req.body.english) {
    englishIsReady = false;
    !fs.existsSync(englishDir) && fs.mkdirSync(englishDir, { recursive: true });
    fs.copyFile(req.body.english, req.body.title + "_en.mp4")
      .then((englishIsReady = true))
      .then(console.log("english is ready"));
  } else {
    fs.existsSync(englishDir) &&
      fs
        .rm(englishDir, (err) => {
          console.log(err);
        })
        .then((englishIsReady = true));
  }
  posterIsReady &&
    trailerIsReady &&
    germanIsReady &&
    englishIsReady &&
    res.status(200).send({
      message: "movie files of '" + req.body.title + "' have been updated.",
    });
};

const updateMovieFiles = async (req, res) => {
  let oldPosterDir = dir + "//poster//" + req.body.old_title + ".jpg";
  let oldTrailerDir = dir + "//trailer//" + req.body.old_title + ".mp4";
  let oldGermanDir = dir + "//de//" + req.body.old_title + "_de.mp4";
  let oldEnglishDir = dir + "//en//" + req.body.old_title + "_en.mp4";
  //
  let newPosterDir = dir + "//poster//" + req.body.title + ".jpg";
  let newTrailerDir = dir + "//trailer//" + req.body.title + ".mp4";
  let newGermanDir = dir + "//de//" + req.body.title + "_de.mp4";
  let newEnglishDir = dir + "//en//" + req.body.title + "_en.mp4";
  //
  console.log(req.body.poster);
  req.body.poster &&
    fs.rename(oldPosterDir, newPosterDir, (err) => {
      err && console.log(err);
    });
  req.body.trailer &&
    fs.rename(oldTrailerDir, newTrailerDir, (err) => {
      err && console.log(err);
    });
  req.body.german &&
    fs.rename(oldGermanDir, newGermanDir, (err) => {
      err && console.log(err);
    });
  req.body.english &&
    fs.rename(oldEnglishDir, newEnglishDir, (err) => {
      err && console.log(err);
    });
  res.status(200).send({
    message: "movie files of '" + req.body.title + "' have been updated.",
  });
};

/**
 * @req movie
 */
const deleteMovieFiles = async (req, res) => {
  try {
    let posterDir = dir + "//poster//" + req.body.title + ".jpg";
    let trailerDir = dir + "//trailer//" + req.body.title + ".mp4";
    let germanDir = dir + "//de//" + req.body.title + "_de.mp4";
    let englishDir = dir + "//en//" + req.body.title + "_en.mp4";
    //delete file if is not in the body and exist
    !req.body.poster &&
      fs.existsSync(posterDir) &&
      fs.rm(posterDir, (err) => {
        console.log(err);
      });
    !req.body.trailer &&
      fs.existsSync(trailerDir) &&
      fs.rm(trailerDir, (err) => {
        console.log(err);
      });
    !req.body.german &&
      fs.existsSync(germanDir) &&
      fs.rm(germanDir, (err) => {
        console.log(err);
      });
    !req.body.english &&
      fs.existsSync(englishDir) &&
      fs.rm(englishDir, (err) => {
        console.log(err);
      });
  } catch {
    res.status(500).send({
      message: "error while removing movie files of '" + req.body.title + "': ",
      err,
    });
  }
  res.status(200).send({
    message: "movie files of '" + req.body.title + "' have been removed.",
  });
};

module.exports = {
  getAllGenres,
  //
  getAllMovies,
  getOneMovieById,
  getMoviesBySearch,
  getMoviesByGenre,
  //
  createMovieData,
  updateMovieData,
  deleteMovieData,
  //
  createMovieFiles,
  updateMovieFiles,
  deleteMovieFiles,
};
