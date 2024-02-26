// controllers/PostController.js
const Posts = require('../models/Posts.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');

// controllers/PostController.js
class PostController {
    async index(req, res, next) {
        try {
            const { page, pageSize = 10 } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(pageSize);

            const posts = await Posts.find()
                .populate('userId', 'avatar email username')
                .skip(skip)
                .limit(parseInt(pageSize))
                .exec();

            const totalPosts = await Posts.countDocuments();
            const totalPages = Math.ceil(totalPosts / parseInt(pageSize));

            const sanitizedPosts = posts
                .map((post) => {
                    if (post && post._doc) {
                        const { userId, ...rest } = post._doc;
                        if (userId && userId._doc) {
                            const sanitizedUser = { ...userId._doc, password: undefined };
                            return { ...rest, userId: sanitizedUser };
                        }
                    }
                    return null;
                })
                .filter(Boolean);

            res.json({
                page: parseInt(page),
                per_page: parseInt(pageSize),
                total: totalPosts,
                total_pages: totalPages,
                data: sanitizedPosts,
            });
        } catch (err) {
            console.error('Error fetching posts:', err);
            next(err);
        }
    }

    async create(req, res, next) {
        const { title, content } = req.body;

        // Kiểm tra xác thực thông qua req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized - User not logged in' });
        }

        const userId = req.user.id;

        try {
            const newPost = new Posts({ title, content, userId }); // Chỉnh sửa tại đây
            await newPost.save();
            return res.status(201).json({ message: 'Bài viết đã được lưu trữ thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu trữ bài viết.' });
        } finally {
            next();
        }
    }

    // async detail(req, res) {
    //     try {
    //         const post = await Posts.findById(req.params.id).exec();

    //         if (!post) {
    //             return res.status(404).json({ message: 'Bài viết không tồn tại' });
    //         }

    //         res.json({ post });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Lỗi server' });
    //     }
    // }
    async detail(req, res) {
        try {
            const post = await Posts.findById(req.params.id).exec();

            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại' });
            }

            const userId = post.userId;
            const user = await User.findById(userId).select('-password').exec();

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            res.json({ post, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    async search(req, res, next) {
        const query = req.query.q.toLowerCase();
        try {
            const postResults = await Posts.find({
                $or: [{ title: { $regex: query, $options: 'i' } }, { content: { $regex: query, $options: 'i' } }],
            }).populate('userId', '-password'); // Sử dụng populate để lấy thông tin của người dùng và loại bỏ trường password

            if (postResults.length === 0) {
                return res.status(404).json({ message: 'No results found' });
            }

            return res.status(200).json(postResults);
        } catch (error) {
            console.error('Error searching:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // của user
    async savedPosts(req, res, next) {
        try {
            const userId = req.body.userId;
            const postId = req.body.postId;

            // Tạo một đối tượng ObjectId bằng cách sử dụng new mongoose.mongo.ObjectId()
            const postObjectId = new mongoose.mongo.ObjectId(postId);

            // Thêm postObjectId vào mảng savedPosts của người dùng
            await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postObjectId } });

            res.status(200).json({ message: 'Bài viết đã được lưu thành công', postObjectId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new PostController();
