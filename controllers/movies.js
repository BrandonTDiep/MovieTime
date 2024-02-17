const Review = require("../models/Review");

module.exports = {
  getMovie: async (req, res) => {
    try {
      res.render("movies.ejs", {
        user: {
          loggedIn: true
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  getSearchedMovies: async (req, res) => {
    try{
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2'
      const movieName = req.query.query;
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIEAPI_KEY}&query=${movieName}&include_adult=false&language=en-US&page=1`)
      const movies = await response.json()
      const results = movies.results

      res.render('search.ejs', {
        movies: results, 
        base_url: BASE_URL,
        user: {
          loggedIn: true
        }
      });
    }
    catch(e){
      console.error(e)
      req.flash('errors', 'Movie could not be found')
      res.redirect('/movies')
    }   
  },
  getMoviePage: async (req, res) => {
    try {
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2'
      const movieId = req.params.id;
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
      const movie = await response.json()

      const reviews = await Review.find({movieId}).sort({ reviewLikes: "desc", createdAt: "desc" }).lean(); // find all comments tied to our post


      res.render("moviepage.ejs", {
        movieId: req.params.id,
        movieDetails: movie, 
        base_url: BASE_URL,
        reviews: reviews,
        user: {
          loggedIn: true
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};

