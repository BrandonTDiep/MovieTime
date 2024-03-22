const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const moviesController = require("../controllers/movies");
const profileController = require("../controllers/profiles");
const settingController = require("../controllers/settings");
const searchesController = require("../controllers/searches");


const { ensureAuth, ensureGuest, ensureUserExists } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", moviesController.getHomePage);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup",  authController.getSignup);
router.get("/settings", ensureAuth, settingController.getSetting);
router.get("/search/movie",  searchesController.getSearchedMovies); 
router.get("/:user", ensureUserExists, profileController.getProfile);
router.post("/signup", authController.postSignup);

module.exports = router;
