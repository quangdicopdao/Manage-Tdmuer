const express = require('express');
const router = express.Router();

const profileController = require('../controllers/ProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/posts/:id', authMiddleware.verifyToken, profileController.getMyPosts);
router.get('/:id', profileController.getProfile);
module.exports = router;
