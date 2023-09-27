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
  let movies;
  await Movies.findAll({
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    res.status(500).send({
      message: "get-all movies error: " + err,
    });
  });
  res.status(200).send(movies);
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
    res.status(500).send({ message: "get-movie by id error: " + err });
  });
  res.status(200).send(movie);
};

/**
 * @req -
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Movies.findAll().catch((err) => {
    res.status(500).send({ message: "get-all genres error: " + err });
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
      if (!distinct.includes(withoutComma[i]) && withoutComma[i] != "") {
        distinct.push(str);
      }
    }
    //in alphabetical order
    distinct.sort();
    res.status(200).send(distinct);
  } catch (err) {
    res.status(500).send({ message: "get-distinct genres error: " + err });
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
      res.status(500).send({ message: "filter-movie by all error: " + err });
    });
  } else if (req.params.genre === "Recent") {
    movies = await Movies.findAll({
      limit: 3,
      order: [[sequelize.literal("last_watched"), "DESC"]],
    }).catch((err) => {
      res.status(500).send({ message: "filter-movie by recent error: " + err });
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
      res.status(500).send({ message: "filter-movie by genre error: " + err });
    });
  }
  res.status(200).send(movies);
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
        res
          .status(500)
          .send({ message: "filter-movie by title error: " + err });
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
        res
          .status(500)
          .send({ message: "filter-movie by director error: " + err });
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
        res
          .status(500)
          .send({ message: "filter-movie by actor error: " + err });
      });
      break;
    default:
  }
  res.status(200).send(movies);
};

//------------------------------------------------------------------------
// CREATE, UPDATE, DELETE movie data
//------------------------------------------------------------------------
/**
 * @param {*} req
 * @param {*} isMovie
 */
const deleteFiles = async (req, isMovie) => {
  //delete previous file
  let previousChange = req.body.changes - 1;
  isMovie &&
    req.body.poster &&
    deleteFile(
      dir + "//poster//" + req.body.id + "_" + previousChange + ".jpg"
    );
  isMovie &&
    req.body.trailer &&
    deleteFile(
      dir + "//trailer//" + req.body.id + "_" + previousChange + ".mp4"
    );
  //delete file if
  //-> entry is empty and movie exist
  //-> or if movie not exist
  (req.body.poster === "" || !isMovie) &&
    deleteFile(
      dir + "//poster//" + req.body.id + "_" + req.body.changes + ".jpg"
    );
  (req.body.trailer === "" || !isMovie) &&
    deleteFile(
      dir + "//trailer//" + req.body.id + "_" + req.body.changes + ".mp4"
    );
  (req.body.german === "" || !isMovie) &&
    deleteFile(
      dir + "//de//" + req.body.id + "_" + req.body.changes + "._de.mp4"
    );
  (req.body.poster === "" || !isMovie) &&
    deleteFile(
      dir + "//en//" + req.body.id + "_" + req.body.changes + "._en.mp4"
    );
};
const deleteFile = (dir) => {
  fs.existsSync(dir) &&
    fs.rm(dir, (err) => {
      if (err) throw err;
    });
};
/**
 * @param req
 * @param movie_id
 * @param posterPath
 * @param trailerPath
 * @param germanPath
 * @param englishPath
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
  ).then(deleteFiles(req, true));
};

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
      res.status(500).send({
        message: "create-movie '" + req.body.title + "' error: " + err,
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
      ...(req.body.elapsed_time && { elapsed_time: req.body.elapsed_time }),
      ...(req.body.last_viewed && { last_viewed: req.body.last_viewed }),
      changes: req.body.changes,
    },
    {
      where: { id: movie_id },
    }
  )
    .then(
      res
        .status(200)
        .send({ message: "movie data of'" + req.body.title + "' was updated" })
    )
    .catch((err) => {
      res.status(500).send({
        message: "update-movie '" + req.body.title + "' error: " + err,
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
      res.status(500).send({
        message: "delete-movie '" + req.body.title + "' error: " + err,
      });
    });
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
  let posterName = movie_id + "_" + req.body.changes + ".jpg";
  let trailerName = movie_id + "_" + req.body.changes + "_trailer.mp4";
  let germanName = movie_id + "_de.mp4";
  let englishName = movie_id + "_en.mp4";
  //
  let posterFolder = dir + "//poster//";
  let trailerFolder = dir + "//trailer//";
  let germanFolder = dir + "//de//";
  let englishFolder = dir + "//en//";
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
          if (err) throw err;
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
            posterName,
            trailerName,
            germanName,
            englishName
          );
      });
    } else {
      //copy and rename local file to directory
      fs.copyFile(req.body.poster, posterFolder + posterName, (err) => {
        if (err) throw err;
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
            posterName,
            trailerName,
            germanName,
            englishName
          );
      });
    }
  }
  if (req.body.trailer) {
    !fs.existsSync(trailerFolder) &&
      fs.mkdirSync(trailerFolder, { recursive: true });
    fs.copyFile(req.body.trailer, trailerFolder + trailerName, (err) => {
      if (err) throw err;
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
          posterName,
          trailerName,
          germanName,
          englishName
        );
    });
  }
  if (req.body.german) {
    !fs.existsSync(germanFolder) &&
      fs.mkdirSync(germanFolder, { recursive: true });
    fs.copyFile(req.body.german, germanFolder + germanName, (err) => {
      if (err) throw err;
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
          posterName,
          trailerName,
          germanName,
          englishName
        );
    });
  }
  if (req.body.english) {
    !fs.existsSync(englishFolder) &&
      fs.mkdirSync(englishFolder, { recursive: true });
    fs.copyFile(req.body.english, englishFolder + englishName, (err) => {
      if (err) throw err;
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
          posterName,
          trailerName,
          germanName,
          englishName
        );
    });
  }
  res.send("new files created");
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
