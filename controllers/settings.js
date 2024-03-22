// const Review = require("../models/Review");
const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getSetting: async (req, res) => {
    try {
      const BASE_URL = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
      const favFilms = req.user.favFilms.sort((a, b) => a.position - b.position)
      let favfilm1;
      let favfilm2;
      let favfilm3;
      let favfilm4;
      for(let i = 0; i < favFilms.length; i++){
        if(favFilms[i].position === 1){
          favfilm1 = favFilms[i];
        }
        else if(favFilms[i].position === 2){
          favfilm2 = favFilms[i];
        }
        else if(favFilms[i].position === 3){
          favfilm3 = favFilms[i];
        }
        else{
          favfilm4 = favFilms[i];
        }
      }
      
      res.render("settings.ejs", {
          user: req.user,
          userStatus: {
              loggedIn: true
          },
          favFilms: favFilms,
          base_url: BASE_URL,
          favfilm1: favfilm1,
          favfilm2: favfilm2,
          favfilm3: favfilm3,
          favfilm4: favfilm4,
      });
    } catch (err) {
      console.log(err);
    }
  },
  updateSetting: async (req, res) => {
    try {
      // Upload image to cloudinary
      if(req.file){
        // Delete image from cloudinary
        if(req.user.cloudinaryId){
          await cloudinary.uploader.destroy(req.user.cloudinaryId);
        }

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
              "favFilms.$.movieId": movieId,
              "favFilms.$.movieTitle": movie.title,
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
              movieId: movieId,
              movieTitle: movie.title,
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
  deleteFavMovies: async (req, res) => {
    try {
      const favFilmId = req.params.favFilmId;
      console.log(favFilmId)

      // Delete the favorite film document
      await User.findOneAndUpdate(
        {_id: req.user._id},
        { $pull: { favFilms: { _id: favFilmId } } }
      );      
      console.log("Deleted Fav Film");
      res.redirect(`/settings`);
    } catch (err) {
      console.log(err)
    }
  },
};

