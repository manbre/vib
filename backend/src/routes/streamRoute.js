const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

router.get("/media/:type/:filename", streamController.getMediaStream);
router.get("/image/:filename", streamController.getImageStream);

module.exports = router;
