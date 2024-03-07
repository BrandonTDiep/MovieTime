// const Review = require("../models/Review");
const User = require("../models/User");
const Review = require("../models/Review");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userProfile = await User.findOne({userName: req.params.id});
      const popularReviews = await Review.find({ user: userProfile.id }).sort({ reviewLikes: 'desc' }).populate('user');
      const recentReviews = await Review.find({ user: userProfile.id }).sort({ createdAt: 'desc' }).populate('user');

      if(userProfile){
        res.render("profile.ejs", {
          user: req.user,
          userProf: userProfile,
          recentReviews: recentReviews,
          popularReviews: popularReviews,
          userId: req.user.id,
          userStatus: {
            loggedIn: true
          },
        });
      }
      else{
        res.render("profile.ejs", {
          user: req.user,
          userProf: userProfile,
          userStatus: {
            loggedIn: true
          },
        });
      }
      
    } catch (err) {
      console.log(err);
    }
  },
};

