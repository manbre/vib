const express = require("express");
const router = express.Router();
const seasonController = require("../controllers/seasonController");

router.get("/", seasonController.getAllSeasons);
router.get("/genres", seasonController.getAllGenres);
router.get("/genre/:genre", seasonController.getSeasonsByGenre);
router.get("/search/:input", seasonController.getSeasonsBySearch);
//
router.post("/", seasonController.createSeason);
router.put("/", seasonController.updateSeason);
router.delete("/", seasonController.deleteSeason);
//
router.put("/files", seasonController.updateSeasonFiles);

module.exports = router;
