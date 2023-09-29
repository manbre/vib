const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");


router.get("/", episodeController.getAllSeasons);
router.get("/series/:series", episodeController.getSeasonsBySeries);
router.get("/id/:id", movieController.getOneEpisodeById);
router.get("/genres", episodeController.getAllGenres);
router.get("/genre/:genre", episodeController.getSeasonsByGenre);
router.get("/:series/:season", episodeController.getEpisodesBySeason);
router.get("/recent/:series/:season/", episodeController.getRecentEpisode);
//
router.post("/", episodeController.createEpisode);
router.put("/", episodeController.updateEpisode);
router.delete("/", episodeController.deleteEpisode);
//
router.put("/files", episodeController.updateEpisodeFiles);

module.exports = router;
