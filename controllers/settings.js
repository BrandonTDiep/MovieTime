// const Review = require("../models/Review");
const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");

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
  updateSetting: async (req, res) => {
    try {
      // Upload image to cloudinary
      console.log(req.file.path)
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "movie_profilePics"
      });

      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(user.cloudinaryId);

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          profilePic: result.secure_url,
          cloudinaryId: result.public_id,
        }
      );
      console.log("hello")

      res.redirect(`/settings`);


    } catch (err) {
      console.log(err);
    }
  },
};

