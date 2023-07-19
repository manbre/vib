const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", movieController.getAllMovies);
router.get("/genres", movieController.getAllGenres);
router.get("/genre/:genre", movieController.getMoviesByGenre);
router.get("/search/:search/:input", movieController.getMoviesBySearch);
//
router.post("/", movieController.createNewMovie);
router.post("/files", movieController.copyMovieFiles);
//
router.put("/", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
