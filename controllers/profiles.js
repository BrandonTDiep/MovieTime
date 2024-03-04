// const Review = require("../models/Review");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {

    try {
      const userProfile = await User.findOne({userName: req.params.id});
      if(userProfile){
        res.render("profile.ejs", {
          user: req.user,
          userProf: userProfile,
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

