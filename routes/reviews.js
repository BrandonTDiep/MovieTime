const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Review Routes - simplified for now
router.post("/createReview/:id", ensureAuth, reviewsController.createReview);


module.exports = router;
