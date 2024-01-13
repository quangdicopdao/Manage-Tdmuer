const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../config/database');
const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3001;
//test
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();
passport.use(
    new GoogleStrategy(
        {
            clientID: 'YOUR_GOOGLE_CLIENT_ID',
            clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
            callbackURL: 'http://localhost:3001/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, done) {
            // Thực hiện xử lý đăng nhập, lưu thông tin người dùng vào cơ sở dữ liệu
            return done(null, profile);
        },
    ),
);

// Serialize và Deserialize người dùng cho phiên làm việc
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Xử lý sau khi người dùng đã đăng nhập thành công
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    // Đăng nhập thành công, thực hiện các thao tác khác nếu cần
    res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
db.connect()
    .then(() => {
        // Use the site routes
        app.use('/', siteRoutes);
        //login
        app.use('/auth', authRoutes);
        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
