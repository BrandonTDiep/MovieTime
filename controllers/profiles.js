const User = require("../models/User");
const Review = require("../models/Review");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userProfile = await User.findOne({userName: req.params.user});
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
      const path = req.originalUrl;
      const pathParts = path.split('/');
      const username = pathParts[1];
      
      const userProfile = await User.findOne({userName: username});

      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
      
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];
      const movieTitleParts = movieName.split('-');
      const result = movieTitleParts.slice(1).join("-"); 

      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
      const movie = await movieRes.json()

      let movieTitle;
      if(movie.success === undefined){
         movieTitle = movie.title.replace(/:/g, '').replace(/\s+/g, '-').toLowerCase();
      }
      if(movie.success === undefined && result === movieTitle){
        const userHasReview = await Review.findOne({
          movieId: movieId,
          user: userProfile.id
        });

        let comments;
        if(userHasReview){
          comments = await Review.findOne({ "_id": userHasReview.id }, {"_id": 0, "comments": 1 }).populate('comments.user').sort({ "comments.createdAt": 'asc' });
        }

        if(req.user){
          if(userHasReview){
            res.render("review.ejs", {
              movieId: movieId,
              movieDetails: movie, 
              base_url: BASE_URL,
              user: req.user,
              userId: req.user.id,
              userProf: userProfile,
              comments: comments.comments,
              userStatus: {
                loggedIn: true
              },
              userReview: userHasReview,
            });
          } 
          else{
            res.status(404).render('error'); 
          }
        }
        else{
          res.render("review.ejs", {
            movieId: movieId,
            movieDetails: movie, 
            base_url: BASE_URL,
            userReview: userHasReview,
            userProf: userProfile,
            comments: comments,
            userStatus: {
              loggedIn: false
            },
          });
        }
        } else {
          res.status(404).render('error'); 
        }
    } catch (err) {
      console.log(err);
    }
  },
  getLikesPage: async (req, res) => {
    try {
      const path = req.originalUrl;
      const pathParts = path.split('/');
      const username = pathParts[1];
      
      const userProfile = await User.findOne({userName: username});

      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
      
      const movieName = req.params.movieId;
      const movieId = movieName.split('-')[0];
      const movieTitleParts = movieName.split('-');
      const result = movieTitleParts.slice(1).join("-"); 

      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
      const movie = await movieRes.json()

      let movieTitle;
      if(movie.success === undefined){
         movieTitle = movie.title.replace(/:/g, '').replace(/\s+/g, '-').toLowerCase();
      }
      if(movie.success === undefined && result === movieTitle){
        const userHasReview = await Review.findOne({
          movieId: movieId,
          user: userProfile.id
        });

        let userLikes;
        if(userHasReview){
          userLikes = await Review.findOne({ "_id": userHasReview.id }, {"_id": 0, "userLikes": 1 }).populate('userLikes');
        }

        if(req.user){
          if(userHasReview){
            res.render("likes.ejs", {
              movieId: movieId,
              movieDetails: movie, 
              base_url: BASE_URL,
              user: req.user,
              userId: req.user.id,
              userProf: userProfile,
              userLikes: userLikes.userLikes,
              userStatus: {
                loggedIn: true
              },
              userReview: userHasReview,
            });
          } 
          else{
            res.status(404).render('error'); 
          }
        }
        else{
          res.render("likes.ejs", {
            movieId: movieId,
            movieDetails: movie, 
            base_url: BASE_URL,
            userReview: userHasReview,
            userProf: userProfile,
            userLikes: userLikes.userLikes,
            userStatus: {
              loggedIn: false
            },
          });
        }
        } else {
          res.status(404).render('error'); 
        }
    } catch (err) {
      console.log(err);
    }
  },
};

