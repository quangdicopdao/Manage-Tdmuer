// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = {
    verifyToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json('Token not provided');
        }

        const accessToken = token.split(' ')[1];

        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token not valid', error: err.message });
            }
            req.user = user;
            next();
        });
    },
};

module.exports = authMiddleware;
