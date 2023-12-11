const sequelize = require("../config/databaseConfig");
const Movies = require("../models/movieModel");
//
const fileOperations = require("../helpers/fileOperations");
const getAttributes = require("../helpers/getAttributes");
//
const https = require("https");
const fs = require("fs");
const path = require("path");
//
const dir = "G:\\vib\\";

//------------------------------------------------------------------------
// QUERY movie data
//------------------------------------------------------------------------
/**
 * @req -
 * @res all movies
 */
const getAllMovies = async (req, res) => {
  try {
    let movies = await Movies.findAll({
      order: [[sequelize.literal("series, year"), "ASC"]],
    });
    res.status(200).send(movies);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req id
 * @res one movie by id
 */
const getOneMovieById = async (req, res) => {
  try {
    let movie = await Movies.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(movie);
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
    let genres = await getAttributes.getGenres(Movies);
    res.status(200).send(genres);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req genre
 * @res movies by genre
 */
const getMoviesByGenre = async (req, res) => {
  let movies;
  try {
    switch (req.params.genre) {
      case "All":
      case "0":
        movies = await Movies.findAll({
          order: [[sequelize.literal("series", "year"), "ASC"]],
        });
        break;
      case "Recent":
        movies = await Movies.findAll({
          where: { lastWatched: { $ne: null } },
          limit: 3,
          order: [[sequelize.literal("lastWatched"), "DESC"]],
        });
        break;
      default:
        movies = await Movies.findAll({
          where: {
            genre: sequelize.where(
              sequelize.col("genre"),
              "LIKE",
              "%" + req.params.genre + "%"
            ),
          },
          order: [[sequelize.literal("series, year"), "ASC"]],
        });
    }
    res.status(200).send(movies);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/**
 * @req search, input
 * @res movies by search
 */
const getMoviesBySearch = async (req, res) => {
  let movies = [];
  //
  try {
    let titles = await Movies.findAll({
      where: {
        title: sequelize.where(
          sequelize.col("title"),
          "LIKE",
          "%" + req.params.input + "%"
        ),
      },
      order: [[sequelize.literal("series, year"), "ASC"]],
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
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
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
    director: req.body.director,
    genre: req.body.genre,
    //
    year: req.body.year,
    fsk: req.body.fsk,
    awards: req.body.awards,
    rating: req.body.rating,
    runtime: req.body.runtime,
    //
    actors: req.body.actors,
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
 * @req movie
 * @res -
 */
const updateMovie = async (req, res) => {
  await Movies.update(
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.series && { series: req.body.series }),
      ...(req.body.director && { director: req.body.director }),
      ...(req.body.genre && { genre: req.body.genre }),
      //
      ...(req.body.year && { year: req.body.year }),
      ...(req.body.fsk && { fsk: req.body.fsk }),
      ...(req.body.awards && { awards: req.body.awards }),
      ...(req.body.rating && { rating: req.body.rating }),
      ...(req.body.runtime && { runtime: req.body.runtime }),
      //
      ...(req.body.actors && { director: req.body.actors }),
      ...(req.body.plot && { plot: req.body.plot }),
      //
      changes: req.body.changes,
      //
      ...(req.body.elapsedTime && { elapsedTime: req.body.elapsedTime }),
      ...(req.body.lastWatched && { lastWatched: req.body.lastWatched }),
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
      res.status(500).send({
        error: err.message,
      });
    });
};

/**
 * @param req
 * @param posterName
 * @param teaserName
 * @param germanName
 * @param englishName
 */
const updateFileData = async (
  req,
  posterName,
  teaserName,
  germanName,
  englishName
) => {
  await Movies.update(
    {
      //no update if file is null / undefined
      ...(req.body.poster
        ? { poster: posterName }
        : req.body.poster === "" && { poster: "" }),
      ...(req.body.teaser
        ? { teaser: teaserName }
        : req.body.teaser === "" && { teaser: "" }),
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
      res.status(500).send({
        error: err.message,
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
  //
  try {
    let posterName = req.body.id + "_" + req.body.changes + ".jpg";
    let teaserName = req.body.id + "_" + req.body.changes + ".mp4";
    //"path.extname" gets the file type (e.g. .mp4 or .mpeg)
    let germanName = req.body.id + "_de" + path.extname(req.body.german + "");
    let englishName = req.body.id + "_en" + path.extname(req.body.english + "");
    //
    let posterFolder = dir + "//poster//";
    let teaserFolder = dir + "//teaser//";
    let germanFolder = dir + "//de//";
    let englishFolder = dir + "//en//";
    //
    let posterPath = posterFolder + posterName;
    let teaserPath = teaserFolder + teaserName;
    let germanPath = germanFolder + germanName;
    let englishPath = englishFolder + englishName;
    //
    let prevChange = req.body.changes - 1;
    let prevPosterPath = posterFolder + req.body.id + "_" + prevChange + ".jpg";
    let prevTeaserPath = teaserFolder + req.body.id + "_" + prevChange + ".mp4";
    //
    fileOperations.copyFile(req.body.poster, posterFolder, posterPath).then(
      fileOperations.copyFile(req.body.teaser, teaserFolder, teaserPath).then(
        fileOperations.copyFile(req.body.german, germanFolder, germanPath).then(
          fileOperations
            .copyFile(req.body.english, englishFolder, englishPath)
            .then(
              //link new files in database
              updateFileData(
                req,
                posterName,
                teaserName,
                germanName,
                englishName
              )
                .then(
                  res.status(200).send({
                    message:
                      "files of movie '" + req.body.title + "' were updated.",
                  })
                )
                .then(
                  //remove old files
                  deleteFiles(
                    req,
                    true,
                    posterPath,
                    teaserPath,
                    germanPath,
                    englishPath,
                    //
                    prevPosterPath,
                    prevTeaserPath
                  )
                )
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
 * @param isMovie
 * @param posterPath
 * @param teaserPath
 * @param germanPath
 * @param englishPath
 */
const deleteFiles = async (
  req,
  isMovie,
  posterPath,
  teaserPath,
  germanPath,
  englishPath,
  //
  prevPosterPath,
  prevTeaserPath
) => {
  //delete previous files to clean up
  if (isMovie) {
    req.body.poster && fileOperations.deleteFile(prevPosterPath);
    req.body.teaser && fileOperations.deleteFile(prevTeaserPath);
  }
  //delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isMovie) && fileOperations.deleteFile(posterPath);
  (req.body.teaser === "" || !isMovie) && fileOperations.deleteFile(teaserPath);
  (req.body.german === "" || !isMovie) && fileOperationsdeleteFile(germanPath);
  (req.body.english === "" || !isMovie) &&
    fileOperations.deleteFile(englishPath);
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
