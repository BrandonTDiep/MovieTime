const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies");

//Movies Routes - simplified for now
router.get("/:movieId", moviesController.getMoviePage);


module.exports = router;
