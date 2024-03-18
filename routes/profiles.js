const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profiles");

//Profile Routes - simplified for now
router.get("/review/:movieId",  profileController.getProfileReviewPage);

module.exports = router;