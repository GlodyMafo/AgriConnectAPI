const express = require('express');
const mongodb = require('./config/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const PORT = 8080;

//MiddleWare
app.use(bodyParser.json());
app.use(cors());

// //Session
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// // Passport 
app.use(passport.initialize());
app.use(passport.session());

// // OAuth 

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback   : true,
    scope: ['profile', 'email'] 
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`)
    } 
    );
  }
});
