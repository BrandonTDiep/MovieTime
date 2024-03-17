const User = require("../models/User");
const Review = require("../models/Review");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userProfile = await User.findOne({userName: req.params.username});
      const BASE_URL = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2'
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const base_url2 = 'https://www.themoviedb.org/t/p/w220_and_h330_face'

      const popularReviews = await Review.find({ user: userProfile.id }).sort({ reviewLikes: 'desc' }).populate('user');
      const recentReviews = await Review.find({ user: userProfile.id }).sort({ createdAt: 'desc' }).populate('user');

      const movieIds = []

      for(const review of recentReviews){
        movieIds.push(review.movieId)
      }

      const movieDetails = []

      for(const movieId of movieIds){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
        const movie = await response.json()
        movieDetails.push(movie)
      }

      const favFilms = userProfile.favFilms.sort((a, b) => a.position - b.position)
      if(req.user){
        res.render("profile.ejs", {
          user: req.user,
          userProf: userProfile,
          recentReviews: recentReviews,
          popularReviews: popularReviews,
          movieDetails: movieDetails,
          favFilms: favFilms,
          base_url: BASE_URL,
          base_url2: base_url2,
          userId: req.user.id,
          userStatus: {
            loggedIn: true
          },
        });
      }
      else{
        res.render("profile.ejs", {
          user: req.user,
          userProf: userProfile,
          recentReviews: recentReviews,
          popularReviews: popularReviews,
          movieDetails: movieDetails,
          favFilms: favFilms,
          base_url: BASE_URL,
          base_url2: base_url2,
          userStatus: {
            loggedIn: false
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getProfileReviewPage: async (req, res) => {
    try {
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
      const movieName = req.params.movieId;

      const movieId = movieName.split('-')[0];
      console.log(req.params)

      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
      const movie = await movieRes.json()

      const userHasReview = await Review.findOne({
        movieId: movieId,
        user: req.user.id
      });

      if(userHasReview){
        if(req.user){
          res.render("reviewpage.ejs", {
            movieId: movieId,
            movieDetails: movie, 
            base_url: BASE_URL,
            user: req.user,
            userId: req.user.id,
            userStatus: {
              loggedIn: true
            },
            userReview: userHasReview
          });
        }
        else{
          res.render("reviewpage.ejs", {
            movieId: movieId,
            movieDetails: movie, 
            base_url: BASE_URL,
            userStatus: {
              loggedIn: false
            },
          });
        }
      }
      else{
        res.status(404).render('error'); 
      }
      

    } catch (err) {
      console.log(err);
    }
  },
};

