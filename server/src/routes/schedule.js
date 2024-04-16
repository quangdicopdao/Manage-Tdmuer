const express = require('express');
const ScheduleController = require('../controllers/ScheduleController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
//get schedule
router.get('/api/show', authMiddleware.verifyToken, ScheduleController.show);
router.get('/api/overview', authMiddleware.verifyToken, ScheduleController.overview);
router.post('/api/create', authMiddleware.verifyToken, ScheduleController.create);
router.post('/api/create-member', authMiddleware.verifyToken, ScheduleController.createForMember);
router.post('/api/:id', authMiddleware.verifyToken, ScheduleController.update);
router.delete('/api/delete/:id', authMiddleware.verifyToken, ScheduleController.delete);
router.post('/api/edit/:id', authMiddleware.verifyToken, ScheduleController.edit);
router.post('/api/update-status/:scheduleId', authMiddleware.verifyToken, ScheduleController.updateStatus);
module.exports = router;
