// authMiddleware.js
const jwt = require('jsonwebtoken');
const JWTSEC = "#2@!@$ndja45883 r7##";
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
    // verifyToken1(req , res , next){
    //     const authHeader = req.headers.token;
    //     if(authHeader){
    //               const token = authHeader;
    //               jwt.verify(token , process.env.JWT_ACCESS_KEY , (err , user)=>{
    //                         if(err) return res.status(400).json({ error: 'Some error occurred', details: err.message });
    //                         req.user = user;
    //                         next();
    //               } )
    //     }else{
    //               return res.status(400).json("Access token is not valid")
    //     }
    // },
};

module.exports = authMiddleware;
