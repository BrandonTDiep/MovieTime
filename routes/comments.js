const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now
router.post("/createComment/:userId/:reviewId",  commentsController.createComment);
router.delete("/deleteComment/:commentId",  commentsController.deleteComment);


module.exports = router;
