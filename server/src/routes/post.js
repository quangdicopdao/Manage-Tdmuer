// routes/Post.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middlewares/authMiddleware');
// Add a leading slash to the route path

//crud basic
router.get('/', PostController.index);
router.post('/create', authMiddleware.verifyToken, PostController.create);
router.get('/detail/:id', PostController.detail);
router.get('/search', PostController.search);
router.get('/get-tags', PostController.getTags);

//save post
router.post('/save-post', PostController.savedPosts);

// like post
router.post('/like-post', PostController.like);
router.post('/unlike-post', PostController.unlike);
router.get('/check-like', PostController.checkLike);

//comment post
router.get('/get-comment', PostController.getAllComments);
router.post('/comment-post', PostController.createComment);

module.exports = router;
