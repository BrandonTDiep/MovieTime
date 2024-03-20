const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  comments: [{ 
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model("Review", ReviewSchema);
