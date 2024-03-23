const User = require("../models/User");

module.exports = {
  getSearchedMovies: async (req, res) => {
    try{
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2'
      const movieName = req.query.query;
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIEAPI_KEY}&query=${movieName}&include_adult=false&language=en-US&page=1`)
      const movies = await response.json()
      const results = movies.results
      if(req.user){
        res.render('search.ejs', {
          movies: results, 
          base_url: BASE_URL,
          searchQuery: movieName,
          user: req.user,
          userStatus: {
            loggedIn: true
          }
        });
      }
      else{
        res.render('search.ejs', {
          movies: results, 
          base_url: BASE_URL,
          searchQuery: movieName,
          userStatus: {
            loggedIn: false
          }
        });
      }
    }
    catch(e){
      console.error(e)
      req.flash('errors', 'Movie could not be found')
      res.redirect('/')
    }   
  },
  getSearchedUsers: async (req, res) => {
    try{
      const user = req.query.query;

      const userProfiles = await User.find({ userName: { $regex: 'testguy', $options: 'i' } });


      if(req.user){
        res.render('searchuser.ejs', {
          userProfiles: userProfiles, 
          searchQuery: user,
          user: req.user,
          userStatus: {
            loggedIn: true
          }
        });
      }
      else{
        res.render('searchuser.ejs', {
          userProfiles: userProfiles, 
          searchQuery: user,
          userStatus: {
            loggedIn: false
          }
        });
      }
    }
    catch(e){
      console.log(e)

    }   
  },
};

