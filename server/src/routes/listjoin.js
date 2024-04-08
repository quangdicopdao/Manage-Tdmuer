const express = require('express');
const router = express.Router();

const listJoinController = require('../controllers/ListJoinController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/join-activity', listJoinController.joinActivity);
router.post('/check-join-activity', listJoinController.checkJoinActivity);
router.get('/show-list/:postId', listJoinController.showList);
router.get('/show-my-list/:userId', listJoinController.showMyList);
router.post('/update-image', listJoinController.updateImageUrl);
module.exports = router;
