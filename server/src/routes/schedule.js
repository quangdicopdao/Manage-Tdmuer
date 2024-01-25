const express = require('express');
const ScheduleController = require('../controllers/ScheduleController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
//get schedule
router.get('/api/show', authMiddleware.verifyToken, ScheduleController.show);
router.post('/api/create', authMiddleware.verifyToken, ScheduleController.create);
module.exports = router;
