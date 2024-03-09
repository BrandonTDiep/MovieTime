const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const moviesController = require("../controllers/movies");
const settingsController = require("../controllers/settings");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", moviesController.getMovie);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup",  authController.getSignup);
router.get("/settings", ensureAuth, settingsController.getSetting);
router.post("/signup", authController.postSignup);

module.exports = router;
