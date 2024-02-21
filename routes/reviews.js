const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Review Routes - simplified for now
router.post("/createReview/:id", ensureAuth, reviewsController.createReview);
router.put("/likeReview/:id", reviewsController.likeReview);
router.delete("/deleteReview/:id", reviewsController.deleteReview);



module.exports = router;
