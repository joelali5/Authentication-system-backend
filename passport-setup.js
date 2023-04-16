const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const dontenv = require("dotenv");
const db = require("./db/connection");

// dontenv.config({ path: `${__dirname}/.env.development` });

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "822854830003-5etp8roar8hab0f741kjfmh9chjsd02g.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    }
    //   async (request, accessToken, refreshToken, profile, done) => {
    //     try {
    //       const email = profile.email;
    //       //Check if the profile exists in the db
    //       const existingUser = await db.query(
    //         "SELECT * FROM users WHERE email=$1",
    //         [email]
    //       );
    //       if (existingUser) {
    //         return done(null, existingUser);
    //       }
    //       //Create a new user if the user does not exist
    //       const newUser = await db.query(
    //         "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;",
    //         [email, "12345"]
    //       );
    //       return done(null, newUser);
    //     } catch (error) {
    //       return done(error, false);
    //     }
    //   }
  )
);

passport.serializeUser((done, user) => {
  done(null, user);
});

passport.deserializeUser((done, user) => {
  done(null, user);
});
