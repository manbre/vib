const sequelize = require("../config/databaseConfig");
const Movies = require("../models/movieModel");
//
const https = require("https");
const fs = require("fs");
//
const path = "E:\\vib\\movies\\";
const dir = path;

//------------------------------------------------------------------------
// QUERY movie data
//------------------------------------------------------------------------
/**
 * @req -
 * @res all movies
 */
const getAllMovies = async (req, res) => {
  let movies;
  await Movies.findAll({
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    res.status(500).send({
      message: "error while getting all movies: " + err,
    });
  });
  res.send(movies);
};

/**
 * @req id
 * @res one movie by id
 */
const getOneMovieById = async (req, res) => {
  let movie;
  movie = await Movies.findOne({
    where: { id: req.params.id },
  }).catch((err) => {
    res.status(500).send({
      message: "error while getting movie data by id: " + err,
    });
  });
  res.send(movie);
};

/**
 * @req -
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
 * @req genre
 * @res movies by genre
 */
const getMoviesByGenre = async (req, res) => {
  let movies;
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
      }).catch((err) => {
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
      }).catch((err) => {
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
      }).catch((err) => {
        res.status(500).send({
          message: "error while filtering movie data by actor search: " + err,
        });
      });
      break;
    default:
  }
  res.send(movies);
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE movie data
//------------------------------------------------------------------------
/**
 * @param {*} req
 * @param {*} movie_id
 * @param {*} posterPath
 * @param {*} trailerPath
 * @param {*} germanPath
 * @param {*} englishPath
 */
const createFileData = async (
  req,
  movie_id,
  posterPath,
  trailerPath,
  germanPath,
  englishPath
) => {
  await Movies.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterPath }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.trailer
        ? { trailer: trailerPath }
        : req.body.trailer === "" && { trailer: "" }),
      ...(req.body.german
        ? { german: germanPath }
        : req.body.german === "" && { german: "" }),
      ...(req.body.english
        ? { english: englishPath }
        : req.body.english === "" && { english: "" }),
    },
    { where: { id: movie_id } }
  );
};

/**
 * @req movie
 * @res -
 */
const createMovie = async (req, res) => {
  let movie_id;
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
    changes: req.body.changes + 1,
  })
    //=====================================================
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: "error while creating movie '" + req.body.title + "': " + err,
      });
    });
};

/**
 * @req movie
 * @res -
 */
const updateMovie = async (req, res) => {
  let movie_id = req.body.id;
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
      ...(req.body.changes && { changes: req.body.changes + 1 }),
      ...(req.body.elapsed_time && { elapsed_time: req.body.elapsed_time }),
      ...(req.body.last_viewed && { last_viewed: req.body.last_viewed }),
    },
    {
      where: { id: movie_id },
    }
  )
    //=====================================================

    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      res.status(500).send(err);
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
    .then(() => res.status(200))
    .catch((err) => res.status(500).send(err));
};

//------------------------------------------------------------------------
// CREATE / DELETE movie files
//------------------------------------------------------------------------
/**
 * @req movie including new id
 * @res -
 */
const updateMovieFiles = async (req, res) => {
  let movie_id = req.body.id;
  let isPosterReady = req.body.poster ? false : true;
  let isTrailerReady = req.body.trailer ? false : true;
  let isGermanReady = req.body.german ? false : true;
  let isEnglishReady = req.body.english ? false : true;
  //
  let num = req.body.changes + 1;
  let posterPath = movie_id + "_" + num + ".jpg";
  let trailerPath = movie_id + "_" + num + ".mp4";
  let germanPath = movie_id + "_" + num + "_de.mp4";
  let englishPath = movie_id + "_" + num + "_en.mp4";
  //
  let posterDir = dir + "//poster//";
  let trailerDir = dir + "//trailer//";
  let germanDir = dir + "//de//";
  let englishDir = dir + "//en//";
  //
  if (req.body.poster) {
    //create "dir" if not exists, "recursive: true" => for parent folder too
    !fs.existsSync(posterDir) && fs.mkdirSync(posterDir, { recursive: true });
    //download poster from OMDB api to location
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(posterDir + posterPath);
      https.get(req.body.poster, (result) => {
        result.pipe(file);
        file.on("error", (err) => {
          err && res.status(500).send(err);
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
          createFileData(
            req,
            movie_id,
            posterPath,
            trailerPath,
            germanPath,
            englishPath
          )
            .then(res.status(200))
            .catch((err) => res.status(500).send(err));
      });
    } else {
      //copy and rename local file to directory
      fs.copyFile(req.body.poster, posterDir + posterPath, (err) => {
        err && res.status(500).send(err);
        isPosterReady = true;
        //
        isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady &&
          //
          createFileData(
            req,
            movie_id,
            posterPath,
            trailerPath,
            germanPath,
            englishPath
          )
            .then(res.status(200))
            .catch((err) => res.status(500).send(err));
      });
    }
  }
  if (req.body.trailer) {
    !fs.existsSync(trailerDir) && fs.mkdirSync(trailerDir, { recursive: true });
    fs.copyFile(req.body.trailer, trailerDir + trailerPath, (err) => {
      err && res.status(500).send(err);
      isTrailerReady = true;
      //
      isPosterReady &&
        isTrailerReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        createFileData(
          req,
          movie_id,
          posterPath,
          trailerPath,
          germanPath,
          englishPath
        )
          .then(res.status(200))
          .catch((err) => res.status(500).send(err));
    });
  }
  if (req.body.german) {
    !fs.existsSync(germanDir) && fs.mkdirSync(germanDir, { recursive: true });
    fs.copyFile(req.body.german, germanDir + germanPath, (err) => {
      err && res.status(500).send(err);
      isGermanReady = true;
      //
      isPosterReady &&
        isTrailerReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        createFileData(
          req,
          movie_id,
          posterPath,
          trailerPath,
          germanPath,
          englishPath
        )
          .then(res.status(200))
          .catch((err) => res.status(500).send(err));
    });
  }
  if (req.body.english) {
    !fs.existsSync(englishDir) && fs.mkdirSync(englishDir, { recursive: true });
    fs.copyFile(req.body.english, englishDir + englishPath, (err) => {
      err && res.status(500).send(err);
      isEnglishReady = true;
      //
      isPosterReady &&
        isTrailerReady &&
        isGermanReady &&
        isEnglishReady &&
        //
        createFileData(
          req,
          movie_id,
          posterPath,
          trailerPath,
          germanPath,
          englishPath
        )
          .then(res.status(200))
          .catch((err) => res.status(500).send(err));
    });
  }
};

/**
 * @param {*} req
 * @param {*} isMovie
 */
const deleteFiles = (req, isMovie) => {
  let num = req.body.changes;
  let posterDir = dir + "//poster//" + req.body.id + "_" + num + ".jpg";
  let trailerDir = dir + "//trailer//" + req.body.id + "_" + num + ".mp4";
  let germanDir = dir + "//de//" + req.body.id + "_" + num + "_de.mp4";
  let englishDir = dir + "//en//" + req.body.id + "_" + num + "_en.mp4";
  //delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isMovie) &&
    fs.existsSync(posterDir) &&
    fs.rm(posterDir, (err) => {
      console.log(err);
    });
  (req.body.trailer === "" || !isMovie) &&
    fs.existsSync(trailerDir) &&
    fs.rm(trailerDir, (err) => {
      console.log(err);
    });
  (req.body.german === "" || !isMovie) &&
    fs.existsSync(germanDir) &&
    fs.rm(germanDir, (err) => {
      console.log(err);
    });
  (req.body.english === "" || !isMovie) &&
    fs.existsSync(englishDir) &&
    fs.rm(englishDir, (err) => {
      console.log(err);
    });
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
