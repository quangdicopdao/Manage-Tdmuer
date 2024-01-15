const express = require('express');
const ScheduleController = require('../controllers/ScheduleController');
const router = express.Router();

//get schedule
router.get('/', ScheduleController.show);
module.exports = router;
