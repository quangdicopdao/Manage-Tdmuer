// controllers/PostController.js
const Posts = require('../models/Posts.js');
const User = require('../models/User.js');
const Like = require('../models/Likes.js');
const Comment = require('../models/Comments.js');
const Notification = require('../models/Notification.js');
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

    async detail(req, res) {
        try {
            const postId = req.params.id;
            const post = await Posts.findById(postId).exec();

            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại' });
            }

            const userId = post.userId;
            const user = await User.findById(userId).select('-password').exec();

            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            // Đếm số lượt thích cho bài viết
            const likesCount = await Like.countDocuments({ postId });

            // Thêm số lượt thích vào kết quả trả về
            res.json({ post: { ...post.toObject(), likes: likesCount }, user });
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
    //like post
    async like(req, res, next) {
        try {
            const postId = req.body.postId;
            console.log('postIdLiked', postId);
            const userId = req.body.userId; // Giả sử bạn truyền userId qua body của request

            // Kiểm tra xem liệu người dùng đã like bài viết này trước đó chưa
            const existingLike = await Like.findOne({ postId, userId });

            // Nếu người dùng đã like rồi, không thực hiện thêm mới
            if (existingLike) {
                return res.status(400).json({ message: 'Bạn đã like bài viết này trước đó' });
            }

            // Nếu chưa like, thêm mới dữ liệu vào cơ sở dữ liệu
            const newLike = new Like({ postId, userId });
            await newLike.save();

            // Trả về thông báo và dữ liệu đã like
            res.status(201).json({ message: 'Like post thành công', like: newLike });
        } catch (error) {
            console.error('Error liking post:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi thích bài viết' });
        }
    }

    async unlike(req, res, next) {
        try {
            const postId = req.params.postId;
            const userId = req.body.userId; // Assuming you have userId in your request body

            // Delete the like document associated with the postId and userId
            await Like.findOneAndDelete({ postId, userId });

            res.status(200).json({ message: 'Unlike post successfully' });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async checkLike(req, res, next) {
        try {
            const userId = req.query.userId; // Lấy userId từ query parameters
            const postId = req.query.postId; // Lấy postId từ query parameters

            // Truy vấn cơ sở dữ liệu để kiểm tra xem người dùng đã thích bài viết hay chưa
            const like = await Like.findOne({ userId, postId });

            // Đếm số lượt like cho bài viết
            const likeCount = await Like.countDocuments({ postId });
            const commentCount = await Comment.countDocuments({ postId });
            // Trả về kết quả
            res.json({ liked: like !== null, likeCount, commentCount });
        } catch (error) {
            console.error('Error checking like:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    //comments post
    async createComment(req, res) {
        try {
            const { postId, userId, content, parentId } = req.body;
            const comment = new Comment({ postId, userId, content, parentId });
            await comment.save();

            // Lưu thông báo vào cơ sở dữ liệu
            const notification = new Notification({ userId: userId, message: 'Bạn có một bình luận mới' });
            await notification.save();

            // Gửi thông báo qua WebSocket
            req.io.emit('notification', notification);

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getAllComments(req, res) {
        try {
            const postId = req.query.postId; // Lấy postId từ request params
            const comments = await Comment.find({ postId }).exec();

            // Tạo một mảng mới để chứa thông tin comment và user
            const commentData = [];
            for (const comment of comments) {
                const userId = comment.userId;
                const user = await User.findById(userId).select('-password').exec();
                commentData.push({ comment, user });
            }

            res.status(200).json(commentData);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async replyComment(req, res) {}
}
module.exports = new PostController();
