const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");

router.get("/season/:id", episodeController.getAllEpisodesBySeason);
router.get("/season/recent/:id", episodeController.getRecentEpisodeBySeason);
router.get("/episode/:seasonId/:episodeNr", episodeController.getOneEpisode);
router.get("/id/:id", episodeController.getOneEpisodeById);
//
router.post("/", episodeController.createEpisode);
router.put("/", episodeController.updateEpisode);
router.delete("/", episodeController.deleteEpisode);
//
router.put("/files", episodeController.updateEpisodeFiles);

module.exports = router;
