const express = require('express');
const ScheduleController = require('../controllers/ScheduleController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
//get schedule
router.get('/api/show', authMiddleware.verifyToken, ScheduleController.show);
router.get('/api/overview', authMiddleware.verifyToken, ScheduleController.overview);
router.post('/api/create', authMiddleware.verifyToken, ScheduleController.create);
router.post('/api/:id', authMiddleware.verifyToken, ScheduleController.update);
// router.get('/api/:id/edit', authMiddleware.verifyToken, ScheduleController.edit)
module.exports = router;
