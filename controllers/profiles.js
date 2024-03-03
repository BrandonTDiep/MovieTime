// const Review = require("../models/Review");

module.exports = {
  getProfile: async (req, res) => {
    try {
      res.render("profile.ejs", {
        user: req.user,

        userStatus: {
          loggedIn: true
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};

