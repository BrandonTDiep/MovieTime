const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
        await Comment.create({
            comment: req.body.comment, 
            user: req.params.userId,
            review: req.params.reviewId,
        });
        console.log("Comment has been added!");
         res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;

      // Delete the review document
      await Comment.findByIdAndDelete(commentId);
          
      console.log("Deleted Comment");
      res.redirect(`back`);
    } catch (err) {
      console.log(err)
    }
  },
};
