const Review = require("../models/Review");
const User = require("../models/User");

module.exports = {
  createReview: async (req, res) => {
    try {
      const user = await User.findById(req.user.id); 
      const userName = user.userName;
      const existingReview = await Review.findOne({movieId: req.params.id});
      console.log(req.body);

      if(existingReview){
        await Review.findByIdAndUpdate(
          existingReview._id, {
            $push: {
              userReviews: {
                review: req.body.review, 
                reviewLikes: 0,
                rating: req.body.rating,
                liked: 0,
                user: req.user.id,
                userName: userName,
              }
            }
          }
        );
        console.log("Review has been added for exisiting movieId!");
      }
      else{
        await Review.create({
          // moviepage.ejs has input with the name of "review", so when this form submits, whatever value is input, it will have the value of req.body.review
          movieId: req.params.id,
          userReviews: [{
            review: req.body.review, 
            reviewLikes: 0,
            rating: req.body.rating,
            liked: 0,
            user: req.user.id,
            userName: userName,
          }],
        });
        console.log("Review has been added for new movieId!");
      }
      res.redirect("/movies/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  updateReview: async (req, res) => {
    try {
      await Review.findOneAndUpdate(
        { 
          movieId: req.params.movieId, 
          "userReviews.user": req.user.id 
        },
        {
          $set: { 
            "userReviews.$.review": req.body.review, 
            "userReviews.$.rating": req.body.rating,
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
      const review = await Review.findOne({ "userReviews._id": reviewId });

      const userReview = review.userReviews.find(review => review._id.toString() === reviewId);

      // Check if the user has already liked the review
      if (userReview.userLikes.includes(userId)) {
        // If the user has already liked, decrement the like count
        await Review.findOneAndUpdate(
            { "userReviews._id": reviewId  },
            { $inc: { "userReviews.$.reviewLikes": -1 }, $pull: { "userReviews.$.userLikes": userId } }
        );
      } 
      else {
        // If the user hasn't liked, increment the like count
        await Review.findOneAndUpdate(
          { "userReviews._id": reviewId  },
          { $inc: { "userReviews.$.reviewLikes": 1 }, $push: { "userReviews.$.userLikes": userId } }
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

      // Delete review from db
      // Delete the review from the userReviews array based on _id
      await Review.findOneAndUpdate(
        { "userReviews._id": reviewId },
        { $pull: { userReviews: { _id: reviewId } } }
      );
      console.log("Deleted Review");
      res.redirect(`/movies/${movieId}`);
    } catch (err) {
      res.redirect(`/movies/${movieId}`);
    }
  },
};





