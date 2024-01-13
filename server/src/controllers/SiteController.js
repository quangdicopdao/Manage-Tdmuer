// controllers/SiteController.js
const Posts = require('../models/Posts.js');

// controllers/SiteController.js
class SiteController {
    async index(req, res, next) {
        try {
            const posts = await Posts.find();
            res.json({ posts });
        } catch (err) {
            console.error('Error fetching posts:', err);
            next(err);
        }
    }
}

module.exports = new SiteController();
