module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs", {
      userStatus: {
        loggedIn: false
      },
    });
  },
};
