module.exports = {
  getIndex: (req, res) => {
    if (req.user) {
      return res.redirect("/movies");
    }
    res.render("index.ejs", {
      userStatus: {
        loggedIn: false
      },
    });
  },
};
