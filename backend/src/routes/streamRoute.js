const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

router.get("/track/:type/:filename", streamController.getTrackStream);
router.get("/poster/:filename", streamController.getPosterStream);

module.exports = router;
