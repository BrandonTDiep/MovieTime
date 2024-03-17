const User = require("../models/User");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/movies");
    }
  },
  ensureUserExists: async function (req, res, next) {
    const userProfile = await User.findOne({userName: req.params.user});
    if (userProfile) {
      return next();
    } else {
      res.render("error.ejs");
    }
  },
};
