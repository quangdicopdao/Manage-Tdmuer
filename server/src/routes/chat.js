// routes/site.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');
const authMiddleware = require('../middlewares/authMiddleware');
// Add a leading slash to the route path


router.post('/api/create', authMiddleware.verifyToken, chatController.createChat);
//router.get('/getchat/:user1Id/:user2Id', chatController.getChat);
// Route để lấy tin nhắn giữa người dùng và nhóm
router.get('/getchat/:userId/:groupId', chatController.getChat);
router.get('/following/:id', chatController.following);
router.post('/api/follow/:userId',chatController.addfollow);
router.post('/api/creategroup', chatController.createGroupChat);
router.get('/api/getgroup/:userId', chatController.getGroup);
module.exports = router;
