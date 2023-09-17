const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", movieController.getAllMovies);
router.get("/id/:id", movieController.getOneMovieById);
router.get("/genres", movieController.getAllGenres);
router.get("/genre/:genre", movieController.getMoviesByGenre);
router.get("/search/:search/:input", movieController.getMoviesBySearch);
//
router.post("/", movieController.createMovie);
router.put("/", movieController.updateMovie);
router.delete("/", movieController.deleteMovie);
//
router.put("/files", movieController.updateMovieFiles);

module.exports = router;
