const passport = require('passport');
const { generateToken } = require('../utils/auth');

const AuthController = {
    googleLoginCallback: (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Google authentication failed.' });
            }

            // Nếu xác thực thành công, tạo và trả về token JWT
            const token = generateToken(user);
            return res.redirect(`/dashboard?token=${token}`);
        })(req, res, next);
    },
};

module.exports = AuthController;
