const Review = require("../models/Review");

module.exports = {
  createComment: async (req, res) => {
    try {
        await Review.findByIdAndUpdate(
          req.params.reviewId,
          { $push: { 
            "comments": {
              comment: req.body.comment, 
              user: req.params.userId,
            } 
          }}
        );
        console.log("Comment has been added!");
        res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const reviewId = req.params.reviewId;

      console.log(commentId)
      // Delete the comment
      await Review.findOneAndUpdate(
        { _id: reviewId},
        { $pull: {
          "comments": {
            _id: commentId, 
          } 
        }}
      );

      console.log("Deleted Comment");
      res.redirect(`back`);
    } catch (err) {
      console.log(err)
    }
  },
};
