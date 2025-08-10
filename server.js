const express = require('express');
const mongodb = require('./config/database');
const bodyParser = require('body-parser');
// const passport = require('passport');
// const session = require('express-session');
// const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 8080;

//MiddleWare
app.use(bodyParser.json());
app.use(cors());

// //Session
// app.use(session({
//   secret: 'secret', 
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false } 
// }));

// // Passport 
// app.use(passport.initialize());
// app.use(passport.session());

// // OAuth 
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL
//   },
//   (accessToken, refreshToken, profile, done) => {
//     return done(null, profile);
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });


app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});
