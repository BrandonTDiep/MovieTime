// const Review = require("../models/Review");
const User = require("../models/User");
const Review = require("../models/Review");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userProfile = await User.findOne({userName: req.params.id});
      const popularReviews = await Review.find({ user: userProfile.id }).sort({ reviewLikes: 'desc' }).populate('user');
      const recentReviews = await Review.find({ user: userProfile.id }).sort({ createdAt: 'desc' }).populate('user');
      const BASE_URL = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2'
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY


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


      if(userProfile){
        res.render("profile.ejs", {
          user: req.user,
          userProf: userProfile,
          recentReviews: recentReviews,
          popularReviews: popularReviews,
          movieDetails: movieDetails,
          base_url: BASE_URL,
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
          userStatus: {
            loggedIn: true
          },
        });
      }
      
    } catch (err) {
      console.log(err);
    }
  },
};

