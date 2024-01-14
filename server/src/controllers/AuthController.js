// controllers/SiteController.js
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// controllers/AuthController.js
class AuthController {
    //register
    async register(req, res) {
        try {
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // create a new user
            const newUser = await new User({
                username: req.body.username,
                password: hashed,
                email: req.body.email,
            });
            //save to db
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //login
    async login(req, res) {
        try {
            const user = await User.findOne({
                username: req.body.username,
            });
            if (!user) {
                return res.status(404).json('wrong username!');
            }
            const valiPassword = await bcrypt.compare(req.body.password, user.password);
            if (!valiPassword) {
                return res.status(404).json('wrong password!');
            }
            if (user && valiPassword) {
                const accsesToken = jwt.sign(
                    {
                        id: user._id,
                        admin: user.isAdmin,
                    },
                    process.env.JWT_ACCCES_KEY,
                    {
                        expiresIn: '30s',
                    },
                );
                const refreshToken = jwt.sign(
                    {
                        id: user._id,
                        admin: user.isAdmin,
                    },
                    process.env.JWT_REFRESH_TOKEN,
                    {
                        expiresIn: '365d',
                    },
                );
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accsesToken });
            }
        } catch (error) {
            console.error('Login error:', error);

            res.status(500).json(error);
        }
    }
    async requestRefreshToken(req, res) {
        // take refresh token from user
        const refreshToken = req.cookie.refreshToken;
        if (!refreshToken) return res.status(401).json('You are not authenticated');
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                console.log(err);
            }

            const newAccesToken = jwt.sign(
                {
                    id: user._id,
                    admin: user.isAdmin,
                },
                process.env.JWT_ACCCES_KEY,
                {
                    expiresIn: '30s',
                },
            );
            const newRefreshToken = jwt.sign(
                {
                    id: user._id,
                    admin: user.isAdmin,
                },
                process.env.JWT_REFRESH_TOKEN,
                {
                    expiresIn: '365d',
                },
            );
            res.cookie('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ accsesToken: newAccesToken });
        });
    }
    async logout(req, res) {
        res.clearCookie('refreshToken');
        res.status(200).json('Logged out!');
    }
}

module.exports = new AuthController();
