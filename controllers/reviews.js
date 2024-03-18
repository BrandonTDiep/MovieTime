const Movie = require("../models/Movie");
const Review = require("../models/Review");
const User = require("../models/User");

module.exports = {
  createReview: async (req, res) => {
    try {
      const user = await User.findById(req.user.id); 
      const userName = user.userName;
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];
    
      const newReview = await Review.create({
        movieId: movieId,
        user: req.user.id,
        review: req.body.review, 
        reviewLikes: 0,
        rating: req.body.rating,
        liked: 0,
        userName: userName,
      });

      const existingMovie = await Movie.findOne({movieId: movieId});

      if(existingMovie){
        existingMovie.reviews.push(newReview._id);
        await existingMovie.save();
        console.log("Review has been added for existing movieId!");
      }
      else{
        await Movie.create({
          movieId: movieId,
          reviews: [newReview._id],
        })
        console.log("Review has been added for new movieId!")
      }
      
      res.redirect(`back`);
    } catch (err) {
      console.log(err);
    }
  },
  updateReview: async (req, res) => {
    try {
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];
      const movieTitleParts = movieName.split('-');

      await Review.findOneAndUpdate(
        { 
          movieId: movieId, 
          "user": req.user.id 
        },
        {
          $set: { 
            "review": req.body.review, 
            "rating": req.body.rating,
          }
        },
        { new: true }
      );
      res.redirect(`back`);
    } catch (err) {
      console.log(err);
    }
  },
  likeReview: async (req, res) => {
    try {

      const movieName = req.params.movieId;

      const userId = req.user.id;
      const reviewId = req.params.reviewId;

      // Get me the review (document) that has the userReview id
      const review = await Review.findOne({ "_id": reviewId });

      // Check if the user has already liked the review
      if (review.userLikes.includes(userId)) {
        // If the user has already liked, decrement the like count
        await Review.findOneAndUpdate(
            { "_id": reviewId  },
            { $inc: { "reviewLikes": -1 }, $pull: { "userLikes": userId } }
        );
      } 
      else {
        // If the user hasn't liked, increment the like count
        await Review.findOneAndUpdate(
          { "_id": reviewId  },
          { $inc: { "reviewLikes": 1 }, $push: { "userLikes": userId } }
        );
      }
      res.redirect(`back`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteReview: async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];

      // Delete the review document
      await Review.findByIdAndDelete(reviewId);
          
      // Remove the reference to the deleted review from the Movie document
      await Movie.findOneAndUpdate(
        { movieId: movieId },
        { $pull: { reviews: reviewId } }
      );
      console.log("Deleted Review");
      res.redirect(`back`);
    } catch (err) {
      console.log(err)
    }
  },
};





