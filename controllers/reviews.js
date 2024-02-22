const Review = require("../models/Review");
const User = require("../models/User");

module.exports = {
  createReview: async (req, res) => {
    try {
      const user = await User.findById(req.user.id); 
      const userName = user.userName
      console.log(req.body);

      await Review.create({
        // moviepage.ejs has input with the name of "review", so when this form submits, whatever value is input, it will have the value of req.body.review
        review: req.body.review, 
        reviewLikes: 0,
        rating: req.body.rating,
        liked: 0,
        movieId: req.params.id,
        user: req.user.id,
        userName: userName,
      });
      console.log("Review has been added!");
      res.redirect("/movies/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  likeReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id); 
      const movieId = review.movieId
      const userId = req.user.id;

      // Check if the user has already liked the review
      if (review.userLikes.includes(userId)) {
        // If the user has already liked, decrement the like count
        await Review.findOneAndUpdate(
            { _id: req.params.id },
            { $inc: { reviewLikes: -1 }, $pull: { userLikes: userId } } // Remove user from userLikes array
        );
      } 
      else {
        // If the user hasn't liked, increment the like count
        await Review.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { reviewLikes: 1 }, $push: { userLikes: userId } } // Add user to userLikes array
        );
      }
      res.redirect(`/movies/${movieId}#review-section`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id); 
      const movieId = review.movieId
      // Delete review from db
      await Review.remove({ _id: req.params.id });
      console.log("Deleted Review");
      res.redirect(`/movies/${movieId}`);
    } catch (err) {
      res.redirect(`/movies/${movieId}`);
    }
  },
};





