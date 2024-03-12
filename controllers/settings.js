// const Review = require("../models/Review");
const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getSetting: async (req, res) => {
    try {
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
      const favFilms = req.user.favFilms.sort((a, b) => a.position - b.position)

      res.render("settings.ejs", {
          user: req.user,
          userStatus: {
              loggedIn: true
          },
          favFilms: favFilms,
          base_url: BASE_URL,

      });
    } catch (err) {
      console.log(err);
    }
  },
  updateSetting: async (req, res) => {
    try {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(req.user.cloudinaryId);

      // Upload image to cloudinary
      if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "movie_profilePics"
        });

        await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            bio: req.body.bio,
            profilePic: result.secure_url,
            cloudinaryId: result.public_id,
          }
        );
      }
      else{
        await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            bio: req.body.bio,
          }
        );
      }
      res.redirect(`/settings`);
    } catch (err) {
      console.log(err);
    }
  },
  updateFavMovies: async (req, res) => {
    try {
      const movieName = req.body.favFilm
      const MOVIEAPI_KEY = process.env.MOVIEAPI_KEY

      const movieIdRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIEAPI_KEY}&query=${movieName}&include_adult=false&language=en-US&page=1`)
      const movies = await movieIdRes.json()
      const movieId = movies.results[0].id

      const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIEAPI_KEY}&language=en-US`)
      const movie = await movieRes.json()
      const position = req.body.position;

      const fav_film = await User.findOne({ _id: req.user.id, "favFilms.position": position });

      if(fav_film){
        await User.findOneAndUpdate(
          { "_id": req.user.id, "favFilms.position": position },
          {
            $set: { 
              "favFilms.$.moviePoster": movie.poster_path,
              "favFilms.$.position": position
            },
          }
        );
      }
      else{
        await User.findOneAndUpdate(
          { "_id": req.user.id},
          {
            $push: { "favFilms": {
              moviePoster: movie.poster_path,
              position: position
            }},
          }
        );

      }
      res.redirect(`/settings`);
    } catch (err) {
      console.log(err);
    }
  },
};

