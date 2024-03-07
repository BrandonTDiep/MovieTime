const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Review Routes - simplified for now
router.post("/createReview/:id", ensureAuth, reviewsController.createReview);
router.put("/updateReview/:movieId", reviewsController.updateReview);
router.put("/likeReview/:movieId/:reviewId", ensureAuth, reviewsController.likeReview);
router.delete("/deleteReview/:movieId/:reviewId", reviewsController.deleteReview);



module.exports = router;
