const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

router.get("/video/:type/:media/:filename", streamController.getVideoStream);
router.get("/image/:type/:filename", streamController.getImageStream);
router.get("/audio/:filename", streamController.getAudioStream);

module.exports = router;
