const jwt = require('jsonwebtoken');
const authMiddleware = {
    //verify token
    verifyToken(req, res, next) {
        const token = req.headers.token;
        if (token) {
            const accsesToken = token.split(' ')[1];
            jwt.verify(accsesToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json('Token not valid');
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json('You are not authenticated');
        }
    },
};

module.exports = authMiddleware;
