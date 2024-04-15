// controllers/SiteController.js
const Post = require('../models/Posts.js');
const User = require('../models/User.js');
const Tag = require('../models/Tag.js');
const mongoose = require('mongoose');
class ProfileController {
    async getMyPosts(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const userId = new mongoose.Types.ObjectId(req.params.id); // Chuyển đổi userId sang ObjectId
            const myPosts = await Post.find({ userId: userId }).exec();

            // Tạo một mảng chứa các promise của việc lấy tag thông qua tagId của từng bài viết
            const tagPromises = myPosts.map((post) => Tag.findById(post.tagId));

            // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
            const tags = await Promise.all(tagPromises);

            // Sau khi lấy được tất cả các tag, bạn có thể trích xuất tên của tag từ mỗi tag và tạo một mảng mới
            const nameTags = tags.map((tag) => tag.name);

            // Kết hợp nameTags với myPosts để tạo ra một mảng mới các bài viết với nameTag
            const myPostsWithNameTag = myPosts.map((post, index) => ({ ...post.toObject(), tagName: nameTags[index] }));
            console.log(myPostsWithNameTag);

            return res.status(200).json({ myPosts: myPostsWithNameTag });
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
