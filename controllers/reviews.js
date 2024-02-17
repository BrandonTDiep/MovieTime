const Review = require("../models/Review");
const User = require("../models/User");

module.exports = {
  createReview: async (req, res) => {
    try {

      const user = await User.findById(req.user.id); 
      const userName = user.userName
    
      await Review.create({
        // moviepage.ejs has input with the name of "review", so when this form submits, whatever value is input, it will have the value of req.body.comment
        review: req.body.review, 
        reviewLikes: 0,
        rating: 0,
        liked: 0,
        movieId: req.params.id,
        user: req.user.id,
        userName: userName
      });
      console.log("Review has been added!");
      res.redirect("/movies/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};





