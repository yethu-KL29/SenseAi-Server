const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "https://senseai-api.onrender.com/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

return passport;