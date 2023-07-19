const express = require("express");
const router = express.Router();
const omdbController = require("../controllers/omdbController");

router.get("/:title", omdbController.getOMDBData);
router.get("/:title/:year", omdbController.getOMDBData);

module.exports = router;
