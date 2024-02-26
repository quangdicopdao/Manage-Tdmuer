// controllers/SiteController.js
const Posts = require('../models/Posts.js');
const User = require('../models/User.js');

// controllers/SiteController.js
class SiteController {
    // async index(req, res, next) {
    //     try {
    //         const posts = await Posts.find();
    //         res.json({ posts });
    //     } catch (err) {
    //         console.error('Error fetching posts:', err);
    //         next(err);
    //     }
    // }
    async index(req, res, next) {
        try {
            const posts = await Posts.find().populate('userId', 'avatar email').exec();

            // Assuming posts is declared and assigned in the scope
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

            res.json({ posts: sanitizedPosts });
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
            const post = await Posts.findById(req.params.id).exec();

            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại' });
            }

            res.json({ post });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    async search(req, res) {
        const query = req.query.q.toLowerCase();

        try {
            const userResults = await User.find({ username: { $regex: query, $options: 'i' } });
            const postResults = await Posts.find({
                $or: [{ title: { $regex: query, $options: 'i' } }, { content: { $regex: query, $options: 'i' } }],
            });

            const modifiedUserResults = userResults.map(({ password, ...other }) => other);
            const combinedResults = [...modifiedUserResults, ...postResults];

            if (combinedResults.length === 0) {
                return res.status(404).json({ error: 'No results found' });
            }

            res.json(combinedResults);
        } catch (error) {
            console.error('Error searching:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = new SiteController();
