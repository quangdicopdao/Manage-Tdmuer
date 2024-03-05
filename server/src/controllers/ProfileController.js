// controllers/SiteController.js
const Post = require('../models/Posts.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');
class ProfileController {
    async getMyPosts(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const userId = new mongoose.Types.ObjectId(req.params.id); // Chuyển đổi userId sang ObjectId
            const myPosts = await Post.find({ userId: userId }).exec();

            return res.status(200).json({ myPosts });
        } catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const userId = req.params.id;
            const profile = await User.findById(userId, { password: 0 }); // Projection excluding password
            res.json(profile);
        } catch (error) {
            next(error); // Handle error appropriately
        }
    }
}
module.exports = new ProfileController();
