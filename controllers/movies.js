const Movie = require("../models/Movie");
const Review = require("../models/Review");


module.exports = {
  getMovie: async (req, res) => {
    try {
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'

      const trendingMovies = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&api_key=${MOVIEAPI_KEY}`)
      const nowPlayingMovies = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${MOVIEAPI_KEY}`)
      const trendMovies = await trendingMovies.json()
      const nowPlayMovies = await nowPlayingMovies.json()

      res.render("movies.ejs", {
        user: req.user,
        trendMovies: trendMovies.results,
        nowPlayMovies: nowPlayMovies.results,
        base_url: BASE_URL,
        userStatus: {
          loggedIn: true
        },
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
        searchQuery: movieName,
        user: req.user,
        userStatus: {
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
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
      const movieId = req.params.id;
      const response_credit =  await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${MOVIEAPI_KEY}`)
      const credit = await response_credit.json()
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
      const movie = await response.json()
      const reviews = await Review.find({ movieId }).sort({ 'userReviews.reviewLikes': 'desc', 'userReviews.createdAt': 'desc' }).populate('user');

      const userHasReview = await Review.findOne({
        movieId: req.params.id,
        user: req.user.id
      });

      let hasReview = false;
      if(userHasReview){
        hasReview = true;
      }

      res.render("moviepage.ejs", {
        movieId: req.params.id,
        movieDetails: movie, 
        movieCredit: credit,
        base_url: BASE_URL,
        reviews: reviews,
        user: req.user,
        userId: req.user.id,
        userStatus: {
          loggedIn: true
        },
        userHasReview: hasReview,
        userReview: userHasReview
      });
    } catch (err) {
      console.log(err);
    }
  },
};

