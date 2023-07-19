const sequelize = require("../config/databaseConfig");
const Movies = require("../models/movieModel");
//
const https = require("https");
const fs = require("fs");
//
const path = "E:\\vib\\movies\\";
const dir =  path;
/**
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Movies.findAll().catch((err) => {
    res.send(err);
  });
  let a = [];
  //get data out of json
  for (let i = 0; i < genres.length; i++) {
    let str = genres[i].genre;
    a.push(str);
  }
  let b = a.toString().split(", ");
  let c = b.toString().split(",");
  //eliminate duplicates and spaces
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
 * @res all movies
 */
const getAllMovies = async (req, res) => {
  let movies = await Movies.findAll({
    order: [[sequelize.literal("series, part,  year"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
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
        order: [[sequelize.literal("series, part, year"), "ASC"]],
      }).catch((err) => {
        res.send(err);
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
        order: [[sequelize.literal("series, part, year"), "ASC"]],
      }).catch((err) => {
        res.send(err);
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
        order: [[sequelize.literal("series, part, year"), "ASC"]],
      }).catch((err) => {
        res.send(err);
      });
      break;
  }
  res.send(movies);
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
      order: [[sequelize.literal("series, part, year"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  } else if (req.params.genre === "Recent") {
    movies = await Movies.findAll({
      limit: 3,
      order: [[sequelize.literal("last_watched"), "DESC"]],
    }).catch((err) => {
      res.send(err);
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
      order: [[sequelize.literal("series, part, year"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  }
  res.send(movies);
};

/**
 * @req movie
 */
const createNewMovie = async (req, res) => {
  let posterPath = req.body.title + ".jpg";
  let trailerPath = req.body.title + ".mp4";
  let germanPath = req.body.title + "_de.mp4";
  let englishPath = req.body.title + "_en.mp4";
  //
  await Movies.create({
    title: req.body.title,
    series: req.body.series,
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
    .catch((err) => {
      res.status(500).send({
        message: "error while inserting movie '" + req.body.title + "'",
      });
      res.send(err);
    })
    .then(() => {
      res.status(200).send({
        message: "movie '" + req.body.title + "' has been inserted.",
      });
    });
};

/**
 * @req movie
 */
const updateMovie = async (req, res) => {
  let posterPath = req.body.title + ".jpg";
  let trailerPath = req.body.title + ".mp4";
  let germanPath = req.body.title + "_de.mp4";
  let englishPath = req.body.title + "_en.mp4";
  //
  await Movies.update(
    {
      ...(req.body.title ? { title: req.body.title } : {}),
      ...(req.body.series ? { series: req.body.series } : {}),
      ...(req.body.part ? { part: req.body.part } : {}),
      ...(req.body.director ? { director: req.body.director } : {}),
      ...(req.body.genre ? { genre: req.body.genre } : {}),
      //
      ...(req.body.year ? { year: req.body.year } : {}),
      ...(req.body.awards ? { awards: req.body.awards } : {}),
      ...(req.body.rating ? { rating: req.body.rating } : {}),
      ...(req.body.runtime ? { runtime: req.body.runtime } : {}),
      //
      ...(req.body.actors ? { director: req.body.actors } : {}),
      ...(req.body.plot ? { plot: req.body.plot } : {}),
      //
      ...(req.body.poster ? { poster: posterPath } : {}),
      ...(req.body.trailer ? { trailer: trailerPath } : {}),
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
        message: "error while updating movie '" + req.body.title + "'.",
      });
      res.send(err);
    })
    .then(() => {
      res.status(200).send({
        message: "movie '" + req.body.title + "' has been updated.",
      });
    });
};

/**
 * @req id
 */
const deleteMovie = async (req, res) => {
  let posterDir = dir + "//poster//" + req.body.title + ".jpg";
  let trailerDir = dir + "//trailer//" + req.body.title + ".mp4";
  let germanDir = dir + "//de//" + req.body.title + "_de.mp4";
  let englishDir = dir + "//en//" + req.body.title + "_en.mp4";
  //
  await Movies.destroy({ where: { id: req.params.id } }).catch((err) => {
    res.send(err);
  });
  //delete files if exist
  fs.existsSync(posterDir) && fs.unlinkSync(posterDir);
  fs.existsSync(trailerDir) && fs.unlinkSync(trailerDir);
  fs.existsSync(germanDir) && fs.unlinkSync(germanDir);
  fs.existsSync(englishDir) && fs.unlinkSync(englishDir);

  res.status(200).send({
    message: "movie '" + req.body.title + "' was removed.",
  });
};

/**
 * @req movie
 * @res copy files to directory
 */
const copyMovieFiles = async (req, res) => {
  let isPosterReady = req.body.poster ? false : true;
  let isTrailerReady = req.body.trailer ? false : true;
  let isGermanReady = req.body.german ? false : true;
  let isEnglishReady = req.body.english ? false : true;
  //
  let posterDir = dir + "//poster//";
  let trailerDir = dir + "//trailer//";
  let germanDir = dir + "//de//";
  let englishDir = dir + "//en//";
  //
  if (req.body.poster) {
    !fs.existsSync(posterDir) && fs.mkdirSync(posterDir, { recursive: true });
    //download poster from OMDB api to location
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(posterDir + req.body.title + ".jpg");
      https.get(req.body.poster, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
        });
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      });
    } else {
      !fs.existsSync(posterDir) && fs.mkdirSync(posterDir, { recursive: true });
      //copy poster to directory
      fs.copyFile(
        req.body.poster,
        posterDir + req.body.title + ".jpg",
        (err) => {
          if (err) throw err;
          isPosterReady = true;
          console.log("poster ready");
          if (
            isPosterReady &&
            isTrailerReady &&
            isGermanReady &&
            isEnglishReady
          ) {
            res.status(200).send({
              message: "copy files finished",
            });
          }
        }
      );
    }
  }
  //
  if (req.body.trailer) {
    !fs.existsSync(trailerDir) && fs.mkdirSync(trailerDir, { recursive: true });
    //copy and rename trailer to directory
    fs.copyFile(
      req.body.trailer,
      trailerDir + req.body.title + ".mp4",
      (err) => {
        if (err) throw err;
        isTrailerReady = true;
        console.log("trailer ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      }
    );
  }
  //
  if (req.body.german) {
    !fs.existsSync(germanDir) && fs.mkdirSync(germanDir, { recursive: true });
    //copy and rename german video to directory
    fs.copyFile(
      req.body.german,
      germanDir + req.body.title + "_de.mp4",
      (err) => {
        if (err) throw err;
        isGermanReady = true;
        console.log("german ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      }
    );
  }
  //
  if (req.body.english) {
    !fs.existsSync(englishDir) && fs.mkdirSync(englishDir, { recursive: true });
    //copy and rename english video to directory
    fs.copyFile(
      req.body.english,
      englishDir + req.body.title + "_en.mp4",
      (err) => {
        if (err) throw err;
        isEnglishReady = true;
        console.log("english ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      }
    );
  }
};

module.exports = {
  getAllGenres,
  //
  getAllMovies,
  getMoviesBySearch,
  getMoviesByGenre,
  //
  createNewMovie,
  updateMovie,
  deleteMovie,
  //
  copyMovieFiles,
};
