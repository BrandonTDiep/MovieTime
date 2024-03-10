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
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(req.user.cloudinaryId);

      // Upload image to cloudinary
      if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "movie_profilePics"
        });

        await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            bio: req.body.bio,
            profilePic: result.secure_url,
            cloudinaryId: result.public_id,
          }
        );
      }
      else{
        await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            bio: req.body.bio,
          }
        );
      }
      
      res.redirect(`/settings`);
    } catch (err) {
      console.log(err);
    }
  },
};

