// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: '724900154435-vt74mfu0m0r5v8gm2fqrj027n8t6242n.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3001/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            };

            done(null, user);
        },
    ),
);

// Serialize và deserialize người dùng
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
