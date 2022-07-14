const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  //   User.findById(id, function (err, user) {
  //     done(err, user);
  //   });
  done(null, id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "294435591448-uouf18sijp1n2rjcsv57vsrmsnah2v7c.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });
      console.log(profile);
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      return done(null, user);
    }
  )
);
