const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

router.get("/video/:type/:filename", streamController.getVideoStream);
router.get("/image/:filename", streamController.getImageStream);

module.exports = router;
