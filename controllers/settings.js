// const Review = require("../models/Review");
const User = require("../models/User");
const Review = require("../models/Review");

module.exports = {
  getSetting: async (req, res) => {
    try {
      res.render("settings.ejs", {
          user: req.user,
          userStatus: {
              loggedIn: true
          },
      });
    } catch (err) {
      console.log(err);
    }
  },
  // updateProfile: async (req, res) => {
  //   try {
  //     // Upload image to cloudinary
  //     const result = await cloudinary.uploader.upload(req.file.path);

  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};

