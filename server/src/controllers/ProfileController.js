// controllers/SiteController.js
const Posts = require('../models/Posts.js');

class ProfileController {
    async getMyPosts(req, res, next) {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Truy vấn lịch theo ID người dùng đã đăng nhập
            const myPosts = await Posts.findById(req.params.id).exec();
            return res.status(200).json({ myPosts });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new ProfileController();
