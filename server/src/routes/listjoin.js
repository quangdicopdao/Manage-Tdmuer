const express = require('express');
const router = express.Router();

const listJoinController = require('../controllers/ListJoinController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/join-activity', listJoinController.joinActivity);
router.post('/check-join-activity', listJoinController.checkJoinActivity);
router.get('/show-list/:postId', listJoinController.showList);
module.exports = router;
