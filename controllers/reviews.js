const Review = require("../models/Review");

module.exports = {
  createReview: async (req, res) => {
    try {
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];
    
      await Review.create({
        movieId: movieId,
        user: req.user.id,
        review: req.body.review, 
        reviewLikes: 0,
        rating: req.body.rating,
        liked: 0,
      });
      
      res.redirect(`back`);
    } catch (err) {
      console.log(err);
    }
  },
  updateReview: async (req, res) => {
    try {
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];

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

      // Delete the review document
      await Review.findByIdAndDelete(reviewId);
          
      console.log("Deleted Review");
      res.redirect(`back`);
    } catch (err) {
      console.log(err)
    }
  },
};





