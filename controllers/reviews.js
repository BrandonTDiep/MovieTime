const Review = require("../models/Review");

module.exports = {
  createReview: async (req, res) => {
    try {
      await Review.create({
        review: req.body.review, // moviepage.ejs has input with the name of "review", so when this form submits, whatever value is input, it will have the value of req.body.comment
        reviewLikes: 0,
        rating: 0,
        liked: 0,
        movieId: req.params.id,
        user: req.user.id,
      });
      console.log("Review has been added!");
      res.redirect("/movies/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};





