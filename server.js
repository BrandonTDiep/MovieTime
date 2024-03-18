const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");
const settingRoutes = require("./routes/settings");
const profileRoutes = require("./routes/profiles");
const commentRoutes = require("./routes/comments");
const { ensureUserExists } = require("./middleware/auth");



//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/movies", movieRoutes)
app.use("/review", reviewRoutes);
app.use("/settings", settingRoutes);
app.use("/:user", ensureUserExists, profileRoutes);
app.use("/comment", commentRoutes);

app.use((req, res) => {
  res.status(404).render('error'); 
});

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});


//  how it works the user makes a request whether it be PUT or GET, it makes  a request to the router. The sole job of the router is know which controller to hand this request off to. So the controller hears that request and goes to the views and ask it to render out some ejs and the controller responds with that html