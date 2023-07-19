const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");


router.get("/", episodeController.getAllSeasons);
router.get("/series/:series", episodeController.getSeasonsBySeries);
router.get("/episodes/:series/:season", episodeController.getEpisodesBySeason);
router.get("/recent/:series/:season/", episodeController.getRecent);
router.get("/episodes", episodeController.getAllEpisodes);
router.get("/genres", episodeController.getAllGenres);
router.get("/genre/:genre", episodeController.getSeasonsByGenre);
//
router.post("/", episodeController.createNewEpisode);
router.post("/files", episodeController.copyEpisodeFiles);
//
router.put("/", episodeController.updateEpisode);
router.delete("/:id", episodeController.deleteEpisode);

module.exports = router;
