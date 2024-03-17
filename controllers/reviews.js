const Movie = require("../models/Movie");
const Review = require("../models/Review");
const User = require("../models/User");

module.exports = {
  createReview: async (req, res) => {
    try {
      const user = await User.findById(req.user.id); 
      const userName = user.userName;
    
      const newReview = await Review.create({
        movieId: req.params.movieId,
        user: req.user.id,
        review: req.body.review, 
        reviewLikes: 0,
        rating: req.body.rating,
        liked: 0,
        userName: userName,
      });

      const existingMovie = await Movie.findOne({movieId: req.params.movieId});

      if(existingMovie){
        existingMovie.reviews.push(newReview._id);
        await existingMovie.save();
        console.log("Review has been added for existing movieId!");
      }
      else{
        await Movie.create({
          movieId: req.params.movieId,
          reviews: [newReview._id],
        })
        console.log("Review has been added for new movieId!")
      }
      
      res.redirect("/movies/" + req.params.movieId);
    } catch (err) {
      console.log(err);
    }
  },
  updateReview: async (req, res) => {
    try {
      await Review.findOneAndUpdate(
        { 
          movieId: req.params.movieId, 
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
      res.redirect("/movies/" + req.params.movieId);
    } catch (err) {
      console.log(err);
    }
  },
  likeReview: async (req, res) => {
    try {
      const movieId = req.params.movieId
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
      res.redirect(`/movies/${movieId}#review-section`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteReview: async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const reviewId = req.params.reviewId;

      // Delete the review document
      await Review.findByIdAndDelete(reviewId);
          
      // Remove the reference to the deleted review from the Movie document
      await Movie.findOneAndUpdate(
        { movieId: movieId },
        { $pull: { reviews: reviewId } }
      );
      console.log("Deleted Review");
      res.redirect(`/movies/${movieId}`);
    } catch (err) {
      console.log(err)
    }
  },
};





