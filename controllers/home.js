module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs", {
      user: {
        loggedIn: false
      }
    });
  },
};
