const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  userReviews: [{
    review: {
      type: String,
      required: true,
    },
    reviewLikes: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  }],
});

module.exports = mongoose.model("Review", ReviewSchema);
