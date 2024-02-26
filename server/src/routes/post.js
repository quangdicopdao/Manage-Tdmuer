// routes/Post.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middlewares/authMiddleware');
// Add a leading slash to the route path
router.get('/', PostController.index);
router.post('/create', authMiddleware.verifyToken, PostController.create);
router.get('/detail/:id', PostController.detail);
router.get('/search', PostController.search);
router.post('/save-post', PostController.savedPosts);

module.exports = router;
