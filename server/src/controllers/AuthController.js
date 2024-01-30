// controllers/SiteController.js
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

// controllers/AuthController.js
let refreshTokens = [];
class AuthController {
    //register
    async register(req, res) {
        try {
            const { username, password, email } = req.body;

            // Tạo ảnh avatar dựa trên chữ cái đầu của tên người dùng
            const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' }); // Adjust the parameters as needed
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Tạo một đối tượng User mới
            const newUser = new User({
                username: username,
                password: hashedPassword,
                email: email,
                avatar: avatar, // Lưu đường dẫn ảnh avatar vào trường avatar
            });

            // Lưu thông tin người dùng vào cơ sở dữ liệu
            const savedUser = await newUser.save();

            res.status(201).json(savedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký người dùng.' });
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
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        admin: user.isAdmin,
                    },
                    process.env.JWT_ACCESS_KEY,
                    {
                        expiresIn: '2m',
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
                refreshTokens.push(refreshToken);

                res.cookie('accessToken', accessToken, {
                    maxAge:4*24*3600*1000,
                    httpOnly: false,
                    secure: false,
                    // path: '/',
                    // sameSite: 'strict',
                });
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            console.error('Login error:', error);

            res.status(500).json(error);
        }
    }
    async requestRefreshToken(req, res) {
        // take refresh token from user
        const refreshTokenCookieName = 'refresh_token';
        const refreshToken = req.cookies[refreshTokenCookieName];

        if (!refreshToken) return res.status(401).json('You are not authenticated');
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json('Refresh token is not valid');
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(401).json('Invalid refresh token');
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = jwt.sign(
                {
                    id: user._id,
                    admin: user.isAdmin,
                },
                process.env.JWT_ACCESS_KEY,
                {
                    expiresIn: '2m',
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
            refreshTokens.push(newRefreshToken);

            res.cookie('accessToken', accessToken, {
                maxAge:4*24*3600*1000,
                httpOnly: false,
                secure: false,
                // path: '/',
                // sameSite: 'strict',
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    }
    async logout(req, res) {
        res.clearCookie('refresh_token');
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json('Logged out!');
    }
    //get user
    
}

module.exports = new AuthController();
