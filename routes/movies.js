const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Movies Routes - simplified for now
router.get("/search", ensureAuth, moviesController.getSearchedMovies); // this is where the "id" property is created in request :id query parameter
router.get("/:id",ensureAuth, moviesController.getMoviePage);


module.exports = router;
