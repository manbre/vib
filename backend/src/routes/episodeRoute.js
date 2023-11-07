const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");

router.get("/season/:series/:season", episodeController.getAllEpisodesBySeason);
router.get("/recent/:series/:season/", episodeController.getRecentEpisodeBySeason);
router.get("/id/:id", episodeController.getOneEpisodeById);
//
router.post("/", episodeController.createEpisode);
router.put("/", episodeController.updateEpisode);
router.delete("/", episodeController.deleteEpisode);
//
router.put("/files", episodeController.updateEpisodeFiles);

module.exports = router;
